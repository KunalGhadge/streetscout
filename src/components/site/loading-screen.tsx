'use client'

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  images: string[]
  onComplete: () => void
}

export function LoadingScreen({ images, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    let loaded = 0
    const total = images.length
    const startTime = Date.now()
    const MIN_DISPLAY = 1200 // minimum 1.2s for a welcoming feel

    // If no images, complete immediately
    if (total === 0) {
      setProgress(100)
      finish()
      return
    }

    const updateProgress = () => {
      loaded++
      const pct = Math.round((loaded / total) * 100)
      setProgress(pct)
      if (loaded >= total) {
        finish()
      }
    }

    // Preload each image
    images.forEach((src) => {
      const img = new Image()
      img.onload = updateProgress
      img.onerror = updateProgress // count errors as loaded too
      img.src = src
    })

    // Safety timeout - force finish after 4s regardless
    const timeout = setTimeout(() => {
      setProgress(100)
      finish()
    }, 4000)

    function finish() {
      clearTimeout(timeout)
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, MIN_DISPLAY - elapsed)
      // Ensure minimum display time for welcoming effect
      setTimeout(() => {
        setExiting(true)
        // Wait for fade-out animation
        setTimeout(() => {
          onComplete()
        }, 600)
      }, remaining)
    }

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#050505] ${
        exiting ? 'loader-exit' : ''
      }`}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40" />

      {/* Orbit rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[400px] w-[400px] rounded-full border border-[#FF2D55]/8" />
        <div
          className="absolute h-[300px] w-[300px] rounded-full border border-[#FF2D55]/5"
          style={{ animation: 'loader-orbit 8s linear infinite' }}
        />
        <div
          className="absolute h-[200px] w-[200px] rounded-full border border-[#FF2D55]/3"
          style={{ animation: 'loader-orbit 5s linear infinite reverse' }}
        />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Star symbol */}
        <div className="mb-6 flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            className="text-[#FF2D55]"
            fill="currentColor"
            style={{ animation: 'loader-star 1.5s ease-in-out infinite' }}
          >
            <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" />
          </svg>
          <span className="font-jp text-xs tracking-[0.4em] text-[#FF2D55]">
            東京ストリート
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            className="text-[#FF2D55]"
            fill="currentColor"
            style={{ animation: 'loader-star 1.5s ease-in-out infinite 0.3s' }}
          >
            <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" />
          </svg>
        </div>

        {/* Brand name */}
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl animate-glitch">
          STREET SCOUT
        </h1>

        {/* Japanese subtext */}
        <p className="font-jp mt-2 text-sm tracking-[0.3em] text-white/40">
          ストリートスカウト
        </p>

        {/* Technical label */}
        <p className="font-mono-tech mt-6 text-[10px] tracking-wider text-white/30">
          ANIME ATHLETICS · LOADING
        </p>

        {/* Progress bar */}
        <div className="mt-8 w-64 max-w-[80vw]">
          <div className="relative h-px w-full overflow-hidden bg-[#2A2A2A]">
            <div
              className="absolute inset-y-0 left-0 bg-[#FF2D55]"
              style={{
                width: `${progress}%`,
                transition: 'width 0.3s ease-out',
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono-tech text-[9px] text-white/30">
              {progress < 100 ? 'LOADING ASSETS' : 'READY'}
            </span>
            <span className="font-mono-tech text-[9px] text-[#FF2D55]">
              {String(progress).padStart(3, '0')}%
            </span>
          </div>
        </div>

        {/* Corner technical labels */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          <div className="absolute left-6 top-6 flex items-center gap-2">
            <span className="h-1 w-1 bg-[#FF2D55]" />
            <span className="font-mono-tech text-[9px] text-white/30">SS / 2025</span>
          </div>
          <div className="absolute right-6 top-6 flex items-center gap-2">
            <span className="font-mono-tech text-[9px] text-white/30">DROP-001</span>
            <span className="h-1 w-1 bg-[#FF2D55]" />
          </div>
          <div className="absolute bottom-6 left-6">
            <span className="font-mono-tech text-[9px] text-white/20">東京 / TOKYO</span>
          </div>
          <div className="absolute bottom-6 right-6">
            <span className="font-mono-tech text-[9px] text-white/20">LIMITED COLLECTION</span>
          </div>
        </div>
      </div>
    </div>
  )
}
