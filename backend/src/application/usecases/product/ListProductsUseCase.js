'use strict';

class ListProductsUseCase {
  constructor(productRepository) { this.productRepository = productRepository; }

  async execute({ limit = 20, offset = 0 } = {}) {
    return this.productRepository.findAll({ limit, offset });
  }
}

module.exports = { ListProductsUseCase };
