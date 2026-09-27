'use strict';

const { Order, OrderItem } = require('../entities/Order');

/**
 * Servicio de dominio: orquesta reglas de negocio que involucran
 * más de una entidad (Order + Product) sin depender de infraestructura.
 * Recibe entidades Product ya cargadas (inyectadas por el caso de uso),
 * nunca accede directamente a una base de datos.
 */
class OrderService {
  /**
   * @param {{userId: string, lines: {productId: string, quantity: number}[]}} orderRequest
   * @param {Map<string, import('../entities/Product').Product>} productsById
   * @returns {Order}
   */
  static buildOrderFromCart(orderRequest, productsById) {
    const items = orderRequest.lines.map(({ productId, quantity }) => {
      const product = productsById.get(productId);
      if (!product) {
        throw new Error(`Producto no encontrado: ${productId}`);
      }
      if (!product.hasStockFor(quantity)) {
        throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${quantity}`);
      }
      return new OrderItem({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
      });
    });

    // Aplica la baja de stock en memoria; la persistencia la confirma el repositorio (transacción).
    orderRequest.lines.forEach(({ productId, quantity }) => {
      productsById.get(productId).decreaseStock(quantity);
    });

    const order = new Order({ userId: orderRequest.userId, items });
    order.total = order.calculateTotal();
    return order;
  }
}

module.exports = { OrderService };
