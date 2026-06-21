import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default-password-change-me'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'default-secret-change-me'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

interface SessionPayload {
  role: string
  exp: number
  iat: number
}

/**
 * Hash a password with a salt using SHA-256
 * Format: salt$hash
 */
function hashPassword(password: string): string {
  const salt = ADMIN_SECRET.slice(0, 16)
  const hash = createHmac('sha256', ADMIN_SECRET).update(salt + password).digest('hex')
  return `${salt}$${hash}`
}

/**
 * Verify a password against the stored hash using timing-safe comparison
 */
export function verifyAdminPassword(password: string): boolean {
  const storedHash = hashPassword(ADMIN_PASSWORD)
  const [salt, expectedHash] = storedHash.split('$')
  const providedHash = createHmac('sha256', ADMIN_SECRET).update(salt + password).digest('hex')

  // Timing-safe comparison to prevent timing attacks
  try {
    const a = Buffer.from(expectedHash, 'hex')
    const b = Buffer.from(providedHash, 'hex')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/**
 * Create a signed session token (HMAC)
 */
export function createSessionToken(): string {
  const payload: SessionPayload = {
    role: 'admin',
    iat: Date.now(),
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

  // Timing-safe comparison of signatures
  try {
    const a = Buffer.from(signature, 'base64url')
    const b = Buffer.from(expectedSignature, 'base64url')
    if (a.length !== b.length) return false as any
    if (!timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString()) as SessionPayload
    if (payload.exp < Date.now()) return null
    if (payload.role !== 'admin') return null
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
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_DURATION / 1000, // in seconds
  }
}
