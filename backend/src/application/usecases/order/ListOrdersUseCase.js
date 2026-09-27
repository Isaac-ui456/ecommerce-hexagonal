'use strict';

class ListOrdersUseCase {
  constructor(orderRepository) { this.orderRepository = orderRepository; }

  async execute({ userId, limit = 20, offset = 0 } = {}) {
    if (userId) return this.orderRepository.findByUserId(userId);
    return this.orderRepository.findAll({ limit, offset });
  }
}

module.exports = { ListOrdersUseCase };
