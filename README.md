# Akicti - Evidence Inbox Platform

Akicti es una plataforma de monitoreo de seguridad que permite gestionar alertas y evidencias de amenazas detectadas en diferentes fuentes. El sistema proporciona una interfaz centralizada para que los equipos de seguridad puedan revisar, clasificar y dar seguimiento a incidentes de seguridad.

## Descripción del Sistema

El sistema de alertas permite:

- **Gestión de Alertas**: Crear, listar y filtrar alertas de seguridad clasificadas por severidad (critical, high, medium, low) y estado (open, in_progress, closed)
- **Evidencias Asociadas**: Cada alerta puede tener múltiples evidencias provenientes de diferentes fuentes (Twitter, LinkedIn, Instagram, Web, Agentes)
- **Revisión de Evidencias**: Los analistas pueden marcar evidencias como revisadas, con tracking automático de quién y cuándo se revisó
- **Autenticación Segura**: Sistema de autenticación JWT con rotación de tokens y blacklisting

## Arquitectura

El proyecto sigue una arquitectura REST desacoplada:

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Frontend │ JSON │ Backend │ │ Database │
│ React + Vite │◄───────►│ Django + DRF │◄───────►│ PostgreSQL │
│ Port: 3000 │ API │ Port: 8000 │ │ Port: 5432 │
└─────────────────┘ └─────────────────┘ └─────────────────┘


## Stack Tecnológico

### Backend (Django)

| Tecnología | Propósito |
|------------|-----------|
| Django 5.x | Framework web principal |
| Django REST Framework | API REST |
| SimpleJWT | Autenticación JWT |
| django-filter | Filtrado de querysets |
| django-cors-headers | Manejo de CORS |
| PostgreSQL | Base de datos |

**Buenas Prácticas Implementadas:**

- **Autenticación JWT Avanzada**
  - Rotación de refresh tokens (`ROTATE_REFRESH_TOKENS=True`)
  - Blacklisting de tokens comprometidos
  - Tokens de acceso cortos (30 minutos)
  - Refresh tokens con expiración (7 días)

- **Seguridad**
  - Rate limiting diferenciado (más estricto para login/register)
  - CORS configurado para dominios específicos
  - Headers de seguridad (HSTS, CSP, X-Frame-Options)
  - Validación de password strength
  - Throttling por usuario

- **Arquitectura**
  - Separación en apps (alerts, users)
  - Permisos custom (`IsOwnerOrAdmin`, `IsAdmin`)
  - Serializers con validación
  - ViewSets con filtros y paginación
  - Auditoría de logs

### Frontend (React)

| Tecnología | Propósito |
|------------|-----------|
| React 18 | Biblioteca UI |
| TypeScript | Tipado estático |
| Vite | Build tool |
| Tailwind CSS | Estilos |
| React Router v7 | Routing |
| Axios | HTTP client |
| Zod | Validación de schemas |

**Buenas Prácticas Implementadas:**

- **Gestión de Estado**
  - Single Context con `useReducer` (sin Redux/MobX)
  - Estado normalizado y optimizado
  - Memoización selectiva con `useMemo` / `useCallback`

- **API Layer**
  - JWT Rotation automático
  - Retry logic con exponential backoff
  - Request caching con TTL configurable
  - Request deduplication
  - Manejo centralizado de errores

- **Optimistic Updates**
  - Actualización inmediata de UI
  - Rollback automático en caso de error

- **Validación**
  - Zod schemas para validación estricta
  - TypeScript strict mode

- **Calidad de Código**
  - ESLint + Prettier
  - Testing con Vitest + React Testing Library
  - MSW para mocking de APIs

## Estructura del Proyecto

octapus/
├── akicti/ # Backend Django
│ ├── akicti/ # Configuración del proyecto
│ │ ├── settings.py
│ │ ├── urls.py
│ │ └── pagination.py
│ ├── alerts/ # App de alertas y evidencias
│ │ ├── models.py # Modelos Alert y Evidence
│ │ ├── serializers.py # Serializers DRF
│ │ ├── views.py # ViewSets
│ │ ├── permissions.py # Permisos custom
│ │ └── urls.py
│ ├── users/ # App de autenticación
│ │ ├── serializers.py # Serializers de usuario
│ │ ├── views.py # Vistas de auth
│ │ ├── throttling.py # Rate limiting
│ │ └── urls.py
│ ├── manage.py
│ └── requirements.txt
│
├── frontend-akicti/ # Frontend React
│ ├── src/
│ │ ├── api/ # Cliente API con JWT
│ │ ├── components/ # Componentes UI
│ │ ├── contexts/ # Estado global
│ │ ├── hooks/ # Custom hooks
│ │ ├── types/ # TypeScript + Zod
│ │ └── routes/ # Configuración de rutas
│ ├── package.json
│ └── vite.config.ts
│
├── docker-compose.yml # Orquestación de servicios
└── README.md


## Endpoints API

### Autenticación (`/api/v1/auth/`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/register/` | Registrar usuario |
| POST | `/login/` | Obtener tokens JWT |
| POST | `/logout/` | Invalidar refresh token |
| POST | `/token/refresh/` | Rotar tokens |
| POST | `/token/verify/` | Verificar token |

### Alertas (`/api/v1/alerts/`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Listar alertas (con filtros, búsqueda, paginación) |
| GET | `/<id>/` | Detalle de alerta |
| POST | `/` | Crear alerta |
| GET | `/<id>/evidences/` | Listar evidencias de alerta |

**Parámetros de filtrado:**
- `?severity=critical` - Filtrar por severidad
- `?status=open` - Filtrar por estado
- `?search=phishing` - Buscar por título
- `?page=1&page_size=15` - Paginación

### Evidencias (`/api/v1/evidences/`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| PATCH | `/<id>/` | Marcar evidencia como revisada |

## Despliegue con Docker

### Servicios

| Servicio | Puerto Externo | Puerto Interno | Imagen |
|----------|----------------|----------------|--------|
| db (PostgreSQL) | 3310 | 5432 | postgres:16-alpine |
| backend (Django) | 8000 | 8000 | python:3.12-slim |
| frontend (React) | 3000 | 80 | nginx:alpine |

## Licencia

Proyecto privado - Todos los derechos reservados.

