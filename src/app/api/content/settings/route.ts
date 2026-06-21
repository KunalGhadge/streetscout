import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Public: get settings (only exposes whitelisted keys)
const PUBLIC_KEYS = ['whatsapp_number']

export async function GET() {
  const settings = await db.setting.findMany({
    where: { key: { in: PUBLIC_KEYS } },
  })
  const map: Record<string, string> = {}
  settings.forEach((s) => { map[s.key] = s.value })
  return NextResponse.json(map)
}
