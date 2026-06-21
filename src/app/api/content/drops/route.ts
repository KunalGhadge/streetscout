import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const items = await db.drop.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(items)
}
