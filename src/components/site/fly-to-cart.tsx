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
        animation: 'flyToCart 0.8s cubic-bezier(0.4, 0, 0.6, 1) forwards',
        '--dx': `${dx}px`,
        '--dy': `${dy}px`,
      } as React.CSSProperties}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF2D55] text-white shadow-lg glow-accent">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <style>{`
        @keyframes flyToCart {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
