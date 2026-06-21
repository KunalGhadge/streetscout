export interface Product {
  id: string
  name: string
  slug: string
  collection: string
  collectionTag: string
  dropNumber: string
  universe: string
  universeJp: string
  price: number
  description: string
  fabric: string
  fit: string
  breathability: string
  durability: string
  sizes: string // comma-separated, e.g. "XS,S,M,L,XL,XXL"
  imageFront: string
  imageBack: string
  accentColor: string
  isFeatured: boolean
  inStock: boolean
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

export interface Coupon {
  id: string
  code: string
  description: string
  type: string
  value: number
  giftName: string
  minOrder: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Universe {
  id: string
  name: string
  japanese: string
  dropNumber: string
  image: string
  order: number
}

export interface Drop {
  id: string
  number: string
  japanese: string
  title: string
  description: string
  status: string
  image: string
  order: number
}

export interface Lifestyle {
  id: string
  label: string
  japanese: string
  tag: string
  description: string
  image: string
  order: number
}

// Default sizes used when creating a new product
export const DEFAULT_SIZES = 'XS,S,M,L,XL,XXL'

// Parse a comma-separated sizes string into an array
export function parseSizes(sizes: string | undefined | null): string[] {
  if (!sizes) return ['M']
  return sizes
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
}
