# Grandma's Food

Sistema MVP para gestión de pedidos a domicilio de la franquicia de comidas Grandma's Food.

## Requisitos

- Docker y Docker Compose

## Ejecutar el proyecto

```bash
# Clonar y levantar todos los servicios
git clone <repo-url>
cd Training
cp .env.example .env
docker compose up --build
```

Tres servicios se levantan automaticamente:

| Servicio   | Container     | Puerto | Tecnologia            |
|------------|---------------|--------|-----------------------|
| Frontend   | `react_client`| `5173` | React 19 + Vite       |
| Backend    | `fast_api`    | `8000` | FastAPI + SQLAlchemy  |
| Base datos | `db`          | `5432` | PostgreSQL 16 Alpine  |

Acceder a:
- Frontend: http://localhost:5173
- API docs (Swagger): http://localhost:8000/docs
- API Redoc: http://localhost:8000/redoc

### Sembrar datos de prueba

```bash
docker exec -it fast_api python scripts/seed_data.py
```

### Ejecutar pruebas

```bash
docker exec fast_api pytest
```

## Arquitectura

### Backend (FastAPI + PostgreSQL)

Patron **Controller → Service → Repository** con 3 modulos independientes:

- **customers/** — CRUD de clientes (documento, nombre, email, telefono, direccion)
- **meals/** — CRUD de combos (nombre, categoria, precio, disponibilidad)
- **orders/** — Creacion de pedidos y marcado como entregado (calcula subtotal, IVA 19%, total)

Cada modulo tiene su propio `controller.py` (rutas), `service.py` (logica de negocio), `repository.py` (acceso a datos), `model.py` (SQLAlchemy) y `schema.py` (Pydantic). Los handlers de error estan centralizados en `app/handler/`.

### Frontend (React 19 + TypeScript + Vite)

SPA con paginas para cada modulo del negocio:

- **Pages:** `Customers`, `Meals`, `Orders`, `Dashboard`
- **Components:** `Button`, `Card`, `GlobalSidebar`, `Modal`, `Table` (reutilizables)
- **Services:** Capa HTTP para comunicacion con la API (`/customers`, `/meals`, `/orders`)
- **Models:** Tipos TypeScript que reflejan los schemas del backend
- **Routing:** Navegacion por estado en `App.tsx` con sidebar

El Dashboard tiene su propia sub-arquitectura en `modules/Dashboard/` con tipos, constantes y componentes independientes (`Hero`, `Panel`, `StatsGrid`).
