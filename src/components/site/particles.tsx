'use client'

import { useEffect, useRef } from 'react'

interface ParticlesProps {
  count?: number
  className?: string
}

export function Particles({
  count = 10,
  className = '',
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      width = rect.width
      height = rect.height
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.2 - 0.05,
      size: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.3 + 0.05,
      life: Math.random(),
    }))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life += 0.002

        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * width
          p.y = height + 10
          p.life = 0
        }

        const alpha = p.opacity * Math.sin(p.life * Math.PI)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 45, 85, ${alpha})`
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  )
}
