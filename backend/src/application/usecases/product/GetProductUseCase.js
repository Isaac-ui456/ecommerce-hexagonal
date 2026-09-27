'use strict';
const { NotFoundError } = require('../../../domain/errors/DomainErrors');

class GetProductUseCase {
  constructor(productRepository) { this.productRepository = productRepository; }

  async execute(id) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundError('Producto', id);
    return product;
  }
}

module.exports = { GetProductUseCase };
