'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, X } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
      } else {
        onChange(data.url)
      }
    } catch {
      setError('Network error')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      {label && (
        <label className="mb-2 block font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
          {label}
        </label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative mb-2 overflow-hidden border border-[#2A2A2A]">
          { }
          <img src={value} alt="Preview" className="h-32 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/70 text-white hover:bg-[#FF2D55]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#2A2A2A] bg-[#0a0a0a] px-4 py-6 text-white/40 transition-all hover:border-[#FF2D55]/50 hover:text-white/70"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            <span className="text-xs">Click or drag image here</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>

      {/* Manual URL input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste URL"
        className="mt-2 w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-xs text-white/80 placeholder-white/30 focus:border-[#FF2D55] focus:outline-none"
      />

      {error && <p className="mt-1 text-xs text-[#FF2D55]">{error}</p>}
    </div>
  )
}
