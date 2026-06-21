import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

// PUT - update order status (PENDING → CONFIRMED or CANCELLED)
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

    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await db.affiliateOrder.update({
      where: { id },
      data: {
        status: body.status,
        customerNote: body.customerNote !== undefined ? String(body.customerNote).slice(0, 500) : undefined,
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Update affiliate order error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
