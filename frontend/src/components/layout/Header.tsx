import { Link } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
              <span className="text-lg font-bold">E</span>
            </div>
            <span className="text-xl font-bold">MarketPlace</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 px-8 md:block">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  0
                </span>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden border-t py-3 md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link to="/products" className="font-medium hover:text-primary">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/products?category=laptops" className="hover:text-primary">
                Laptops
              </Link>
            </li>
            <li>
              <Link to="/products?category=smartphones" className="hover:text-primary">
                Smartphones
              </Link>
            </li>
            <li>
              <Link to="/products?category=accessories" className="hover:text-primary">
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/products?tag=sale" className="text-red-600 hover:text-red-700">
                Sale
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
