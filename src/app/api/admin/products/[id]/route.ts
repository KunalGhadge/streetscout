import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

// PUT - update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug || body.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        collection: body.collection,
        collectionTag: body.collectionTag,
        dropNumber: body.dropNumber,
        universe: body.universe,
        universeJp: body.universeJp,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        description: body.description,
        fabric: body.fabric,
        fit: body.fit,
        breathability: body.breathability,
        durability: body.durability,
        imageFront: body.imageFront,
        imageBack: body.imageBack,
        accentColor: body.accentColor,
        isFeatured: body.isFeatured,
        inStock: body.inStock,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - remove a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await db.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
