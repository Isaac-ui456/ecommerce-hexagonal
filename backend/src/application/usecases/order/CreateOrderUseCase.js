const NodemailerAdapter = require('../../../infrastructure/adapters/NodemailerAdapter');

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

    // Persistencia
    const saved = await this.orderRepository.save(order, { decrementStock: true });

    // === ENVÍO DE NOTIFICACIONES POR CORREO (Mailtrap) ===
    const emailAdapter = new NodemailerAdapter();

    // 1. Enviar correo al cliente
    try {
      await emailAdapter.sendOrderConfirmationEmail(saved, user.email);
      console.log('Correo de cliente enviado a Mailtrap correctamente');
    } catch (error) {
      console.error('Aviso correo cliente:', error.message);
    }

    // Pausa de 5 segundos enteros para reiniciar la ventana de frecuencia de Mailtrap
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 2. Enviar correo al administrador
    try {
      await emailAdapter.sendAdminOrderNotification(saved, process.env.ADMIN_EMAIL);
      console.log('Correo de admin enviado a Mailtrap correctamente');
    } catch (error) {
      console.error('Aviso correo admin:', error.message);
    }

    return saved;
  }
}

module.exports = { CreateOrderUseCase };