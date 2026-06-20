'use client'

import { Instagram, Twitter, Youtube } from 'lucide-react'

interface FooterProps {
  onNavigate: (section: string) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[#030303]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              STREET<span className="accent-crimson"> SCOUT</span>
            </h3>
            <p className="font-jp mt-1 text-xs tracking-wider text-white/30">
              ストリートスカウト
            </p>
            <p className="mt-4 max-w-xs text-sm text-white/40">
              Premium anime jerseys built for everyday legends. A fashion label first, an anime store second.
            </p>
            {/* Social */}
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:border-white/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/70">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Featured', target: 'featured' },
                { label: 'Collections', target: 'universes' },
                { label: 'Lifestyle', target: 'lifestyle' },
              ].map((link) => (
                <li key={link.target}>
                  <button
                    onClick={() => onNavigate(link.target)}
                    className="text-sm text-white/40 transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/70">
              Support
            </h4>
            <ul className="space-y-3">
              {['Size Guide', 'Shipping', 'Returns', 'Contact'].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-white/40 transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brush stroke divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Street Scout. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Privacy
            </a>
            <a href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Terms
            </a>
            <span className="font-jp text-xs text-white/20">影の戦士</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
