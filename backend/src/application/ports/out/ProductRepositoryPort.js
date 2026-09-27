'use strict';

class ProductRepositoryPort {
  async save(product) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByIds(ids) { throw new Error('Not implemented'); }
  async findAll({ limit, offset } = {}) { throw new Error('Not implemented'); }
  async update(id, partialProduct) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  /** Debe ejecutarse en una transacción junto con la creación del pedido. */
  async decreaseStockBatch(items) { throw new Error('Not implemented'); }
}

module.exports = { ProductRepositoryPort };
