import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

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

    // Generate slug from name if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const product = await db.product.create({
      data: {
        name: body.name,
        slug,
        collection: body.collection || '',
        collectionTag: body.collectionTag || '',
        dropNumber: body.dropNumber || 'DROP-001',
        universe: body.universe || '',
        universeJp: body.universeJp || '',
        price: parseFloat(body.price) || 0,
        description: body.description || '',
        fabric: body.fabric || '',
        fit: body.fit || '',
        breathability: body.breathability || '',
        durability: body.durability || '',
        imageFront: body.imageFront || '/images/product-naruto.png',
        imageBack: body.imageBack || body.imageFront || '/images/product-naruto.png',
        accentColor: body.accentColor || 'accent',
        isFeatured: body.isFeatured || false,
        inStock: body.inStock !== false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
