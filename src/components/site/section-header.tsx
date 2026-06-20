'use client'

import { Reveal } from './reveal'

interface SectionHeaderProps {
  dropNumber?: string
  japanese?: string
  title: string
  accentWord?: string
  description?: string
  align?: 'left' | 'center'
  tag?: string
}

export function SectionHeader({
  dropNumber,
  japanese,
  title,
  accentWord,
  description,
  align = 'left',
  tag,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <Reveal>
      <div className={isCenter ? 'text-center' : 'text-left'}>
        {/* Top line with drop number and tag */}
        <div className={`mb-4 flex items-center gap-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
          {dropNumber && (
            <>
              <span className="font-mono-tech text-xs text-[#FF2D55]">{dropNumber}</span>
              <span className="h-px w-6 bg-[#FF2D55]/40" />
            </>
          )}
          {japanese && (
            <span className="font-jp text-xs tracking-[0.3em] text-white/40">{japanese}</span>
          )}
          {tag && (
            <>
              <span className="h-px w-6 bg-[#2A2A2A]" />
              <span className="font-mono-tech text-[10px] text-white/30">{tag}</span>
            </>
          )}
        </div>

        {/* Main title */}
        <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}{' '}
          {accentWord && <span className="text-[#FF2D55]">{accentWord}</span>}
        </h2>

        {/* Description */}
        {description && (
          <p className={`mt-4 max-w-md text-sm text-white/50 ${isCenter ? 'mx-auto' : ''}`}>
            {description}
          </p>
        )}

        {/* Bottom line */}
        <div className={`mt-6 h-px w-16 bg-[#2A2A2A] ${isCenter ? 'mx-auto' : ''}`} />
      </div>
    </Reveal>
  )
}
