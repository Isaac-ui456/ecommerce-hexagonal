'use strict';

const { ProductRepositoryPort } = require('../../../../../application/ports/out/ProductRepositoryPort');
const { Product } = require('../../../../../domain/entities/Product');

function rowToProduct(row) {
  if (!row) return null;
  return new Product({
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class PostgresProductRepository extends ProductRepositoryPort {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async save(product) {
    const { rows } = await this.pool.query(
      `INSERT INTO products (name, description, price, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product.name, product.description, product.price, product.stock]
    );
    return rowToProduct(rows[0]);
  }

  async findById(id) {
    const { rows } = await this.pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return rowToProduct(rows[0]);
  }

  async findByIds(ids) {
    if (ids.length === 0) return [];
    const { rows } = await this.pool.query('SELECT * FROM products WHERE id = ANY($1::uuid[])', [ids]);
    return rows.map(rowToProduct);
  }

  async findAll({ limit = 20, offset = 0 } = {}) {
    const { rows } = await this.pool.query(
      'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return rows.map(rowToProduct);
  }

  async update(id, patch) {
    const fields = [];
    const values = [];
    let i = 1;

    if (patch.name !== undefined) { fields.push(`name = $${i++}`); values.push(patch.name); }
    if (patch.description !== undefined) { fields.push(`description = $${i++}`); values.push(patch.description); }
    if (patch.price !== undefined) { fields.push(`price = $${i++}`); values.push(patch.price); }
    if (patch.stock !== undefined) { fields.push(`stock = $${i++}`); values.push(patch.stock); }
    fields.push(`updated_at = now()`);

    values.push(id);
    const { rows } = await this.pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return rowToProduct(rows[0]);
  }

  async delete(id) {
    await this.pool.query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  }

  /** Usado dentro de la transacción de creación de pedido. */
  async decreaseStockBatch(items, client) {
    const runner = client || this.pool;
    for (const item of items) {
      const { rowCount } = await runner.query(
        `UPDATE products SET stock = stock - $1, updated_at = now()
         WHERE id = $2 AND stock >= $1`,
        [item.quantity, item.productId]
      );
      if (rowCount === 0) {
        throw new Error(`Stock insuficiente o producto inexistente: ${item.productId}`);
      }
    }
  }
}

module.exports = { PostgresProductRepository };
