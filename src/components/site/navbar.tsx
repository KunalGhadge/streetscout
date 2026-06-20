'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-store'

interface NavbarProps {
  onNavigate: (section: string) => void
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const totalItems = useCart((s) => s.getTotalItems())
  const openCart = useCart((s) => s.openCart)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { label: 'Shop', target: 'featured', num: '01' },
    { label: 'Collections', target: 'universes', num: '02' },
    { label: 'Drops', target: 'drops', num: '03' },
    { label: 'About', target: 'lifestyle', num: '04' },
  ]

  const handleNav = (target: string) => {
    setMobileOpen(false)
    onNavigate(target)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass-subtle border-b border-[#2A2A2A] py-2.5'
            : 'bg-transparent py-4'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => handleNav('hero')}
            className="group flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Street Scout home"
          >
            <div className="flex items-center gap-2">
              {/* Star symbol */}
              <svg width="14" height="14" viewBox="0 0 14 14" className="text-[#FF2D55]" fill="currentColor" aria-hidden="true">
                <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" />
              </svg>
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
                STREET SCOUT
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => handleNav(item.target)}
                className="group relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                <span className="font-mono-tech text-[9px] text-[#FF2D55]/60 transition-colors group-hover:text-[#FF2D55]">
                  {item.num}
                </span>
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#FF2D55] transition-all duration-300 group-hover:w-2/3" />
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="group relative flex h-10 items-center gap-2 rounded-full border border-transparent px-3 transition-all hover:border-[#2A2A2A] hover:bg-white/[0.02]"
              aria-label={`Open cart, ${totalItems} items`}
            >
              <span className="hidden sm:inline font-mono-tech text-[10px] text-white/40 group-hover:text-white/60">
                CART
              </span>
              <div className="relative" key={`cart-icon-${totalItems}`}>
                <ShoppingBag className="h-5 w-5 text-white/70 transition-colors group-hover:text-white cart-bounce" />
                {totalItems > 0 && (
                  <span
                    className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF2D55] px-1 text-[9px] font-bold text-white cart-bounce"
                  >
                    {totalItems}
                  </span>
                )}
              </div>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-white/80 transition-all hover:border-[#2A2A2A] hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 glass-subtle transition-all duration-300 md:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div className="relative flex h-full flex-col items-center justify-center gap-4">
          {/* Technical label top */}
          <div className="absolute top-24 left-6 flex items-center gap-2">
            <span className="h-1 w-1 bg-[#FF2D55]" />
            <span className="font-mono-tech text-[10px] text-white/40">MENU / NAVIGATION</span>
          </div>

          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleNav(item.target)}
              className="group flex items-center gap-3 transition-all hover:opacity-80"
            >
              <span className="font-mono-tech text-xs text-[#FF2D55]">{item.num}</span>
              <span className="font-display text-4xl font-bold tracking-tight text-white/80 transition-colors group-hover:text-white">
                {item.label}
              </span>
            </button>
          ))}

          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="font-jp text-sm tracking-wider text-white/30">ストリートスカウト</div>
            <div className="font-mono-tech text-[10px] text-white/20">ANIME ATHLETICS · EST 2025</div>
          </div>
        </div>
      </div>
    </>
  )
}
