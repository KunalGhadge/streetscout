'use client'

import { useEffect } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/cart-store'
import { getWhatsAppUrl } from '@/lib/whatsapp'
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
          'fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-[#0a0a0a] shadow-2xl transition-transform duration-400 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-white/70" />
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-white">
                Your Cart
              </h2>
              <p className="text-xs text-white/40">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/5 hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
              <ShoppingBag className="h-8 w-8 text-white/20" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">Your cart is empty</p>
              <p className="mt-1 text-sm text-white/40">
                Add some premium jerseys to get started.
              </p>
            </div>
            <div className="font-jp mt-4 text-xs tracking-wider text-white/20">
              カートは空です
            </div>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
                  >
                    {/* Product image */}
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-[#0a0a0a]">
                      { }
                      <img
                        src={item.product.imageFront}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            {item.product.universe}
                          </p>
                          <h3 className="font-display text-sm font-bold leading-tight text-white">
                            {item.product.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-white/40">
                            Size: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-white/30 transition-all hover:bg-white/5 hover:text-accent-crimson"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Quantity and price */}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, item.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/5 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, item.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/5 hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          ${(item.product.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with total and checkout */}
            <div className="border-t border-white/[0.06] px-5 py-4">
              {/* Subtotal */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-white/50">Subtotal</span>
                <span className="font-display text-xl font-bold text-white">
                  ${total.toFixed(0)}
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-white/40">Shipping</span>
                <span className="text-xs text-white/40">Calculated on WhatsApp</span>
              </div>

              {/* WhatsApp checkout */}
              <button
                onClick={handleWhatsAppCheckout}
                className="btn-glow group flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-[#22c55e]"
              >
                <MessageCircle className="h-5 w-5" />
                Order On WhatsApp
              </button>

              <p className="mt-3 text-center text-[11px] text-white/30">
                You'll be redirected to WhatsApp with your order details pre-filled.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
