'use strict';

class ProductController {
  constructor({ createProductUseCase, getProductUseCase, listProductsUseCase, updateProductUseCase, deleteProductUseCase }) {
    this.createProductUseCase = createProductUseCase;
    this.getProductUseCase = getProductUseCase;
    this.listProductsUseCase = listProductsUseCase;
    this.updateProductUseCase = updateProductUseCase;
    this.deleteProductUseCase = deleteProductUseCase;
  }

  create = async (req, res, next) => {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      res.status(201).json(product);
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const product = await this.getProductUseCase.execute(req.params.id);
      res.status(200).json(product);
    } catch (err) { next(err); }
  };

  list = async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const products = await this.listProductsUseCase.execute({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      res.status(200).json(products);
    } catch (err) { next(err); }
  };

  update = async (req, res, next) => {
    try {
      const product = await this.updateProductUseCase.execute(req.params.id, req.body);
      res.status(200).json(product);
    } catch (err) { next(err); }
  };

  remove = async (req, res, next) => {
    try {
      const result = await this.deleteProductUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (err) { next(err); }
  };
}

module.exports = { ProductController };
