'use client'

import { lifestyleImages } from '@/lib/data'
import { Reveal } from './reveal'

export function Lifestyle() {
  return (
    <section id="lifestyle" className="relative bg-[#050505] py-20 sm:py-28">
      {/* Brush stroke divider at top */}
      <div className="absolute top-0 left-1/2 h-2 w-32 -translate-x-1/2">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-accent-crimson/40 to-transparent" style={{ clipPath: 'polygon(5% 0, 95% 30%, 90% 100%, 10% 70%)' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 sm:mb-16">
          <div className="text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-accent-crimson" />
              <span className="font-jp text-xs tracking-[0.3em] accent-crimson">
                ライフスタイル
              </span>
              <span className="h-px w-6 bg-accent-crimson" />
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Worn In <span className="accent-crimson">Every Scene</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
              From campus to convention floor. Built for the life you actually live.
            </p>
          </div>
        </Reveal>

        {/* Lookbook grid - asymmetric editorial layout */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4">
          {/* Large feature image - left */}
          <Reveal className="sm:col-span-7" delay={0}>
            <LookbookCard
              image={lifestyleImages[0]}
              className="aspect-[16/10] sm:aspect-[16/11]"
              large
            />
          </Reveal>

          {/* Right column - 2 stacked images */}
          <div className="grid grid-cols-1 gap-3 sm:col-span-5 sm:gap-4">
            <Reveal delay={100}>
              <LookbookCard
                image={lifestyleImages[1]}
                className="aspect-[16/10] sm:aspect-[16/9]"
              />
            </Reveal>
            <Reveal delay={200}>
              <LookbookCard
                image={lifestyleImages[2]}
                className="aspect-[16/10] sm:aspect-[16/9]"
              />
            </Reveal>
          </div>

          {/* Bottom wide image */}
          <Reveal className="sm:col-span-12" delay={150}>
            <LookbookCard
              image={lifestyleImages[3]}
              className="aspect-[16/7]"
              wide
            />
          </Reveal>
        </div>

        {/* Brand statement */}
        <Reveal className="mt-16 sm:mt-24" delay={100}>
          <div className="mx-auto max-w-2xl text-center">
            <div className="font-jp mb-4 text-sm tracking-[0.3em] text-white/30">
              影の戦士
            </div>
            <p className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
              Not just merchandise.
              <br />
              <span className="accent-crimson">A uniform for the dedicated.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function LookbookCard({
  image,
  className,
  large = false,
  wide = false,
}: {
  image: { src: string; label: string; japanese: string; description: string }
  className?: string
  large?: boolean
  wide?: boolean
}) {
  return (
    <div className={`group relative overflow-hidden rounded-lg bg-[#121212] ${className || ''}`}>
      { }
      <img
        src={image.src}
        alt={image.label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-95"
      />

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Manga panel border */}
      <div className="absolute inset-0 border border-white/[0.06]" />

      {/* Content */}
      <div className={`absolute inset-0 flex ${wide ? 'items-center justify-center text-center' : 'flex-col justify-end'} p-5 sm:p-7`}>
        {wide ? (
          <div>
            <div className="font-jp mb-2 text-xs tracking-wider text-white/50">
              {image.japanese}
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {image.label}
            </h3>
            <p className="mt-1 text-sm text-white/50">{image.description}</p>
          </div>
        ) : (
          <>
            <div className="font-jp mb-1 text-xs tracking-wider text-white/50">
              {image.japanese}
            </div>
            <h3 className={`font-display ${large ? 'text-2xl sm:text-3xl' : 'text-xl'} font-bold tracking-tight text-white`}>
              {image.label}
            </h3>
            <p className="mt-1 text-sm text-white/50">{image.description}</p>
            {/* Accent line */}
            <div className="mt-3 h-0.5 w-0 origin-left bg-accent-crimson transition-all duration-500 group-hover:w-10" />
          </>
        )}
      </div>
    </div>
  )
}
