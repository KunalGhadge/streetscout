import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const universe = searchParams.get('universe')
    const featured = searchParams.get('featured')

    const where: any = { inStock: true }
    if (universe && universe !== 'all') {
      where.universe = universe
    }
    if (featured === 'true') {
      where.isFeatured = true
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
