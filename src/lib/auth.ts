import { createHmac } from 'crypto'
import { NextRequest } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default-password-change-me'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'default-secret-change-me'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

interface SessionPayload {
  role: string
  exp: number
}

/**
 * Verify the admin password against the env variable
 */
export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

/**
 * Create a signed session token (HMAC)
 */
export function createSessionToken(): string {
  const payload: SessionPayload = {
    role: 'admin',
    exp: Date.now() + SESSION_DURATION,
  }
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', ADMIN_SECRET).update(payloadStr).digest('base64url')
  return `${payloadStr}.${signature}`
}

/**
 * Verify a session token and return the payload if valid
 */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [payloadStr, signature] = parts
  const expectedSignature = createHmac('sha256', ADMIN_SECRET).update(payloadStr).digest('base64url')

  // Timing-safe comparison
  if (signature.length !== expectedSignature.length) return null
  if (signature !== expectedSignature) return null

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString()) as SessionPayload
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

/**
 * Check if the request is authenticated (reads the session cookie)
 */
export function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('ss_admin_session')?.value
  return verifySessionToken(token) !== null
}

/**
 * Cookie options for the session
 */
export const SESSION_COOKIE_NAME = 'ss_admin_session'

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DURATION / 1000, // in seconds
  }
}
