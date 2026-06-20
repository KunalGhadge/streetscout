'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { sizes, formatINR } from '@/lib/data'
import { useCart } from '@/lib/cart-store'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

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

  const images = [
    { src: product.imageFront, label: 'Front' },
    { src: product.imageBack, label: 'Detail' },
  ]

  const handleAddToCart = (e: React.MouseEvent) => {
    setAdding(true)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    triggerFly(rect.left + rect.width / 2, rect.top + rect.height / 2)

    addItem(product, selectedSize, quantity)

    setTimeout(() => {
      setAdding(false)
      toast({
        title: 'Added to cart',
        description: `${product.name} — Size ${selectedSize} × ${quantity}`,
      })
      onClose()
      openCart()
    }, 550)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-lg border border-[#2A2A2A] bg-[#050505] sm:rounded-lg no-scrollbar">
        {/* Top technical bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#2A2A2A] bg-[#050505]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-[10px] text-[#FF2D55]">{product.dropNumber}</span>
            <span className="h-3 w-px bg-[#2A2A2A]" />
            <span className="font-mono-tech text-[10px] text-white/50">{product.collectionTag}</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A2A] text-white/60 transition-all hover:border-[#FF2D55] hover:text-white"
            aria-label="Close product detail"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="relative bg-[#080808] p-5 sm:p-8 lg:p-10">
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-overlay opacity-20" />

            {/* Main image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-[#2A2A2A]">
              { }
              <img
                src={images[activeImage].src}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              {/* Corner brackets */}
              <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-[#FF2D55]/60" />
              <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-[#FF2D55]/60" />
              <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-[#FF2D55]/60" />
              <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-[#FF2D55]/60" />

              {/* View label */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-1.5 border border-[#2A2A2A] bg-black/70 px-2.5 py-1 backdrop-blur-sm">
                  <span className="h-1 w-1 bg-[#FF2D55]" />
                  <span className="font-mono-tech text-[9px] tracking-wider text-white/80">
                    {images[activeImage].label.toUpperCase()} VIEW
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail gallery */}
            <div className="mt-4 flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    'relative h-20 w-16 overflow-hidden border-2 transition-all',
                    activeImage === idx
                      ? 'border-[#FF2D55]'
                      : 'border-[#2A2A2A] hover:border-white/30'
                  )}
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

            {/* Japanese collection tag */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#2A2A2A]" />
              <span className="font-jp text-xs tracking-[0.3em] text-white/40">
                {product.universeJp}
              </span>
              <span className="h-px w-8 bg-[#2A2A2A]" />
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col p-5 sm:p-8 lg:p-10">
            {/* Collection tag */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#FF2D55]" />
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#FF2D55]/80">
                {product.collectionTag}
              </span>
            </div>

            {/* Name */}
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {product.name}
            </h2>

            {/* Collection line */}
            <div className="mt-2 flex items-center gap-2 text-sm text-white/40">
              <span>{product.universe}</span>
              <span className="h-3 w-px bg-[#2A2A2A]" />
              <span>{product.collection}</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-white">
                {formatINR(product.price)}
              </span>
              <span className="font-mono-tech text-[10px] text-white/40">INR · FREE SHIP</span>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-white/55">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
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
                      'flex h-11 min-w-11 items-center justify-center px-4 text-sm font-semibold transition-all',
                      selectedSize === size
                        ? 'border-2 border-[#FF2D55] bg-[#FF2D55]/10 text-white'
                        : 'border border-[#2A2A2A] text-white/60 hover:border-white/40 hover:text-white'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <label className="mb-3 block font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
                Quantity
              </label>
              <div className="inline-flex items-center gap-1 border border-[#2A2A2A] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center text-white/60 transition-all hover:bg-[#FF2D55] hover:text-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center text-white/60 transition-all hover:bg-[#FF2D55] hover:text-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Product specs - technical grid */}
            <div className="mt-8 grid grid-cols-2 gap-px border border-[#2A2A2A] bg-[#2A2A2A]">
              {[
                { label: 'Fabric', value: product.fabric, jp: '素材' },
                { label: 'Fit', value: product.fit, jp: 'フィット' },
                { label: 'Breathability', value: product.breathability, jp: '通気性' },
                { label: 'Durability', value: product.durability, jp: '耐久性' },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-[#0a0a0a] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[9px] uppercase tracking-wider text-white/40">
                      {spec.label}
                    </span>
                    <span className="font-jp text-[9px] text-white/20">{spec.jp}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/85">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <Button
              onClick={handleAddToCart}
              disabled={adding}
              className="btn-glow mt-8 w-full rounded-none py-4 text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90"
              style={{ minHeight: '52px', backgroundColor: '#FF2D55', color: 'white' }}
            >
              {adding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Add To Cart — {formatINR(product.price * quantity)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
