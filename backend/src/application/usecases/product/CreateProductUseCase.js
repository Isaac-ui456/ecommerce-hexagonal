'use strict';
const { Product } = require('../../../domain/entities/Product');

class CreateProductUseCase {
  constructor(productRepository) { this.productRepository = productRepository; }

  async execute({ name, description, price, stock }) {
    const product = new Product({ name, description, price: Number(price), stock: Number(stock) });
    return this.productRepository.save(product);
  }
}

module.exports = { CreateProductUseCase };
