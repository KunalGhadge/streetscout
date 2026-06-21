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

    if (body.title !== undefined) data.title = String(body.title).slice(0, 200)
    if (body.body !== undefined) data.body = String(body.body).slice(0, 1000)
    if (body.type !== undefined) {
      data.type = ['INFO', 'OFFER', 'COUPON', 'WARNING'].includes(body.type) ? body.type : 'INFO'
    }
    if (body.link !== undefined) data.link = String(body.link).slice(0, 500)
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive)

    const notification = await db.notification.update({ where: { id }, data })
    return NextResponse.json(notification)
  } catch (error: any) {
    console.error('Update notification error:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
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
    await db.notification.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete notification error:', error)
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
  }
}
