'use client'

import { useState, useEffect } from 'react'
import { Reveal } from './reveal'
import { SectionHeader } from './section-header'
import { ArrowRight } from 'lucide-react'
import type { Drop } from '@/lib/types'

interface DropsProps {
  onShopClick: () => void
}

export function Drops({ onShopClick }: DropsProps) {
  const [drops, setDrops] = useState<Drop[]>([])

  useEffect(() => {
    fetch('/api/content/drops')
      .then((r) => r.json())
      .then(setDrops)
      .catch(console.error)
  }, [])

  return (
    <section id="drops" className="relative bg-[#030303] py-20 sm:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between gap-8 sm:mb-16">
          <SectionHeader
            dropNumber="RELEASES"
            japanese="ドロップ"
            tag="LIMITED"
            title="Latest"
            accentWord="Drops"
            description="Limited release collections. Once they're gone, they're gone."
          />
          <button
            onClick={onShopClick}
            className="group hidden shrink-0 items-center gap-2 border border-[#2A2A2A] px-4 py-2 transition-all hover:border-[#FF2D55] sm:flex"
          >
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-white/60 group-hover:text-white">
              View All
            </span>
            <ArrowRight className="h-3 w-3 text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:text-[#FF2D55]" />
          </button>
        </div>

        {/* Drops list - editorial rows */}
        <div className="space-y-3">
          {drops.map((drop, index) => (
            <Reveal key={drop.id} delay={index * 100}>
              <button
                onClick={onShopClick}
                className="group relative w-full overflow-hidden border border-[#2A2A2A] bg-[#0a0a0a] text-left transition-colors hover:border-[#FF2D55]/50"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111111] sm:aspect-auto sm:w-2/5 lg:w-1/3">
                    { }
                    <img
                      src={drop.image}
                      alt={drop.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />

                    {/* Corner brackets */}
                    <div className="absolute inset-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-[#FF2D55]" />
                      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-[#FF2D55]" />
                      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#FF2D55]" />
                      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#FF2D55]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-8">
                    {/* Top: number + status */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-tech text-xs text-[#FF2D55]">{drop.number}</span>
                          <span className="h-px w-6 bg-[#FF2D55]/40" />
                          <span className="font-jp text-xs tracking-wider text-white/40">{drop.japanese}</span>
                        </div>
                        <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                          {drop.title}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`font-mono-tech text-[9px] ${
                          drop.status === 'LIMITED' ? 'text-[#FF2D55]' : 'text-white/50'
                        }`}>
                          {drop.status}
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A2A] text-white/60 transition-all group-hover:border-[#FF2D55] group-hover:bg-[#FF2D55] group-hover:text-white">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 max-w-md text-sm text-white/50">
                      {drop.description}
                    </p>

                    {/* Bottom line */}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="h-px flex-1 bg-[#2A2A2A]" />
                      <span className="font-mono-tech text-[9px] text-white/30">SHOP NOW</span>
                    </div>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
