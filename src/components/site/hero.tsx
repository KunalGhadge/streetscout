'use client'

import { Button } from '@/components/ui/button'
import { Particles } from './particles'
import { ArrowRight, Compass } from 'lucide-react'

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
      {/* Background image with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 animate-ken-burns">
          { }
          <img
            src="/images/hero-bg.png"
            alt=""
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </div>

        {/* Heavy dark gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />

        {/* Crimson glow accent - subtle red eyes effect */}
        <div
          className="absolute left-[15%] top-[30%] h-32 w-32 rounded-full bg-accent-crimson/20 blur-3xl animate-pulse-glow"
          aria-hidden="true"
        />
        <div
          className="absolute right-[20%] top-[25%] h-24 w-24 rounded-full bg-accent-crimson/15 blur-3xl animate-pulse-glow"
          style={{ animationDelay: '1s' }}
          aria-hidden="true"
        />
      </div>

      {/* Floating Japanese characters - decorative */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <span className="font-jp absolute left-[8%] top-[20%] text-2xl text-white/[0.04] sm:text-4xl">
          影
        </span>
        <span className="font-jp absolute right-[10%] top-[60%] text-3xl text-white/[0.04] sm:text-5xl">
          街
        </span>
        <span className="font-jp absolute left-[15%] bottom-[15%] text-xl text-white/[0.03] sm:text-3xl">
          戦士
        </span>
      </div>

      {/* Particles */}
      <Particles count={14} color="rgba(220, 20, 60, 0.5)" />

      {/* Glowing line accents */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute left-1/2 top-0 h-24 w-px bg-gradient-to-b from-transparent via-accent-crimson/40 to-transparent"
          style={{ animationDelay: '0.5s' }}
        />
        <div className="absolute bottom-0 left-1/4 h-16 w-px bg-gradient-to-t from-accent-crimson/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Small Japanese label */}
        <div className="animate-fade-in-up mb-6 flex items-center justify-center gap-3 opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <span className="h-px w-8 bg-accent-crimson/60" />
          <span className="font-jp text-xs tracking-[0.4em] text-accent-crimson/90 sm:text-sm">
            東京ストリート
          </span>
          <span className="h-px w-8 bg-accent-crimson/60" />
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up font-display text-5xl font-bold leading-[0.95] tracking-tight text-white opacity-0 sm:text-7xl lg:text-8xl"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          Wear Your
          <br />
          <span className="text-glow-crimson accent-crimson">Fandom.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-in-up mx-auto mt-6 max-w-xl text-base text-white/60 opacity-0 sm:text-lg"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          Premium Anime Jerseys Built For Everyday Legends.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row sm:gap-4"
          style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}
        >
          <Button
            onClick={onShopClick}
            size="lg"
            className="btn-glow group h-12 w-full rounded-none border border-white bg-white px-8 text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-accent-crimson hover:text-white hover:border-accent-crimson sm:w-auto"
          >
            Shop Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            onClick={onExploreClick}
            size="lg"
            className="btn-glow group h-12 w-full rounded-none border border-white/20 bg-transparent px-8 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:border-white hover:bg-white/5 sm:w-auto"
          >
            <Compass className="h-4 w-4" />
            Explore Drops
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-jp text-[10px] tracking-[0.3em] text-white/30">スクロール</span>
          <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent">
            <div className="h-3 w-px animate-pulse bg-accent-crimson" />
          </div>
        </div>
      </div>
    </section>
  )
}
