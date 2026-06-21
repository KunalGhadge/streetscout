import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Public: validate an affiliate code
// Returns the affiliate details if valid (for cart to apply reward)
export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Code is required' })
    }

    const affiliate = await db.affiliate.findUnique({
      where: { code: String(code).trim().toUpperCase() },
    })

    if (!affiliate) {
      return NextResponse.json({ valid: false, error: 'Invalid code', isAffiliate: false })
    }

    if (!affiliate.isActive) {
      return NextResponse.json({ valid: false, error: 'This code is no longer active' })
    }

    // Calculate customer reward
    let discountAmount = 0
    let freeShipping = false
    let freeGift = ''

    if (affiliate.rewardType === 'DISCOUNT') {
      const total = parseFloat(cartTotal) || 0
      discountAmount = Math.round((total * affiliate.rewardValue) / 100)
    } else if (affiliate.rewardType === 'FREE_GIFT') {
      freeGift = affiliate.rewardGiftName
    } else if (affiliate.rewardType === 'NONE') {
      // No customer reward — they just help the creator
    }

    // Calculate commission (for tracking, not shown to customer)
    const total = parseFloat(cartTotal) || 0
    const finalTotal = Math.max(0, total - discountAmount)
    let commissionDue = 0
    if (affiliate.commissionType === 'PERCENTAGE') {
      commissionDue = Math.round((finalTotal * affiliate.commissionValue) / 100)
    } else {
      // FIXED amount
      commissionDue = Math.round(affiliate.commissionValue)
    }

    return NextResponse.json({
      valid: true,
      isAffiliate: true,
      affiliate: {
        id: affiliate.id,
        code: affiliate.code,
        creatorName: affiliate.creatorName,
        rewardType: affiliate.rewardType,
        rewardValue: affiliate.rewardValue,
        rewardGiftName: affiliate.rewardGiftName,
        discountAmount,
        freeShipping,
        freeGift,
        commissionDue, // used when creating the order record
      },
    })
  } catch (error) {
    console.error('Affiliate validation error:', error)
    return NextResponse.json({ valid: false, error: 'Failed to validate code' })
  }
}
