import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from './types'

export interface AppliedCoupon {
  id: string
  code: string
  type: 'DISCOUNT' | 'FREE_SHIPPING' | 'FREE_GIFT'
  value: number
  giftName: string
  discountAmount: number
  freeShipping: boolean
  description: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isFlying: boolean
  flyTarget: { x: number; y: number } | null
  coupon: AppliedCoupon | null
  addItem: (product: Product, size: string, quantity?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  triggerFly: (x: number, y: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getDiscount: () => number
  getFinalTotal: () => number
  getFreeShipping: () => boolean
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isFlying: false,
      flyTarget: null,
      coupon: null,
      addItem: (product, size, quantity = 1) => {
        const items = get().items
        const existing = items.find(
          (item) => item.product.id === product.id && item.size === size
        )
        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, size, quantity }] })
        }
        // Coupon becomes stale when cart changes — remove it so user re-validates
        if (get().coupon) set({ coupon: null })
      },
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && item.size === size)
          ),
        })
        if (get().coupon) set({ coupon: null })
      },
      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        })
        if (get().coupon) set({ coupon: null })
      },
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      clearCart: () => set({ items: [], coupon: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      triggerFly: (x, y) => {
        set({ isFlying: true, flyTarget: { x, y } })
        setTimeout(() => set({ isFlying: false, flyTarget: null }), 550)
      },
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      getDiscount: () => {
        const coupon = get().coupon
        if (!coupon) return 0
        return coupon.discountAmount || 0
      },
      getFinalTotal: () => {
        const total = get().getTotalPrice()
        const discount = get().getDiscount()
        return Math.max(0, total - discount)
      },
      getFreeShipping: () => {
        const coupon = get().coupon
        return coupon ? coupon.freeShipping : false
      },
    }),
    {
      name: 'street-scout-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
