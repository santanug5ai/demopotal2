// Static data service - reads from local .toon format file
import catalogData from '../data/catalog.json';

// Transform .toon format to our frontend format
const transformProduct = (product) => ({
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
  },
  images: product.images,
  variants: product.variants,
  attributes: product.attributes,
  status: product.status,
  tags: product.tags,
  ratingAverage: 4.5, // Mock rating
  ratingCount: Math.floor(Math.random() * 200) + 50, // Mock count
});

// Get all products with filtering and pagination
export const getProducts = ({ page = 1, limit = 20, status = 'active', category, tag } = {}) => {
  let products = catalogData.products || [];

  // Filter by status
  if (status) {
    products = products.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  // Filter by category
  if (category) {
    products = products.filter(p =>
      p.category_ids && p.category_ids.some(catId => {
        const cat = catalogData.categories?.find(c => c.id === catId);
        return cat?.slug === category;
      })
    );
  }

  // Filter by tag
  if (tag) {
    products = products.filter(p => p.tags && p.tags.includes(tag));
  }

  // Transform products
  const transformedProducts = products.map(transformProduct);

  // Pagination
  const skip = (page - 1) * limit;
  const paginatedProducts = transformedProducts.slice(skip, skip + limit);

  return {
    data: paginatedProducts,
    pagination: {
      total: transformedProducts.length,
      skip,
      take: limit,
      page,
      pages: Math.ceil(transformedProducts.length / limit),
    },
  };
};

// Get product by slug
export const getProductBySlug = (slug) => {
  const product = catalogData.products.find(p => p.slug === slug);
  if (!product) return null;
  return transformProduct(product);
};

// Get product by ID
export const getProductById = (id) => {
  const product = catalogData.products.find(p => p.id === id);
  if (!product) return null;
  return transformProduct(product);
};

// Get all categories
export const getCategories = () => {
  return catalogData.categories || [];
};

// Get all collections
export const getCollections = () => {
  return catalogData.collections || [];
};

// Export the catalog data
export const getCatalog = () => catalogData;
