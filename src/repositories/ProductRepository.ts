import { Product, ProductCreateDTO, ProductUpdateDTO } from '../models/Product';
import { Database } from '../database/Database'; // Assuming you have a Database class

export class ProductRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(product: ProductCreateDTO): Promise<Product> {
    const query = `
      INSERT INTO Products 
      (category_id, name, description, sku, price, stock_quantity) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await this.db.execute(query, [
      product.categoryId,
      product.name,
      product.description,
      product.sku,
      product.price,
      product.stockQuantity
    ]);

    return {
      id: result.insertId,
      ...product
    };
  }

  async findById(id: number): Promise<Product | null> {
    const query = 'SELECT * FROM Products WHERE id = ?';
    const results = await this.db.query(query, [id]);
    return results.length > 0 ? this.mapToProduct(results[0]) : null;
  }

  async findAll(): Promise<Product[]> {
    const query = 'SELECT * FROM Products';
    const results = await this.db.query(query);
    return results.map(this.mapToProduct);
  }

  async update(id: number, product: ProductUpdateDTO): Promise<Product | null> {
    const updateFields = Object.keys(product)
      .filter(key => product[key] !== undefined)
      .map(key => `${this.camelToSnakeCase(key)} = ?`)
      .join(', ');

    const values = Object.keys(product)
      .filter(key => product[key] !== undefined)
      .map(key => product[key]);

    values.push(id);

    const query = `UPDATE Products SET ${updateFields} WHERE id = ?`;
    await this.db.execute(query, values);

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM Products WHERE id = ?';
    const result = await this.db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  private mapToProduct(row: any): Product {
    return {
      id: row.id,
      categoryId: row.category_id,
      name: row.name,
      description: row.description,
      sku: row.sku,
      price: row.price,
      stockQuantity: row.stock_quantity,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
