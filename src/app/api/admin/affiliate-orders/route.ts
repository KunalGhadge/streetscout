import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

// GET - list all affiliate orders (with filtering)
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const affiliateId = searchParams.get('affiliateId')

  const where: any = {}
  if (status && ['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
    where.status = status
  }
  if (affiliateId) {
    where.affiliateId = affiliateId
  }

  const orders = await db.affiliateOrder.findMany({
    where,
    include: {
      affiliate: {
        select: { id: true, code: true, creatorName: true, platform: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
