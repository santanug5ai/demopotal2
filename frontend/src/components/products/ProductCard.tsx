import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
  const hasDiscount = product.price.compareAt && product.price.compareAt > product.price.amount

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={primaryImage?.url}
            alt={primaryImage?.alt || product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.tags.includes('new') && (
              <Badge variant="default">New</Badge>
            )}
            {product.tags.includes('sale') && (
              <Badge variant="destructive">Sale</Badge>
            )}
            {product.tags.includes('featured') && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button className="absolute right-2 top-2 rounded-full bg-white p-2 opacity-0 shadow-md transition-opacity hover:bg-gray-50 group-hover:opacity-100">
            <Heart className="h-4 w-4" />
          </button>

          {/* Quick View on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white/95 p-4 transition-transform group-hover:translate-y-0">
            <p className="line-clamp-2 text-sm text-gray-600">
              {product.shortDescription || product.description}
            </p>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="mb-1 font-semibold text-gray-900 line-clamp-1 hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratingAverage && (
          <div className="mb-2 flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.ratingAverage!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.ratingCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price.amount, product.price.currency)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price.compareAt!, product.price.currency)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.inventory.inStock ? (
            <span className="text-xs text-green-600">In Stock</span>
          ) : (
            <span className="text-xs text-red-600">Out of Stock</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!product.inventory.inStock}
          onClick={(e) => {
            e.preventDefault()
            // Add to cart logic
            console.log('Add to cart:', product.id)
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
