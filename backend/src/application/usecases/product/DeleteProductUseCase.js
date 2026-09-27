'use strict';
const { NotFoundError } = require('../../../domain/errors/DomainErrors');

class DeleteProductUseCase {
  constructor(productRepository) { this.productRepository = productRepository; }

  async execute(id) {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new NotFoundError('Producto', id);
    await this.productRepository.delete(id);
    return { deleted: true, id };
  }
}

module.exports = { DeleteProductUseCase };
