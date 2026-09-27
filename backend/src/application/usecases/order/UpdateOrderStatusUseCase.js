'use strict';
const { NotFoundError } = require('../../../domain/errors/DomainErrors');

class UpdateOrderStatusUseCase {
  constructor(orderRepository) { this.orderRepository = orderRepository; }

  async execute(id, status) {
    const existing = await this.orderRepository.findById(id);
    if (!existing) throw new NotFoundError('Pedido', id);
    return this.orderRepository.updateStatus(id, status);
  }
}

module.exports = { UpdateOrderStatusUseCase };
