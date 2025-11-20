import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types/product'

// Mock data - will be replaced with API call
const featuredProducts: Product[] = [
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
    tags: ['new', 'featured', '5g'],
    ratingAverage: 4.8,
    ratingCount: 256,
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-5xl font-bold">
              Welcome to Your E-Commerce Marketplace
            </h1>
            <p className="mb-8 text-xl text-white/90">
              Discover amazing products with our .toon format integration.
              Professional quality, unbeatable prices.
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-600">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-gray-600">Check out our top picks</p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Shopping?</h2>
          <p className="mb-8 text-gray-600">
            Browse our full catalog of premium products
          </p>
          <Link to="/products">
            <Button size="lg">
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
