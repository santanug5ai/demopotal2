import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, Heart, Truck, ShieldCheck, ArrowLeft, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getProductBySlug, getProducts } from '@/services/dataService'
import { formatPrice } from '@/lib/utils'
import ProductCard from '@/components/products/ProductCard'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductBySlug(slug) : null

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/products">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  const currentPrice = selectedVariant?.price?.amount || product.price.amount
  const hasDiscount = product.price.compareAt && product.price.compareAt > product.price.amount

  // Get related products (same category or tags)
  const { data: relatedProducts } = getProducts({ limit: 4 })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border-2 border-gray-200">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt}
                className="w-full h-full object-cover"
              />
              {product.tags.includes('sale') && hasDiscount && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Save {Math.round(((product.price.compareAt! - product.price.amount) / product.price.compareAt!) * 100)}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="flex gap-2">
              {product.tags.includes('new') && <Badge>New Arrival</Badge>}
              {product.tags.includes('featured') && <Badge variant="secondary">Featured</Badge>}
              {product.tags.includes('popular') && <Badge variant="secondary">Popular</Badge>}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.shortDescription}</p>
            </div>

            {/* Rating */}
            {product.ratingAverage && (
              <div className="flex items-center gap-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratingAverage!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.ratingAverage} ({product.ratingCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(currentPrice, product.price.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(product.price.compareAt!, product.price.currency)}
                  </span>
                )}
              </div>
              {product.inventory.inStock ? (
                <p className="text-green-600 font-medium flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  In Stock - Ready to ship
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Available Options:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{variant.options.color}</div>
                      <div className="text-sm text-gray-600">{variant.options.storage}</div>
                      <div className="text-sm font-semibold text-primary mt-1">
                        {formatPrice(variant.price.amount, product.price.currency)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.inventory.quantity} units available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={!product.inventory.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Warranty</p>
                  <p className="text-sm text-gray-600">{product.attributes?.warranty || '1 year'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <Card>
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex border-b border-gray-200 pb-3">
                        <span className="font-semibold text-gray-700 w-1/2 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-600 w-1/2">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU and Categories */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex gap-8 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">SKU: </span>
                    <span className="text-gray-600">{product.sku}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Tags: </span>
                    <span className="text-gray-600">{product.tags.join(', ')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
