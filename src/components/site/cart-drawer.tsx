'use client'

import { useEffect } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/cart-store'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { formatINR } from '@/lib/data'
import { cn } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCart])

  const total = getTotalPrice()
  const totalItems = getTotalItems()

  const handleWhatsAppCheckout = () => {
    const url = getWhatsAppUrl(items, total)
    window.open(url, '_blank')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-[#050505] shadow-2xl transition-transform duration-400',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-label="Shopping cart"
      >
        {/* Header with technical bar */}
        <div className="border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono-tech text-[10px] text-[#FF2D55]">CART / {String(totalItems).padStart(2, '0')}</span>
              <span className="h-3 w-px bg-[#2A2A2A]" />
              <span className="font-mono-tech text-[10px] text-white/40">YOUR ORDER</span>
            </div>
            <button
              onClick={closeCart}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A2A] text-white/60 transition-all hover:border-[#FF2D55] hover:text-white"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-5 pb-3">
            <ShoppingBag className="h-4 w-4 text-white/40" />
            <h2 className="font-display text-lg font-bold tracking-tight text-white">
              Your Cart
            </h2>
            <span className="font-jp text-[10px] text-white/30">カート</span>
          </div>
        </div>

        {/* Cart items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#2A2A2A]">
              <ShoppingBag className="h-8 w-8 text-white/20" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">Your cart is empty</p>
              <p className="mt-1 text-sm text-white/40">
                Add some premium jerseys to get started.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-px w-6 bg-[#2A2A2A]" />
              <span className="font-jp text-[10px] tracking-wider text-white/20">カートは空です</span>
              <span className="h-px w-6 bg-[#2A2A2A]" />
            </div>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="border border-[#2A2A2A] bg-[#111111] p-3"
                  >
                    {/* Top technical line */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono-tech text-[8px] text-[#FF2D55]">
                        {item.product.dropNumber}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="flex h-6 w-6 items-center justify-center text-white/30 transition-all hover:text-[#FF2D55]"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex gap-3">
                      {/* Product image */}
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-[#0a0a0a] border border-[#2A2A2A]">
                        { }
                        <img
                          src={item.product.imageFront}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex flex-1 flex-col">
                        <div>
                          <p className="font-mono-tech text-[8px] uppercase tracking-wider text-white/40">
                            {item.product.collectionTag}
                          </p>
                          <h3 className="font-display text-sm font-bold leading-tight text-white">
                            {item.product.name}
                          </h3>
                          <p className="mt-0.5 font-mono-tech text-[9px] text-white/40">
                            SIZE: {item.size}
                          </p>
                        </div>

                        {/* Quantity and price */}
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center gap-0 border border-[#2A2A2A]">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.size, item.quantity - 1)
                              }
                              className="flex h-7 w-7 items-center justify-center text-white/60 transition-all hover:bg-[#FF2D55] hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.size, item.quantity + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center text-white/60 transition-all hover:bg-[#FF2D55] hover:text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-display text-sm font-bold text-white">
                            {formatINR(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with total and checkout */}
            <div className="border-t border-[#2A2A2A] px-5 py-4">
              {/* Subtotal */}
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono-tech text-[10px] text-white/50">SUBTOTAL</span>
                <span className="font-display text-2xl font-bold text-white">
                  {formatINR(total)}
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono-tech text-[9px] text-white/30">SHIPPING</span>
                <span className="font-mono-tech text-[9px] text-white/40">CONFIRMED ON WHATSAPP</span>
              </div>

              {/* WhatsApp checkout */}
              <button
                onClick={handleWhatsAppCheckout}
                className="btn-glow group flex w-full items-center justify-center gap-2 bg-[#25D366] py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-[#22c55e]"
              >
                <MessageCircle className="h-5 w-5" />
                Order On WhatsApp
              </button>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="h-px w-6 bg-[#2A2A2A]" />
                <p className="font-mono-tech text-center text-[9px] text-white/30">
                  STOCK CHECK → CONFIRM → SHIP
                </p>
                <span className="h-px w-6 bg-[#2A2A2A]" />
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
