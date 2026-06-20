import type { CartItem } from './types'

// Change this to your business WhatsApp number (include country code, no + or spaces)
export const WHATSAPP_NUMBER = '919999999999'

export function generateWhatsAppMessage(items: CartItem[], total: number): string {
  const lines = items.map((item, index) => {
    const { product, size, quantity } = item
    const itemTotal = (product.price * quantity).toFixed(2)
    return `${index + 1}. ${product.name}
   Collection: ${product.collection}
   Size: ${size}
   Qty: ${quantity}
   Price: $${itemTotal}`
  })

  const message = `*STREET SCOUT — ORDER*
━━━━━━━━━━━━━━━━━━

${lines.join('\n\n')}

━━━━━━━━━━━━━━━━━━
*TOTAL: $${total.toFixed(2)}*

Ship to:
Name: 
Address: 
City: 
Pincode: 
Phone: 

━━━━━━━━━━━━━━━━━━
Thank you for shopping with Street Scout!`

  return encodeURIComponent(message)
}

export function getWhatsAppUrl(items: CartItem[], total: number): string {
  const message = generateWhatsAppMessage(items, total)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
