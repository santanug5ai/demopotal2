import { useState } from 'react'
import { Filter } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'

// Mock data - will be replaced with API call
const products: Product[] = [
  {
    id: 'prod_laptop_001',
    sku: 'LAPTOP-PRO-15-001',
    name: 'Professional Laptop Pro 15',
    slug: 'professional-laptop-pro-15',
    description: 'High-performance laptop designed for professionals',
    shortDescription: '15-inch professional laptop with 32GB RAM and 4K display',
    price: {
      amount: 1899.99,
      currency: 'USD',
      compareAt: 2299.99,
    },
    inventory: {
      quantity: 45,
      inStock: true,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        alt: 'Professional Laptop Pro 15',
        isPrimary: true,
        position: 1,
      },
    ],
    status: 'active',
    tags: ['new', 'featured', 'sale'],
    ratingAverage: 4.5,
    ratingCount: 128,
  },
  {
    id: 'prod_phone_001',
    sku: 'PHONE-ULTRA-001',
    name: 'UltraPhone X1',
    slug: 'ultraphone-x1',
    description: 'The latest flagship smartphone',
    shortDescription: 'Premium flagship smartphone with advanced camera system',
    price: {
      amount: 1199.99,
      currency: 'USD',
    },
    inventory: {
      quantity: 120,
      inStock: true,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        alt: 'UltraPhone X1',
        isPrimary: true,
        position: 1,
      },
    ],
    status: 'active',
    tags: ['new', 'featured'],
    ratingAverage: 4.8,
    ratingCount: 256,
  },
]

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-gray-600">Browse our complete catalog</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`${
            showFilters ? 'block' : 'hidden'
          } w-64 shrink-0 lg:block`}
        >
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 font-semibold">Filters</h3>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium">Categories</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Laptops</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Smartphones</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Accessories</span>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium">Price Range</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Under $500</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">$500 - $1000</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">$1000 - $2000</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Over $2000</span>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="mb-2 text-sm font-medium">Tags</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">New Arrivals</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">On Sale</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {products.length} products
            </p>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A to Z</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
