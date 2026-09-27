'use strict';

const { Router } = require('express');

function orderRoutes(orderController, authenticate, requireRole) {
  const router = Router();

  router.post('/', authenticate, orderController.create);
  router.get('/', authenticate, orderController.list);
  router.get('/:id', authenticate, orderController.getById);
  router.patch('/:id/status', authenticate, requireRole('admin'), orderController.updateStatus);
  router.delete('/:id', authenticate, requireRole('admin'), orderController.remove);

  return router;
}

module.exports = { orderRoutes };
