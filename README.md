# Akicti – Evidence Inbox Platform

Akicti es una plataforma de **monitoreo y gestión de evidencias de seguridad** que centraliza alertas provenientes de múltiples fuentes para facilitar su análisis, clasificación y seguimiento por parte de equipos de ciberseguridad.

---

## 🚀 Features

- Gestión centralizada de alertas de seguridad
- Clasificación por severidad y estado
- Asociación de múltiples evidencias por alerta
- Revisión y auditoría de evidencias
- Autenticación segura basada en JWT
- Arquitectura desacoplada y escalable

---

## 🧩 System Overview

El sistema permite:

- **Gestión de Alertas**  
  Crear, listar y filtrar alertas clasificadas por severidad (`critical`, `high`, `medium`, `low`) y estado (`open`, `in_progress`, `closed`).

- **Evidencias Asociadas**  
  Cada alerta puede contener múltiples evidencias provenientes de distintas fuentes (Twitter, LinkedIn, Instagram, Web, Agentes).

- **Revisión de Evidencias**  
  Los analistas pueden marcar evidencias como revisadas, con trazabilidad automática de quién y cuándo realizó la revisión.

- **Autenticación Segura**  
  Autenticación JWT con rotación de tokens y blacklisting.

---

## 🏗️ Architecture

Akicti sigue una arquitectura **REST desacoplada**, separando claramente frontend, backend y base de datos:

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Frontend │ JSON │ Backend │ │ Database │
│ React + Vite │◄───────►│ Django + DRF │◄───────►│ PostgreSQL │
│ Port: 3000 │ API │ Port: 8000 │ │ Port: 5432 │
└─────────────────┘ └─────────────────┘ └─────────────────┘


---

## 🛠️ Tech Stack

### Backend

| Tecnología | Propósito |
|------------|-----------|
| Django 5.x | Framework web principal |
| Django REST Framework | API REST |
| SimpleJWT | Autenticación JWT |
| django-filter | Filtrado de querysets |
| django-cors-headers | Manejo de CORS |
| PostgreSQL | Base de datos |

#### Security & Best Practices

- Rotación de refresh tokens
- Blacklisting de tokens comprometidos
- Tokens de acceso de corta duración (30 min)
- Refresh tokens con expiración (7 días)
- Rate limiting diferenciado
- Headers de seguridad (HSTS, CSP, X-Frame-Options)
- Validación de contraseñas
- Throttling por usuario
- Auditoría de logs

---

### Frontend

| Tecnología | Propósito |
|------------|-----------|
| React 18 | Biblioteca UI |
| TypeScript | Tipado estático |
| Vite | Build tool |
| Tailwind CSS | Estilos |
| React Router v7 | Routing |
| Axios | HTTP client |
| Zod | Validación de schemas |

#### Frontend Best Practices

- Gestión de estado con Context API + `useReducer`
- Estado normalizado y optimizado
- Memoización selectiva (`useMemo`, `useCallback`)
- Capa de API con:
  - Rotación automática de JWT
  - Retry con exponential backoff
  - Cache con TTL
  - Deduplicación de requests
  - Manejo centralizado de errores
- Optimistic UI updates con rollback automático
- Testing con Vitest y React Testing Library
- Mocking de APIs con MSW

---

## 📁 Project Structure

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


---

## 🔌 API Endpoints

### Authentication (`/api/v1/auth/`)

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/register/` | Registrar usuario |
| POST | `/login/` | Obtener tokens JWT |
| POST | `/logout/` | Invalidar refresh token |
| POST | `/token/refresh/` | Rotar tokens |
| POST | `/token/verify/` | Verificar token |

---

### Alerts (`/api/v1/alerts/`)

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/` | Listar alertas |
| GET | `/<id>/` | Detalle de alerta |
| POST | `/` | Crear alerta |
| GET | `/<id>/evidences/` | Evidencias de la alerta |

**Query parameters:**
- `severity`
- `status`
- `search`
- `page`, `page_size`

---

### Evidences (`/api/v1/evidences/`)

| Method | Endpoint | Description |
|-------|----------|-------------|
| PATCH | `/<id>/` | Marcar evidencia como revisada |

---

## 🐳 Docker Deployment

### Services

| Service | External Port | Internal Port | Image |
|--------|---------------|---------------|-------|
| PostgreSQL | 3310 | 5432 | postgres:16-alpine |
| Backend | 8000 | 8000 | python:3.12-slim |
| Frontend | 3000 | 80 | nginx:alpine |

### Run with Docker

## Build images and run containers 
docker-compose up --build -d

## Check if any containers are running.
docker ps

## Turn off containers
docker-compose down

## Turn off containers and delete volumes (WARNING: Delete data)
docker-compose down -v 

### 🧪 Testing

## Backend
python manage.py test alerts users

## Frotend
npm run test
npm run test:coverage

### License
Private project.  
All rights reserved.



