'use strict';
const { NotFoundError } = require('../../../domain/errors/DomainErrors');

class DeleteOrderUseCase {
  constructor(orderRepository) { this.orderRepository = orderRepository; }

  async execute(id) {
    const existing = await this.orderRepository.findById(id);
    if (!existing) throw new NotFoundError('Pedido', id);
    await this.orderRepository.delete(id);
    return { deleted: true, id };
  }
}

module.exports = { DeleteOrderUseCase };
