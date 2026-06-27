import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Public: Create a pending affiliate order record when customer checks out
// This is called AFTER the WhatsApp link opens — the order starts as PENDING
// Admin confirms or cancels it later from the dashboard
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.affiliateId || !body.code || !body.creatorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the affiliate exists and is active
    const affiliate = await db.affiliate.findUnique({
      where: { id: body.affiliateId },
    })

    if (!affiliate || !affiliate.isActive) {
      return NextResponse.json({ error: 'Affiliate not found or inactive' }, { status: 400 })
    }

    // Create the pending order record with customer details
    const order = await db.affiliateOrder.create({
      data: {
        affiliateId: affiliate.id,
        code: String(body.code).slice(0, 50),
        creatorName: String(body.creatorName).slice(0, 200),
        customerName: String(body.customerName || '').slice(0, 200),
        customerPhone: String(body.customerPhone || '').slice(0, 20),
        orderTotal: Math.max(0, parseFloat(body.orderTotal) || 0),
        commissionDue: Math.max(0, parseFloat(body.commissionDue) || 0),
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error: any) {
    console.error('Affiliate track error:', error)
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 })
  }
}
