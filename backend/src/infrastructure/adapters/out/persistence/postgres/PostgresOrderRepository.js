'use strict';

const { OrderRepositoryPort } = require('../../../../../application/ports/out/OrderRepositoryPort');
const { Order, OrderItem } = require('../../../../../domain/entities/Order');

function rowsToOrder(orderRow, itemRows) {
  return new Order({
    id: orderRow.id,
    userId: orderRow.user_id,
    status: orderRow.status,
    createdAt: orderRow.created_at,
    items: itemRows.map((r) => new OrderItem({
      productId: r.product_id,
      productName: r.product_name,
      unitPrice: Number(r.unit_price),
      quantity: r.quantity,
    })),
  });
}

class PostgresOrderRepository extends OrderRepositoryPort {
  constructor(pool, productRepository) {
    super();
    this.pool = pool;
    this.productRepository = productRepository;
  }

  /**
   * Guarda el pedido y descuenta stock de forma ATÓMICA usando una transacción.
   * Si falla cualquier paso (p.ej. stock insuficiente detectado por otra
   * petición concurrente), se revierte todo con ROLLBACK.
   */
  async save(order, { decrementStock = false } = {}) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const total = order.calculateTotal();
      const { rows: orderRows } = await client.query(
        `INSERT INTO orders (user_id, status, total) VALUES ($1, $2, $3) RETURNING *`,
        [order.userId, order.status, total]
      );
      const orderRow = orderRows[0];

      const itemRows = [];
      for (const item of order.items) {
        const { rows } = await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [orderRow.id, item.productId, item.productName, item.unitPrice, item.quantity]
        );
        itemRows.push(rows[0]);
      }

      if (decrementStock) {
        await this.productRepository.decreaseStockBatch(order.items, client);
      }

      await client.query('COMMIT');
      return rowsToOrder(orderRow, itemRows);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const { rows: orderRows } = await this.pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderRows.length === 0) return null;
    const { rows: itemRows } = await this.pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    return rowsToOrder(orderRows[0], itemRows);
  }

  async findByUserId(userId) {
    const { rows: orderRows } = await this.pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]
    );
    return this._attachItems(orderRows);
  }

  async findAll({ limit = 20, offset = 0 } = {}) {
    const { rows: orderRows } = await this.pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]
    );
    return this._attachItems(orderRows);
  }

  async _attachItems(orderRows) {
    if (orderRows.length === 0) return [];
    const ids = orderRows.map((r) => r.id);
    const { rows: itemRows } = await this.pool.query(
      'SELECT * FROM order_items WHERE order_id = ANY($1::uuid[])', [ids]
    );
    return orderRows.map((row) => rowsToOrder(row, itemRows.filter((i) => i.order_id === row.id)));
  }

  async updateStatus(id, status) {
    const { rows } = await this.pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]
    );
    const { rows: itemRows } = await this.pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    return rowsToOrder(rows[0], itemRows);
  }

  async delete(id) {
    await this.pool.query('DELETE FROM orders WHERE id = $1', [id]);
    return true;
  }
}

module.exports = { PostgresOrderRepository };
