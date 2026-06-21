import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

// GET - current store status (admin)
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const status = await db.storeStatus.findFirst()
  return NextResponse.json(status || { accepting: true, message: '' })
}

// PUT - update store status (there's only one row)
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const existing = await db.storeStatus.findFirst()

    let status
    if (existing) {
      status = await db.storeStatus.update({
        where: { id: existing.id },
        data: {
          accepting: body.accepting !== undefined ? Boolean(body.accepting) : undefined,
          message: body.message !== undefined ? String(body.message).slice(0, 500) : undefined,
        },
      })
    } else {
      status = await db.storeStatus.create({
        data: {
          accepting: body.accepting !== false,
          message: String(body.message || '').slice(0, 500),
        },
      })
    }

    return NextResponse.json(status)
  } catch (error: any) {
    console.error('Update store status error:', error)
    return NextResponse.json({ error: 'Failed to update store status' }, { status: 500 })
  }
}
