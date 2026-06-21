'use client'

import { useEffect, useState } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Tag, Loader2, Check, AlertCircle, Gift, Truck } from 'lucide-react'
import { useCart } from '@/lib/cart-store'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { formatINR } from '@/lib/data'
import { cn } from '@/lib/utils'

interface StoreStatus {
  accepting: boolean
  message: string
}

export function CartDrawer() {
  const {
    items, isOpen, closeCart, removeItem, updateQuantity,
    getTotalPrice, getTotalItems, getDiscount, getFinalTotal, getFreeShipping,
    coupon, applyCoupon, removeCoupon,
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState(false)
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({ accepting: true, message: '' })

  // Fetch store status on mount and when cart opens
  useEffect(() => {
    fetch('/api/content/store-status')
      .then((r) => r.json())
      .then(setStoreStatus)
      .catch(() => {})
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCart])

  const subtotal = getTotalPrice()
  const discount = getDiscount()
  const finalTotal = getFinalTotal()
  const freeShipping = getFreeShipping()
  const totalItems = getTotalItems()

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError('')
    setCouponSuccess(false)

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, cartTotal: subtotal }),
      })
      const data = await res.json()

      if (!data.valid) {
        setCouponError(data.error || 'Invalid code')
        setCouponSuccess(false)
      } else {
        applyCoupon(data.coupon)
        setCouponSuccess(true)
        setCouponError('')
        setTimeout(() => setCouponSuccess(false), 2000)
      }
    } catch {
      setCouponError('Network error')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleWhatsAppCheckout = async () => {
    // Block checkout if store is not accepting orders
    if (!storeStatus.accepting) return

    const url = await getWhatsAppUrl(items, finalTotal, coupon, freeShipping)
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
                        <img
                          src={item.product.imageFront}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
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
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-white/60 transition-all hover:bg-[#FF2D55] hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
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

              {/* Coupon Section */}
              <div className="mt-4 border border-[#2A2A2A] bg-[#0a0a0a] p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-[#FF2D55]" />
                  <span className="font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
                    Coupon Code
                  </span>
                </div>

                {coupon ? (
                  /* Applied coupon display */
                  <div className={cn('flex items-center justify-between p-2', couponSuccess && 'animate-coupon-success')}>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#22c55e]" />
                      <div>
                        <p className="font-mono-tech text-xs font-bold text-[#22c55e]">{coupon.code}</p>
                        <p className="font-mono-tech text-[9px] text-white/40">
                          {coupon.type === 'DISCOUNT' && `${coupon.value}% off applied`}
                          {coupon.type === 'FREE_SHIPPING' && 'Free shipping applied'}
                          {coupon.type === 'FREE_GIFT' && `Free gift: ${coupon.giftName}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { removeCoupon(); setCouponInput('') }}
                      className="flex h-7 w-7 items-center justify-center text-white/30 hover:text-[#FF2D55]"
                      aria-label="Remove coupon"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  /* Coupon input */
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="ENTER CODE"
                      className={cn(
                        'flex-1 border bg-[#050505] px-3 py-2 text-xs font-bold tracking-wider text-white placeholder-white/30 focus:outline-none transition-colors',
                        couponError ? 'border-[#FF2D55] animate-shake' : 'border-[#2A2A2A] focus:border-[#FF2D55]'
                      )}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="flex h-9 items-center justify-center border border-[#FF2D55] bg-[#FF2D55]/10 px-4 text-xs font-bold text-[#FF2D55] transition-all hover:bg-[#FF2D55] hover:text-white disabled:opacity-40"
                    >
                      {couponLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'APPLY'}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="mt-2 flex items-center gap-1 font-mono-tech text-[9px] text-[#FF2D55]">
                    <AlertCircle className="h-3 w-3" />
                    {couponError}
                  </p>
                )}
              </div>

              {/* Free gift / free shipping indicator */}
              {coupon && (coupon.type === 'FREE_GIFT' || coupon.type === 'FREE_SHIPPING') && (
                <div className="mt-2 flex items-center gap-2 border border-[#22c55e]/30 bg-[#22c55e]/5 p-2 animate-slide-up-fade">
                  {coupon.type === 'FREE_GIFT' ? (
                    <Gift className="h-3.5 w-3.5 text-[#22c55e]" />
                  ) : (
                    <Truck className="h-3.5 w-3.5 text-[#22c55e]" />
                  )}
                  <span className="font-mono-tech text-[9px] text-[#22c55e]">
                    {coupon.type === 'FREE_GIFT'
                      ? `Free gift included: ${coupon.giftName}`
                      : 'Free shipping unlocked!'}
                  </span>
                </div>
              )}
            </div>

            {/* Footer with total and checkout */}
            <div className="border-t border-[#2A2A2A] px-5 py-4">
              {/* Store status warning (if orders paused) */}
              {!storeStatus.accepting && (
                <div className="mb-3 flex items-start gap-2 border border-[#FF2D55]/40 bg-[#FF2D55]/10 p-3 animate-slide-up-fade">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FF2D55]" />
                  <div>
                    <p className="font-mono-tech text-[10px] font-bold text-[#FF2D55]">ORDERS PAUSED</p>
                    <p className="mt-0.5 text-xs text-white/70">
                      {storeStatus.message || 'We are currently not accepting new orders. Please check back soon.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono-tech text-[10px] text-white/50">SUBTOTAL</span>
                <span className={cn('font-mono-tech text-sm', discount > 0 ? 'text-white/40 line-through' : 'text-white')}>
                  {formatINR(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="mb-1 flex items-center justify-between animate-slide-up-fade">
                  <span className="font-mono-tech text-[10px] text-[#22c55e]">DISCOUNT</span>
                  <span className="font-mono-tech text-sm text-[#22c55e]">-{formatINR(discount)}</span>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono-tech text-[10px] text-white/50">TOTAL</span>
                <span className="font-display text-2xl font-bold text-white">
                  {formatINR(finalTotal)}
                </span>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono-tech text-[9px] text-white/30">SHIPPING</span>
                <span className="font-mono-tech text-[9px] text-white/40">
                  {freeShipping ? 'FREE' : 'CONFIRMED ON WHATSAPP'}
                </span>
              </div>

              {/* WhatsApp checkout */}
              <button
                onClick={handleWhatsAppCheckout}
                disabled={!storeStatus.accepting}
                className={cn(
                  'btn-glow group flex w-full items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider transition-all',
                  storeStatus.accepting
                    ? 'bg-[#25D366] text-black hover:bg-[#22c55e]'
                    : 'cursor-not-allowed bg-[#2A2A2A] text-white/40'
                )}
              >
                <MessageCircle className="h-5 w-5" />
                {storeStatus.accepting ? 'Order On WhatsApp' : 'Orders Paused'}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="h-px w-6 bg-[#2A2A2A]" />
                <p className="font-mono-tech text-center text-[9px] text-white/30">
                  {storeStatus.accepting ? 'STOCK CHECK → CONFIRM → SHIP' : 'PLEASE CHECK BACK LATER'}
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
