import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Max dimensions for product images (preserves aspect ratio, no stretching)
const MAX_WIDTH = 1200
const MAX_HEIGHT = 1600

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

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: JPG, PNG, WebP, GIF` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB.' },
        { status: 400 }
      )
    }

    // Read file bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate magic bytes (prevent fake extensions)
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

    // Generate safe filename
    const safeName = `${crypto.randomUUID()}.webp`
    const filePath = path.join(UPLOAD_DIR, safeName)

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true })

    // Optimize and resize the image using sharp:
    // - Convert to WebP for smaller file size and better quality
    // - Resize to max dimensions while PRESERVING aspect ratio (no stretching)
    // - Use 'inside' fit so the image fits within bounds without cropping
    await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',       // preserve aspect ratio, no stretch
        withoutEnlargement: true, // don't upscale small images
      })
      .webp({ quality: 85 })
      .toFile(filePath)

    return NextResponse.json({
      url: `/uploads/${safeName}`,
      size: file.size,
      optimized: true,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
