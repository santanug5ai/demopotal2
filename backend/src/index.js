import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data file path
const DATA_DIR = join(__dirname, '../../data');
const CATALOG_FILE = join(DATA_DIR, 'sample-catalog.toon');

// Helper function to read .toon file
async function readToonFile() {
  try {
    const data = await fs.readFile(CATALOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading .toon file:', error);
    return null;
  }
}

// Helper function to write .toon file
async function writeToonFile(data) {
  try {
    await fs.writeFile(CATALOG_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing .toon file:', error);
    return false;
  }
}

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'E-Commerce Marketplace API (File-based)',
    version: '1.0.0',
  });
});

// Get all products
app.get('/api/v1/products', async (req, res) => {
  try {
    const catalog = await readToonFile();
    if (!catalog) {
      return res.status(500).json({ error: 'Failed to read catalog' });
    }

    const { page = 1, limit = 20, status = 'active', category, tag } = req.query;
    let products = catalog.products || [];

    // Filter by status
    if (status) {
      products = products.filter(p => p.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by category
    if (category) {
      products = products.filter(p =>
        p.category_ids && p.category_ids.some(catId => {
          const cat = catalog.categories?.find(c => c.id === catId);
          return cat?.slug === category;
        })
      );
    }

    // Filter by tag
    if (tag) {
      products = products.filter(p => p.tags && p.tags.includes(tag));
    }

    // Transform to API format
    const transformedProducts = products.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.short_description,
      price: {
        amount: p.price.amount,
        currency: p.price.currency,
        compareAt: p.price.compare_at,
      },
      inventory: {
        quantity: p.inventory.quantity,
        inStock: p.inventory.quantity > 0,
      },
      images: p.images,
      status: p.status,
      tags: p.tags,
      ratingAverage: p.rating_average,
      ratingCount: p.rating_count || 0,
    }));

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const paginatedProducts = transformedProducts.slice(skip, skip + limitNum);

    res.json({
      data: paginatedProducts,
      pagination: {
        total: transformedProducts.length,
        skip,
        take: limitNum,
        page: pageNum,
        pages: Math.ceil(transformedProducts.length / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by slug
app.get('/api/v1/products/slug/:slug', async (req, res) => {
  try {
    const catalog = await readToonFile();
    if (!catalog) {
      return res.status(500).json({ error: 'Failed to read catalog' });
    }

    const product = catalog.products.find(p => p.slug === req.params.slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform to API format
    const transformedProduct = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      price: {
        amount: product.price.amount,
        currency: product.price.currency,
        compareAt: product.price.compare_at,
      },
      inventory: {
        quantity: product.inventory.quantity,
        inStock: product.inventory.quantity > 0,
        trackInventory: product.inventory.track_inventory,
        allowBackorder: product.inventory.allow_backorder,
      },
      images: product.images,
      variants: product.variants,
      attributes: product.attributes,
      seo: product.seo,
      status: product.status,
      tags: product.tags,
      ratingAverage: product.rating_average,
      ratingCount: product.rating_count || 0,
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
app.get('/api/v1/products/:id', async (req, res) => {
  try {
    const catalog = await readToonFile();
    if (!catalog) {
      return res.status(500).json({ error: 'Failed to read catalog' });
    }

    const product = catalog.products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform to API format (same as slug endpoint)
    const transformedProduct = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      price: {
        amount: product.price.amount,
        currency: product.price.currency,
        compareAt: product.price.compare_at,
      },
      inventory: {
        quantity: product.inventory.quantity,
        inStock: product.inventory.quantity > 0,
        trackInventory: product.inventory.track_inventory,
        allowBackorder: product.inventory.allow_backorder,
      },
      images: product.images,
      variants: product.variants,
      attributes: product.attributes,
      seo: product.seo,
      status: product.status,
      tags: product.tags,
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
app.get('/api/v1/categories', async (req, res) => {
  try {
    const catalog = await readToonFile();
    if (!catalog) {
      return res.status(500).json({ error: 'Failed to read catalog' });
    }

    res.json({ data: catalog.categories || [] });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all collections
app.get('/api/v1/collections', async (req, res) => {
  try {
    const catalog = await readToonFile();
    if (!catalog) {
      return res.status(500).json({ error: 'Failed to read catalog' });
    }

    res.json({ data: catalog.collections || [] });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate .toon file
app.post('/api/v1/toon/validate', async (req, res) => {
  const data = req.body;
  const errors = [];

  if (!data.version) errors.push('Missing required field: version');
  if (!data.metadata) errors.push('Missing required field: metadata');
  if (!data.products || !Array.isArray(data.products)) {
    errors.push('Missing or invalid field: products (must be an array)');
  }

  res.json({
    valid: errors.length === 0,
    errors,
  });
});

// Export catalog to .toon format
app.get('/api/v1/toon/export', async (req, res) => {
  try {
    const catalog = await readToonFile();
    if (!catalog) {
      return res.status(500).json({ error: 'Failed to read catalog' });
    }

    res.json(catalog);
  } catch (error) {
    console.error('Error exporting catalog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/v1/products`);
});
