export interface Product {
  id?: number;
  categoryId: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stockQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreateDTO {
  categoryId: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stockQuantity: number;
}

export interface ProductUpdateDTO {
  categoryId?: number;
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  stockQuantity?: number;
}
