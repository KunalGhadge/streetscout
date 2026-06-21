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
