'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'

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
    { label: 'Shop', target: 'featured' },
    { label: 'Collections', target: 'universes' },
    { label: 'About', target: 'lifestyle' },
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
            ? 'glass-subtle border-b border-white/[0.06] py-2'
            : 'bg-transparent py-4'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => handleNav('hero')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Street Scout home"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              STREET<span className="accent-crimson"> SCOUT</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => handleNav(item.target)}
                className="relative px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white group"
              >
                {item.label}
                <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-accent-crimson transition-all duration-300 group-hover:w-3/4" />
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/5 hover:text-white"
              aria-label={`Open cart, ${totalItems} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span
                  key={totalItems}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-crimson px-1 text-[10px] font-bold text-white animate-fade-in"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/5 hover:text-white md:hidden"
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
        <div className="flex h-full flex-col items-center justify-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleNav(item.target)}
              className="font-display text-4xl font-bold tracking-tight text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </button>
          ))}
          <div className="mt-8 font-jp text-sm text-white/30">ストリートスカウト</div>
        </div>
      </div>
    </>
  )
}
