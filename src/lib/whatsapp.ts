import type { CartItem } from './types'
import type { AppliedCoupon } from './cart-store'

// Fallback WhatsApp number (used if settings API fails)
const FALLBACK_WHATSAPP_NUMBER = '918451818607'

// Cache the WhatsApp number so we don't fetch on every checkout
let cachedNumber: string | null = null

/**
 * Fetch the WhatsApp number from the settings API
 */
export async function getWhatsAppNumber(): Promise<string> {
  if (cachedNumber) return cachedNumber
  try {
    const res = await fetch('/api/content/settings')
    const data = await res.json()
    cachedNumber = data.whatsapp_number || FALLBACK_WHATSAPP_NUMBER
    return cachedNumber!
  } catch {
    return FALLBACK_WHATSAPP_NUMBER
  }
}

export function formatINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}

export function generateWhatsAppMessage(
  items: CartItem[],
  total: number,
  coupon?: AppliedCoupon | null,
  freeShipping?: boolean
): string {
  const lines = items.map((item, index) => {
    const { product, size, quantity } = item
    const itemTotal = product.price * quantity
    return `${index + 1}. ${product.name} (${size}) x${quantity} — ${formatINR(itemTotal)}`
  })

  // Calculate totals
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const discount = coupon?.discountAmount || 0
  const finalTotal = Math.max(0, subtotal - discount)

  let message = `Hey Street Scout! I'd like to order:\n\n${lines.join('\n')}`

  // Add coupon info if applied
  if (coupon) {
    message += `\n\nCoupon: ${coupon.code}`
    if (coupon.type === 'DISCOUNT') {
      message += ` (${coupon.value}% off)`
    } else if (coupon.type === 'FREE_SHIPPING') {
      message += ` (Free Shipping)`
    } else if (coupon.type === 'FREE_GIFT' && coupon.giftName) {
      message += ` (Free Gift: ${coupon.giftName})`
    }
  }

  if (discount > 0) {
    message += `\n\nSubtotal: ${formatINR(subtotal)}`
    message += `\nDiscount: -${formatINR(discount)}`
  }

  message += `\n\nTotal: ${formatINR(finalTotal)}`

  if (freeShipping) {
    message += `\nShipping: FREE`
  }

  message += `\n\nPlease confirm availability and payment details.`

  return encodeURIComponent(message)
}

/**
 * Get the WhatsApp URL — fetches the number from settings API
 */
export async function getWhatsAppUrl(
  items: CartItem[],
  total: number,
  coupon?: AppliedCoupon | null,
  freeShipping?: boolean
): Promise<string> {
  const number = await getWhatsAppNumber()
  const message = generateWhatsAppMessage(items, total, coupon, freeShipping)
  return `https://wa.me/${number}?text=${message}`
}
