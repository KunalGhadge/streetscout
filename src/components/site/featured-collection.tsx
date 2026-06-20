'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { Reveal } from './reveal'
import { SectionHeader } from './section-header'
import { useCart } from '@/lib/cart-store'
import { useToast } from '@/hooks/use-toast'
import { formatINR } from '@/lib/data'

interface FeaturedCollectionProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
}

export function FeaturedCollection({ products, onSelectProduct }: FeaturedCollectionProps) {
  return (
    <section id="featured" className="relative bg-[#050505] py-20 sm:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between gap-8 sm:mb-16">
          <SectionHeader
            dropNumber="DROP-001"
            japanese="特集"
            tag="FEATURED"
            title="Featured"
            accentWord="Collection"
            description="Curated drops engineered for the modern otaku. Limited quantities, premium construction."
          />
          <div className="hidden shrink-0 lg:block">
            <div className="font-mono-tech text-right text-[10px] text-white/30">
              <div>{products.length} ITEMS</div>
              <div className="mt-1">FW / 2025</div>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 80}>
              <ProductCard product={product} onSelectProduct={onSelectProduct} />
            </Reveal>
          ))}
        </div>

        {/* Bottom line */}
        <Reveal delay={200}>
          <div className="mt-16 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#2A2A2A]" />
            <span className="font-mono-tech text-[10px] text-white/30">END OF COLLECTION</span>
            <span className="h-px w-16 bg-[#2A2A2A]" />
          </div>
        </Reveal>
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
        'group relative cursor-pointer overflow-hidden bg-[#111111] transition-all duration-400',
        'border border-[#2A2A2A] hover:border-[#FF2D55]/50',
        hovered && 'shadow-2xl shadow-black/60 -translate-y-1'
      )}
    >
      {/* Top technical bar */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] px-3 py-2">
        <span className="font-mono-tech text-[9px] text-[#FF2D55]">{product.dropNumber}</span>
        <span className="font-mono-tech text-[9px] text-white/30">{product.universeJp}</span>
      </div>

      {/* Product image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#080808]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        {/* Corner brackets on hover */}
        <div className={cn(
          'absolute inset-3 transition-opacity duration-300',
          hovered ? 'opacity-100' : 'opacity-0'
        )}>
          <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-[#FF2D55]" />
          <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-[#FF2D55]" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#FF2D55]" />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#FF2D55]" />
        </div>

        {/* Quick add button */}
        <button
          onClick={handleQuickAdd}
          disabled={adding}
          className={cn(
            'absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full',
            'bg-white text-black transition-all duration-300',
            'hover:bg-[#FF2D55] hover:text-white',
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

        {/* Limited release badge */}
        <div className="absolute left-3 top-3">
          <div className="flex items-center gap-1.5 border border-[#2A2A2A] bg-black/70 px-2 py-1 backdrop-blur-sm">
            <span className="h-1 w-1 bg-[#FF2D55]" />
            <span className="font-mono-tech text-[8px] text-white/70">LIMITED</span>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="border-t border-[#2A2A2A] p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono-tech text-[9px] uppercase tracking-wider text-[#FF2D55]/80">
            {product.collectionTag}
          </span>
          <span className="font-mono-tech text-[9px] text-white/30">
            {product.universe}
          </span>
        </div>
        <h3 className="font-display text-lg font-bold tracking-tight text-white transition-colors">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-bold text-white">
              {formatINR(product.price)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono-tech text-[9px] text-white/30">SIZES</span>
            <span className="font-mono-tech text-[9px] text-white/50">S–XXL</span>
          </div>
        </div>
      </div>
    </article>
  )
}
