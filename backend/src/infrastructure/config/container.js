'use strict';

const { pool } = require('./db');

// Adaptadores de salida
const { PostgresUserRepository } = require('../adapters/out/persistence/postgres/PostgresUserRepository');
const { PostgresProductRepository } = require('../adapters/out/persistence/postgres/PostgresProductRepository');
const { PostgresOrderRepository } = require('../adapters/out/persistence/postgres/PostgresOrderRepository');
const { BcryptPasswordHasher } = require('../adapters/out/security/BcryptPasswordHasher');
const { JwtTokenService } = require('../adapters/out/security/JwtTokenService');

// Casos de uso - Usuario
const { RegisterUserUseCase } = require('../../application/usecases/user/RegisterUserUseCase');
const { AuthenticateUserUseCase } = require('../../application/usecases/user/AuthenticateUserUseCase');
const { GetUserUseCase } = require('../../application/usecases/user/GetUserUseCase');
const { ListUsersUseCase } = require('../../application/usecases/user/ListUsersUseCase');
const { UpdateUserUseCase } = require('../../application/usecases/user/UpdateUserUseCase');
const { DeleteUserUseCase } = require('../../application/usecases/user/DeleteUserUseCase');

// Casos de uso - Producto
const { CreateProductUseCase } = require('../../application/usecases/product/CreateProductUseCase');
const { GetProductUseCase } = require('../../application/usecases/product/GetProductUseCase');
const { ListProductsUseCase } = require('../../application/usecases/product/ListProductsUseCase');
const { UpdateProductUseCase } = require('../../application/usecases/product/UpdateProductUseCase');
const { DeleteProductUseCase } = require('../../application/usecases/product/DeleteProductUseCase');

// Casos de uso - Pedido
const { CreateOrderUseCase } = require('../../application/usecases/order/CreateOrderUseCase');
const { GetOrderUseCase } = require('../../application/usecases/order/GetOrderUseCase');
const { ListOrdersUseCase } = require('../../application/usecases/order/ListOrdersUseCase');
const { UpdateOrderStatusUseCase } = require('../../application/usecases/order/UpdateOrderStatusUseCase');
const { DeleteOrderUseCase } = require('../../application/usecases/order/DeleteOrderUseCase');

// Adaptadores de entrada
const { UserController } = require('../adapters/in/http/controllers/userController');
const { ProductController } = require('../adapters/in/http/controllers/productController');
const { OrderController } = require('../adapters/in/http/controllers/orderController');

/**
 * Contenedor de inyección de dependencias (composition root).
 * Es el único lugar donde se "cablean" adaptadores concretos con
 * casos de uso. Si mañana se cambia PostgreSQL por MongoDB, o bcrypt
 * por argon2, solo se toca este archivo.
 */
function buildContainer() {
  const userRepository = new PostgresUserRepository(pool);
  const productRepository = new PostgresProductRepository(pool);
  const orderRepository = new PostgresOrderRepository(pool, productRepository);
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);

  const userController = new UserController({
    registerUserUseCase: new RegisterUserUseCase(userRepository, passwordHasher),
    authenticateUserUseCase: new AuthenticateUserUseCase(userRepository, passwordHasher, tokenService),
    getUserUseCase: new GetUserUseCase(userRepository),
    listUsersUseCase: new ListUsersUseCase(userRepository),
    updateUserUseCase: new UpdateUserUseCase(userRepository, passwordHasher),
    deleteUserUseCase: new DeleteUserUseCase(userRepository),
  });

  const productController = new ProductController({
    createProductUseCase: new CreateProductUseCase(productRepository),
    getProductUseCase: new GetProductUseCase(productRepository),
    listProductsUseCase: new ListProductsUseCase(productRepository),
    updateProductUseCase: new UpdateProductUseCase(productRepository),
    deleteProductUseCase: new DeleteProductUseCase(productRepository),
  });

  const orderController = new OrderController({
    createOrderUseCase: new CreateOrderUseCase(orderRepository, productRepository, userRepository),
    getOrderUseCase: new GetOrderUseCase(orderRepository),
    listOrdersUseCase: new ListOrdersUseCase(orderRepository),
    updateOrderStatusUseCase: new UpdateOrderStatusUseCase(orderRepository),
    deleteOrderUseCase: new DeleteOrderUseCase(orderRepository),
  });

  return { userController, productController, orderController, tokenService };
}

module.exports = { buildContainer };
