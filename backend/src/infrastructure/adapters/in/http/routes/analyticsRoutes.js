'use strict';

const express = require('express');

function analyticsRoutes(analyticsController, requireAuth, requireRole) {
  const router = express.Router();

  // Ruta protegida: requiere token válido y rol 'admin'
  router.get(
    '/',
    requireAuth,
    requireRole('admin'),
    (req, res, next) => analyticsController.getDashboardData(req, res, next)
  );

  return router;
}

module.exports = { analyticsRoutes };