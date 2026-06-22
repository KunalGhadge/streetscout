import type { CartItem } from './types'
import type { AppliedCoupon, AppliedAffiliate } from './cart-store'

const FALLBACK_WHATSAPP_NUMBER = '918451818607'

let cachedNumber: string | null = null

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
  affiliate?: AppliedAffiliate | null,
  freeShipping?: boolean,
  customerName?: string,
  customerPhone?: string
): string {
  const lines = items.map((item, index) => {
    const { product, size, quantity } = item
    const itemTotal = product.price * quantity
    return `${index + 1}. ${product.name} (${size}) x${quantity} — ${formatINR(itemTotal)}`
  })

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const discount = coupon?.discountAmount || affiliate?.discountAmount || 0
  const finalTotal = Math.max(0, subtotal - discount)

  let message = `Hey Street Scout! I'd like to order:\n\n`

  // Customer details at the top so you see who's ordering
  if (customerName || customerPhone) {
    message += `👤 Customer Details:\n`
    if (customerName) message += `Name: ${customerName}\n`
    if (customerPhone) message += `Phone: ${customerPhone}\n`
    message += `\n`
  }

  message += `🛒 Order:\n${lines.join('\n')}`

  // Add coupon info if applied
  if (coupon) {
    message += `\n\n🎟️ Coupon: ${coupon.code}`
    if (coupon.type === 'DISCOUNT') {
      message += ` (${coupon.value}% off)`
    } else if (coupon.type === 'FREE_SHIPPING') {
      message += ` (Free Shipping)`
    } else if (coupon.type === 'FREE_GIFT' && coupon.giftName) {
      message += ` (Free Gift: ${coupon.giftName})`
    }
  }

  // Add affiliate info if applied
  if (affiliate) {
    message += `\n\n🤝 Affiliate Code: ${affiliate.code} (${affiliate.creatorName})`
    if (affiliate.rewardType === 'DISCOUNT') {
      message += ` — ${affiliate.rewardValue}% off`
    } else if (affiliate.rewardType === 'FREE_GIFT' && affiliate.rewardGiftName) {
      message += ` — Free Gift: ${affiliate.rewardGiftName}`
    }
  }

  if (discount > 0) {
    message += `\n\n💰 Bill Summary:`
    message += `\nSubtotal: ${formatINR(subtotal)}`
    message += `\nDiscount: -${formatINR(discount)}`
  }

  message += `\n\nTotal: ${formatINR(finalTotal)}`

  if (freeShipping) {
    message += `\nShipping: FREE`
  }

  message += `\n\nPlease confirm availability and payment details.`

  return encodeURIComponent(message)
}

export async function getWhatsAppUrl(
  items: CartItem[],
  total: number,
  coupon?: AppliedCoupon | null,
  affiliate?: AppliedAffiliate | null,
  freeShipping?: boolean,
  customerName?: string,
  customerPhone?: string
): Promise<string> {
  const number = await getWhatsAppNumber()
  const message = generateWhatsAppMessage(items, total, coupon, affiliate, freeShipping, customerName, customerPhone)
  return `https://wa.me/${number}?text=${message}`
}
