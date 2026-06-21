import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_WIDTH = 1200
const MAX_HEIGHT = 1600

/**
 * Check if we're running on Vercel (production) — use Blob storage
 * Otherwise (local dev) — use local filesystem
 */
function isVercelProduction(): boolean {
  // Vercel sets this automatically
  return process.env.VERCEL === '1' || !!process.env.BLOB_READ_WRITE_TOKEN
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: JPG, PNG, WebP, GIF` },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate magic bytes
    const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50
    const isWebp = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46
    const isGif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46

    if (!isJpg && !isPng && !isWebp && !isGif) {
      return NextResponse.json(
        { error: 'File content does not match an image' },
        { status: 400 }
      )
    }

    // Optimize image with sharp
    const sharp = (await import('sharp')).default
    const optimizedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer()

    const filename = `${crypto.randomUUID()}.webp`

    // PRODUCTION (Vercel): Use Vercel Blob Storage
    if (isVercelProduction()) {
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(filename, optimizedBuffer, {
          access: 'public',
          contentType: 'image/webp',
        })
        return NextResponse.json({
          url: blob.url,
          size: file.size,
          optimized: true,
        })
      } catch (blobError: any) {
        console.error('Vercel Blob error:', blobError)
        return NextResponse.json(
          { error: 'Image upload failed: ' + (blobError.message || 'Blob error') },
          { status: 500 }
        )
      }
    }

    // DEVELOPMENT (local): Save to local filesystem
    const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(UPLOAD_DIR, filename)
    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(filePath, optimizedBuffer)

    return NextResponse.json({
      url: `/uploads/${filename}`,
      size: file.size,
      optimized: true,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
