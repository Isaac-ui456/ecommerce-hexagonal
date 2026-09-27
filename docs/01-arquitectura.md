# Diagrama Arquitectónico — Backend (Arquitectura Hexagonal)

El backend sigue el patrón **Ports & Adapters (Hexagonal)**: el dominio no
depende de ningún framework, y toda comunicación con el exterior (HTTP,
PostgreSQL, bcrypt, JWT) pasa por interfaces (puertos) implementadas por
adaptadores intercambiables.

```mermaid
flowchart TB
    subgraph EXT["Actores externos"]
        CLI[Cliente React SPA]
        DB[(PostgreSQL)]
    end

    subgraph ADAPT_IN["Adaptadores de Entrada (infrastructure/adapters/in)"]
        HTTP[Controladores REST Express<br/>userController / productController / orderController]
        MW[Middlewares<br/>authMiddleware · errorHandler]
    end

    subgraph APP["Capa de Aplicación (application)"]
        PORTIN[Puertos de Entrada<br/>Casos de Uso]
        UCU[CRUD Usuario<br/>Register/Authenticate/Get/List/Update/Delete]
        UCP[CRUD Producto<br/>Create/Get/List/Update/Delete]
        UCO[CRUD Pedido<br/>Create/Get/List/UpdateStatus/Delete]
        PORTOUT[Puertos de Salida<br/>UserRepositoryPort · ProductRepositoryPort<br/>OrderRepositoryPort · PasswordHasherPort · TokenServicePort]
    end

    subgraph DOM["Capa de Dominio (domain)"]
        ENT[Entidades Puras<br/>User · Product · Order/OrderItem]
        SVC[Servicios de Dominio<br/>PasswordPolicy · OrderService]
        ERR[Errores de Dominio]
    end

    subgraph ADAPT_OUT["Adaptadores de Salida (infrastructure/adapters/out)"]
        REPO[Repositorios PostgreSQL<br/>PostgresUserRepository · PostgresProductRepository<br/>PostgresOrderRepository]
        SEC[Módulo de Cifrado<br/>BcryptPasswordHasher · JwtTokenService]
    end

    CLI -->|HTTP JSON| HTTP
    HTTP --> MW --> PORTIN
    PORTIN --> UCU & UCP & UCO
    UCU & UCP & UCO --> ENT
    UCU & UCP & UCO --> SVC
    UCU & UCP & UCO --> ERR
    UCU & UCP & UCO --> PORTOUT
    PORTOUT -.implementado por.-> REPO
    PORTOUT -.implementado por.-> SEC
    REPO --> DB
    SEC -.cifra/verifica.-> UCU

    style DOM fill:#fef3c7,stroke:#b45309
    style APP fill:#dbeafe,stroke:#1d4ed8
    style ADAPT_IN fill:#dcfce7,stroke:#15803d
    style ADAPT_OUT fill:#dcfce7,stroke:#15803d
```

## Regla de dependencia

```
Adaptadores de Entrada  →  Aplicación (Puertos de Entrada)  →  Dominio
Adaptadores de Salida   →  implementan → Puertos de Salida  ←  Aplicación
```

El **Dominio** (entidades + servicios + errores) no importa Express, `pg`,
`bcrypt` ni `jsonwebtoken`. Toda esa infraestructura vive exclusivamente en
`infrastructure/adapters/*` y se conecta mediante el **contenedor de
inyección de dependencias** (`infrastructure/config/container.js`), que es
el único punto del sistema donde se instancian implementaciones concretas.

## Estructura de carpetas del backend

```
backend/src/
├── domain/
│   ├── entities/        User.js, Product.js, Order.js
│   ├── services/        PasswordPolicy.js, OrderService.js
│   └── errors/          DomainErrors.js
├── application/
│   ├── ports/
│   │   ├── in/           (contratos de casos de uso, implícitos en usecases/)
│   │   └── out/          UserRepositoryPort.js, ProductRepositoryPort.js,
│   │                     OrderRepositoryPort.js, PasswordHasherPort.js,
│   │                     TokenServicePort.js
│   └── usecases/
│       ├── user/         RegisterUserUseCase.js, AuthenticateUserUseCase.js, ...
│       ├── product/       CreateProductUseCase.js, ...
│       └── order/         CreateOrderUseCase.js, ...
└── infrastructure/
    ├── adapters/
    │   ├── in/http/       controllers/, routes/, middlewares/
    │   └── out/
    │       ├── persistence/postgres/  PostgresUserRepository.js, ...
    │       └── security/               BcryptPasswordHasher.js, JwtTokenService.js
    └── config/            db.js, container.js
```

## Seguridad de credenciales

- La contraseña en texto plano **nunca se persiste**: se valida con
  `PasswordPolicy` (regla de dominio) y se transforma en hash mediante
  `BcryptPasswordHasher` (12 salt rounds) antes de construir la entidad `User`.
- `User.toSafeObject()` es la única forma en que un usuario sale hacia HTTP;
  excluye `passwordHash` explícitamente.
- La autenticación expide un JWT firmado (`JwtTokenService`) que el
  frontend adjunta como `Authorization: Bearer <token>` en cada petición.
- `authMiddleware` valida el token y `requireRole` restringe operaciones
  administrativas (crear/editar/eliminar productos, gestionar usuarios,
  cambiar estado de pedidos).
