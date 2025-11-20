# E-Commerce Marketplace Specification
## .toon Format Data Source Integration

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2025-11-20

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [.toon Format Specification](#toon-format-specification)
3. [System Architecture](#system-architecture)
4. [Technical Stack](#technical-stack)
5. [Data Models](#data-models)
6. [API Specifications](#api-specifications)
7. [UI/UX Specifications](#uiux-specifications)
8. [Security Requirements](#security-requirements)
9. [Performance Requirements](#performance-requirements)
10. [Implementation Roadmap](#implementation-roadmap)

---

## 1. Executive Summary

This document specifies the development of a modern e-commerce marketplace platform that utilizes the `.toon` format as its primary data source. The platform will provide a professional, robust GUI for browsing products, managing inventory, processing orders, and handling user accounts.

### Key Features

- **Multi-vendor marketplace** support
- **.toon format** integration for product catalogs
- **Real-time inventory** management
- **Advanced search and filtering**
- **Responsive, professional UI**
- **Secure payment processing**
- **Order tracking and management**
- **Admin dashboard**

---

## 2. .toon Format Specification

### 2.1 Format Overview

The `.toon` format is a structured data format designed for e-commerce product catalogs and marketplace data. It supports hierarchical organization, metadata, and relationships between entities.

### 2.2 File Structure

```json
{
  "version": "1.0",
  "metadata": {
    "catalog_id": "string",
    "catalog_name": "string",
    "created_at": "ISO 8601 datetime",
    "updated_at": "ISO 8601 datetime",
    "vendor": {
      "id": "string",
      "name": "string",
      "contact": "string"
    }
  },
  "categories": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "parent_id": "string | null",
      "attributes": {}
    }
  ],
  "products": [
    {
      "id": "string",
      "sku": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "short_description": "string",
      "category_ids": ["string"],
      "price": {
        "amount": "number",
        "currency": "string",
        "compare_at": "number | null"
      },
      "inventory": {
        "quantity": "number",
        "track_inventory": "boolean",
        "allow_backorder": "boolean"
      },
      "images": [
        {
          "url": "string",
          "alt": "string",
          "position": "number",
          "is_primary": "boolean"
        }
      ],
      "variants": [
        {
          "id": "string",
          "sku": "string",
          "options": {
            "size": "string",
            "color": "string"
          },
          "price": {},
          "inventory": {}
        }
      ],
      "attributes": {
        "brand": "string",
        "material": "string",
        "weight": "string",
        "dimensions": {}
      },
      "seo": {
        "title": "string",
        "description": "string",
        "keywords": ["string"]
      },
      "status": "active | draft | archived",
      "tags": ["string"]
    }
  ],
  "collections": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "product_ids": ["string"],
      "rules": {}
    }
  ]
}
```

### 2.3 Validation Rules

1. **Required Fields**: `version`, `metadata`, `products`
2. **Product ID**: Must be unique within catalog
3. **SKU**: Must be unique across all products and variants
4. **Price**: Must be positive number
5. **Currency**: ISO 4217 code (USD, EUR, GBP, etc.)
6. **Status**: One of `active`, `draft`, `archived`
7. **Images**: At least one image must be marked as `is_primary`

### 2.4 File Operations

- **Import**: Parse .toon files and populate database
- **Export**: Generate .toon files from database
- **Sync**: Periodic synchronization with external .toon sources
- **Validation**: Schema validation before import

---

## 3. System Architecture

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend Layer                       │
│  (React + TypeScript + Tailwind CSS + shadcn/ui)       │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ REST API / GraphQL
                  │
┌─────────────────▼───────────────────────────────────────┐
│                    Backend Layer                         │
│            (Node.js + Express/NestJS)                   │
│  ┌──────────────┬──────────────┬──────────────┐        │
│  │ Auth Service │ Product Svc  │ Order Service│        │
│  └──────────────┴──────────────┴──────────────┘        │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                   Data Layer                             │
│  ┌──────────────┬──────────────┬──────────────┐        │
│  │ PostgreSQL   │ Redis Cache  │ S3/CDN       │        │
│  └──────────────┴──────────────┴──────────────┘        │
└──────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              .toon Parser Service                        │
│         (File watcher + Validator + Importer)           │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Component Architecture

**Frontend Components:**
- Product Catalog Browser
- Product Detail View
- Shopping Cart
- Checkout Flow
- User Dashboard
- Admin Panel
- Vendor Dashboard

**Backend Services:**
- Authentication & Authorization
- Product Management
- Order Processing
- Payment Gateway Integration
- Inventory Management
- Search & Filtering
- Analytics & Reporting

---

## 4. Technical Stack

### 4.1 Frontend

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: Zustand or Redux Toolkit
- **API Client**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts or Chart.js

### 4.2 Backend

- **Runtime**: Node.js 20+
- **Framework**: NestJS (modular, scalable architecture)
- **Language**: TypeScript
- **API**: REST + GraphQL (optional)
- **ORM**: Prisma or TypeORM
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator, class-transformer
- **File Processing**: Custom .toon parser

### 4.3 Database & Storage

- **Primary Database**: PostgreSQL 15+
- **Cache**: Redis
- **File Storage**: AWS S3 or compatible (MinIO)
- **Search Engine**: Elasticsearch or Meilisearch
- **CDN**: CloudFront or Cloudflare

### 4.4 DevOps & Tools

- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose
- **Testing**: Jest, Vitest, Playwright
- **Code Quality**: ESLint, Prettier
- **Documentation**: Swagger/OpenAPI, Storybook

---

## 5. Data Models

### 5.1 Core Entities

#### User
```typescript
interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'customer' | 'vendor' | 'admin';
  phone?: string;
  avatar_url?: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
```

#### Product
```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  vendor_id: string;
  category_ids: string[];
  base_price: number;
  currency: string;
  compare_at_price?: number;
  cost_price?: number;
  inventory_quantity: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  status: 'active' | 'draft' | 'archived';
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: Record<string, any>;
  seo: SEOMetadata;
  tags: string[];
  rating_average?: number;
  rating_count: number;
  created_at: Date;
  updated_at: Date;
}
```

#### Order
```typescript
interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  total: number;
  currency: string;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
```

#### Cart
```typescript
interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  items: CartItem[];
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}
```

### 5.2 Relationships

- User → Orders (one-to-many)
- User → Cart (one-to-one)
- User → Reviews (one-to-many)
- Product → Category (many-to-many)
- Product → Variants (one-to-many)
- Order → OrderItems (one-to-many)
- Vendor → Products (one-to-many)

---

## 6. API Specifications

### 6.1 REST API Endpoints

#### Products

```
GET    /api/v1/products              - List products (with pagination, filters)
GET    /api/v1/products/:id          - Get product details
POST   /api/v1/products              - Create product (vendor/admin)
PUT    /api/v1/products/:id          - Update product (vendor/admin)
DELETE /api/v1/products/:id          - Delete product (vendor/admin)
GET    /api/v1/products/search       - Search products
```

#### Cart

```
GET    /api/v1/cart                  - Get current cart
POST   /api/v1/cart/items            - Add item to cart
PUT    /api/v1/cart/items/:id        - Update cart item quantity
DELETE /api/v1/cart/items/:id        - Remove item from cart
DELETE /api/v1/cart                  - Clear cart
```

#### Orders

```
GET    /api/v1/orders                - List user orders
GET    /api/v1/orders/:id            - Get order details
POST   /api/v1/orders                - Create order (checkout)
PUT    /api/v1/orders/:id/cancel     - Cancel order
GET    /api/v1/orders/:id/track      - Track order
```

#### Auth

```
POST   /api/v1/auth/register         - Register new user
POST   /api/v1/auth/login            - Login
POST   /api/v1/auth/logout           - Logout
POST   /api/v1/auth/refresh          - Refresh token
POST   /api/v1/auth/forgot-password  - Request password reset
POST   /api/v1/auth/reset-password   - Reset password
```

#### .toon Integration

```
POST   /api/v1/toon/import           - Import .toon file
GET    /api/v1/toon/export           - Export to .toon format
POST   /api/v1/toon/validate         - Validate .toon file
GET    /api/v1/toon/sync-status      - Get sync status
```

### 6.2 Request/Response Examples

#### GET /api/v1/products

**Query Parameters:**
```
page=1
limit=20
category=electronics
min_price=0
max_price=1000
sort=price_asc|price_desc|name_asc|name_desc|newest
status=active
```

**Response:**
```json
{
  "data": [
    {
      "id": "prod_123",
      "sku": "LAPTOP-001",
      "name": "Professional Laptop",
      "slug": "professional-laptop",
      "short_description": "High-performance laptop for professionals",
      "price": {
        "amount": 1299.99,
        "currency": "USD",
        "compare_at": 1499.99
      },
      "images": [
        {
          "url": "https://cdn.example.com/laptop-001.jpg",
          "alt": "Professional Laptop",
          "is_primary": true
        }
      ],
      "status": "active",
      "inventory": {
        "quantity": 50,
        "in_stock": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

---

## 7. UI/UX Specifications

### 7.1 Design Principles

1. **Clean & Modern**: Minimalist design with focus on products
2. **Responsive**: Mobile-first approach
3. **Accessible**: WCAG 2.1 AA compliance
4. **Fast**: Optimized for performance
5. **Intuitive**: Clear navigation and user flows

### 7.2 Color Palette

```
Primary:    #2563EB (Blue)
Secondary:  #7C3AED (Purple)
Success:    #10B981 (Green)
Warning:    #F59E0B (Amber)
Error:      #EF4444 (Red)
Neutral:    #6B7280 (Gray)
Background: #FFFFFF (White)
Surface:    #F9FAFB (Light Gray)
Text:       #111827 (Dark Gray)
```

### 7.3 Typography

```
Font Family:  Inter (system font fallback)
Headings:     Bold, 24-40px
Body:         Regular, 14-16px
Small:        Regular, 12-14px
Line Height:  1.5
```

### 7.4 Key UI Components

#### Product Card
- Product image (with hover zoom)
- Product name
- Price (with compare-at price if available)
- Rating stars
- Quick add to cart button
- Wishlist icon
- Badge for sale/new items

#### Product Detail Page
- Image gallery (main + thumbnails)
- Product title and SKU
- Price and availability
- Quantity selector
- Add to cart button
- Product description tabs (Description, Specifications, Reviews)
- Related products
- Breadcrumb navigation

#### Shopping Cart
- Cart items list (image, name, price, quantity)
- Quantity updater
- Remove item button
- Subtotal calculation
- Proceed to checkout button
- Continue shopping link

#### Checkout Flow
1. Cart review
2. Shipping information
3. Payment method
4. Order confirmation

#### Admin Dashboard
- Overview metrics (sales, orders, products)
- Recent orders table
- Low stock alerts
- Quick actions
- Analytics charts

### 7.5 Responsive Breakpoints

```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
Wide:     > 1536px
```

---

## 8. Security Requirements

### 8.1 Authentication & Authorization

- **Password Policy**: Minimum 8 characters, mix of letters, numbers, symbols
- **Token Expiration**: Access token (15 min), Refresh token (7 days)
- **Multi-Factor Authentication**: Optional for users, required for admin
- **Role-Based Access Control**: Customer, Vendor, Admin roles

### 8.2 Data Security

- **Encryption at Rest**: Database encryption enabled
- **Encryption in Transit**: TLS 1.3 for all API calls
- **Password Hashing**: bcrypt with salt rounds ≥ 10
- **API Rate Limiting**: 100 requests per minute per IP
- **Input Validation**: Sanitize all user inputs
- **SQL Injection Prevention**: Use parameterized queries/ORM
- **XSS Prevention**: Content Security Policy headers

### 8.3 Payment Security

- **PCI DSS Compliance**: Use certified payment gateway
- **No Card Storage**: Never store full card numbers
- **Tokenization**: Use payment tokens for recurring charges
- **3D Secure**: Support for enhanced authentication

### 8.4 File Upload Security

- **File Type Validation**: Whitelist allowed MIME types
- **File Size Limits**: Max 5MB per image, 10MB per .toon file
- **Virus Scanning**: Scan uploaded files
- **Secure Storage**: Store files in isolated storage

---

## 9. Performance Requirements

### 9.1 Response Time Targets

- **Homepage Load**: < 1.5 seconds
- **Product Listing**: < 2 seconds
- **Product Detail**: < 1 second
- **Search Results**: < 1 second
- **API Response**: < 200ms (p95)
- **Checkout Process**: < 3 seconds per step

### 9.2 Optimization Strategies

1. **Frontend**
   - Code splitting and lazy loading
   - Image optimization (WebP format, lazy loading)
   - CDN for static assets
   - Service worker for caching
   - Debounced search input

2. **Backend**
   - Database query optimization
   - Redis caching for frequently accessed data
   - Connection pooling
   - Async processing for heavy tasks
   - Rate limiting

3. **Database**
   - Proper indexing on frequently queried fields
   - Query optimization
   - Read replicas for scaling
   - Pagination for large datasets

### 9.3 Scalability

- **Horizontal Scaling**: Support for multiple backend instances
- **Load Balancing**: Distribute traffic across instances
- **Caching Strategy**: Multi-layer caching (CDN, Redis, browser)
- **Database Scaling**: Master-replica setup
- **Queue System**: Bull/BullMQ for background jobs

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Project setup and boilerplate
- [ ] Database schema design
- [ ] .toon format parser implementation
- [ ] Basic API structure
- [ ] Authentication system
- [ ] Frontend project setup with component library

### Phase 2: Core Features (Weeks 3-5)

- [ ] Product catalog implementation
- [ ] Product detail pages
- [ ] Search and filtering
- [ ] Shopping cart functionality
- [ ] User profile management
- [ ] Category management

### Phase 3: Commerce Features (Weeks 6-8)

- [ ] Checkout flow
- [ ] Payment gateway integration
- [ ] Order management
- [ ] Email notifications
- [ ] Invoice generation
- [ ] Order tracking

### Phase 4: Vendor & Admin (Weeks 9-10)

- [ ] Vendor dashboard
- [ ] Product management UI
- [ ] Inventory management
- [ ] Admin panel
- [ ] Analytics and reporting
- [ ] Bulk operations

### Phase 5: Enhancement (Weeks 11-12)

- [ ] Reviews and ratings
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Advanced search (Elasticsearch)
- [ ] Multi-language support
- [ ] Performance optimization

### Phase 6: Testing & Launch (Weeks 13-14)

- [ ] Comprehensive testing (unit, integration, e2e)
- [ ] Security audit
- [ ] Performance testing
- [ ] Bug fixes
- [ ] Documentation
- [ ] Deployment and launch

---

## Appendix

### A. Glossary

- **SKU**: Stock Keeping Unit - unique product identifier
- **Variant**: Product variation (e.g., size, color)
- **.toon Format**: Custom catalog data format for this platform
- **JWT**: JSON Web Token for authentication

### B. References

- [Stripe API Documentation](https://stripe.com/docs/api)
- [REST API Best Practices](https://restfulapi.net/)
- [React Documentation](https://react.dev/)
- [NestJS Documentation](https://docs.nestjs.com/)

### C. Change Log

- **v1.0.0** (2025-11-20): Initial specification document

---

**Document Prepared By**: Claude AI Development Assistant
**Document Status**: Ready for Implementation
