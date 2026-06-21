import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Public: validate a coupon code
export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Code is required' })
    }

    const coupon = await db.coupon.findUnique({
      where: { code: String(code).trim().toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Invalid code' })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: 'This code is no longer active' })
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This code has expired' })
    }

    // Check usage limit (0 = unlimited)
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({
        valid: false,
        error: `This code has reached its usage limit (${coupon.usageLimit} uses)`,
      })
    }

    // Check minimum order
    const total = parseFloat(cartTotal) || 0
    if (coupon.minOrder > 0 && total < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')} required`,
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'DISCOUNT') {
      discountAmount = Math.round((total * coupon.value) / 100)
    }

    // Increment usage count (the coupon is now "used" by this user)
    await db.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    })

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        giftName: coupon.giftName,
        discountAmount,
        freeShipping: coupon.type === 'FREE_SHIPPING',
        description: coupon.description,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount + 1,
      },
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ valid: false, error: 'Failed to validate code' })
  }
}
