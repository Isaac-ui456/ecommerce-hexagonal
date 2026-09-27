'use strict';

const { Router } = require('express');

function userRoutes(userController, authenticate, requireRole) {
  const router = Router();

  router.post('/register', userController.register);
  router.post('/login', userController.login);

  router.get('/', authenticate, requireRole('admin'), userController.list);
  router.get('/:id', authenticate, userController.getById);
  router.put('/:id', authenticate, userController.update);
  router.delete('/:id', authenticate, requireRole('admin'), userController.remove);

  return router;
}

module.exports = { userRoutes };
