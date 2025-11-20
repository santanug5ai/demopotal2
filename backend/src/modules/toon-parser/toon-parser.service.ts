import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ToonFormat {
  version: string;
  metadata: {
    catalog_id: string;
    catalog_name: string;
    created_at: string;
    updated_at: string;
    vendor?: {
      id: string;
      name: string;
      contact: string;
    };
  };
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    parent_id?: string | null;
    attributes?: Record<string, any>;
  }>;
  products: Array<{
    id: string;
    sku: string;
    name: string;
    slug: string;
    description: string;
    short_description?: string;
    category_ids: string[];
    price: {
      amount: number;
      currency: string;
      compare_at?: number | null;
    };
    inventory: {
      quantity: number;
      track_inventory: boolean;
      allow_backorder: boolean;
    };
    images: Array<{
      url: string;
      alt: string;
      position: number;
      is_primary: boolean;
    }>;
    variants?: Array<{
      id: string;
      sku: string;
      options: Record<string, string>;
      price: { amount: number; currency: string };
      inventory: { quantity: number };
    }>;
    attributes?: Record<string, any>;
    seo?: {
      title: string;
      description: string;
      keywords: string[];
    };
    status: 'active' | 'draft' | 'archived';
    tags: string[];
  }>;
  collections?: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    product_ids: string[];
    rules?: Record<string, any>;
  }>;
}

@Injectable()
export class ToonParserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validate .toon format file
   */
  validateToonFormat(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.version) {
      errors.push('Missing required field: version');
    }

    if (!data.metadata) {
      errors.push('Missing required field: metadata');
    } else {
      if (!data.metadata.catalog_id) {
        errors.push('Missing required field: metadata.catalog_id');
      }
      if (!data.metadata.catalog_name) {
        errors.push('Missing required field: metadata.catalog_name');
      }
    }

    if (!data.products || !Array.isArray(data.products)) {
      errors.push('Missing or invalid field: products (must be an array)');
    } else {
      data.products.forEach((product: any, index: number) => {
        if (!product.id) errors.push(`Product ${index}: missing id`);
        if (!product.sku) errors.push(`Product ${index}: missing sku`);
        if (!product.name) errors.push(`Product ${index}: missing name`);
        if (!product.slug) errors.push(`Product ${index}: missing slug`);
        if (!product.price?.amount)
          errors.push(`Product ${index}: missing price.amount`);
        if (!product.price?.currency)
          errors.push(`Product ${index}: missing price.currency`);
        if (!product.status)
          errors.push(`Product ${index}: missing status`);
        if (!['active', 'draft', 'archived'].includes(product.status))
          errors.push(
            `Product ${index}: invalid status (must be active, draft, or archived)`,
          );
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Parse and import .toon format file
   */
  async importToonFile(
    data: ToonFormat,
    vendorId: string,
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const validation = this.validateToonFormat(data);
    if (!validation.valid) {
      throw new BadRequestException({
        message: 'Invalid .toon format',
        errors: validation.errors,
      });
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Import categories first
    if (data.categories && data.categories.length > 0) {
      for (const category of data.categories) {
        try {
          await this.prisma.category.upsert({
            where: { slug: category.slug },
            update: {
              name: category.name,
              description: category.description,
              parentId: category.parent_id,
            },
            create: {
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
              parentId: category.parent_id,
            },
          });
        } catch (error) {
          errors.push(`Category ${category.slug}: ${error.message}`);
        }
      }
    }

    // Import products
    for (const product of data.products) {
      try {
        // Create or update product
        const createdProduct = await this.prisma.product.upsert({
          where: { sku: product.sku },
          update: {
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.short_description,
            basePrice: product.price.amount,
            currency: product.price.currency,
            compareAtPrice: product.price.compare_at,
            inventoryQty: product.inventory.quantity,
            trackInventory: product.inventory.track_inventory,
            allowBackorder: product.inventory.allow_backorder,
            status: product.status.toUpperCase() as any,
            attributes: product.attributes || {},
            seoTitle: product.seo?.title,
            seoDescription: product.seo?.description,
            seoKeywords: product.seo?.keywords || [],
            tags: product.tags,
          },
          create: {
            id: product.id,
            sku: product.sku,
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.short_description,
            vendorId,
            basePrice: product.price.amount,
            currency: product.price.currency,
            compareAtPrice: product.price.compare_at,
            inventoryQty: product.inventory.quantity,
            trackInventory: product.inventory.track_inventory,
            allowBackorder: product.inventory.allow_backorder,
            status: product.status.toUpperCase() as any,
            attributes: product.attributes || {},
            seoTitle: product.seo?.title,
            seoDescription: product.seo?.description,
            seoKeywords: product.seo?.keywords || [],
            tags: product.tags,
          },
        });

        // Import product images
        if (product.images && product.images.length > 0) {
          // Delete existing images
          await this.prisma.productImage.deleteMany({
            where: { productId: createdProduct.id },
          });

          // Create new images
          for (const image of product.images) {
            await this.prisma.productImage.create({
              data: {
                productId: createdProduct.id,
                url: image.url,
                alt: image.alt,
                position: image.position,
                isPrimary: image.is_primary,
              },
            });
          }
        }

        // Import product variants
        if (product.variants && product.variants.length > 0) {
          for (const variant of product.variants) {
            await this.prisma.productVariant.upsert({
              where: { sku: variant.sku },
              update: {
                options: variant.options,
                price: variant.price.amount,
                inventoryQty: variant.inventory.quantity,
              },
              create: {
                id: variant.id,
                productId: createdProduct.id,
                sku: variant.sku,
                options: variant.options,
                price: variant.price.amount,
                inventoryQty: variant.inventory.quantity,
              },
            });
          }
        }

        imported++;
      } catch (error) {
        errors.push(`Product ${product.sku}: ${error.message}`);
        skipped++;
      }
    }

    return { imported, skipped, errors };
  }

  /**
   * Export products to .toon format
   */
  async exportToToonFormat(vendorId?: string): Promise<ToonFormat> {
    const products = await this.prisma.product.findMany({
      where: vendorId ? { vendorId } : {},
      include: {
        images: true,
        variants: true,
        categories: true,
      },
    });

    const categories = await this.prisma.category.findMany();

    const toonData: ToonFormat = {
      version: '1.0',
      metadata: {
        catalog_id: `export_${Date.now()}`,
        catalog_name: 'Exported Catalog',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || undefined,
        parent_id: cat.parentId,
      })),
      products: products.map((product) => ({
        id: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.shortDescription || undefined,
        category_ids: product.categories.map((c) => c.id),
        price: {
          amount: Number(product.basePrice),
          currency: product.currency,
          compare_at: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
        },
        inventory: {
          quantity: product.inventoryQty,
          track_inventory: product.trackInventory,
          allow_backorder: product.allowBackorder,
        },
        images: product.images.map((img) => ({
          url: img.url,
          alt: img.alt || '',
          position: img.position,
          is_primary: img.isPrimary,
        })),
        variants: product.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          options: variant.options as Record<string, string>,
          price: {
            amount: Number(variant.price),
            currency: product.currency,
          },
          inventory: {
            quantity: variant.inventoryQty,
          },
        })),
        attributes: product.attributes as Record<string, any>,
        seo: {
          title: product.seoTitle || product.name,
          description: product.seoDescription || product.description,
          keywords: product.seoKeywords,
        },
        status: product.status.toLowerCase() as 'active' | 'draft' | 'archived',
        tags: product.tags,
      })),
    };

    return toonData;
  }
}
