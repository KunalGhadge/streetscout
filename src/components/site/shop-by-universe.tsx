'use client'

import { universes } from '@/lib/data'
import { Reveal } from './reveal'
import { ArrowUpRight } from 'lucide-react'
import { getAccent } from '@/lib/accents'

interface ShopByUniverseProps {
  onSelectUniverse: (universeId: string) => void
}

export function ShopByUniverse({ onSelectUniverse }: ShopByUniverseProps) {
  return (
    <section id="universes" className="relative bg-[#070707] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 sm:mb-16">
          <div className="text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-6" style={{ backgroundColor: '#0066FF' }} />
              <span className="font-jp text-xs tracking-[0.3em]" style={{ color: '#0066FF' }}>
                ユニバース
              </span>
              <span className="h-px w-6" style={{ backgroundColor: '#0066FF' }} />
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Shop By <span style={{ color: '#0066FF' }}>Universe</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
              Choose your world. Each collection is crafted with its own distinct visual language.
            </p>
          </div>
        </Reveal>

        {/* Universe grid - editorial layout */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {universes.map((universe, index) => {
            const accent = getAccent(universe.accent)
            return (
              <Reveal key={universe.id} delay={index * 60}>
                <button
                  onClick={() => onSelectUniverse(universe.id)}
                  className={`group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#121212] ${
                    index === 0 ? 'sm:col-span-2 sm:aspect-[16/10] lg:col-span-2 lg:aspect-[16/10]' : ''
                  }`}
                >
                  {/* Image */}
                  { }
                  <img
                    src={universe.image}
                    alt={universe.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
                  />

                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Accent glow on hover */}
                  <div
                    className="absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-30"
                    style={{ backgroundColor: accent.hex }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <div className="font-jp mb-1 text-xs tracking-wider text-white/50">
                      {universe.japanese}
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {universe.name}
                      </h3>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    {/* Accent line */}
                    <div
                      className="mt-3 h-0.5 w-0 origin-left transition-all duration-500 group-hover:w-12"
                      style={{ backgroundColor: accent.hex }}
                    />
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
