'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { buildContainer } = require('./infrastructure/config/container');
const { authenticate, requireRole } = require('./infrastructure/adapters/in/http/middlewares/authMiddleware');
const { errorHandler } = require('./infrastructure/adapters/in/http/middlewares/errorHandler');
const { userRoutes } = require('./infrastructure/adapters/in/http/routes/userRoutes');
const { productRoutes } = require('./infrastructure/adapters/in/http/routes/productRoutes');
const { orderRoutes } = require('./infrastructure/adapters/in/http/routes/orderRoutes');
const { analyticsRoutes } = require('./infrastructure/adapters/in/http/routes/analyticsRoutes');

function createApp() {
  const app = express();
  const { userController, productController, orderController, analyticsController, tokenService } = buildContainer();

  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

  const requireAuth = authenticate(tokenService);

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/users', userRoutes(userController, requireAuth, requireRole));
  app.use('/api/products', productRoutes(productController, requireAuth, requireRole));
  app.use('/api/orders', orderRoutes(orderController, requireAuth, requireRole));
  app.use('/api/analytics', analyticsRoutes(analyticsController, requireAuth, requireRole));

  app.use((req, res) => res.status(404).json({ error: 'NotFound', message: 'Ruta no encontrada' }));
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };