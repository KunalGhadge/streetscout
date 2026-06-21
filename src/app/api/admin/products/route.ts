import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'
import { DEFAULT_SIZES } from '@/lib/types'

// GET - list all products (including non-featured, for admin)
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

// POST - create a new product
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }

    // Generate slug from name if not provided
    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Sanitize sizes — ensure it's a clean comma-separated string
    const sizesRaw = typeof body.sizes === 'string' ? body.sizes : DEFAULT_SIZES
    const sizes = sizesRaw
      .split(',')
      .map((s: string) => s.trim().toUpperCase())
      .filter(Boolean)
      .join(',') || DEFAULT_SIZES

    const product = await db.product.create({
      data: {
        name: String(body.name).trim().slice(0, 200),
        slug,
        collection: String(body.collection || '').slice(0, 200),
        collectionTag: String(body.collectionTag || '').slice(0, 200),
        dropNumber: String(body.dropNumber || 'DROP-001').slice(0, 50),
        universe: String(body.universe || '').slice(0, 200),
        universeJp: String(body.universeJp || '').slice(0, 200),
        price: Math.max(0, parseFloat(body.price) || 0),
        description: String(body.description || '').slice(0, 2000),
        fabric: String(body.fabric || '').slice(0, 200),
        fit: String(body.fit || '').slice(0, 200),
        breathability: String(body.breathability || '').slice(0, 200),
        durability: String(body.durability || '').slice(0, 200),
        sizes,
        imageFront: String(body.imageFront || '/images/product-naruto.png').slice(0, 500),
        imageBack: String(body.imageBack || body.imageFront || '/images/product-naruto.png').slice(0, 500),
        accentColor: String(body.accentColor || 'accent').slice(0, 50),
        isFeatured: Boolean(body.isFeatured),
        inStock: body.inStock !== false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
