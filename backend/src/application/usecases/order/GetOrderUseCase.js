'use strict';
const { NotFoundError } = require('../../../domain/errors/DomainErrors');

class GetOrderUseCase {
  constructor(orderRepository) { this.orderRepository = orderRepository; }

  async execute(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundError('Pedido', id);
    return order;
  }
}

module.exports = { GetOrderUseCase };
