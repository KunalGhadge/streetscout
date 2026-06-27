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
  Tag,
  Power,
  Bell,
  Settings,
  Users,
  BarChart3,
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

type TabId =
  | 'products'
  | 'universes'
  | 'drops'
  | 'lifestyle'
  | 'coupons'
  | 'store'
  | 'notifications'
  | 'settings'
  | 'affiliates'
  | 'affiliateDashboard'

interface Coupon {
  id: string
  code: string
  description: string
  type: string // DISCOUNT | FREE_SHIPPING | FREE_GIFT
  value: number
  giftName: string
  minOrder: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

interface StoreStatus {
  id?: string
  accepting: boolean
  message: string
}

interface AdminNotification {
  id: string
  title: string
  body: string
  type: string // INFO | OFFER | COUPON | WARNING
  link: string
  isActive: boolean
  createdAt: string
}

interface Affiliate {
  id: string
  code: string
  creatorName: string
  platform: string
  contact: string
  rewardType: string // DISCOUNT | FREE_GIFT | NONE
  rewardValue: number
  rewardGiftName: string
  commissionType: string // PERCENTAGE | FIXED
  commissionValue: number
  isActive: boolean
  createdAt: string
  stats?: {
    totalOrders: number
    confirmedOrders: number
    pendingOrders: number
    cancelledOrders: number
    totalRevenue: number
    totalCommission: number
    pendingCommission: number
  }
}

interface AffiliateOrder {
  id: string
  affiliateId: string
  code: string
  creatorName: string
  customerName: string
  customerPhone: string
  orderTotal: number
  commissionDue: number
  status: string // PENDING | CONFIRMED | CANCELLED
  customerNote: string
  createdAt: string
  affiliate?: {
    id: string
    code: string
    creatorName: string
    platform: string
  }
}

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

// ============================================================================
// Select with custom-option fallback
// ============================================================================

interface PresetOption {
  value: string
  label: string
}

function SelectWithCustom({
  value,
  onChange,
  presets,
  selectPlaceholder,
  customPlaceholder,
  includeEmptyOption = true,
}: {
  value: string
  onChange: (v: string) => void
  presets: PresetOption[]
  selectPlaceholder?: string
  customPlaceholder?: string
  includeEmptyOption?: boolean
}) {
  // If the current value matches one of the presets, show that as selected.
  // If it's a non-empty non-preset value, show __custom mode + TextInput.
  // If empty, show the placeholder (or first preset when includeEmptyOption=false).
  const isPreset = presets.some((p) => p.value === value)
  const selectValue = isPreset ? value : value ? '__custom' : includeEmptyOption ? '' : '__custom'

  return (
    <div className="space-y-2">
      <select
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value
          if (v === '__custom') {
            // Switch to custom mode — clear preset so the TextInput shows
            onChange(isPreset ? '' : value)
          } else {
            onChange(v)
          }
        }}
        className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/80 focus:border-[#FF2D55] focus:outline-none"
      >
        {includeEmptyOption && (
          <option value="">{selectPlaceholder || 'Select...'}</option>
        )}
        {presets.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
        <option value="__custom">+ Custom...</option>
      </select>
      {selectValue === '__custom' && (
        <TextInput
          value={value}
          onChange={onChange}
          placeholder={customPlaceholder || 'Enter custom value'}
        />
      )}
    </div>
  )
}

// Preset option lists shared by ProductForm
const UNIVERSE_PRESETS: PresetOption[] = [
  { value: 'Naruto', label: 'Naruto' },
  { value: 'One Piece', label: 'One Piece' },
  { value: 'Jujutsu Kaisen', label: 'Jujutsu Kaisen' },
  { value: 'Attack on Titan', label: 'Attack on Titan' },
  { value: 'Demon Slayer', label: 'Demon Slayer' },
  { value: 'Solo Leveling', label: 'Solo Leveling' },
]

const COLLECTION_TAG_PRESETS: PresetOption[] = [
  { value: 'NARUTO COLLECTION', label: 'NARUTO COLLECTION' },
  { value: 'ONE PIECE COLLECTION', label: 'ONE PIECE COLLECTION' },
  { value: 'JJK COLLECTION', label: 'JJK COLLECTION' },
  { value: 'AOT COLLECTION', label: 'AOT COLLECTION' },
  { value: 'DEMON SLAYER COLLECTION', label: 'DEMON SLAYER COLLECTION' },
  { value: 'SOLO LEVELING COLLECTION', label: 'SOLO LEVELING COLLECTION' },
]

const DROP_NUMBER_PRESETS: PresetOption[] = [
  { value: 'DROP-001', label: 'DROP-001' },
  { value: 'DROP-002', label: 'DROP-002' },
  { value: 'DROP-003', label: 'DROP-003' },
  { value: 'DROP-004', label: 'DROP-004' },
  { value: 'DROP-005', label: 'DROP-005' },
  { value: 'DROP-006', label: 'DROP-006' },
]

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
          <SelectWithCustom
            value={form.collectionTag}
            onChange={(v) => set('collectionTag', v)}
            presets={COLLECTION_TAG_PRESETS}
            selectPlaceholder="Select tag..."
            customPlaceholder="SS-001"
          />
        </Field>

        <Field label="Drop Number">
          <SelectWithCustom
            value={form.dropNumber}
            onChange={(v) => set('dropNumber', v)}
            presets={DROP_NUMBER_PRESETS}
            includeEmptyOption={false}
            customPlaceholder="DROP-007"
          />
        </Field>

        <Field label="Universe">
          <SelectWithCustom
            value={form.universe}
            onChange={(v) => set('universe', v)}
            presets={UNIVERSE_PRESETS}
            selectPlaceholder="Select universe..."
            customPlaceholder="Naruto"
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
// Coupon Form
// ============================================================================

interface CouponFormData {
  code: string
  description: string
  type: string // DISCOUNT | FREE_SHIPPING | FREE_GIFT
  value: string
  giftName: string
  minOrder: string
  usageLimit: string
  isActive: boolean
  expiresAt: string // '' or datetime-local string
}

function emptyCouponForm(): CouponFormData {
  return {
    code: '',
    description: '',
    type: 'DISCOUNT',
    value: '0',
    giftName: '',
    minOrder: '0',
    usageLimit: '0',
    isActive: true,
    expiresAt: '',
  }
}

function CouponForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Coupon | null
  onSave: (data: CouponFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<CouponFormData>(() =>
    item
      ? {
          code: item.code,
          description: item.description || '',
          type: item.type,
          value: String(item.value ?? 0),
          giftName: item.giftName || '',
          minOrder: String(item.minOrder ?? 0),
          usageLimit: String(item.usageLimit || 0),
          isActive: item.isActive,
          expiresAt: item.expiresAt ? item.expiresAt.slice(0, 16) : '',
        }
      : emptyCouponForm()
  )

  const set = <K extends keyof CouponFormData>(key: K, value: CouponFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <FormShell
      title={item ? 'Edit Coupon' : 'New Coupon'}
      jp={item ? 'クーポン編集' : '新クーポン'}
      onClose={onCancel}
      onSave={() => onSave(form)}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Code" hint="Auto-uppercase">
          <TextInput
            value={form.code}
            onChange={(v) => set('code', v.toUpperCase())}
            placeholder="SUMMER10"
          />
        </Field>
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 transition-colors focus:border-[#FF2D55] focus:outline-none"
          >
            <option value="DISCOUNT">DISCOUNT</option>
            <option value="FREE_SHIPPING">FREE_SHIPPING</option>
            <option value="FREE_GIFT">FREE_GIFT</option>
          </select>
        </Field>

        <div className="md:col-span-2">
          <Field label="Description">
            <TextInput
              value={form.description}
              onChange={(v) => set('description', v)}
              placeholder="10% off summer collection"
            />
          </Field>
        </div>

        {form.type === 'DISCOUNT' && (
          <Field label="Value" hint="Percentage off (e.g. 10 = 10% off)">
            <TextInput
              value={form.value}
              onChange={(v) => set('value', v)}
              placeholder="10"
              type="number"
            />
          </Field>
        )}

        {form.type === 'FREE_GIFT' && (
          <Field label="Collector Pack / Gift Name" hint="e.g. Collector Pack, Premium Sticker Set, Exclusive Poster">
            <TextInput
              value={form.giftName}
              onChange={(v) => set('giftName', v)}
              placeholder="Collector Pack"
            />
          </Field>
        )}

        <Field label="Min Order" hint="Minimum cart total to apply (0 = no minimum)">
          <TextInput
            value={form.minOrder}
            onChange={(v) => set('minOrder', v)}
            placeholder="0"
            type="number"
          />
        </Field>

        <Field label="Usage Limit" hint="0 = unlimited, N = first N users only (e.g. 10 = first 10 customers)">
          <TextInput
            type="number"
            value={form.usageLimit}
            onChange={(v) => set('usageLimit', v)}
            placeholder="0"
          />
        </Field>

        <Field label="Expires At" hint="Optional · leave empty for no expiry">
          <input
            type="datetime-local"
            value={form.expiresAt}
            onChange={(e) => set('expiresAt', e.target.value)}
            className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 transition-colors focus:border-[#FF2D55] focus:outline-none"
          />
        </Field>

        <div className="md:col-span-2">
          <Toggle
            checked={form.isActive}
            onChange={(v) => set('isActive', v)}
            label="Active"
          />
        </div>
      </div>
    </FormShell>
  )
}

// ============================================================================
// Notification Form
// ============================================================================

interface NotificationFormData {
  title: string
  body: string
  type: string // INFO | OFFER | COUPON | WARNING
  link: string
  isActive: boolean
}

function emptyNotificationForm(): NotificationFormData {
  return {
    title: '',
    body: '',
    type: 'INFO',
    link: '',
    isActive: true,
  }
}

function NotificationForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: AdminNotification | null
  onSave: (data: NotificationFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<NotificationFormData>(() =>
    item
      ? {
          title: item.title,
          body: item.body,
          type: item.type,
          link: item.link || '',
          isActive: item.isActive,
        }
      : emptyNotificationForm()
  )

  const set = <K extends keyof NotificationFormData>(key: K, value: NotificationFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <FormShell
      title={item ? 'Edit Notification' : 'New Notification'}
      jp={item ? '通知編集' : '新通知'}
      onClose={onCancel}
      onSave={() => onSave(form)}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4">
        <Field label="Title">
          <TextInput
            value={form.title}
            onChange={(v) => set('title', v)}
            placeholder="Flash Sale Live"
          />
        </Field>
        <Field label="Body">
          <TextArea
            value={form.body}
            onChange={(v) => set('body', v)}
            placeholder="Up to 30% off select items. Limited time only."
            rows={4}
          />
        </Field>
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 transition-colors focus:border-[#FF2D55] focus:outline-none"
          >
            <option value="INFO">INFO</option>
            <option value="OFFER">OFFER</option>
            <option value="COUPON">COUPON</option>
            <option value="WARNING">WARNING</option>
          </select>
        </Field>
        <Field label="Link" hint="URL to navigate when clicked (e.g. #featured)">
          <TextInput
            value={form.link}
            onChange={(v) => set('link', v)}
            placeholder="#featured"
          />
        </Field>
        <Toggle
          checked={form.isActive}
          onChange={(v) => set('isActive', v)}
          label="Active"
        />
      </div>
    </FormShell>
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
  { id: 'coupons', label: 'Coupons', jp: 'クーポン', icon: Tag },
  { id: 'store', label: 'Store', jp: 'ストア', icon: Power },
  { id: 'notifications', label: 'Alerts', jp: '通知', icon: Bell },
  { id: 'settings', label: 'Settings', jp: '設定', icon: Settings },
  { id: 'affiliates', label: 'Affiliates', jp: 'アフィリエイト', icon: Users },
  { id: 'affiliateDashboard', label: 'Dashboard', jp: 'ダッシュボード', icon: BarChart3 },
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
// Coupons Tab
// ============================================================================

function CouponsTab() {
  const { toast } = useToast()
  const [items, setItems] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/coupons')
      if (res.ok) setItems(await res.json())
    } catch {
      toast({ title: 'Failed to load coupons', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSave = async (data: CouponFormData) => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/coupons/${editing.id}` : '/api/admin/coupons'
      const method = editing ? 'PUT' : 'POST'
      const payload = {
        code: data.code,
        description: data.description,
        type: data.type,
        value: parseFloat(data.value) || 0,
        giftName: data.giftName,
        minOrder: parseFloat(data.minOrder) || 0,
        usageLimit: parseInt(data.usageLimit) || 0,
        isActive: data.isActive,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: editing ? 'Coupon updated' : 'Coupon created' })
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
      const res = await fetch(`/api/admin/coupons/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      } else {
        toast({ title: 'Coupon deleted' })
        setDeleteId(null)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (coupon: Coupon) => {
    setTogglingId(coupon.id)
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...coupon, isActive: !coupon.isActive }),
      })
      if (!res.ok) {
        toast({ title: 'Update failed', variant: 'destructive' })
      } else {
        setItems((prev) =>
          prev.map((c) =>
            c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
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
      <CouponForm
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

  // Color-code by type: DISCOUNT = white, FREE_SHIPPING = green, FREE_GIFT = pink
  const typeStyle = (type: string) => {
    switch (type) {
      case 'FREE_SHIPPING':
        return 'bg-[#22c55e]/15 text-[#22c55e]'
      case 'FREE_GIFT':
        return 'bg-[#FF2D55]/15 text-[#FF2D55]'
      default:
        return 'border border-[#2A2A2A] text-white/60'
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle
          title="Coupons"
          jp="クーポン"
          subtitle={`${items.length} coupons configured`}
        />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Add New Coupon
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState label="No coupons yet · Add your first coupon" />
      ) : (
        <div className="space-y-2">
          <div className="hidden grid-cols-12 gap-3 border-b border-[#2A2A2A] px-3 pb-2 md:grid">
            <span className="col-span-3 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Code
            </span>
            <span className="col-span-2 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Type
            </span>
            <span className="col-span-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Value
            </span>
            <span className="col-span-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Min Order
            </span>
            <span className="col-span-2 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Usage
            </span>
            <span className="col-span-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Active
            </span>
            <span className="col-span-2 text-right font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
              Actions
            </span>
          </div>

          {items.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-12 items-center gap-3 border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2.5 transition-colors hover:border-[#2A2A2A]/70"
            >
              <div className="col-span-12 md:col-span-3">
                <p className="font-mono-tech text-sm uppercase tracking-wider text-white/90">
                  {c.code}
                </p>
                {c.description && (
                  <p className="truncate text-[11px] text-white/40">{c.description}</p>
                )}
              </div>
              <div className="col-span-4 md:col-span-2">
                <span
                  className={`inline-block px-1.5 py-0.5 font-mono-tech text-[8px] uppercase tracking-wider ${typeStyle(c.type)}`}
                >
                  {c.type}
                </span>
              </div>
              <div className="col-span-4 md:col-span-1">
                {c.type === 'DISCOUNT' && (
                  <span className="text-sm font-medium text-white/90">{c.value}%</span>
                )}
                {c.type === 'FREE_GIFT' && (
                  <span className="truncate text-xs text-white/70">
                    {c.giftName || '—'}
                  </span>
                )}
                {c.type === 'FREE_SHIPPING' && (
                  <span className="text-xs text-white/40">—</span>
                )}
              </div>
              <div className="col-span-4 md:col-span-1">
                <span className="text-sm text-white/70">{formatINR(c.minOrder)}</span>
              </div>
              <div className="col-span-12 md:col-span-2">
                {c.usageLimit > 0 ? (
                  <span className="font-mono-tech text-[11px] uppercase tracking-wider text-white/80">
                    {c.usedCount || 0}/{c.usageLimit} used
                  </span>
                ) : (
                  <span className="font-mono-tech text-[10px] uppercase tracking-wider text-white/40">
                    Unlimited
                  </span>
                )}
              </div>
              <div className="col-span-6 md:col-span-1">
                <button
                  onClick={() => handleToggleActive(c)}
                  disabled={togglingId === c.id}
                  className={`px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider transition-colors ${
                    c.isActive
                      ? 'bg-[#FF2D55]/20 text-[#FF2D55]'
                      : 'border border-[#2A2A2A] text-white/40 hover:text-white/70'
                  }`}
                >
                  {togglingId === c.id ? '...' : c.isActive ? 'On' : 'Off'}
                </button>
              </div>
              <div className="col-span-6 flex items-center justify-end gap-1 md:col-span-2">
                <button
                  onClick={() => setEditing(c)}
                  className="flex h-8 w-8 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                  aria-label={`Edit ${c.code}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(c.id)}
                  className="flex h-8 w-8 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                  aria-label={`Delete ${c.code}`}
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
        title="Delete Coupon"
        message="This action cannot be undone. The coupon will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

// ============================================================================
// Store Status Tab
// ============================================================================

function StoreStatusTab() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [accepting, setAccepting] = useState(true)
  const [message, setMessage] = useState('')

  const fetchStatus = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/store-status')
      if (res.ok) {
        const data: StoreStatus = await res.json()
        setAccepting(data.accepting)
        setMessage(data.message || '')
      }
    } catch {
      toast({ title: 'Failed to load store status', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/store-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepting, message }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: 'Store status updated' })
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    )
  }

  return (
    <div>
      <SectionTitle
        title="Store Status"
        jp="ストア"
        subtitle="Control whether the storefront is accepting orders"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Editor */}
        <div className="border border-[#2A2A2A] bg-[#0a0a0a] p-5">
          <div className="mb-5 flex items-center justify-between border border-[#2A2A2A] bg-[#111111] px-4 py-3">
            <div>
              <p className="font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
                Accepting Orders
              </p>
              <p className="font-jp text-[10px] tracking-wider text-white/30">注文受付</p>
            </div>
            <button
              type="button"
              onClick={() => setAccepting(!accepting)}
              className="relative h-6 w-11 rounded-full transition-colors"
              style={{ backgroundColor: accepting ? '#FF2D55' : '#2A2A2A' }}
              aria-label="Toggle accepting orders"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                  accepting ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className={accepting ? 'pointer-events-none opacity-40' : ''}>
            <Field label="Paused Message" hint="Shown to users when orders are paused">
              <TextArea
                value={message}
                onChange={setMessage}
                placeholder="We're temporarily pausing orders. Check back soon."
                rows={4}
              />
            </Field>
          </div>

          <div className="mt-5 flex justify-end">
            <PrimaryButton onClick={handleSave} loading={saving}>
              Save Status
            </PrimaryButton>
          </div>
        </div>

        {/* Preview */}
        <div className="border border-[#2A2A2A] bg-[#0a0a0a] p-5">
          <p className="mb-3 font-mono-tech text-[10px] uppercase tracking-wider text-white/40">
            User Preview · ユーザープレビュー
          </p>
          {accepting ? (
            <div className="flex items-center gap-3 border border-[#22c55e]/30 bg-[#22c55e]/5 px-4 py-4">
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[#22c55e]" />
              <div>
                <p className="text-sm font-medium text-white/90">Store is open</p>
                <p className="font-mono-tech text-[10px] uppercase tracking-wider text-white/40">
                  Accepting orders normally
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-[#FF2D55]/30 bg-[#FF2D55]/5 px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#FF2D55]" />
                <p className="text-sm font-medium text-white/90">Orders paused</p>
              </div>
              <p className="text-sm text-white/70">
                {message || 'No message set. Users will see a generic paused notice.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Notifications Tab
// ============================================================================

function NotificationsTab() {
  const { toast } = useToast()
  const [items, setItems] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<AdminNotification | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/notifications')
      if (res.ok) setItems(await res.json())
    } catch {
      toast({ title: 'Failed to load notifications', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSave = async (data: NotificationFormData) => {
    setSaving(true)
    try {
      const url = editing
        ? `/api/admin/notifications/${editing.id}`
        : '/api/admin/notifications'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: editing ? 'Notification updated' : 'Notification created' })
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
      const res = await fetch(`/api/admin/notifications/${deleteId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      } else {
        toast({ title: 'Notification deleted' })
        setDeleteId(null)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (n: AdminNotification) => {
    setTogglingId(n.id)
    try {
      const res = await fetch(`/api/admin/notifications/${n.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...n, isActive: !n.isActive }),
      })
      if (!res.ok) {
        toast({ title: 'Update failed', variant: 'destructive' })
      } else {
        setItems((prev) =>
          prev.map((x) =>
            x.id === n.id ? { ...x, isActive: !n.isActive } : x
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
      <NotificationForm
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

  // Color-code by type: INFO = white, OFFER = pink, COUPON = green, WARNING = pink
  const typeStyle = (type: string) => {
    switch (type) {
      case 'OFFER':
        return 'bg-[#FF2D55]/15 text-[#FF2D55]'
      case 'COUPON':
        return 'bg-[#22c55e]/15 text-[#22c55e]'
      case 'WARNING':
        return 'bg-[#FF2D55]/15 text-[#FF2D55]'
      default:
        return 'border border-[#2A2A2A] text-white/60'
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle
          title="Notifications"
          jp="通知"
          subtitle={`${items.length} notifications configured`}
        />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Create Notification
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState label="No notifications yet · Create your first alert" />
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div
              key={n.id}
              className="border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-3 transition-colors hover:border-[#2A2A2A]/70"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 px-1.5 py-0.5 font-mono-tech text-[8px] uppercase tracking-wider ${typeStyle(n.type)}`}
                >
                  {n.type}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/90">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-white/50">{n.body}</p>
                  {n.link && (
                    <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                      → {n.link}
                    </p>
                  )}
                  <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/25">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(n)}
                    disabled={togglingId === n.id}
                    className={`px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider transition-colors ${
                      n.isActive
                        ? 'bg-[#FF2D55]/20 text-[#FF2D55]'
                        : 'border border-[#2A2A2A] text-white/40 hover:text-white/70'
                    }`}
                  >
                    {togglingId === n.id ? '...' : n.isActive ? 'On' : 'Off'}
                  </button>
                  <button
                    onClick={() => setEditing(n)}
                    className="flex h-8 w-8 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                    aria-label={`Edit ${n.title}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(n.id)}
                    className="flex h-8 w-8 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                    aria-label={`Delete ${n.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Notification"
        message="This action cannot be undone. The notification will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

// ============================================================================
// Settings Tab
// ============================================================================

// Format a raw WhatsApp number (digits only, with country code) for display.
// Examples:  "918451818607" → "+91 8451818607"
//            "8451818607"   → "+91 8451818607"  (assumes India)
//            "12345"        → "+12345"
function formatWhatsAppDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  // Indian number: 10-digit national, optionally prefixed with 91
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`
  }
  if (digits.length === 10) {
    return `+91 ${digits}`
  }
  // Fallback: just show with leading +
  return `+${digits}`
}

function SettingsTab() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data: Record<string, string> = await res.json()
        setWhatsapp(data.whatsapp_number || '')
      }
    } catch {
      toast({ title: 'Failed to load settings', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp_number: whatsapp }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: 'Settings saved' })
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    )
  }

  const displayNumber = formatWhatsAppDisplay(whatsapp)

  return (
    <div>
      <SectionTitle
        title="Settings"
        jp="設定"
        subtitle="Store-wide configuration"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Editor */}
        <div className="border border-[#2A2A2A] bg-[#0a0a0a] p-5">
          <Field
            label="WhatsApp Number"
            hint="Include country code, no + or spaces. Example: 918451818607 for +91 8451818607"
          >
            <TextInput
              value={whatsapp}
              onChange={setWhatsapp}
              placeholder="918451818607"
            />
          </Field>

          <div className="mt-5 flex justify-end">
            <PrimaryButton onClick={handleSave} loading={saving}>
              Save Settings
            </PrimaryButton>
          </div>
        </div>

        {/* Preview */}
        <div className="border border-[#2A2A2A] bg-[#0a0a0a] p-5">
          <p className="mb-3 font-mono-tech text-[10px] uppercase tracking-wider text-white/40">
            Order Routing Preview · 注文送信先
          </p>
          {displayNumber ? (
            <div className="flex items-center gap-3 border border-[#22c55e]/30 bg-[#22c55e]/5 px-4 py-4">
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[#22c55e]" />
              <div>
                <p className="text-sm font-medium text-white/90">
                  Orders will be sent to: {displayNumber}
                </p>
                <p className="font-mono-tech text-[10px] uppercase tracking-wider text-white/40">
                  WhatsApp · メッセージ送信
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-[#FF2D55]/30 bg-[#FF2D55]/5 px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#FF2D55]" />
                <p className="text-sm font-medium text-white/90">No number set</p>
              </div>
              <p className="text-sm text-white/70">
                Enter a WhatsApp number above so new orders can be routed to the store owner.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Affiliate Form
// ============================================================================

interface AffiliateFormData {
  code: string
  creatorName: string
  platform: string
  contact: string
  rewardType: string // DISCOUNT | FREE_GIFT | NONE
  rewardValue: string
  rewardGiftName: string
  commissionType: string // PERCENTAGE | FIXED
  commissionValue: string
  isActive: boolean
}

function emptyAffiliateForm(): AffiliateFormData {
  return {
    code: '',
    creatorName: '',
    platform: 'Instagram',
    contact: '',
    rewardType: 'DISCOUNT',
    rewardValue: '10',
    rewardGiftName: '',
    commissionType: 'PERCENTAGE',
    commissionValue: '10',
    isActive: true,
  }
}

function AffiliateForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Affiliate | null
  onSave: (data: AffiliateFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<AffiliateFormData>(() =>
    item
      ? {
          code: item.code,
          creatorName: item.creatorName,
          platform: item.platform,
          contact: item.contact || '',
          rewardType: item.rewardType,
          rewardValue: String(item.rewardValue ?? 0),
          rewardGiftName: item.rewardGiftName || '',
          commissionType: item.commissionType,
          commissionValue: String(item.commissionValue ?? 0),
          isActive: item.isActive,
        }
      : emptyAffiliateForm()
  )

  const set = <K extends keyof AffiliateFormData>(key: K, value: AffiliateFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <FormShell
      title={item ? 'Edit Affiliate' : 'New Affiliate'}
      jp={item ? 'アフィリエイト編集' : '新アフィリエイト'}
      onClose={onCancel}
      onSave={() => onSave(form)}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Code" hint="Auto-uppercase · what customers type at checkout">
          <TextInput
            value={form.code}
            onChange={(v) => set('code', v.toUpperCase())}
            placeholder="NARUTO10"
          />
        </Field>
        <Field label="Creator Name" hint="Handle or display name">
          <TextInput
            value={form.creatorName}
            onChange={(v) => set('creatorName', v)}
            placeholder="@anime_fan_page"
          />
        </Field>
        <Field label="Platform">
          <select
            value={form.platform}
            onChange={(e) => set('platform', e.target.value)}
            className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 transition-colors focus:border-[#FF2D55] focus:outline-none"
          >
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="Twitter/X">Twitter/X</option>
            <option value="Facebook">Facebook</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Contact" hint="WhatsApp number or email for payout">
          <TextInput
            value={form.contact}
            onChange={(v) => set('contact', v)}
            placeholder="WhatsApp number or email for payout"
          />
        </Field>

        <div className="md:col-span-2 border-t border-[#2A2A2A] pt-4">
          <p className="mb-1 font-mono-tech text-[10px] uppercase tracking-wider text-[#FF2D55]">
            Customer Reward · カスタマー特典
          </p>
        </div>

        <Field label="Reward Type">
          <select
            value={form.rewardType}
            onChange={(e) => set('rewardType', e.target.value)}
            className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 transition-colors focus:border-[#FF2D55] focus:outline-none"
          >
            <option value="DISCOUNT">DISCOUNT</option>
            <option value="FREE_GIFT">FREE_GIFT</option>
            <option value="NONE">NONE</option>
          </select>
        </Field>

        {form.rewardType === 'DISCOUNT' && (
          <Field label="Reward Value" hint="Percentage off (0–100)">
            <TextInput
              value={form.rewardValue}
              onChange={(v) => set('rewardValue', v)}
              placeholder="10"
              type="number"
            />
          </Field>
        )}
        {form.rewardType === 'FREE_GIFT' && (
          <Field label="Collector Pack / Gift Name" hint="e.g. Collector Pack, Premium Sticker Set, Exclusive Poster">
            <TextInput
              value={form.rewardGiftName}
              onChange={(v) => set('rewardGiftName', v)}
              placeholder="Collector Pack"
            />
          </Field>
        )}
        {form.rewardType === 'NONE' && (
          <div className="md:col-span-1 flex items-end">
            <p className="font-mono-tech text-[10px] uppercase tracking-wider text-white/30">
              No customer discount — they just support the creator
            </p>
          </div>
        )}

        <div className="md:col-span-2 border-t border-[#2A2A2A] pt-4">
          <p className="mb-1 font-mono-tech text-[10px] uppercase tracking-wider text-[#FF2D55]">
            Creator Commission · クリエイター報酬
          </p>
        </div>

        <Field label="Commission Type">
          <select
            value={form.commissionType}
            onChange={(e) => set('commissionType', e.target.value)}
            className="w-full border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-2 text-sm text-white/90 transition-colors focus:border-[#FF2D55] focus:outline-none"
          >
            <option value="PERCENTAGE">PERCENTAGE</option>
            <option value="FIXED">FIXED</option>
          </select>
        </Field>

        <Field
          label="Commission Value"
          hint={
            form.commissionType === 'PERCENTAGE'
              ? 'e.g. 10 for 10% per sale'
              : 'e.g. 100 for ₹100 per sale'
          }
        >
          <TextInput
            value={form.commissionValue}
            onChange={(v) => set('commissionValue', v)}
            placeholder="10"
            type="number"
          />
        </Field>

        <div className="md:col-span-2">
          <Toggle
            checked={form.isActive}
            onChange={(v) => set('isActive', v)}
            label="Active"
          />
        </div>
      </div>
    </FormShell>
  )
}

// ============================================================================
// Affiliates Tab (Creator Management)
// ============================================================================

function formatRewardLabel(a: Affiliate): string {
  if (a.rewardType === 'DISCOUNT') return `${a.rewardValue}% off`
  if (a.rewardType === 'FREE_GIFT') return `Free Gift: ${a.rewardGiftName || '—'}`
  return 'None'
}

function formatCommissionLabel(a: Affiliate): string {
  if (a.commissionType === 'PERCENTAGE') return `${a.commissionValue}% per sale`
  return `${formatINR(a.commissionValue)} per sale`
}

function platformBadgeStyle(platform: string): string {
  switch (platform) {
    case 'Instagram':
      return 'bg-[#FF2D55]/15 text-[#FF2D55]'
    case 'YouTube':
      return 'bg-[#FF2D55]/15 text-[#FF2D55]'
    case 'TikTok':
      return 'bg-[#22c55e]/15 text-[#22c55e]'
    default:
      return 'border border-[#2A2A2A] text-white/60'
  }
}

function AffiliatesTab() {
  const { toast } = useToast()
  const [items, setItems] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Affiliate | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/affiliates')
      if (res.ok) setItems(await res.json())
    } catch {
      toast({ title: 'Failed to load affiliates', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSave = async (data: AffiliateFormData) => {
    setSaving(true)
    try {
      const url = editing
        ? `/api/admin/affiliates/${editing.id}`
        : '/api/admin/affiliates'
      const method = editing ? 'PUT' : 'POST'
      const payload = {
        code: data.code,
        creatorName: data.creatorName,
        platform: data.platform,
        contact: data.contact,
        rewardType: data.rewardType,
        rewardValue: parseFloat(data.rewardValue) || 0,
        rewardGiftName: data.rewardGiftName,
        commissionType: data.commissionType,
        commissionValue: parseFloat(data.commissionValue) || 0,
        isActive: data.isActive,
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Save failed', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: editing ? 'Affiliate updated' : 'Affiliate created' })
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
      const res = await fetch(`/api/admin/affiliates/${deleteId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
      } else if (data.deactivated) {
        toast({
          title: 'Affiliate deactivated',
          description: data.message,
        })
        setDeleteId(null)
        fetchItems()
      } else {
        toast({ title: 'Affiliate deleted' })
        setDeleteId(null)
        fetchItems()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (a: Affiliate) => {
    setTogglingId(a.id)
    try {
      const res = await fetch(`/api/admin/affiliates/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !a.isActive }),
      })
      if (!res.ok) {
        toast({ title: 'Update failed', variant: 'destructive' })
      } else {
        setItems((prev) =>
          prev.map((x) =>
            x.id === a.id ? { ...x, isActive: !a.isActive } : x
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
      <AffiliateForm
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
          title="Affiliates"
          jp="アフィリエイト"
          subtitle={`${items.length} creators enrolled`}
        />
        <PrimaryButton onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Add New Affiliate
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState label="No affiliates yet · Add your first creator" />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div
              key={a.id}
              className="border border-[#2A2A2A] bg-[#0a0a0a] p-4 transition-colors hover:border-[#2A2A2A]/70"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono-tech text-sm uppercase tracking-wider text-white/90">
                      {a.code}
                    </span>
                    <span
                      className={`inline-block px-1.5 py-0.5 font-mono-tech text-[8px] uppercase tracking-wider ${platformBadgeStyle(
                        a.platform
                      )}`}
                    >
                      {a.platform}
                    </span>
                    {!a.isActive && (
                      <span className="inline-block px-1.5 py-0.5 font-mono-tech text-[8px] uppercase tracking-wider border border-[#2A2A2A] text-white/40">
                        Paused
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-white/90">
                    {a.creatorName}
                  </p>
                  {a.contact && (
                    <p className="mt-0.5 truncate font-mono-tech text-[10px] uppercase tracking-wider text-white/30">
                      {a.contact}
                    </p>
                  )}
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(a)}
                    disabled={togglingId === a.id}
                    className={`px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider transition-colors ${
                      a.isActive
                        ? 'bg-[#FF2D55]/20 text-[#FF2D55]'
                        : 'border border-[#2A2A2A] text-white/40 hover:text-white/70'
                    }`}
                  >
                    {togglingId === a.id ? '...' : a.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => setEditing(a)}
                    className="flex h-8 w-8 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                    aria-label={`Edit ${a.code}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(a.id)}
                    className="flex h-8 w-8 items-center justify-center border border-[#2A2A2A] text-white/50 transition-colors hover:border-[#FF2D55] hover:text-[#FF2D55]"
                    aria-label={`Delete ${a.code}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Reward + commission info */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="border border-[#2A2A2A] bg-[#111111] px-3 py-2">
                  <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                    Customer Reward · 特典
                  </p>
                  <p className="mt-1 text-sm text-white/80">{formatRewardLabel(a)}</p>
                </div>
                <div className="border border-[#2A2A2A] bg-[#111111] px-3 py-2">
                  <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                    Creator Commission · 報酬
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    {formatCommissionLabel(a)}
                  </p>
                </div>
              </div>

              {/* Stats */}
              {a.stats && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="px-2 py-1.5">
                    <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                      Orders
                    </p>
                    <p className="mt-0.5 font-mono-tech text-sm text-white/90">
                      {a.stats.totalOrders}
                    </p>
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                      Confirmed
                    </p>
                    <p className="mt-0.5 font-mono-tech text-sm text-[#22c55e]">
                      {a.stats.confirmedOrders}
                    </p>
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                      Revenue
                    </p>
                    <p className="mt-0.5 font-mono-tech text-sm text-white/90">
                      {formatINR(a.stats.totalRevenue)}
                    </p>
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                      Commission
                    </p>
                    <p className="mt-0.5 font-mono-tech text-sm text-[#FF2D55]">
                      {formatINR(a.stats.totalCommission)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Affiliate"
        message="This will permanently delete the affiliate. If they have confirmed orders, they will be deactivated instead to preserve payout history."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

// ============================================================================
// Affiliate Dashboard Tab (Campaign Overview + Order Management)
// ============================================================================

function orderStatusStyle(status: string): string {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-[#22c55e]/15 text-[#22c55e]'
    case 'CANCELLED':
      return 'bg-[#FF2D55]/15 text-[#FF2D55]'
    default:
      return 'bg-[#f59e0b]/15 text-[#f59e0b]'
  }
}

function AffiliateDashboardTab() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<AffiliateOrder[]>([])
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [bulkAffiliateId, setBulkAffiliateId] = useState<string | null>(null)
  const [orderNote, setOrderNote] = useState<Record<string, string>>({})

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [ordersRes, affRes] = await Promise.all([
        fetch('/api/admin/affiliate-orders'),
        fetch('/api/admin/affiliates'),
      ])
      if (ordersRes.ok) setOrders(await ordersRes.json())
      if (affRes.ok) setAffiliates(await affRes.json())
    } catch {
      toast({ title: 'Failed to load dashboard data', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const updateOrderStatus = async (
    orderId: string,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  ) => {
    setUpdatingId(orderId)
    try {
      const note = orderNote[orderId] || ''
      const res = await fetch(`/api/admin/affiliate-orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, customerNote: note }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast({
          title: 'Update failed',
          description: data.error,
          variant: 'destructive',
        })
      } else {
        toast({ title: `Order ${status.toLowerCase()}` })
        setOrderNote((prev) => {
          const next = { ...prev }
          delete next[orderId]
          return next
        })
        fetchAll()
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleBulkConfirm = async (affiliateId: string) => {
    setBulkAffiliateId(affiliateId)
    const pending = orders.filter(
      (o) => o.affiliateId === affiliateId && o.status === 'PENDING'
    )
    if (pending.length === 0) {
      toast({ title: 'No pending orders for this creator' })
      setBulkAffiliateId(null)
      return
    }
    let okCount = 0
    let failCount = 0
    for (const o of pending) {
      try {
        const res = await fetch(`/api/admin/affiliate-orders/${o.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CONFIRMED' }),
        })
        if (res.ok) okCount++
        else failCount++
      } catch {
        failCount++
      }
    }
    if (failCount === 0) {
      toast({
        title: `${okCount} order${okCount === 1 ? '' : 's'} confirmed`,
      })
    } else {
      toast({
        title: `${okCount} confirmed, ${failCount} failed`,
        variant: 'destructive',
      })
    }
    setBulkAffiliateId(null)
    fetchAll()
  }

  // Compute overview stats from orders
  const confirmedOrders = orders.filter((o) => o.status === 'CONFIRMED')
  const pendingOrdersArr = orders.filter((o) => o.status === 'PENDING')
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.orderTotal, 0)
  const totalCommission = confirmedOrders.reduce(
    (sum, o) => sum + o.commissionDue,
    0
  )
  const pendingCommission = pendingOrdersArr.reduce(
    (sum, o) => sum + o.commissionDue,
    0
  )

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  const activeCreators = affiliates.filter(
    (a) => (a.stats?.totalOrders ?? 0) > 0
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    )
  }

  return (
    <div>
      <SectionTitle
        title="Affiliate Dashboard"
        jp="ダッシュボード"
        subtitle="Campaign overview · order management · creator breakdown"
      />

      {/* Top: Campaign Overview Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="border border-[#2A2A2A] bg-[#0a0a0a] p-4">
          <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
            Total Revenue · 総売上
          </p>
          <p className="mt-1 font-display text-xl text-white/90">
            {formatINR(totalRevenue)}
          </p>
          <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
            {confirmedOrders.length} confirmed orders
          </p>
        </div>
        <div className="border border-[#2A2A2A] bg-[#0a0a0a] p-4">
          <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
            Commission Owed · 報酬総額
          </p>
          <p className="mt-1 font-display text-xl text-[#FF2D55]">
            {formatINR(totalCommission)}
          </p>
          <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
            From confirmed orders
          </p>
        </div>
        <div className="border border-[#2A2A2A] bg-[#0a0a0a] p-4">
          <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
            Pending · 保留中
          </p>
          <p className="mt-1 font-display text-xl text-[#f59e0b]">
            {formatINR(pendingCommission)}
          </p>
          <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
            {pendingOrdersArr.length} pending orders
          </p>
        </div>
        <div className="border border-[#2A2A2A] bg-[#0a0a0a] p-4">
          <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
            Total Orders · 注文総数
          </p>
          <p className="mt-1 font-display text-xl text-white/90">{orders.length}</p>
          <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
            Across {activeCreators} creators
          </p>
        </div>
      </div>

      {/* Middle: Order Management */}
      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3">
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-lg uppercase text-white">
              Order Management
            </h3>
            <span className="font-jp text-xs tracking-wider text-white/30">
              注文管理
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(
              ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'] as const
            ).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 font-mono-tech text-[9px] uppercase tracking-wider transition-colors ${
                  filter === f
                    ? 'bg-[#FF2D55] text-white'
                    : 'border border-[#2A2A2A] text-white/50 hover:text-white/80'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            label={`No ${
              filter === 'ALL' ? '' : filter.toLowerCase() + ' '
            }orders yet`}
          />
        ) : (
          <div className="space-y-2">
            {/* Header row */}
            <div className="hidden grid-cols-12 gap-3 border-b border-[#2A2A2A] px-3 pb-2 md:grid">
              <span className="col-span-2 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                Date
              </span>
              <span className="col-span-3 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                Creator
              </span>
              <span className="col-span-2 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                Total
              </span>
              <span className="col-span-2 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                Commission
              </span>
              <span className="col-span-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                Status
              </span>
              <span className="col-span-2 text-right font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                Actions
              </span>
            </div>

            {filteredOrders.map((o) => (
              <div
                key={o.id}
                className="border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-3 transition-colors hover:border-[#2A2A2A]/70"
              >
                <div className="grid grid-cols-12 items-center gap-3">
                  <div className="col-span-12 md:col-span-2">
                    <p className="font-mono-tech text-[10px] uppercase tracking-wider text-white/60">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                      {new Date(o.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <p className="truncate text-sm text-white/90">
                      {o.creatorName}
                    </p>
                    <p className="font-mono-tech text-[9px] uppercase tracking-wider text-[#FF2D55]">
                      {o.code}
                    </p>
                    {/* Customer details — so you know who ordered */}
                    {o.customerName && (
                      <p className="mt-1 truncate text-xs text-white/70">
                        👤 {o.customerName}
                      </p>
                    )}
                    {o.customerPhone && (
                      <p className="font-mono-tech text-[9px] text-white/50">
                        📱 {o.customerPhone}
                      </p>
                    )}
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <span className="text-sm font-medium text-white/90">
                      {formatINR(o.orderTotal)}
                    </span>
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <span className="text-sm text-white/70">
                      {formatINR(o.commissionDue)}
                    </span>
                  </div>
                  <div className="col-span-6 md:col-span-1">
                    <span
                      className={`inline-block px-1.5 py-0.5 font-mono-tech text-[8px] uppercase tracking-wider ${orderStatusStyle(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <div className="col-span-12 flex items-center justify-end gap-1 md:col-span-2">
                    {o.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(o.id, 'CONFIRMED')}
                          disabled={updatingId === o.id}
                          className="border border-[#22c55e]/40 bg-[#22c55e]/10 px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-[#22c55e] transition-colors hover:bg-[#22c55e]/20 disabled:opacity-50"
                        >
                          {updatingId === o.id ? '...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => updateOrderStatus(o.id, 'CANCELLED')}
                          disabled={updatingId === o.id}
                          className="border border-[#FF2D55]/40 bg-[#FF2D55]/10 px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-[#FF2D55] transition-colors hover:bg-[#FF2D55]/20 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {o.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'CANCELLED')}
                        disabled={updatingId === o.id}
                        className="border border-[#FF2D55]/40 bg-[#FF2D55]/10 px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-[#FF2D55] transition-colors hover:bg-[#FF2D55]/20 disabled:opacity-50"
                      >
                        {updatingId === o.id ? '...' : 'Cancel'}
                      </button>
                    )}
                    {o.status === 'CANCELLED' && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'PENDING')}
                        disabled={updatingId === o.id}
                        className="border border-[#2A2A2A] px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/60 transition-colors hover:border-white/30 hover:text-white/80 disabled:opacity-50"
                      >
                        {updatingId === o.id ? '...' : 'Reopen'}
                      </button>
                    )}
                  </div>
                </div>
                {/* Note + note editor */}
                <div className="mt-2 border-t border-[#2A2A2A] pt-2">
                  {o.customerNote && (
                    <p className="mb-1.5 font-mono-tech text-[9px] uppercase tracking-wider text-white/40">
                      Note: {o.customerNote}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={orderNote[o.id] || ''}
                      onChange={(e) =>
                        setOrderNote((prev) => ({
                          ...prev,
                          [o.id]: e.target.value,
                        }))
                      }
                      placeholder="Add note (e.g. out of stock, customer cancelled)"
                      className="flex-1 border border-[#2A2A2A] bg-[#050505] px-2 py-1 text-xs text-white/70 placeholder-white/25 focus:border-[#FF2D55] focus:outline-none"
                    />
                    {orderNote[o.id] && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            o.id,
                            o.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED'
                          )
                        }
                        disabled={updatingId === o.id}
                        className="border border-[#2A2A2A] px-2 py-1 font-mono-tech text-[9px] uppercase tracking-wider text-white/50 transition-colors hover:text-white/80 disabled:opacity-50"
                      >
                        Save Note
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom: Per-Creator Breakdown */}
      <div>
        <div className="mb-4 flex items-baseline gap-3 border-b border-[#2A2A2A] pb-3">
          <h3 className="font-display text-lg uppercase text-white">
            Creator Breakdown
          </h3>
          <span className="font-jp text-xs tracking-wider text-white/30">
            クリエイター別
          </span>
        </div>

        {affiliates.length === 0 ? (
          <EmptyState label="No affiliates yet" />
        ) : (
          <div className="space-y-2">
            {affiliates.map((a) => {
              const stats = a.stats
              const pendingCount = stats?.pendingOrders ?? 0
              return (
                <div
                  key={a.id}
                  className="border border-[#2A2A2A] bg-[#0a0a0a] px-3 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-medium text-white/90">
                          {a.creatorName}
                        </span>
                        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#FF2D55]">
                          {a.code}
                        </span>
                        <span className="font-mono-tech text-[9px] uppercase tracking-wider text-white/40">
                          {a.platform}
                        </span>
                        {!a.isActive && (
                          <span className="inline-block px-1.5 py-0.5 font-mono-tech text-[8px] uppercase tracking-wider border border-[#2A2A2A] text-white/40">
                            Paused
                          </span>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                            Confirmed
                          </p>
                          <p className="font-mono-tech text-sm text-[#22c55e]">
                            {stats?.confirmedOrders ?? 0}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                            Revenue
                          </p>
                          <p className="font-mono-tech text-sm text-white/90">
                            {formatINR(stats?.totalRevenue ?? 0)}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                            Commission Owed
                          </p>
                          <p className="font-mono-tech text-sm text-[#FF2D55]">
                            {formatINR(stats?.totalCommission ?? 0)}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono-tech text-[9px] uppercase tracking-wider text-white/30">
                            Pending Comm.
                          </p>
                          <p className="font-mono-tech text-sm text-[#f59e0b]">
                            {formatINR(stats?.pendingCommission ?? 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleBulkConfirm(a.id)}
                        disabled={pendingCount === 0 || bulkAffiliateId === a.id}
                        className="border border-[#22c55e]/40 bg-[#22c55e]/10 px-3 py-1.5 font-mono-tech text-[9px] uppercase tracking-wider text-[#22c55e] transition-colors hover:bg-[#22c55e]/20 disabled:cursor-not-allowed disabled:border-[#2A2A2A] disabled:bg-transparent disabled:text-white/30"
                      >
                        {bulkAffiliateId === a.id
                          ? '...'
                          : `Confirm all pending (${pendingCount})`}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
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
            {activeTab === 'coupons' && <CouponsTab />}
            {activeTab === 'store' && <StoreStatusTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'affiliates' && <AffiliatesTab />}
            {activeTab === 'affiliateDashboard' && <AffiliateDashboardTab />}
          </div>
        </main>
      </div>
    </div>
  )
}
