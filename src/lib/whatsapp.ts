import type { CartItem } from './types'

// Change this to your business WhatsApp number (include country code, no + or spaces)
export const WHATSAPP_NUMBER = '919999999999'

export function formatINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}

export function generateWhatsAppMessage(items: CartItem[], total: number): string {
  const lines = items.map((item, index) => {
    const { product, size, quantity } = item
    const itemTotal = product.price * quantity
    return `${index + 1}. ${product.name} (${size}) x${quantity} — ${formatINR(itemTotal)}`
  })

  const message = `Hey Street Scout! I'd like to order:

${lines.join('\n')}

Total: ${formatINR(total)}

Please confirm availability and payment details.`

  return encodeURIComponent(message)
}

export function getWhatsAppUrl(items: CartItem[], total: number): string {
  const message = generateWhatsAppMessage(items, total)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
