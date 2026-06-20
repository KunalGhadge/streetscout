export interface Product {
  id: string
  name: string
  slug: string
  collection: string
  universe: string
  price: number
  description: string
  fabric: string
  fit: string
  breathability: string
  durability: string
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

export interface Universe {
  id: string
  name: string
  japanese: string
  image: string
  accent: string
}
