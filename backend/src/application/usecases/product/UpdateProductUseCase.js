'use strict';
const { NotFoundError } = require('../../../domain/errors/DomainErrors');

class UpdateProductUseCase {
  constructor(productRepository) { this.productRepository = productRepository; }

  async execute(id, { name, description, price, stock }) {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new NotFoundError('Producto', id);

    const patch = {};
    if (name !== undefined) patch.name = name;
    if (description !== undefined) patch.description = description;
    if (price !== undefined) patch.price = Number(price);
    if (stock !== undefined) patch.stock = Number(stock);

    return this.productRepository.update(id, patch);
  }
}

module.exports = { UpdateProductUseCase };
