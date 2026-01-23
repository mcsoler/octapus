# Akicti Frontend

Frontend de la plataforma de monitoreo Akicti, construido con React + TypeScript + Vite.

## Características

- **Arquitectura**: React + TypeScript con Vite
- **Estado Global**: Context + useReducer (sin Redux/MobX)
- **API Client**: Axios con JWT rotation, retry logic, caching y request deduplication
- **Validación**: Zod schemas para validación estricta de datos
- **Routing**: React Router v7
- **Testing**: Vitest + React Testing Library + MSW
- **Linting**: ESLint + Prettier
- **Estilos**: Tailwind CSS

## Estructura del Proyecto

```
src/
├── api/              # Capa de API con JWT rotation
├── components/        # Componentes UI reutilizables
│   ├── ui/          # Componentes base
│   └── alerts/      # Componentes de alertas
├── contexts/          # Context global con useReducer
├── features/          # Features por dominio
├── fixtures/          # Datos mock para desarrollo/testing
├── hooks/             # Custom hooks reutilizables
├── lib/               # Utilidades
├── routes/            # Configuración de rutas
├── test/              # Configuración de tests
└── types/             # Tipos TypeScript y Zod schemas
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format

# Tests
npm run test
npm run test:ui
npm run test:coverage
```

## Variables de Entorno

Crear un archivo `.env` en la raíz:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Pantallas Implementadas

### Lista de Alertas (`/alerts`)
- Tabla con listado de alertas
- Filtros por severidad (critical, high, medium, low)
- Filtros por estado (open, closed, investigating, pending)
- Búsqueda por título con debounce (300ms)
- Paginación sincronizada con el backend
- Manejo de estados loading/error/empty

### Detalle de Alerta (`/alerts/:id`)
- Vista detallada de todos los campos de la alerta
- Lista paginada de evidencias relacionadas
- Cada evidencia muestra: fuente, resumen, fecha, checkbox "Revisado"
- Optimistic updates para checkbox de evidencias
- Automatic rollback en caso de error
- Manejo de estados loading/error

## Arquitectura de Estado

Single Context con `useReducer` para estado centralizado:

```typescript
AppState {
  alerts: { items, count, page, pageSize, loading, error, filters },
  alertDetail: { item, loading, error },
  evidences: { items, count, page, pageSize, loading, error },
  evidenceUpdate: { loading, error }
}
```

## API Layer

- **JWT Rotation**: Refresh automático de tokens expirados
- **Retry Logic**: Reintentos con exponential backoff
- **Caching**: Cache para requests GET con TTL configurable (5 min)
- **Deduplication**: Prevención de requests duplicados simultáneos
- **Error Handling**: Manejo centralizado de errores HTTP con toasts

## Optimistic Updates

Los updates de evidencias usan optimistic updates:

1. Actualizar UI inmediatamente (EVIDENCE_UPDATE_OPTIMISTIC)
2. Enviar PATCH al backend
3. Si éxito: actualizar con respuesta (EVIDENCE_UPDATE_SUCCESS)
4. Si error: rollback al estado original (EVIDENCE_UPDATE_ROLLBACK)

## Requisitos del Backend

El frontend se conecta a un backend Django REST con los siguientes endpoints:

- Auth: register, login, token/refresh, logout
- Alerts: GET, POST (con filtros, búsqueda y paginación)
- Evidences: GET, PATCH (para marcar como revisado)

Ver `api-collection.md` para la documentación completa de la API.
