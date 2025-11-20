# .toon Format Documentation

## Overview

The `.toon` format is a structured JSON format designed specifically for e-commerce product catalogs and marketplace data. It provides a comprehensive way to define products, categories, variants, and collections in a standardized format.

## File Extension

`.toon` files are JSON files with the `.toon` extension.

## Structure

### Root Level

```json
{
  "version": "string",
  "metadata": {},
  "categories": [],
  "products": [],
  "collections": []
}
```

### Metadata

```json
{
  "catalog_id": "unique-identifier",
  "catalog_name": "Catalog Name",
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime",
  "vendor": {
    "id": "vendor-id",
    "name": "Vendor Name",
    "contact": "email@example.com"
  }
}
```

### Products

Each product in the `products` array must include:

**Required Fields:**
- `id`: Unique product identifier
- `sku`: Stock keeping unit (must be unique)
- `name`: Product name
- `slug`: URL-friendly identifier
- `description`: Full product description
- `price`: Price object with `amount` and `currency`
- `inventory`: Inventory object
- `status`: One of `active`, `draft`, `archived`
- `images`: Array of image objects

**Optional Fields:**
- `short_description`: Brief product description
- `category_ids`: Array of category IDs
- `variants`: Product variants
- `attributes`: Custom attributes
- `seo`: SEO metadata
- `tags`: Product tags

### Categories

```json
{
  "id": "cat-id",
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Category description",
  "parent_id": "parent-cat-id or null"
}
```

### Collections

Collections group products together based on rules or manual selection:

```json
{
  "id": "collection-id",
  "name": "Collection Name",
  "slug": "collection-slug",
  "description": "Collection description",
  "product_ids": ["prod-1", "prod-2"],
  "rules": {}
}
```

## Validation Rules

1. **Version**: Must be present (currently "1.0")
2. **Product IDs**: Must be unique within the catalog
3. **SKUs**: Must be unique across all products and variants
4. **Price**: Must be a positive number
5. **Currency**: ISO 4217 code (e.g., USD, EUR, GBP)
6. **Status**: Must be one of: `active`, `draft`, `archived`
7. **Images**: At least one image must be marked as `is_primary`

## Example

See `/data/sample-catalog.toon` for a complete example.

## API Integration

### Import

```bash
POST /api/v1/toon/import
Content-Type: multipart/form-data

file: catalog.toon
```

### Export

```bash
GET /api/v1/toon/export?vendorId={vendorId}
```

### Validate

```bash
POST /api/v1/toon/validate
Content-Type: application/json

{
  "version": "1.0",
  "metadata": {...},
  "products": [...]
}
```

## Best Practices

1. **Unique SKUs**: Always ensure SKUs are unique
2. **Image URLs**: Use absolute URLs with HTTPS
3. **Descriptions**: Provide both short and full descriptions
4. **SEO**: Always include SEO metadata for better discoverability
5. **Inventory**: Keep inventory quantities updated
6. **Categories**: Use meaningful category slugs
7. **Variants**: Define variants for products with options (size, color, etc.)
8. **Validation**: Always validate before importing

## Version History

- **v1.0** (2025-11-20): Initial format specification
