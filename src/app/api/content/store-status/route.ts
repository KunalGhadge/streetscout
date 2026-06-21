import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Public: get current store status (for checkout blocking + banner)
export async function GET() {
  const status = await db.storeStatus.findFirst()
  return NextResponse.json(status || { accepting: true, message: '' })
}
