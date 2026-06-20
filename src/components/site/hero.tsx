'use client'

import { Button } from '@/components/ui/button'
import { Particles } from './particles'
import { ArrowRight, Zap } from 'lucide-react'

interface HeroProps {
  onShopClick: () => void
  onExploreClick: () => void
}

export function Hero({ onShopClick, onExploreClick }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Background video — two versions for responsive quality */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Desktop / landscape video (hidden on mobile) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-bg.png"
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          style={{ objectFit: 'cover' }}
          suppressHydrationWarning
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Mobile / portrait video (hidden on desktop) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-bg.png"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
          style={{ objectFit: 'cover' }}
          suppressHydrationWarning
        >
          <source src="/videos/hero-bg-mobile.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlays — lighter so video is visible but text stays readable */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      {/* Orbit lines decoration */}
      <div className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center">
        <div className="orbit-ring h-[120vh] w-[120vh] opacity-30" />
        <div className="orbit-ring h-[90vh] w-[90vh] opacity-20" />
        <div className="orbit-ring h-[60vh] w-[60vh] opacity-10" />
      </div>

      {/* Floating Japanese characters - decorative */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <span className="font-jp absolute left-[6%] top-[18%] text-2xl text-white/[0.05] sm:text-4xl">
          影
        </span>
        <span className="font-jp absolute right-[8%] top-[55%] text-3xl text-white/[0.04] sm:text-5xl">
          街
        </span>
        <span className="font-jp absolute left-[12%] bottom-[18%] text-xl text-white/[0.03] sm:text-3xl">
          戦士
        </span>
      </div>

      {/* Particles - minimal */}
      <Particles count={10} />

      {/* Technical collection tags - corners */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden sm:block">
        {/* Top left */}
        <div className="absolute left-6 top-24 flex items-center gap-2">
          <span className="h-1 w-1 bg-[#FF2D55]" />
          <span className="font-mono-tech text-[10px] text-white/60">DROP-001 / 2025</span>
        </div>
        {/* Top right */}
        <div className="absolute right-6 top-24 flex items-center gap-2">
          <span className="font-mono-tech text-[10px] text-white/60">ANIME ATHLETICS</span>
          <span className="h-1 w-1 bg-[#FF2D55]" />
        </div>
        {/* Bottom left */}
        <div className="absolute left-6 bottom-12 flex items-center gap-2">
          <span className="font-mono-tech text-[10px] text-white/50">東京 / TOKYO</span>
        </div>
        {/* Bottom right */}
        <div className="absolute right-6 bottom-12 flex items-center gap-2">
          <span className="font-mono-tech text-[10px] text-white/50">LIMITED COLLECTION</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Small Japanese label with stars */}
        <div className="animate-fade-in-up mb-6 flex items-center justify-center gap-3 opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <svg width="10" height="10" viewBox="0 0 14 14" className="text-[#FF2D55]" fill="currentColor"><path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" /></svg>
          <span className="font-jp text-xs tracking-[0.4em] text-[#FF2D55] sm:text-sm">
            東京ストリート
          </span>
          <svg width="10" height="10" viewBox="0 0 14 14" className="text-[#FF2D55]" fill="currentColor"><path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" /></svg>
        </div>

        {/* Headline with text shadow for readability over lighter video */}
        <h1
          className="animate-fade-in-up font-display text-5xl font-bold leading-[0.9] tracking-tight text-white opacity-0 sm:text-7xl lg:text-8xl"
          style={{
            animationDelay: '0.25s',
            animationFillMode: 'forwards',
            textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3)',
          }}
        >
          WEAR YOUR<br />FANDOM
        </h1>

        {/* Accent line under headline */}
        <div
          className="animate-fade-in-up mx-auto mt-6 flex items-center justify-center gap-3 opacity-0"
          style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
        >
          <span className="h-px w-12 bg-[#FF2D55]" />
          <span className="font-mono-tech text-[10px] text-[#FF2D55]">SS / 2025</span>
          <span className="h-px w-12 bg-[#FF2D55]" />
        </div>

        {/* Subheadline with text shadow */}
        <p
          className="animate-fade-in-up mx-auto mt-6 max-w-xl text-sm text-white/80 opacity-0 sm:text-base"
          style={{
            animationDelay: '0.45s',
            animationFillMode: 'forwards',
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
          }}
        >
          Premium Anime Jerseys Built For Everyday Legends
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row sm:gap-4"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <Button
            onClick={onShopClick}
            size="lg"
            className="btn-glow group h-12 w-full rounded-none bg-white px-8 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-[#FF2D55] hover:text-white sm:w-auto"
          >
            Shop Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            onClick={onExploreClick}
            size="lg"
            className="btn-glow group h-12 w-full rounded-none border border-white/30 bg-black/30 px-8 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10 sm:w-auto"
          >
            <Zap className="h-4 w-4" />
            Latest Drop
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono-tech text-[9px] tracking-[0.3em] text-white/50">SCROLL</span>
          <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent">
            <div className="h-3 w-px animate-pulse bg-[#FF2D55]" />
          </div>
        </div>
      </div>
    </section>
  )
}
