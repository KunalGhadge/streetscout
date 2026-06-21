import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, createSessionToken, getSessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/auth'

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    // Rate limiting: 5 attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const attempt = loginAttempts.get(ip)

    if (attempt && now < attempt.resetTime) {
      if (attempt.count >= 5) {
        return NextResponse.json(
          { error: 'Too many attempts. Try again in a minute.' },
          { status: 429 }
        )
      }
      attempt.count++
    } else {
      loginAttempts.set(ip, { count: 1, resetTime: now + 60000 })
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Reset rate limit on success
    loginAttempts.delete(ip)

    // Create session
    const token = createSessionToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions()
    )

    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
