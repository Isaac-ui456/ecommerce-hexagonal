'use strict';

class OrderController {
  constructor({ createOrderUseCase, getOrderUseCase, listOrdersUseCase, updateOrderStatusUseCase, deleteOrderUseCase }) {
    this.createOrderUseCase = createOrderUseCase;
    this.getOrderUseCase = getOrderUseCase;
    this.listOrdersUseCase = listOrdersUseCase;
    this.updateOrderStatusUseCase = updateOrderStatusUseCase;
    this.deleteOrderUseCase = deleteOrderUseCase;
  }

  create = async (req, res, next) => {
    try {
      // userId se toma del token (req.auth.sub), nunca del body, para evitar suplantación.
      const order = await this.createOrderUseCase.execute({ userId: req.auth.sub, lines: req.body.lines });
      res.status(201).json(order);
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const order = await this.getOrderUseCase.execute(req.params.id);
      res.status(200).json(order);
    } catch (err) { next(err); }
  };

  list = async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const isAdmin = req.auth.role === 'admin';
      // Un customer solo puede ver SUS pedidos; un admin puede ver todos o filtrar por userId.
      const userId = isAdmin ? req.query.userId : req.auth.sub;

      const orders = await this.listOrdersUseCase.execute({
        userId,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      res.status(200).json(orders);
    } catch (err) { next(err); }
  };

  updateStatus = async (req, res, next) => {
    try {
      const order = await this.updateOrderStatusUseCase.execute(req.params.id, req.body.status);
      res.status(200).json(order);
    } catch (err) { next(err); }
  };

  remove = async (req, res, next) => {
    try {
      const result = await this.deleteOrderUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (err) { next(err); }
  };
}

module.exports = { OrderController };
