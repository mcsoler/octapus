# Akicti - Evidence Inbox Platform

Akicti es una plataforma de monitoreo de seguridad que permite gestionar alertas y evidencias de amenazas detectadas en diferentes fuentes. El sistema proporciona una interfaz centralizada para que los equipos de seguridad puedan revisar, clasificar y dar seguimiento a incidentes de seguridad.

## Descripcion del Sistema

El sistema de alertas permite:

- **Gestion de Alertas**: Crear, listar y filtrar alertas de seguridad clasificadas por severidad (critical, high, medium, low) y estado (open, in_progress, closed)
- **Evidencias Asociadas**: Cada alerta puede tener multiples evidencias provenientes de diferentes fuentes (Twitter, LinkedIn, Instagram, Web, Agentes)
- **Revision de Evidencias**: Los analistas pueden marcar evidencias como revisadas, con tracking automatico de quien y cuando se reviso
- **Autenticacion Segura**: Sistema de autenticacion JWT con rotacion de tokens y blacklisting

## Arquitectura

El proyecto sigue una arquitectura REST desacoplada:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    Frontend     │  JSON   │     Backend     │         │    Database     │
│  React + Vite   │◄───────►│  Django + DRF   │◄───────►│   PostgreSQL    │
│   Port: 3000    │   API   │   Port: 8000    │         │   Port: 5432    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Stack Tecnologico

### Backend (Django)

| Tecnologia | Proposito |
|------------|-----------|
| Django 5.x | Framework web principal |
| Django REST Framework | API REST |
| SimpleJWT | Autenticacion JWT |
| django-filter | Filtrado de querysets |
| django-cors-headers | Manejo de CORS |
| PostgreSQL | Base de datos |

**Buenas Practicas Implementadas:**

- **Autenticacion JWT Avanzada**
  - Rotacion de refresh tokens (`ROTATE_REFRESH_TOKENS=True`)
  - Blacklisting de tokens comprometidos
  - Tokens de acceso cortos (30 minutos)
  - Refresh tokens con expiracion (7 dias)

- **Seguridad**
  - Rate limiting diferenciado (mas estricto para login/register)
  - CORS configurado para dominios especificos
  - Headers de seguridad (HSTS, CSP, X-Frame-Options)
  - Validacion de password strength
  - Throttling por usuario

- **Arquitectura**
  - Separacion en apps (alerts, users)
  - Permisos custom (`IsOwnerOrAdmin`, `IsAdmin`)
  - Serializers con validacion
  - ViewSets con filtros y paginacion
  - Auditoria de logs

### Frontend (React)

| Tecnologia | Proposito |
|------------|-----------|
| React 18 | Biblioteca UI |
| TypeScript | Tipado estatico |
| Vite | Build tool |
| Tailwind CSS | Estilos |
| React Router v7 | Routing |
| Axios | HTTP client |
| Zod | Validacion de schemas |

**Buenas Practicas Implementadas:**

- **Gestion de Estado**
  - Single Context con `useReducer` (sin Redux/MobX)
  - Estado normalizado y optimizado
  - Memoizacion selectiva con `useMemo`/`useCallback`

- **API Layer**
  - JWT Rotation automatico
  - Retry logic con exponential backoff
  - Request caching con TTL configurable
  - Request deduplication
  - Manejo centralizado de errores

- **Optimistic Updates**
  - Actualizacion inmediata de UI
  - Rollback automatico en caso de error

- **Validacion**
  - Zod schemas para validacion estricta
  - TypeScript strict mode

- **Calidad de Codigo**
  - ESLint + Prettier
  - Testing con Vitest + React Testing Library
  - MSW para mocking de APIs

## Estructura del Proyecto

```
octapus/
├── akicti/                    # Backend Django
│   ├── akicti/               # Configuracion del proyecto
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── pagination.py
│   ├── alerts/               # App de alertas y evidencias
│   │   ├── models.py        # Modelos Alert y Evidence
│   │   ├── serializers.py   # Serializers DRF
│   │   ├── views.py         # ViewSets
│   │   ├── permissions.py   # Permisos custom
│   │   └── urls.py
│   ├── users/               # App de autenticacion
│   │   ├── serializers.py   # Serializers de usuario
│   │   ├── views.py         # Vistas de auth
│   │   ├── throttling.py    # Rate limiting
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend-akicti/          # Frontend React
│   ├── src/
│   │   ├── api/             # Cliente API con JWT
│   │   ├── components/      # Componentes UI
│   │   ├── contexts/        # Estado global
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript + Zod
│   │   └── routes/          # Configuracion de rutas
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml        # Orquestacion de servicios
└── README.md                # Este archivo
```

## Endpoints API

### Autenticacion (`/api/v1/auth/`)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/register/` | Registrar usuario |
| POST | `/login/` | Obtener tokens JWT |
| POST | `/logout/` | Invalidar refresh token |
| POST | `/token/refresh/` | Rotar tokens |
| POST | `/token/verify/` | Verificar token |

### Alertas (`/api/v1/alerts/`)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/` | Listar alertas (con filtros, busqueda, paginacion) |
| GET | `/<id>/` | Detalle de alerta |
| POST | `/` | Crear alerta |
| GET | `/<id>/evidences/` | Listar evidencias de alerta |

**Parametros de filtrado:**
- `?severity=critical` - Filtrar por severidad
- `?status=open` - Filtrar por estado
- `?search=phishing` - Buscar por titulo
- `?page=1&page_size=15` - Paginacion

### Evidencias (`/api/v1/evidences/`)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| PATCH | `/<id>/` | Marcar evidencia como revisada |

## Despliegue con Docker

### Servicios

| Servicio | Puerto Externo | Puerto Interno | Imagen |
|----------|----------------|----------------|--------|
| db (PostgreSQL) | 3310 | 5432 | postgres:16-alpine |
| backend (Django) | 8000 | 8000 | python:3.12-slim |
| frontend (React) | 3000 | 80 | nginx:alpine |

### Archivos de Configuracion

- `docker-compose.yml` - Orquestacion de los 3 servicios
- `.env` - Variables de entorno
- `akicti/Dockerfile` - Imagen Python 3.12 + Gunicorn
- `akicti/entrypoint.sh` - Script de inicializacion
- `frontend-akicti/Dockerfile` - Multi-stage build (Node + Nginx)
- `frontend-akicti/nginx.conf` - Configuracion con proxy al backend

### Comandos

```bash
# Construir y levantar todos los servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Solo la base de datos
docker-compose up db -d

# Detener todo
docker-compose down

# Detener y eliminar volumenes (CUIDADO: borra datos)
docker-compose down -v

# Reconstruir un servicio especifico
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

## Instalacion Local (Desarrollo)

### Backend

```bash
cd akicti

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
python manage.py migrate

# Cargar datos de prueba
python manage.py seed_data

# Ejecutar servidor
python manage.py runserver
```

### Frontend

```bash
cd frontend-akicti

# Instalar dependencias
npm install

# Configurar variables de entorno
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Ejecutar en desarrollo
npm run dev
```

## Conexion a PostgreSQL

```
Host: localhost
Puerto: 3310
Database: akicti_db
Usuario: akicti_user
Password: akicti_secure_password_123
```

```bash
# Conectar desde terminal
psql -h localhost -p 3310 -U akicti_user -d akicti_db
```

## Testing

### Backend
```bash
cd akicti
python manage.py test alerts users
```

### Frontend
```bash
cd frontend-akicti
npm run test
npm run test:coverage
```

## Codigos de Estado HTTP

| Codigo | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Bad Request - Datos invalidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no existe |
| 429 | Too Many Requests - Rate limit |

## Licencia

Proyecto privado - Todos los derechos reservados.
