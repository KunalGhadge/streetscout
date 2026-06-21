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
      data.code = String(body.code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')
    }
    if (body.description !== undefined) data.description = String(body.description).slice(0, 500)
    if (body.type !== undefined) {
      data.type = ['DISCOUNT', 'FREE_SHIPPING', 'FREE_GIFT'].includes(body.type) ? body.type : 'DISCOUNT'
    }
    if (body.value !== undefined) data.value = Math.max(0, Math.min(100, parseFloat(body.value) || 0))
    if (body.giftName !== undefined) data.giftName = String(body.giftName).slice(0, 200)
    if (body.minOrder !== undefined) data.minOrder = Math.max(0, parseFloat(body.minOrder) || 0)
    if (body.usageLimit !== undefined) data.usageLimit = Math.max(0, parseInt(body.usageLimit) || 0)
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive)
    if (body.expiresAt !== undefined) {
      data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null
    }

    const coupon = await db.coupon.update({ where: { id }, data })
    return NextResponse.json(coupon)
  } catch (error: any) {
    console.error('Update coupon error:', error)
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 })
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
    await db.coupon.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete coupon error:', error)
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}
