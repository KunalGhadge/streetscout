'use client'

import { universes } from '@/lib/data'
import { Reveal } from './reveal'
import { SectionHeader } from './section-header'
import { ArrowUpRight } from 'lucide-react'

interface ShopByUniverseProps {
  onSelectUniverse: (universeId: string) => void
}

export function ShopByUniverse({ onSelectUniverse }: ShopByUniverseProps) {
  return (
    <section id="universes" className="relative bg-[#070707] py-20 sm:py-28">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 sm:mb-16">
          <SectionHeader
            dropNumber="COLLECTIONS"
            japanese="ユニバース"
            tag="ALL DROPS"
            title="Shop By"
            accentWord="Universe"
            description="Choose your world. Each collection is crafted with its own distinct visual language."
          />
        </div>

        {/* Universe grid - editorial layout */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {universes.map((universe, index) => (
            <Reveal key={universe.id} delay={index * 60}>
              <button
                onClick={() => onSelectUniverse(universe.id)}
                className={`group relative aspect-[4/5] w-full overflow-hidden bg-[#111111] border border-[#2A2A2A] hover:border-[#FF2D55]/50 transition-colors duration-400 ${
                  index === 0 ? 'sm:col-span-2 sm:aspect-[16/10] lg:col-span-2 lg:aspect-[16/10]' : ''
                }`}
              >
                {/* Top technical bar */}
                <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-white/5 bg-black/40 px-3 py-2 backdrop-blur-sm">
                  <span className="font-mono-tech text-[9px] text-[#FF2D55]">{universe.dropNumber}</span>
                  <span className="font-mono-tech text-[9px] text-white/50">COLLECTION</span>
                </div>

                {/* Image */}
                { }
                <img
                  src={universe.image}
                  alt={universe.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-65 transition-all duration-700 group-hover:scale-110 group-hover:opacity-85"
                />

                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

                {/* Corner brackets on hover */}
                <div className="absolute inset-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-[#FF2D55]" />
                  <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-[#FF2D55]" />
                  <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[#FF2D55]" />
                  <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[#FF2D55]" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
                  <div className="font-jp mb-1 text-xs tracking-wider text-white/50">
                    {universe.japanese}
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {universe.name}
                    </h3>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 group-hover:border-[#FF2D55] group-hover:bg-[#FF2D55] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  {/* Accent line */}
                  <div className="mt-3 h-px w-0 origin-left bg-[#FF2D55] transition-all duration-500 group-hover:w-16" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
