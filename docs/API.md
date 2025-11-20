# API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## Interactive Documentation

When the server is running, access the full Swagger API documentation at:

```
http://localhost:3000/api/docs
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Headers

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-20T00:00:00.000Z",
  "service": "E-Commerce Marketplace API",
  "version": "1.0.0"
}
```

---

### Products

#### GET /products

Get all products with pagination and filtering.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `status` (string, optional): Filter by status (active, draft, archived)
- `category` (string, optional): Filter by category slug
- `tag` (string, optional): Filter by tag

**Response:**
```json
{
  "data": [
    {
      "id": "prod_123",
      "sku": "LAPTOP-001",
      "name": "Professional Laptop",
      "slug": "professional-laptop",
      "price": 1299.99,
      "images": [...],
      "status": "ACTIVE"
    }
  ],
  "pagination": {
    "total": 156,
    "skip": 0,
    "take": 20
  }
}
```

#### GET /products/:id

Get product by ID.

**Response:**
```json
{
  "id": "prod_123",
  "sku": "LAPTOP-001",
  "name": "Professional Laptop",
  "description": "...",
  "price": 1299.99,
  "images": [...],
  "variants": [...],
  "reviews": [...]
}
```

#### GET /products/slug/:slug

Get product by slug.

---

### .toon Format

#### POST /toon/validate

Validate .toon format data.

**Request Body:**
```json
{
  "version": "1.0",
  "metadata": {...},
  "products": [...]
}
```

**Response:**
```json
{
  "valid": true,
  "errors": []
}
```

#### POST /toon/import

Import products from .toon file.

**Content-Type:** `multipart/form-data` or `application/json`

**Form Data:**
- `file`: .toon file (multipart)
- `vendorId`: Vendor ID (optional)

**Response:**
```json
{
  "message": "Import completed",
  "imported": 10,
  "skipped": 0,
  "errors": []
}
```

#### GET /toon/export

Export products to .toon format.

**Query Parameters:**
- `vendorId` (string, optional): Filter by vendor

**Response:** .toon format JSON

---

### Cart

#### GET /cart

Get current user's cart.

#### POST /cart/items

Add item to cart.

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 2
}
```

#### PUT /cart/items/:id

Update cart item quantity.

#### DELETE /cart/items/:id

Remove item from cart.

---

### Orders

#### GET /orders

Get user's orders.

#### GET /orders/:id

Get order details.

#### POST /orders

Create new order (checkout).

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [...]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Support

For API support, please open an issue on GitHub.
