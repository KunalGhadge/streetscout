'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { sizes } from '@/lib/data'
import { useCart } from '@/lib/cart-store'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { getAccent } from '@/lib/accents'

interface ProductDetailProps {
  product: Product | null
  onClose: () => void
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const { addItem, openCart, triggerFly } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [product])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null

  const accent = getAccent(product.accentColor)

  const images = [
    { src: product.imageFront, label: 'Front' },
    { src: product.imageBack, label: 'Detail' },
  ]

  const handleAddToCart = (e: React.MouseEvent) => {
    setAdding(true)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    triggerFly(rect.left + rect.width / 2, rect.top)

    addItem(product, selectedSize, quantity)

    setTimeout(() => {
      setAdding(false)
      toast({
        title: 'Added to cart',
        description: `${product.name} — Size ${selectedSize} × ${quantity}`,
      })
      onClose()
      openCart()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0a0a0a] sm:rounded-2xl no-scrollbar">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-sm transition-all hover:border-white/30 hover:text-white"
          aria-label="Close product detail"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="relative bg-[#050505] p-6 sm:p-8 lg:p-10">
            {/* Main image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#0a0a0a]">
              { }
              <img
                src={images[activeImage].src}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {/* Accent glow */}
              <div
                className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: accent.hex }}
              />

              {/* View label */}
              <div className="absolute bottom-4 left-4">
                <span className="font-jp rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] tracking-wider text-white/70 backdrop-blur-sm">
                  {images[activeImage].label} View
                </span>
              </div>
            </div>

            {/* Thumbnail gallery */}
            <div className="mt-4 flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className="relative h-20 w-16 overflow-hidden rounded-lg border-2 transition-all"
                  style={activeImage === idx ? { borderColor: accent.hex } : undefined}
                >
                  { }
                  <img
                    src={img.src}
                    alt={`${product.name} ${img.label}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Swipe hint for mobile */}
            <p className="mt-3 text-center font-jp text-[10px] text-white/30 sm:hidden">
              スワイプで表示
            </p>
          </div>

          {/* Product info */}
          <div className="flex flex-col p-6 sm:p-8 lg:p-10">
            {/* Universe & collection */}
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent.hex }} />
              <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                {product.universe} · {product.collection}
              </span>
            </div>

            {/* Name */}
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-white">
                ${product.price.toFixed(0)}
              </span>
              <span className="text-sm text-white/40">USD</span>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Select Size
                </label>
                <span className="font-jp text-[10px] text-white/30">サイズ</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-medium transition-all',
                      selectedSize === size
                        ? 'border-2 text-white'
                        : 'border border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                    )}
                    style={
                      selectedSize === size
                        ? { borderColor: accent.hex, backgroundColor: `rgba(${accent.rgb}, 0.1)` }
                        : undefined
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/70">
                Quantity
              </label>
              <div className="inline-flex items-center gap-1 rounded-full border border-white/15 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/5 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/5 hover:text-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Product specs */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { label: 'Fabric', value: product.fabric, jp: '素材' },
                { label: 'Fit', value: product.fit, jp: 'フィット' },
                { label: 'Breathability', value: product.breathability, jp: '通気性' },
                { label: 'Durability', value: product.durability, jp: '耐久性' },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      {spec.label}
                    </span>
                    <span className="font-jp text-[9px] text-white/20">{spec.jp}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/80">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <Button
              onClick={handleAddToCart}
              disabled={adding}
              className="btn-glow mt-8 w-full rounded-none py-4 text-sm font-semibold uppercase tracking-wider transition-all hover:opacity-90"
              style={{ minHeight: '52px', backgroundColor: accent.hex, color: 'white' }}
            >
              {adding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Add To Cart — ${(product.price * quantity).toFixed(0)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
