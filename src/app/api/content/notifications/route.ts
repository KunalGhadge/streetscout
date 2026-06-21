import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Public: get active notifications
export async function GET() {
  const notifications = await db.notification.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 10, // max 10 active notifications
  })
  return NextResponse.json(notifications)
}
