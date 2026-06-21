import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(coupons)
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.code || String(body.code).trim().length === 0) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    // Uppercase and sanitize the code
    const code = String(body.code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')

    if (code.length < 3) {
      return NextResponse.json({ error: 'Code must be at least 3 characters' }, { status: 400 })
    }

    // Check for duplicate
    const existing = await db.coupon.findUnique({ where: { code } })
    if (existing) {
      return NextResponse.json({ error: 'Code already exists' }, { status: 400 })
    }

    const coupon = await db.coupon.create({
      data: {
        code,
        description: String(body.description || '').slice(0, 500),
        type: ['DISCOUNT', 'FREE_SHIPPING', 'FREE_GIFT'].includes(body.type) ? body.type : 'DISCOUNT',
        value: Math.max(0, Math.min(100, parseFloat(body.value) || 0)),
        giftName: String(body.giftName || '').slice(0, 200),
        minOrder: Math.max(0, parseFloat(body.minOrder) || 0),
        usageLimit: Math.max(0, parseInt(body.usageLimit) || 0),
        isActive: body.isActive !== false,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error: any) {
    console.error('Create coupon error:', error)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}
