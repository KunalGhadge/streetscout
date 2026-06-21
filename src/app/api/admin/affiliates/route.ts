import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

// GET - list all affiliates with their stats
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const affiliates = await db.affiliate.findMany({
    include: {
      orders: {
        select: {
          id: true,
          status: true,
          orderTotal: true,
          commissionDue: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate stats per affiliate
  const affiliatesWithStats = affiliates.map((a) => {
    const confirmedOrders = a.orders.filter((o) => o.status === 'CONFIRMED')
    const pendingOrders = a.orders.filter((o) => o.status === 'PENDING')
    const cancelledOrders = a.orders.filter((o) => o.status === 'CANCELLED')

    return {
      ...a,
      orders: undefined, // remove the raw orders array
      stats: {
        totalOrders: a.orders.length,
        confirmedOrders: confirmedOrders.length,
        pendingOrders: pendingOrders.length,
        cancelledOrders: cancelledOrders.length,
        totalRevenue: confirmedOrders.reduce((sum, o) => sum + o.orderTotal, 0),
        totalCommission: confirmedOrders.reduce((sum, o) => sum + o.commissionDue, 0),
        pendingCommission: pendingOrders.reduce((sum, o) => sum + o.commissionDue, 0),
      },
    }
  })

  return NextResponse.json(affiliatesWithStats)
}

// POST - create a new affiliate
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body.code || String(body.code).trim().length < 3) {
      return NextResponse.json({ error: 'Code must be at least 3 characters' }, { status: 400 })
    }

    if (!body.creatorName || String(body.creatorName).trim().length === 0) {
      return NextResponse.json({ error: 'Creator name is required' }, { status: 400 })
    }

    // Uppercase and sanitize the code
    const code = String(body.code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')

    // Check for duplicate (both in affiliates AND coupons to avoid conflicts)
    const existingAff = await db.affiliate.findUnique({ where: { code } })
    if (existingAff) {
      return NextResponse.json({ error: 'Affiliate code already exists' }, { status: 400 })
    }

    const existingCoupon = await db.coupon.findUnique({ where: { code } })
    if (existingCoupon) {
      return NextResponse.json({ error: 'This code is already used as a coupon' }, { status: 400 })
    }

    const affiliate = await db.affiliate.create({
      data: {
        code,
        creatorName: String(body.creatorName).slice(0, 200),
        platform: String(body.platform || 'Instagram').slice(0, 50),
        contact: String(body.contact || '').slice(0, 200),
        rewardType: ['DISCOUNT', 'FREE_GIFT', 'NONE'].includes(body.rewardType) ? body.rewardType : 'DISCOUNT',
        rewardValue: Math.max(0, Math.min(100, parseFloat(body.rewardValue) || 0)),
        rewardGiftName: String(body.rewardGiftName || '').slice(0, 200),
        commissionType: ['PERCENTAGE', 'FIXED'].includes(body.commissionType) ? body.commissionType : 'PERCENTAGE',
        commissionValue: Math.max(0, parseFloat(body.commissionValue) || 0),
        isActive: body.isActive !== false,
      },
    })

    return NextResponse.json(affiliate, { status: 201 })
  } catch (error: any) {
    console.error('Create affiliate error:', error)
    return NextResponse.json({ error: 'Failed to create affiliate' }, { status: 500 })
  }
}
