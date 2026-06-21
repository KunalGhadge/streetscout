import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'
import { DEFAULT_SIZES } from '@/lib/types'

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

    // Build only the fields that are provided (partial update)
    const data: any = {}

    if (body.name !== undefined) data.name = String(body.name).trim().slice(0, 200)
    if (body.slug !== undefined) {
      data.slug = String(body.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    if (body.collection !== undefined) data.collection = String(body.collection).slice(0, 200)
    if (body.collectionTag !== undefined) data.collectionTag = String(body.collectionTag).slice(0, 200)
    if (body.dropNumber !== undefined) data.dropNumber = String(body.dropNumber).slice(0, 50)
    if (body.universe !== undefined) data.universe = String(body.universe).slice(0, 200)
    if (body.universeJp !== undefined) data.universeJp = String(body.universeJp).slice(0, 200)
    if (body.price !== undefined) data.price = Math.max(0, parseFloat(body.price) || 0)
    if (body.description !== undefined) data.description = String(body.description).slice(0, 2000)
    if (body.fabric !== undefined) data.fabric = String(body.fabric).slice(0, 200)
    if (body.fit !== undefined) data.fit = String(body.fit).slice(0, 200)
    if (body.breathability !== undefined) data.breathability = String(body.breathability).slice(0, 200)
    if (body.durability !== undefined) data.durability = String(body.durability).slice(0, 200)
    if (body.sizes !== undefined) {
      const sizes = String(body.sizes)
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .join(',')
      data.sizes = sizes || DEFAULT_SIZES
    }
    if (body.imageFront !== undefined) data.imageFront = String(body.imageFront).slice(0, 500)
    if (body.imageBack !== undefined) data.imageBack = String(body.imageBack).slice(0, 500)
    if (body.accentColor !== undefined) data.accentColor = String(body.accentColor).slice(0, 50)
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured)
    if (body.inStock !== undefined) data.inStock = Boolean(body.inStock)

    const product = await db.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
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
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
