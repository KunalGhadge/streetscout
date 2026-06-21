import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const items = await db.lifestyle.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const item = await db.lifestyle.create({
      data: {
        label: body.label || '',
        japanese: body.japanese || '',
        tag: body.tag || 'SCENE-01',
        description: body.description || '',
        image: body.image || '/images/lifestyle-college.png',
        order: body.order || 0,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
