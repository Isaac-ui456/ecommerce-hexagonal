'use strict';

class OrderRepositoryPort {
  async save(order) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByUserId(userId) { throw new Error('Not implemented'); }
  async findAll({ limit, offset } = {}) { throw new Error('Not implemented'); }
  async updateStatus(id, status) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}

module.exports = { OrderRepositoryPort };
