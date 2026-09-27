'use strict';

const { Router } = require('express');

function productRoutes(productController, authenticate, requireRole) {
  const router = Router();

  // Catálogo público de lectura
  router.get('/', productController.list);
  router.get('/:id', productController.getById);

  // Gestión de catálogo restringida a administradores
  router.post('/', authenticate, requireRole('admin'), productController.create);
  router.put('/:id', authenticate, requireRole('admin'), productController.update);
  router.delete('/:id', authenticate, requireRole('admin'), productController.remove);

  return router;
}

module.exports = { productRoutes };
