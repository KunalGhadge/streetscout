'use client'

import { Instagram, Twitter, Youtube } from 'lucide-react'

interface FooterProps {
  onNavigate: (section: string) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-[#2A2A2A] bg-[#030303]">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" className="text-[#FF2D55]" fill="currentColor"><path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" /></svg>
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                STREET SCOUT
              </h3>
            </div>
            <p className="font-jp mt-1 text-xs tracking-wider text-white/30">
              ストリートスカウト
            </p>
            <p className="mt-4 max-w-xs text-sm text-white/40">
              Premium anime jerseys built for everyday legends. A fashion label first, an anime store second.
            </p>
            {/* Social */}
            <div className="mt-6 flex gap-2">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-[#2A2A2A] text-white/50 transition-all hover:border-[#FF2D55] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="mb-4 font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
              Shop / 01
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Featured', target: 'featured' },
                { label: 'Collections', target: 'universes' },
                { label: 'Drops', target: 'drops' },
                { label: 'Lifestyle', target: 'lifestyle' },
              ].map((link) => (
                <li key={link.target}>
                  <button
                    onClick={() => onNavigate(link.target)}
                    className="text-sm text-white/40 transition-colors hover:text-[#FF2D55]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="mb-4 font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
              Support / 02
            </h4>
            <ul className="space-y-3">
              {['Size Guide', 'Shipping', 'Returns', 'Contact'].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-white/40 transition-colors hover:text-[#FF2D55]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Line divider */}
        <div className="my-8 line-divider" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono-tech text-[10px] text-white/30">
            © {new Date().getFullYear()} STREET SCOUT · ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="font-mono-tech text-[10px] text-white/30 transition-colors hover:text-white/60">
              PRIVACY
            </a>
            <a href="#" className="font-mono-tech text-[10px] text-white/30 transition-colors hover:text-white/60">
              TERMS
            </a>
            <span className="font-jp text-[10px] text-white/20">影の戦士</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
