import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const notifications = await db.notification.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(notifications)
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()

    if (!body.title || String(body.title).trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const notification = await db.notification.create({
      data: {
        title: String(body.title).slice(0, 200),
        body: String(body.body || '').slice(0, 1000),
        type: ['INFO', 'OFFER', 'COUPON', 'WARNING'].includes(body.type) ? body.type : 'INFO',
        link: String(body.link || '').slice(0, 500),
        isActive: body.isActive !== false,
      },
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error: any) {
    console.error('Create notification error:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
