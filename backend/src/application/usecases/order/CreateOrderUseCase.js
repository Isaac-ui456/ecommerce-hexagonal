'use strict';

const { OrderService } = require('../../../domain/services/OrderService');
const { NotFoundError, ValidationError } = require('../../../domain/errors/DomainErrors');

class CreateOrderUseCase {
  /**
   * @param {import('../../ports/out/OrderRepositoryPort').OrderRepositoryPort} orderRepository
   * @param {import('../../ports/out/ProductRepositoryPort').ProductRepositoryPort} productRepository
   * @param {import('../../ports/out/UserRepositoryPort').UserRepositoryPort} userRepository
   */
  constructor(orderRepository, productRepository, userRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  /**
   * @param {{userId: string, lines: {productId: string, quantity: number}[]}} request
   */
  async execute(request) {
    if (!request.lines || request.lines.length === 0) {
      throw new ValidationError('El pedido debe incluir al menos un producto');
    }

    const user = await this.userRepository.findById(request.userId);
    if (!user) throw new NotFoundError('Usuario', request.userId);

    const productIds = request.lines.map((l) => l.productId);
    const products = await this.productRepository.findByIds(productIds);
    const productsById = new Map(products.map((p) => [p.id, p]));

    // Regla de negocio (comprobación de stock + cálculo de total) vive en el dominio.
    const order = OrderService.buildOrderFromCart(request, productsById);

    // Persistencia: guardar el pedido y descontar stock en una sola transacción
    // (ver adaptador PostgresOrderRepository -> se ejecuta dentro de BEGIN/COMMIT).
    const saved = await this.orderRepository.save(order, { decrementStock: true });
    return saved;
  }
}

module.exports = { CreateOrderUseCase };
