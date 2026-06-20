'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { Reveal } from './reveal'
import { useCart } from '@/lib/cart-store'
import { useToast } from '@/hooks/use-toast'
import { sizes } from '@/lib/data'
import { getAccent } from '@/lib/accents'

interface FeaturedCollectionProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
}

export function FeaturedCollection({ products, onSelectProduct }: FeaturedCollectionProps) {
  return (
    <section id="featured" className="relative bg-[#050505] py-20 sm:py-28">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 sm:mb-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-6 bg-accent-purple" />
                <span className="font-jp text-xs tracking-[0.3em] accent-purple">
                  特集コレクション
                </span>
              </div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Featured
                <span className="accent-purple"> Collection</span>
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm text-white/50 lg:block">
              Curated drops engineered for the modern otaku. Limited quantities, premium construction.
            </p>
          </div>
        </Reveal>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 80}>
              <ProductCard product={product} onSelectProduct={onSelectProduct} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
  onSelectProduct,
}: {
  product: Product
  onSelectProduct: (product: Product) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)
  const { addItem, openCart, triggerFly } = useCart()
  const { toast } = useToast()

  const accent = getAccent(product.accentColor)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAdding(true)

    // Fly animation
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    triggerFly(rect.left + rect.width / 2, rect.top)

    // Add default size M
    addItem(product, 'M', 1)

    setTimeout(() => {
      setAdding(false)
      toast({
        title: 'Added to cart',
        description: `${product.name} — Size M`,
      })
      openCart()
    }, 500)
  }

  return (
    <article
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg bg-[#121212] transition-all duration-500',
        'border border-white/[0.04] hover:border-white/[0.12]',
        hovered && 'shadow-2xl shadow-black/50 -translate-y-0.5'
      )}
    >
      {/* Product image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
        { }
        <img
          src={product.imageFront}
          alt={product.name}
          loading="lazy"
          className={cn(
            'h-full w-full object-cover transition-transform duration-700',
            hovered && 'scale-105'
          )}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />

        {/* Accent line on hover */}
        <div
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left transition-transform duration-500"
          style={{
            backgroundColor: accent.hex,
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          }}
        />

        {/* Quick add button */}
        <button
          onClick={handleQuickAdd}
          disabled={adding}
          className={cn(
            'absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full',
            'glass-subtle border border-white/20 text-white transition-all duration-300',
            'hover:border-white hover:bg-white hover:text-black',
            'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
            adding && 'opacity-100'
          )}
          aria-label={`Quick add ${product.name}`}
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>

        {/* Universe badge */}
        <div className="absolute left-4 top-4">
          <span className="font-jp rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] tracking-wider text-white/70 backdrop-blur-sm">
            {product.universe}
          </span>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 sm:p-5">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-wider" style={{ color: accent.hex }}>
          {product.collection}
        </p>
        <h3 className="font-display text-lg font-bold tracking-tight text-white transition-colors group-hover:text-white">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-white">
            ${product.price.toFixed(0)}
          </span>
          <span className="font-jp text-[10px] text-white/30">
            サイズ: S–XXL
          </span>
        </div>
      </div>
    </article>
  )
}
