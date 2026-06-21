import type { CartItem } from './types'
import type { AppliedCoupon } from './cart-store'

// Change this to your business WhatsApp number (include country code, no + or spaces)
export const WHATSAPP_NUMBER = '919999999999'

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

export function getWhatsAppUrl(
  items: CartItem[],
  total: number,
  coupon?: AppliedCoupon | null,
  freeShipping?: boolean
): string {
  const message = generateWhatsAppMessage(items, total, coupon, freeShipping)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
