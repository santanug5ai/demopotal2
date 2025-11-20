import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/services/dataService'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Initialize filters from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const tagParam = searchParams.get('tag')

    if (categoryParam) {
      setSelectedCategories([categoryParam])
    }
    if (tagParam) {
      setSelectedTags([tagParam])
    }
  }, [searchParams])

  // Get filtered products
  const { data: products, pagination } = getProducts({
    limit: 100,
    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    tag: selectedTags.length > 0 ? selectedTags[0] : undefined
  })

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [category] // Only one category at a time

    setSelectedCategories(newCategories)

    // Update URL
    const params = new URLSearchParams(searchParams)
    if (newCategories.length > 0) {
      params.set('category', newCategories[0])
    } else {
      params.delete('category')
    }
    setSearchParams(params)
  }

  const handleTagChange = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [tag] // Only one tag at a time

    setSelectedTags(newTags)

    // Update URL
    const params = new URLSearchParams(searchParams)
    if (newTags.length > 0) {
      params.set('tag', newTags[0])
    } else {
      params.delete('tag')
    }
    setSearchParams(params)
  }

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
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes('laptops')}
                    onChange={() => handleCategoryChange('laptops')}
                  />
                  <span className="text-sm">Laptops</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes('smartphones')}
                    onChange={() => handleCategoryChange('smartphones')}
                  />
                  <span className="text-sm">Smartphones</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes('accessories')}
                    onChange={() => handleCategoryChange('accessories')}
                  />
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
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedTags.includes('new')}
                    onChange={() => handleTagChange('new')}
                  />
                  <span className="text-sm">New Arrivals</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedTags.includes('sale')}
                    onChange={() => handleTagChange('sale')}
                  />
                  <span className="text-sm">On Sale</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedTags.includes('featured')}
                    onChange={() => handleTagChange('featured')}
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedTags.includes('popular')}
                    onChange={() => handleTagChange('popular')}
                  />
                  <span className="text-sm">Popular</span>
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
              Showing {pagination.total} products
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
