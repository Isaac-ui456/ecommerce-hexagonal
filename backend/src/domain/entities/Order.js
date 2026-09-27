'use strict';

const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  SHIPPED: 'shipped',
});

/**
 * OrderItem: snapshot del producto en el momento de la compra
 * (no referencia mutable al catálogo, para preservar el historial de precios).
 */
class OrderItem {
  constructor({ productId, productName, unitPrice, quantity }) {
    if (!productId) throw new Error('OrderItem requiere productId');
    if (typeof unitPrice !== 'number' || unitPrice < 0) throw new Error('unitPrice inválido');
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('quantity debe ser un entero positivo');

    this.productId = productId;
    this.productName = productName;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }

  get subtotal() {
    return Number((this.unitPrice * this.quantity).toFixed(2));
  }
}

class Order {
  constructor({ id = null, userId, items = [], status = ORDER_STATUS.PENDING, createdAt = new Date() }) {
    if (!userId) throw new Error('El pedido requiere un userId');
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('El pedido debe contener al menos un producto');
    }
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new Error(`Estado de pedido inválido: ${status}`);
    }

    this.id = id;
    this.userId = userId;
    this.items = items.map((i) => (i instanceof OrderItem ? i : new OrderItem(i)));
    this.status = status;
    this.createdAt = createdAt;
  }

  /** Regla de negocio: el total siempre se calcula en el dominio, nunca se confía en el cliente. */
  calculateTotal() {
    return Number(this.items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
  }

  cancel() {
    if (this.status !== ORDER_STATUS.PENDING) {
      throw new Error(`No se puede cancelar un pedido en estado "${this.status}"`);
    }
    this.status = ORDER_STATUS.CANCELLED;
  }

  markAsPaid() {
    if (this.status !== ORDER_STATUS.PENDING) {
      throw new Error(`No se puede pagar un pedido en estado "${this.status}"`);
    }
    this.status = ORDER_STATUS.PAID;
  }
}

module.exports = { Order, OrderItem, ORDER_STATUS };
