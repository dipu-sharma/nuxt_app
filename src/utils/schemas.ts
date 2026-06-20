import { z } from 'zod'

// Category Validation Schemas
export const CategorySchema = z.object({
  id: z.number(),
  category_id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  parent_id: z.number().nullable(),
  sort_order: z.number().optional().default(0),
  is_active: z.boolean().optional().default(true),
  is_featured: z.boolean().optional().default(false),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  meta_keywords: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  level: z.number(),
  path: z.string(),
  business_id: z.number().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional()
})

// Needs ZodType for recursive definition
export const CategoryTreeSchema: z.ZodType<any> = CategorySchema.extend({
  children: z.lazy(() => CategoryTreeSchema.array().optional())
})

// Product Validation Schemas
export const ProductImageSchema = z.object({
  id: z.number(),
  file_name: z.string(),
  file_url: z.string(),
  host_url: z.string().optional()
})

export const ProductSchema = z.object({
  id: z.number(),
  product_id: z.string(),
  product_name: z.string(),
  slug: z.string(),
  brand_name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  short_description: z.string().nullable().optional(),
  product_cost_price: z.number().nullable().optional(),
  product_mrp: z.number(),
  discount_percent: z.number().nullable().optional(),
  selling_price: z.number(),
  product_sku: z.string().nullable().optional(),
  hsn_no: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  batch_no: z.string().nullable().optional(),
  mfg_date: z.string().nullable().optional(),
  exp_date: z.string().nullable().optional(),
  product_tax: z.number().nullable().optional(),
  product_packing: z.string().nullable().optional(),
  product_type: z.string().nullable().optional(),
  product_unit: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  low_stock_threshold: z.number().nullable().optional(),
  business_id: z.number().nullable().optional(),
  average_rating: z.number().nullable().optional(),
  reviews_count: z.number().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  deleted_at: z.string().nullable().optional(),
  images: z.array(ProductImageSchema).optional().default([])
})

// Create / Update payload schema
export const ProductPayloadSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  brand_name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  product_cost_price: z.number().min(0).optional().nullable(),
  product_mrp: z.number().min(0, 'MRP price must be >= 0'),
  discount_percent: z.number().min(0).max(100).optional().nullable(),
  product_sku: z.string().optional().nullable(),
  hsn_no: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  batch_no: z.string().optional().nullable(),
  product_tax: z.number().optional().nullable(),
  product_packing: z.string().optional().nullable(),
  product_type: z.string().optional().nullable(),
  product_unit: z.string().optional().nullable(),
  category_id: z.string().min(1, 'Category is required'),
  is_active: z.boolean().optional().default(true),
  is_featured: z.boolean().optional().default(false),
  low_stock_threshold: z.number().min(0).optional().nullable(),
})


export const CategoryPayloadSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parent_id: z.number().optional().nullable()
})
