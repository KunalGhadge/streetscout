'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  LogOut,
  Lock,
  Package,
  Globe,
  Layers,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react'
import { ImageUpload } from '@/components/admin/image-upload'
import { useToast } from '@/hooks/use-toast'
import { formatINR } from '@/lib/data'
import type { Product, Universe, Drop, Lifestyle } from '@/lib/types'

// ============================================================================
// Types
// ============================================================================

interface AdminPanelProps {
  onClose: () => void
}

type TabId = 'products' | 'universes' | 'drops' | 'lifestyle'

// ============================================================================
// Shared primitives
// ============================================================================

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono-tech text-[10px] uppercase tracking-wider text-white/50">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
          {hint}
        </p>
      )}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 placeholder-white/25 transition-colors focus:border-[#FF2D55] focus:outline-none"
    />
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 placeholder-white/25 transition-colors focus:border-[#FF2D55] focus:outline-none"
    />
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 transition-colors hover:border-[#FF2D55]/50"
    >
      <span className="font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
        {label}
      </span>
      <span
        className={`relative h-4 w-7 rounded-full transition-colors ${
          checked ? 'bg-[#FF2D55]' : 'bg-[#2A2A2A]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
            checked ? 'left-3.5' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

function PrimaryButton({
  children,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center justify-center gap-2 bg-[#FF2D55] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#FF2D55]/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

function SecondaryButton({
  children,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center justify-center gap-2 border border-[#2A2A2A] bg-transparent px-4 py-2 text-sm text-white/80 transition-all hover:border-white/30 hover:text-white"
    >
      {children}
    </button>
  )
}

function SectionTitle({
  title,
  jp,
  subtitle,
}: {
  title: string
  jp?: string
  subtitle?: string
}) {
  return (
    <div className="mb-6 border-b border-[#2A2A2A] pb-4">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-2xl uppercase tracking-tight text-white">
          {title}
        </h2>
        {jp && (
          <span className="font-jp text-sm tracking-wider text-white/30">{jp}</span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 font-mono-tech text-[10px] uppercase tracking-wider text-white/40">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-[#2A2A2A] py-16">
      <p className="font-mono-tech text-[10px] uppercase tracking-wider text-white/30">
        {label}
      </p>
    </div>
  )
}

// ============================================================================
// Confirm Dialog
// ============================================================================

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md border border-[#2A2A2A] bg-[#111111] p-6">
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-[#FF2D55]" />
          <h3 className="font-display text-lg uppercase text-white">{title}</h3>
        </div>
        <p className="mb-6 text-sm text-white/60">{message}</p>
        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton onClick={onConfirm} loading={loading}>
            Delete
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Form wrapper
// ============================================================================

function FormShell({
  title,
  jp,
  onClose,
  onSave,
  saving,
  children,
}: {
  title: string
  jp: string
  onClose: () => void
  onSave: () => void
  saving: boolean
  children: React.ReactNode
}) {
  return (
    <div className="border border-[#2A2A2A] bg-[#0a0a0a]">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] px-5 py-4">
        <div className="flex items-baseline gap-3">
          <h3 className="font-display text-lg uppercase text-white">{title}</h3>
          <span className="font-jp text-xs tracking-wider text-white/30">{jp}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center text-white/40 transition-colors hover:bg-[#FF2D55]/10 hover:text-[#FF2D55]"
          aria-label="Close form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-5">{children}</div>

      <div className="flex items-center justify-end gap-3 border-t border-[#2A2A2A] px-5 py-4">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onSave} loading={saving}>
          Save
        </PrimaryButton>
      </div>
    </div>
  )
}

// ============================================================================
// Product Form
// ============================================================================

interface ProductFormData {
  name: string
  slug: string
  collection: string
  collectionTag: string
  dropNumber: string
  universe: string
  universeJp: string
  price: string
  description: string
  fabric: string
  fit: string
  breathability: string
  durability: string
  sizes: string
  imageFront: string
  imageBack: string
  isFeatured: boolean
  inStock: boolean
}

function emptyProductForm(): ProductFormData {
  return {
    name: '',
    slug: '',
    collection: '',
    collectionTag: '',
    dropNumber: 'DROP-001',
    universe: '',
    universeJp: '',
    price: '0',
    description: '',
    fabric: '',
    fit: '',
    breathability: '',
    durability: '',
    sizes: 'XS,S,M,L,XL,XXL',
    imageFront: '',
    imageBack: '',
    isFeatured: false,
    inStock: true,
  }
}

function ProductForm({
  product,
  onSave,
  onCancel,
  saving,
}: {
  product: Product | null
  onSave: (data: ProductFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<ProductFormData>(() =>
    product
      ? {
          name: product.name,
          slug: product.slug,
          collection: product.collection,
          collectionTag: product.collectionTag,
          dropNumber: product.dropNumber,
          universe: product.universe,
          universeJp: product.universeJp,
          price: String(product.price),
          description: product.description,
          fabric: product.fabric,
          fit: product.fit,
          breathability: product.breathability,
          durability: product.durability,
          sizes: product.sizes || 'XS,S,M,L,XL,XXL',
          imageFront: product.imageFront,
          imageBack: product.imageBack,
          isFeatured: product.isFeatured,
          inStock: product.inStock,
        }
      : emptyProductForm()
  )

  const set = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <FormShell
      title={product ? 'Edit Product' : 'New Product'}
      jp={product ? '商品編集' : '新商品'}
      onClose={onCancel}
      onSave={() => onSave(form)}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Name">
            <TextInput
              value={form.name}
              onChange={(v) => set('name', v)}
              placeholder="Shadow Shinobi Jersey"
            />
          </Field>
        </div>

        <Field label="Slug" hint="Auto-generated from name if empty">
          <TextInput
            value={form.slug}
            onChange={(v) => set('slug', v)}
            placeholder="shadow-shinobi-jersey"
          />
        </Field>

        <Field label="Price (₹)">
          <TextInput
            value={form.price}
            onChange={(v) => set('price', v)}
            placeholder="2999"
            type="number"
          />
        </Field>

        <Field label="Collection">
          <TextInput
            value={form.collection}
            onChange={(v) => set('collection', v)}
            placeholder="Shadow Ops"
          />
        </Field>

        <Field label="Collection Tag">
          <TextInput
            value={form.collectionTag}
            onChange={(v) => set('collectionTag', v)}
            placeholder="SS-001"
          />
        </Field>

        <Field label="Drop Number">
          <TextInput
            value={form.dropNumber}
            onChange={(v) => set('dropNumber', v)}
            placeholder="DROP-001"
          />
        </Field>

        <Field label="Universe">
          <TextInput
            value={form.universe}
            onChange={(v) => set('universe', v)}
            placeholder="Naruto"
          />
        </Field>

        <Field label="Universe (Japanese)">
          <TextInput
            value={form.universeJp}
            onChange={(v) => set('universeJp', v)}
            placeholder="ナルト"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Description">
            <TextArea
              value={form.description}
              onChange={(v) => set('description', v)}
              placeholder="Premium anime jersey crafted for the streets..."
              rows={4}
            />
          </Field>
        </div>

        <Field label="Fabric">
          <TextInput
            value={form.fabric}
            onChange={(v) => set('fabric', v)}
            placeholder="220gsm French Terry"
          />
        </Field>

        <Field label="Fit">
          <TextInput
            value={form.fit}
            onChange={(v) => set('fit', v)}
            placeholder="Oversized Boxy"
          />
        </Field>

        <Field label="Breathability">
          <TextInput
            value={form.breathability}
            onChange={(v) => set('breathability', v)}
            placeholder="8/10"
          />
        </Field>

        <Field label="Durability">
          <TextInput
            value={form.durability}
            onChange={(v) => set('durability', v)}
            placeholder="9/10"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Available Sizes" hint="Comma-separated, e.g. XS,S,M,L,XL,XXL">
            <TextInput
              value={form.sizes}
              onChange={(v) => set('sizes', v)}
              placeholder="XS,S,M,L,XL,XXL"
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Front Image">
            <ImageUpload
              value={form.imageFront}
              onChange={(v) => set('imageFront', v)}
              label="Image Front"
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Back Image">
            <ImageUpload
              value={form.imageBack}
              onChange={(v) => set('imageBack', v)}
              label="Image Back"
            />
          </Field>
        </div>

        <Toggle
          checked={form.isFeatured}
          onChange={(v) => set('isFeatured', v)}
          label="Featured"
        />
        <Toggle
          checked={form.inStock}
          onChange={(v) => set('inStock', v)}
          label="In Stock"
        />
      </div>
    </FormShell>
  )
}

// ============================================================================
// Universe Form
// ============================================================================

interface UniverseFormData {
  name: string
  japanese: string
  dropNumber: string
  image: string
  order: string
}

function emptyUniverseForm(): UniverseFormData {
  return { name: '', japanese: '', dropNumber: 'DROP-001', image: '', order: '0' }
}

function UniverseForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Universe | null
  onSave: (data: UniverseFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<UniverseFormData>(() =>
    item
      ? {
          name: item.name,
          japanese: item.japanese,
          dropNumber: item.dropNumber,
          image: item.image,
          order: String(item.order),
        }
      : emptyUniverseForm()
  )

  const set = <K extends keyof UniverseFormData>(key: K, value: UniverseFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <FormShell
      title={item ? 'Edit Universe' : 'New Universe'}
      jp={item ? '宇宙編集' : '新宇宙'}
      onClose={onCancel}
      onSave={() => onSave(form)}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name">
          <TextInput
            value={form.name}
            onChange={(v) => set('name', v)}
            placeholder="Naruto"
          />
        </Field>
        <Field label="Japanese">
          <TextInput
            value={form.japanese}
            onChange={(v) => set('japanese', v)}
            placeholder="ナルト"
          />
        </Field>
        <Field label="Drop Number">
          <TextInput
            value={form.dropNumber}
            onChange={(v) => set('dropNumber', v)}
            placeholder="DROP-001"
          />
        </Field>
        <Field label="Order">
          <TextInput
            value={form.order}
            onChange={(v) => set('order', v)}
            placeholder="0"
            type="number"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Image">
            <ImageUpload value={form.image} onChange={(v) => set('image', v)} label="Universe Image" />
          </Field>
        </div>
      </div>
    </FormShell>
  )
}

// ============================================================================
// Drop Form
// ============================================================================

interface DropFormData {
  number: string
  japanese: string
  title: string
  description: string
  status: string
  image: string
  order: string
}

function emptyDropForm(): DropFormData {
  return {
    number: 'DROP-001',
    japanese: '',
    title: '',
    description: '',
    status: 'AVAILABLE',
    image: '',
    order: '0',
  }
}

function DropForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Drop | null
  onSave: (data: DropFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<DropFormData>(() =>
    item
      ? {
          number: item.number,
          japanese: item.japanese,
          title: item.title,
          description: item.description,
          status: item.status,
          image: item.image,
          order: String(item.order),
        }
      : emptyDropForm()
  )

  const set = <K extends keyof DropFormData>(key: K, value: DropFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <FormShell
      title={item ? 'Edit Drop' : 'New Drop'}
      jp={item ? 'ドロップ編集' : '新ドロップ'}
      onClose={onCancel}
      onSave={() => onSave(form)}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Number">
          <TextInput
            value={form.number}
            onChange={(v) => set('number', v)}
            placeholder="DROP-001"
          />
        </Field>
        <Field label="Japanese">
          <TextInput
            value={form.japanese}
            onChange={(v) => set('japanese', v)}
            placeholder="第1弾"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Title">
            <TextInput
              value={form.title}
              onChange={(v) => set('title', v)}
              placeholder="Genesis Drop"
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Description">
            <TextArea
              value={form.description}
              onChange={(v) => set('description', v)}
              placeholder="The opening chapter of Street Scout..."
              rows={3}
            />
          </Field>
        </div>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 transition-colors focus:border-[#FF2D55] focus:outline-none"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="LIMITED">LIMITED</option>
          </select>
        </Field>
        <Field label="Order">
          <TextInput
            value={form.order}
            onChange={(v) => set('order', v)}
            placeholder="0"
            type="number"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Image">
            <ImageUpload value={form.image} onChange={(v) => set('image', v)} label="Drop Image" />
          </Field>
        </div>
      </div>
    </FormShell>
  )
}

// ============================================================================
// Lifestyle Form
// ============================================================================

interface LifestyleFormData {
  label: string
  japanese: string
  tag: string
  description: string
  image: string
  order: string
}

function emptyLifestyleForm(): LifestyleFormData {
  return {
    label: '',
    japanese: '',
    tag: 'SCENE-01',
    description: '',
    image: '',
    order: '0',
  }
}

function LifestyleForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Lifestyle | null
  onSave: (data: LifestyleFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<LifestyleFormData>(() =>
    item
      ? {
          label: item.label,
          japanese: item.japanese,
          tag: item.tag,
          description: item.description,
          image: item.image,
          order: String(item.order),
        }
      : emptyLifestyleForm()
  )

  const set = <K extends keyof LifestyleFormData>(key: K, value: LifestyleFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <FormShell
      title={item ? 'Edit Lifestyle' : 'New Lifestyle'}
      jp={item ? 'ライフスタイル編集' : '新ライフスタイル'}
      onClose={onCancel}
      onSave={() => onSave(form)}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Label">
          <TextInput
            value={form.label}
            onChange={(v) => set('label', v)}
            placeholder="Campus Legend"
          />
        </Field>
        <Field label="Japanese">
          <TextInput
            value={form.japanese}
            onChange={(v) => set('japanese', v)}
            placeholder="キャンパス"
          />
        </Field>
        <Field label="Tag">
          <TextInput
            value={form.tag}
            onChange={(v) => set('tag', v)}
            placeholder="SCENE-01"
          />
        </Field>
        <Field label="Order">
          <TextInput
            value={form.order}
            onChange={(v) => set('order', v)}
            placeholder="0"
            type="number"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description">
            <TextArea
              value={form.description}
              onChange={(v) => set('description', v)}
              placeholder="From lecture halls to late-night ramen runs..."
              rows={3}
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Image">
            <ImageUpload value={form.image} onChange={(v) => set('image', v)} label="Lifestyle Image" />
          </Field>
        </div>
      </div>
    </FormShell>
  )
}

// ============================================================================
// Thumb helper
// ============================================================================

function Thumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-12 w-12 flex-shrink-0 overflow-hidden border border-[#2A2A2A] bg-[#0a0a0a]">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-contain" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Package className="h-4 w-4 text-white/20" />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Login Screen
// ============================================================================

function LoginScreen({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!password) {
      setError('Password required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
      } else {
        onSuccess()
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#050505]">
      {/* Grid overlay as child (not on the fixed container — grid-overlay sets position:relative which breaks fixed) */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-[#2A2A2A] text-white/40 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
        aria-label="Close admin panel"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-[#FF2D55]" />
            <span className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-[#FF2D55]">
              Secure Access
            </span>
            <div className="h-px w-8 bg-[#FF2D55]" />
          </div>
          <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-white sm:text-5xl">
            Street Scout
            <br />
            Admin
          </h1>
          <p className="mt-3 font-jp text-sm tracking-wider text-white/40">管理パネル</p>
        </div>

        {/* Form card */}
        <div className="border border-[#2A2A2A] bg-[#111111] p-6">
          <div className="mb-5">
            <label className="mb-2 block font-mono-tech text-[10px] uppercase tracking-wider text-white/50">
              Administrator Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin()
                }}
                placeholder="Enter password"
                className="w-full border border-[#2A2A2A] bg-[#0a0a0a] py-3 pl-10 pr-3 text-sm text-white/90 placeholder-white/25 transition-colors focus:border-[#FF2D55] focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 border border-[#FF2D55]/40 bg-[#FF2D55]/10 px-3 py-2">
              <p className="font-mono-tech text-[10px] uppercase tracking-wider text-[#FF2D55]">
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 bg-[#FF2D55] py-3 text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-[#FF2D55]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Enter Admin'
            )}
          </button>
        </div>

        <p className="mt-6 text-center font-mono-tech text-[9px] uppercase tracking-[0.2em] text-white/20">
          Authorized Personnel Only · 許可者のみ
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Tab Definitions
// ============================================================================

const TABS: { id: TabId; label: string; jp: string; icon: typeof Package }[] = [
  { id: 'products', label: 'Products', jp: '商品', icon: Package },
  { id: 'universes', label: 'Universes', jp: '宇宙', icon: Globe },
  { id: 'drops', label: 'Drops', jp: 'ドロップ', icon: Layers },
  { id: 'lifestyle', label: 'Lifestyle', jp: '生活', icon: Sparkles },
]

// ============================================================================
// Products Tab
// ============================================================================

function ProductsTab() {
  const { toast } = useToast()
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch {
      toast({ title: 'Failed to load products', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSave = async (data: ProductFormData) => {
    setSaving(true)
    try {
      const url = editing
        ? `/api/admin/products/${editing.id}`
        : '/api/admin/products'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price) || 0,
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({
          title: editing ? 'Product updated' : 'Product created',
          description: data.name,
        })
        setEditing(null)
        setCreating(false)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      } else {
        toast({ title: 'Product deleted' })
        setDeleteId(null)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    setTogglingId(product.id)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, isFeatured: !product.isFeatured }),
      })
      if (!res.ok) {
        toast({ title: 'Update failed', variant: 'destructive' })
      } else {
        setItems((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p
          )
        )
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setTogglingId(null)
    }
  }

  if (creating || editing) {
    return (
      <ProductForm
        product={editing}
        onSave={handleSave}
        onCancel={() => {
          setCreating(false)
          setEditing(null)
        }}
        saving={saving}
      />
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle
          title="Products"
          jp="商品"
          subtitle={`${items.length} items in catalog`}
        />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Add New Product
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState label="No products yet · Add your first product" />
      ) : (
        <div className="space-y-2">
          {/* Header row (desktop) */}
          <div className="hidden grid-cols-12 gap-3 border-b border-[#2A2A2A] px-3 pb-2 md:grid">
            <span className="col-span-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Image
            </span>
            <span className="col-span-3 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Name
            </span>
            <span className="col-span-2 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Universe
            </span>
            <span className="col-span-2 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Price
            </span>
            <span className="col-span-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Drop
            </span>
            <span className="col-span-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Featured
            </span>
            <span className="col-span-2 text-right font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Actions
            </span>
          </div>

          {items.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-12 items-center gap-3 border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2.5 transition-colors hover:border-[#2A2A2A]/70"
            >
              <div className="col-span-2 md:col-span-1">
                <Thumb src={p.imageFront} alt={p.name} />
              </div>
              <div className="col-span-10 md:col-span-3">
                <p className="truncate text-sm font-medium text-white/90">{p.name}</p>
                <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                  {p.slug}
                </p>
              </div>
              <div className="col-span-6 md:col-span-2">
                <p className="truncate text-sm text-white/70">{p.universe}</p>
                {p.universeJp && (
                  <p className="font-jp text-[10px] text-white/30">{p.universeJp}</p>
                )}
              </div>
              <div className="col-span-3 md:col-span-2">
                <span className="text-sm font-medium text-white/90">
                  {formatINR(p.price)}
                </span>
              </div>
              <div className="col-span-3 md:col-span-1">
                <span className="font-mono-tech text-[10px] uppercase tracking-wider text-white/50">
                  {p.dropNumber}
                </span>
              </div>
              <div className="col-span-6 md:col-span-1">
                <button
                  onClick={() => handleToggleFeatured(p)}
                  disabled={togglingId === p.id}
                  className={`px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider transition-colors ${
                    p.isFeatured
                      ? 'bg-[#FF2D55]/20 text-[#FF2D55]'
                      : 'border border-[#2A2A2A] text-white/40 hover:text-white/70'
                  }`}
                >
                  {togglingId === p.id ? '...' : p.isFeatured ? 'On' : 'Off'}
                </button>
              </div>
              <div className="col-span-6 flex items-center justify-end gap-1 md:col-span-2">
                <button
                  onClick={() => setEditing(p)}
                  className="flex h-8 w-8 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                  aria-label={`Edit ${p.name}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="flex h-8 w-8 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                  aria-label={`Delete ${p.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product"
        message="This action cannot be undone. The product will be permanently removed from the catalog."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

// ============================================================================
// Universes Tab
// ============================================================================

function UniversesTab() {
  const { toast } = useToast()
  const [items, setItems] = useState<Universe[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Universe | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/universes')
      if (res.ok) setItems(await res.json())
    } catch {
      toast({ title: 'Failed to load universes', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSave = async (data: UniverseFormData) => {
    setSaving(true)
    try {
      const url = editing
        ? `/api/admin/universes/${editing.id}`
        : '/api/admin/universes'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, order: parseInt(data.order) || 0 }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: editing ? 'Universe updated' : 'Universe created' })
        setEditing(null)
        setCreating(false)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/universes/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      } else {
        toast({ title: 'Universe deleted' })
        setDeleteId(null)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  if (creating || editing) {
    return (
      <UniverseForm
        item={editing}
        onSave={handleSave}
        onCancel={() => {
          setCreating(false)
          setEditing(null)
        }}
        saving={saving}
      />
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle
          title="Universes"
          jp="宇宙"
          subtitle={`${items.length} universes configured`}
        />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Add New
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState label="No universes yet · Add your first universe" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((u) => (
            <div
              key={u.id}
              className="border border-[#2A2A2A] bg-[#0a0a0a] p-3 transition-colors hover:border-[#2A2A2A]/70"
            >
              <div className="flex items-start gap-3">
                <Thumb src={u.image} alt={u.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/90">{u.name}</p>
                  {u.japanese && (
                    <p className="font-jp text-xs text-white/40">{u.japanese}</p>
                  )}
                  <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                    {u.dropNumber} · Order {u.order}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => setEditing(u)}
                  className="flex items-center gap-1.5 border border-[#2A2A2A] px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(u.id)}
                  className="flex items-center gap-1.5 border border-[#2A2A2A] px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Universe"
        message="This action cannot be undone. The universe entry will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

// ============================================================================
// Drops Tab
// ============================================================================

function DropsTab() {
  const { toast } = useToast()
  const [items, setItems] = useState<Drop[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Drop | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/drops')
      if (res.ok) setItems(await res.json())
    } catch {
      toast({ title: 'Failed to load drops', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSave = async (data: DropFormData) => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/drops/${editing.id}` : '/api/admin/drops'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, order: parseInt(data.order) || 0 }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: editing ? 'Drop updated' : 'Drop created' })
        setEditing(null)
        setCreating(false)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/drops/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      } else {
        toast({ title: 'Drop deleted' })
        setDeleteId(null)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  if (creating || editing) {
    return (
      <DropForm
        item={editing}
        onSave={handleSave}
        onCancel={() => {
          setCreating(false)
          setEditing(null)
        }}
        saving={saving}
      />
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle
          title="Drops"
          jp="ドロップ"
          subtitle={`${items.length} drops scheduled`}
        />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Add New
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState label="No drops yet · Add your first drop" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div
              key={d.id}
              className="border border-[#2A2A2A] bg-[#0a0a0a] p-3 transition-colors hover:border-[#2A2A2A]/70"
            >
              <div className="flex items-start gap-3">
                <Thumb src={d.image} alt={d.title} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#FF2D55]">
                      {d.number}
                    </span>
                    {d.japanese && (
                      <span className="font-jp text-[10px] text-white/40">{d.japanese}</span>
                    )}
                  </div>
                  <p className="truncate text-sm font-medium text-white/90">{d.title}</p>
                  <span
                    className={`mt-1 inline-block px-1.5 py-0.5 font-mono-tech text-[8px] uppercase tracking-wider ${
                      d.status === 'AVAILABLE'
                        ? 'bg-[#FF2D55]/15 text-[#FF2D55]'
                        : 'border border-[#2A2A2A] text-white/50'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => setEditing(d)}
                  className="flex items-center gap-1.5 border border-[#2A2A2A] px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(d.id)}
                  className="flex items-center gap-1.5 border border-[#2A2A2A] px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Drop"
        message="This action cannot be undone. The drop will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

// ============================================================================
// Lifestyle Tab
// ============================================================================

function LifestyleTab() {
  const { toast } = useToast()
  const [items, setItems] = useState<Lifestyle[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Lifestyle | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/lifestyle')
      if (res.ok) setItems(await res.json())
    } catch {
      toast({ title: 'Failed to load lifestyle items', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSave = async (data: LifestyleFormData) => {
    setSaving(true)
    try {
      const url = editing
        ? `/api/admin/lifestyle/${editing.id}`
        : '/api/admin/lifestyle'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, order: parseInt(data.order) || 0 }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: editing ? 'Lifestyle updated' : 'Lifestyle created' })
        setEditing(null)
        setCreating(false)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/lifestyle/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      } else {
        toast({ title: 'Lifestyle deleted' })
        setDeleteId(null)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  if (creating || editing) {
    return (
      <LifestyleForm
        item={editing}
        onSave={handleSave}
        onCancel={() => {
          setCreating(false)
          setEditing(null)
        }}
        saving={saving}
      />
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle
          title="Lifestyle"
          jp="生活"
          subtitle={`${items.length} scenes configured`}
        />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Add New
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState label="No lifestyle items yet · Add your first scene" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <div
              key={l.id}
              className="border border-[#2A2A2A] bg-[#0a0a0a] p-3 transition-colors hover:border-[#2A2A2A]/70"
            >
              <div className="flex items-start gap-3">
                <Thumb src={l.image} alt={l.label} />
                <div className="min-w-0 flex-1">
                  <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#FF2D55]">
                    {l.tag}
                  </span>
                  <p className="truncate text-sm font-medium text-white/90">{l.label}</p>
                  {l.japanese && (
                    <p className="font-jp text-xs text-white/40">{l.japanese}</p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => setEditing(l)}
                  className="flex items-center gap-1.5 border border-[#2A2A2A] px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(l.id)}
                  className="flex items-center gap-1.5 border border-[#2A2A2A] px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Lifestyle"
        message="This action cannot be undone. The lifestyle scene will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

// ============================================================================
// Main Admin Panel
// ============================================================================

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [authChecked, setAuthChecked] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('products')
  const [loggingOut, setLoggingOut] = useState(false)

  // Check auth on mount
  useEffect(() => {
    let cancelled = false
    async function check() {
      try {
        const res = await fetch('/api/admin/auth-check')
        if (cancelled) return
        const data = await res.json()
        setAuthed(!!data.authenticated)
      } catch {
        if (!cancelled) setAuthed(false)
      } finally {
        if (!cancelled) setAuthChecked(true)
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setAuthed(false)
    } catch {
      // ignore
    } finally {
      setLoggingOut(false)
    }
  }

  // Initial loading splash (before auth check completes)
  if (!authChecked) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
          <p className="font-mono-tech text-[10px] uppercase tracking-wider text-white/30">
            Verifying session...
          </p>
        </div>
      </div>
    )
  }

  // Login screen
  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} onClose={onClose} />
  }

  // Dashboard
  return (
    <div className="fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-[#050505]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2A2A2A] bg-[#050505]/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
            aria-label="Back to site"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-base uppercase leading-none tracking-tight text-white sm:text-lg">
              Street Scout Admin
            </h1>
            <p className="mt-0.5 hidden font-jp text-[10px] tracking-wider text-white/30 sm:block">
              管理パネル
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 border border-[#2A2A2A] px-3 py-2 font-mono-tech text-[10px] uppercase tracking-wider text-white/60 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55] disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5" />
          )}
          Logout
        </button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar / tabs */}
        <nav className="border-b border-[#2A2A2A] bg-[#0a0a0a] md:w-56 md:border-b-0 md:border-r">
          <div className="flex gap-1 overflow-x-auto p-3 no-scrollbar md:flex-col">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-shrink-0 items-center gap-3 px-3 py-2.5 text-left transition-colors md:w-full ${
                    isActive
                      ? 'bg-[#FF2D55]/10 text-[#FF2D55]'
                      : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-mono-tech text-[10px] uppercase tracking-wider">
                      {tab.label}
                    </span>
                    <span className="font-jp text-[9px] tracking-wider text-white/30">
                      {tab.jp}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'universes' && <UniversesTab />}
            {activeTab === 'drops' && <DropsTab />}
            {activeTab === 'lifestyle' && <LifestyleTab />}
          </div>
        </main>
      </div>
    </div>
  )
}
