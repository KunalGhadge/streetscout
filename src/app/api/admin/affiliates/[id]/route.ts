import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

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
    const data: any = {}

    if (body.code !== undefined) {
      const code = String(body.code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')
      if (code.length < 3) {
        return NextResponse.json({ error: 'Code must be at least 3 characters' }, { status: 400 })
      }
      // Check duplicate (excluding current)
      const existing = await db.affiliate.findFirst({
        where: { code, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json({ error: 'Code already in use' }, { status: 400 })
      }
      data.code = code
    }
    if (body.creatorName !== undefined) data.creatorName = String(body.creatorName).slice(0, 200)
    if (body.platform !== undefined) data.platform = String(body.platform).slice(0, 50)
    if (body.contact !== undefined) data.contact = String(body.contact).slice(0, 200)
    if (body.rewardType !== undefined) {
      data.rewardType = ['DISCOUNT', 'FREE_GIFT', 'NONE'].includes(body.rewardType) ? body.rewardType : 'DISCOUNT'
    }
    if (body.rewardValue !== undefined) data.rewardValue = Math.max(0, Math.min(100, parseFloat(body.rewardValue) || 0))
    if (body.rewardGiftName !== undefined) data.rewardGiftName = String(body.rewardGiftName).slice(0, 200)
    if (body.commissionType !== undefined) {
      data.commissionType = ['PERCENTAGE', 'FIXED'].includes(body.commissionType) ? body.commissionType : 'PERCENTAGE'
    }
    if (body.commissionValue !== undefined) data.commissionValue = Math.max(0, parseFloat(body.commissionValue) || 0)
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive)

    const affiliate = await db.affiliate.update({ where: { id }, data })
    return NextResponse.json(affiliate)
  } catch (error: any) {
    console.error('Update affiliate error:', error)
    return NextResponse.json({ error: 'Failed to update affiliate' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    // Don't delete if there are confirmed orders (preserve payout history)
    const confirmedOrders = await db.affiliateOrder.count({
      where: { affiliateId: id, status: 'CONFIRMED' },
    })

    if (confirmedOrders > 0) {
      // Instead of deleting, just deactivate
      const affiliate = await db.affiliate.update({
        where: { id },
        data: { isActive: false },
      })
      return NextResponse.json({
        success: true,
        deactivated: true,
        message: 'Affiliate has confirmed orders — deactivated instead of deleted to preserve payout history',
      })
    }

    // Safe to delete (no confirmed orders)
    await db.affiliate.delete({ where: { id } })
    return NextResponse.json({ success: true, deleted: true })
  } catch (error: any) {
    console.error('Delete affiliate error:', error)
    return NextResponse.json({ error: 'Failed to delete affiliate' }, { status: 500 })
  }
}
