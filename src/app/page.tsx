'use client'

import { useEffect, useState, useCallback } from 'react'
import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { FeaturedCollection } from '@/components/site/featured-collection'
import { ShopByUniverse } from '@/components/site/shop-by-universe'
import { Drops } from '@/components/site/drops'
import { Lifestyle } from '@/components/site/lifestyle'
import { ProductDetail } from '@/components/site/product-detail'
import { CartDrawer } from '@/components/site/cart-drawer'
import { Footer } from '@/components/site/footer'
import { FlyToCart } from '@/components/site/fly-to-cart'
import { LoadingScreen } from '@/components/site/loading-screen'
import { universes, lifestyleImages } from '@/lib/data'
import type { Product } from '@/lib/types'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true)

  // Collect all heavy images to preload
  const preloadImages = [
    '/images/hero-bg.png',
    ...universes.map((u) => u.image),
    ...lifestyleImages.map((l) => l.src),
  ]

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const [allRes, featuredRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/products?featured=true'),
        ])
        const all = await allRes.json()
        const featured = await featuredRes.json()
        setProducts(all)
        setFeaturedProducts(featured.length > 0 ? featured : all.slice(0, 6))
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Navigation - smooth scroll to sections
  const handleNavigate = useCallback((section: string) => {
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(section)
    if (el) {
      const offset = 80 // navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  // Universe selection - open product detail for the universe
  const handleSelectUniverse = useCallback(
    (universeId: string) => {
      const universe = universes.find((u) => u.id === universeId)
      if (!universe) return

      // Find a product from this universe
      const product = products.find((p) =>
        p.universe.toLowerCase().includes(universe.name.toLowerCase())
      )
      if (product) {
        setSelectedProduct(product)
      } else {
        handleNavigate('featured')
      }
    },
    [products, handleNavigate]
  )

  return (
    <>
      {showLoader && (
        <LoadingScreen
          images={preloadImages}
          video="/videos/hero-bg.mp4"
          onComplete={() => setShowLoader(false)}
        />
      )}

      <div className="flex min-h-screen flex-col bg-[#050505]">
        <Navbar onNavigate={handleNavigate} />

        <main className="flex-1">
          <Hero
            onShopClick={() => handleNavigate('featured')}
            onExploreClick={() => handleNavigate('drops')}
          />

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="font-jp text-sm tracking-wider text-white/30">読み込み中</div>
                <div className="font-mono-tech text-[10px] text-white/20">LOADING COLLECTION...</div>
              </div>
            </div>
          ) : (
            <FeaturedCollection
              products={featuredProducts}
              onSelectProduct={setSelectedProduct}
            />
          )}

          <ShopByUniverse onSelectUniverse={handleSelectUniverse} />

          <Drops onShopClick={() => handleNavigate('featured')} />

          <Lifestyle />
        </main>

        <Footer onNavigate={handleNavigate} />

        {/* Overlays */}
        <ProductDetail
          key={selectedProduct?.id || 'none'}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
        <CartDrawer />
        <FlyToCart />
      </div>
    </>
  )
}
