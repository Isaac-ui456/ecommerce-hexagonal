# Especificación de Endpoints REST

Base URL local: `http://localhost:3000/api`
Autenticación: header `Authorization: Bearer <token>` (JWT emitido por `/users/login`).
Roles: `admin`, `customer`.

## Usuarios (`/api/users`)

| Método | Ruta                | Auth       | Rol requerido | Descripción                                  |
|--------|---------------------|------------|----------------|-----------------------------------------------|
| POST   | `/users/register`   | No         | —              | Registra un usuario (contraseña se cifra con bcrypt) |
| POST   | `/users/login`      | No         | —              | Autentica y devuelve `{ token, user }`        |
| GET    | `/users`            | Sí         | admin          | Lista usuarios (paginado `?limit=&offset=`)   |
| GET    | `/users/:id`        | Sí         | admin o dueño  | Obtiene un usuario por id                     |
| PUT    | `/users/:id`        | Sí         | admin o dueño  | Actualiza datos / contraseña                  |
| DELETE | `/users/:id`        | Sí         | admin          | Elimina un usuario                            |

## Productos (`/api/products`)

| Método | Ruta                  | Auth | Rol requerido | Descripción                              |
|--------|-----------------------|------|----------------|--------------------------------------------|
| GET    | `/products`           | No   | —              | Lista catálogo (paginado)                  |
| GET    | `/products/:id`       | No   | —              | Obtiene un producto por id                 |
| POST   | `/products`           | Sí   | admin          | Crea un producto                           |
| PUT    | `/products/:id`       | Sí   | admin          | Actualiza nombre, precio, stock, etc.      |
| DELETE | `/products/:id`       | Sí   | admin          | Elimina un producto                        |

## Pedidos (`/api/orders`)

| Método | Ruta                     | Auth | Rol requerido | Descripción                                              |
|--------|--------------------------|------|----------------|------------------------------------------------------------|
| POST   | `/orders`                | Sí   | customer/admin | Crea un pedido (`{ lines: [{ productId, quantity }] }`); valida stock y calcula total en el dominio |
| GET    | `/orders`                | Sí   | admin          | Lista todos los pedidos (o filtra por `?userId=`)          |
| GET    | `/orders/:id`            | Sí   | dueño o admin  | Obtiene un pedido con su detalle                            |
| PATCH  | `/orders/:id/status`     | Sí   | admin          | Cambia el estado (`pending`→`paid`/`cancelled`/`shipped`)   |
| DELETE | `/orders/:id`            | Sí   | admin          | Elimina un pedido                                            |

## Utilidad

| Método | Ruta      | Descripción              |
|--------|-----------|---------------------------|
| GET    | `/health` | Verifica que la API responde |

## Ejemplo de flujo de compra

```
1. POST /api/users/register   → crea cuenta customer
2. POST /api/users/login      → devuelve JWT
3. GET  /api/products         → explora catálogo
4. POST /api/orders           → { "lines": [{ "productId": "<uuid>", "quantity": 2 }] }
                                 el backend valida stock, calcula total y descuenta inventario
                                 en una sola transacción PostgreSQL (BEGIN/COMMIT/ROLLBACK)
5. GET  /api/orders?userId=<id> → consulta historial de pedidos
```
