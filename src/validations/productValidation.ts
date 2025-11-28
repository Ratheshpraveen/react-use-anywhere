import { z } from 'zod';

export const productCreateSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(2).max(255),
  description: z.string().optional(),
  sku: z.string().min(3).max(100),
  price: z.number().positive().min(0),
  stockQuantity: z.number().int().min(0)
});

export const productUpdateSchema = productCreateSchema.partial();

export function validateProductCreate(data: unknown) {
  return productCreateSchema.parse(data);
}

export function validateProductUpdate(data: unknown) {
  return productUpdateSchema.parse(data);
}
