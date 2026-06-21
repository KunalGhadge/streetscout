'use client'

import { useState, useEffect } from 'react'
import { Reveal } from './reveal'
import { SectionHeader } from './section-header'
import type { Lifestyle as LifestyleItem } from '@/lib/types'

export function Lifestyle() {
  const [items, setItems] = useState<LifestyleItem[]>([])

  useEffect(() => {
    fetch('/api/content/lifestyle')
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error)
  }, [])

  return (
    <section id="lifestyle" className="relative bg-[#050505] py-20 sm:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 sm:mb-16">
          <SectionHeader
            dropNumber="LOOKBOOK"
            japanese="ライフスタイル"
            tag="SCENES"
            title="Worn In"
            accentWord="Every Scene"
            description="From campus to convention floor. Built for the life you actually live."
          />
        </div>

        {/* Lookbook grid - asymmetric editorial layout */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4">
          {/* Large feature image - left */}
          {items[0] && (
            <Reveal className="sm:col-span-7" delay={0}>
              <LookbookCard
                image={items[0]}
                className="aspect-[16/10] sm:aspect-[16/11]"
                large
              />
            </Reveal>
          )}

          {/* Right column - 2 stacked images */}
          <div className="grid grid-cols-1 gap-3 sm:col-span-5 sm:gap-4">
            {items[1] && (
              <Reveal delay={100}>
                <LookbookCard
                  image={items[1]}
                  className="aspect-[16/10] sm:aspect-[16/9]"
                />
              </Reveal>
            )}
            {items[2] && (
              <Reveal delay={200}>
                <LookbookCard
                  image={items[2]}
                  className="aspect-[16/10] sm:aspect-[16/9]"
                />
              </Reveal>
            )}
          </div>

          {/* Bottom wide image */}
          {items[3] && (
            <Reveal className="sm:col-span-12" delay={150}>
              <LookbookCard
                image={items[3]}
                className="aspect-[16/7]"
                wide
              />
            </Reveal>
          )}
        </div>

        {/* Brand statement */}
        <Reveal className="mt-16 sm:mt-24" delay={100}>
          <div className="mx-auto max-w-2xl text-center">
            {/* Star symbol */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#2A2A2A]" />
              <svg width="12" height="12" viewBox="0 0 14 14" className="text-[#FF2D55]" fill="currentColor"><path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" /></svg>
              <span className="font-jp text-sm tracking-[0.3em] text-white/40">影の戦士</span>
              <svg width="12" height="12" viewBox="0 0 14 14" className="text-[#FF2D55]" fill="currentColor"><path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" /></svg>
              <span className="h-px w-8 bg-[#2A2A2A]" />
            </div>
            <p className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Not just merchandise.
              <br />
              <span className="text-[#FF2D55]">A uniform for the dedicated.</span>
            </p>
            <div className="mt-6 font-mono-tech text-[10px] tracking-wider text-white/30">
              ANIME ATHLETICS · LIMITED COLLECTION · EST 2025
            </div>
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
  image: LifestyleItem
  className?: string
  large?: boolean
  wide?: boolean
}) {
  return (
    <div className={`group relative overflow-hidden bg-[#111111] border border-[#2A2A2A] hover:border-[#FF2D55]/40 transition-colors duration-400 ${className || ''}`}>
      {/* Image */}
      { }
      <img
        src={image.image}
        alt={image.label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
      />

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Top technical bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-white/5 px-3 py-2">
        <span className="font-mono-tech text-[9px] text-[#FF2D55]">{image.tag}</span>
        <span className="font-mono-tech text-[9px] text-white/40">SCENE</span>
      </div>

      {/* Corner brackets */}
      <div className="absolute inset-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-[#FF2D55]" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-[#FF2D55]" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#FF2D55]" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#FF2D55]" />
      </div>

      {/* Content */}
      <div className={`absolute inset-0 z-10 flex ${wide ? 'items-center justify-center text-center' : 'flex-col justify-end'} p-5 sm:p-7`}>
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
            <div className="mt-3 h-0.5 w-0 origin-left bg-[#FF2D55] transition-all duration-500 group-hover:w-12" />
          </>
        )}
      </div>
    </div>
  )
}
