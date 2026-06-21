'use client'

import { useCart } from '@/lib/cart-store'

export function FlyToCart() {
  const { isFlying, flyTarget } = useCart()

  if (!isFlying || !flyTarget) return null

  // Compute cart icon position (component only mounts when flying)
  let cartX = typeof window !== 'undefined' ? window.innerWidth - 40 : 0
  let cartY = 40

  if (typeof document !== 'undefined') {
    const cartIcon = document.querySelector('[aria-label^="Open cart"]') as HTMLElement | null
    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect()
      cartX = rect.left + rect.width / 2
      cartY = rect.top + rect.height / 2
    }
  }

  const dx = cartX - flyTarget.x
  const dy = cartY - flyTarget.y

  return (
    <div
      className="pointer-events-none fixed z-[200]"
      style={{
        left: flyTarget.x,
        top: flyTarget.y,
        // GPU-only: translate + scale, will-change for compositing
        willChange: 'transform, opacity',
        animation: 'fly-pop 0.55s cubic-bezier(0.2, 0.9, 0.3, 1) forwards',
        '--dx': `${dx}px`,
        '--dy': `${dy}px`,
      } as React.CSSProperties}
    >
      {/* Pop badge with check icon */}
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF2D55] text-white"
        style={{
          boxShadow: '0 0 24px rgba(255, 45, 85, 0.6), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      {/* Trail glow */}
      <div
        className="absolute inset-0 -z-10 rounded-full bg-[#FF2D55]/40 blur-xl"
        style={{ transform: 'scale(1.5)' }}
      />
    </div>
  )
}
