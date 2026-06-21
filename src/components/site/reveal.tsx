'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
}

export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setRevealed(true), delay)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const Tag = as as any

  return (
    <Tag
      ref={ref}
      className={cn('reveal', revealed && 'revealed', className)}
    >
      {children}
    </Tag>
  )
}
