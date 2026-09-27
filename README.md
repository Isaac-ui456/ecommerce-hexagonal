# Sistema de Comercio Electrónico — Arquitectura Hexagonal

Backend Node.js/Express con arquitectura hexagonal + PostgreSQL, y frontend
React + Vite, para un sistema de e-commerce con tres entidades
interconectadas: **Usuario**, **Producto** y **Pedido**.

## Contenido

- `backend/` — API REST (dominio, casos de uso, adaptadores)
- `frontend/` — SPA React organizada por módulos (auth, catalog, orders)
- `docs/`
  - `01-arquitectura.md` — diagrama arquitectónico (Mermaid) y estructura de carpetas
  - `02-endpoints.md` — especificación de endpoints REST
  - `03-guia-despliegue-wsl.md` — despliegue del entorno en WSL
  - `04-guia-despliegue-aws.md` — despliegue en AWS al activar el laboratorio

## Inicio rápido (resumen; detalle en docs/03-guia-despliegue-wsl.md)

```bash
# Base de datos
sudo service postgresql start
psql -U ecommerce_app -d ecommerce -f backend/database/schema.sql

# Backend
cd backend && cp .env.example .env && npm install && npm run dev

# Frontend
cd frontend && cp .env.example .env && npm install && npm run dev
```

Frontend: http://localhost:5173 — Backend: http://localhost:3000
