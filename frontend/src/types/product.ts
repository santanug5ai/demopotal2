export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: {
    amount: number
    currency: string
    compareAt?: number
  }
  inventory: {
    quantity: number
    inStock: boolean
  }
  images: ProductImage[]
  variants?: ProductVariant[]
  attributes?: Record<string, any>
  status: 'active' | 'draft' | 'archived'
  tags: string[]
  ratingAverage?: number
  ratingCount: number
}

export interface ProductImage {
  url: string
  alt: string
  isPrimary: boolean
  position: number
}

export interface ProductVariant {
  id: string
  sku: string
  options: Record<string, string>
  price: {
    amount: number
    currency: string
  }
  inventory: {
    quantity: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  total: number
}
