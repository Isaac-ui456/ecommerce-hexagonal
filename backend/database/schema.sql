-- ============================================================
-- Esquema PostgreSQL - Sistema de Comercio Electrónico
-- Tres entidades interconectadas: users, products, orders/order_items
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- para gen_random_uuid()

CREATE TYPE user_role AS ENUM ('admin', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'cancelled', 'shipped');

-- ---------------------------------------------------
-- Usuarios: la contraseña SOLO se guarda como hash bcrypt
-- ---------------------------------------------------
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,      -- bcrypt hash, nunca texto plano
    role          user_role    NOT NULL DEFAULT 'customer',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ---------------------------------------------------
-- Productos: catálogo, precio e inventario
-- ---------------------------------------------------
CREATE TABLE products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(150)   NOT NULL,
    description TEXT           NOT NULL DEFAULT '',
    price       NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
    stock       INTEGER        NOT NULL CHECK (stock >= 0),
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- ---------------------------------------------------
-- Pedidos: vincula un usuario con uno o más productos
-- ---------------------------------------------------
CREATE TABLE orders (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status     order_status NOT NULL DEFAULT 'pending',
    total      NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Detalle del pedido: snapshot del producto (nombre y precio) al momento
-- de la compra, para no alterar el historial si el catálogo cambia después.
CREATE TABLE order_items (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id   UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(150) NOT NULL,
    unit_price   NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity     INTEGER NOT NULL CHECK (quantity > 0)
);

-- ---------------------------------------------------
-- Índices para las consultas más frecuentes
-- ---------------------------------------------------
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_products_name ON products(name);
