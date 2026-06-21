import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

// GET - all settings (admin)
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const settings = await db.setting.findMany()
  const map: Record<string, string> = {}
  settings.forEach((s) => { map[s.key] = s.value })
  return NextResponse.json(map)
}

// PUT - update settings (bulk)
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const updates = body as Record<string, string>

    for (const [key, value] of Object.entries(updates)) {
      // Sanitize key — only allow alphanumeric + underscore
      const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '')
      if (!safeKey) continue

      await db.setting.upsert({
        where: { key: safeKey },
        update: { value: String(value).slice(0, 500) },
        create: { key: safeKey, value: String(value).slice(0, 500) },
      })
    }

    const settings = await db.setting.findMany()
    const map: Record<string, string> = {}
    settings.forEach((s) => { map[s.key] = s.value })
    return NextResponse.json(map)
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
