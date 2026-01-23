CONTEXTO:
Estoy construyendo Akicti, una plataforma con arquitectura REST desacoplada: Frontend (React) consume APIs en JSON expuestas por Backend (Django) con autenticación JWT robusta.

OBJETIVO FRONTEND:

Senior React Architect especializado en aplicaciones empresariales de alta seguridad y performance. Experto en arquitecturas desacopladas, gestión de estado avanzada, y prácticas de desarrollo robusto con enfoque en SOLID, testing integral y seguridad de datos.

Contexto del Proyecto
Akicti es una plataforma de monitoreo con arquitectura REST desacoplada. El frontend React consume APIs Django que retornan JSON con autenticación JWT. Requiere construir dos pantallas principales con experiencia de usuario fluida, validación estricta de datos y manejo de errores resiliente.

Tareas Específicas a Implementar
1. Pantalla: Lista de Alertas
Tabla/listado con columnas: título, severidad, estado, fecha de creación

Sistema de filtros para severidad y estado (checkboxes o dropdowns)

Búsqueda por título con debounce simple (300-500ms)

Paginación cliente-servidor sincronizada

Diseño responsive con buen manejo de datos vacíos/loading

2. Pantalla: Detalle de Alerta + Evidencias
Vista detallada de todos los campos de la alerta

Lista paginada de evidencias relacionadas (5-15 por alerta)

Cada evidencia muestra: fuente, resumen, fecha creación, checkbox "Revisado"

Al marcar "Revisado":

Llamada PATCH inmediata al backend

Actualización optimista en UI o refetch después de éxito

Manejo visual de estados loading/error

Prevención de loops infinitos por mal uso de hooks/estado

Requisitos Técnicos No Negociables
Arquitectura de Estado
Single Context con useReducer para estado global centralizado

Estado normalizado y optimizado para updates frecuentes

Memoización selectiva con useMemo/useCallback donde sea necesario

Patrón de optimistic updates con rollback automático en errores

Capa de API (api.js)
Interceptors para inyección automática de JWT

Leer todo el API_COLLECTION.md que tiene los endpoint del backend que se deben consultar para el frontend

Request deduplication: evitar llamadas duplicadas simultáneas

Retry logic con exponential backoff para fallos transitorios

Response caching para requests idempotentes (GET) con TTL configurable

Cancelación de requests en desmontaje de componentes

Manejo centralizado de errores HTTP

Seguridad y Validación
Validación estricta de todos los datos provenientes de endpoints

Sanitización de inputs antes de enviar al backend

JWT secret rotation a continuacion te dejo la recomendacion del backend para JWT rotation

## Manejo de Token Expiration en Frontend

```javascript
async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('access_token');
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      const refreshResponse = await fetch('/api/v1/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${data.access}`,
          },
        });
      } else {
        window.location.href = '/login';
      }
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

Protección contra XSS en renderizado de datos dinámicos

Headers de seguridad en todas las requests (CSP, XSS protection)

Testing Integral
Jest + React Testing Library para unit tests de componentes

Cypress para E2E tests de flujos completos

MSW (Mock Service Worker) para mocking de APIs en tests

Coverage mínimo: 80% para lógica de negocio, 60% para componentes UI

Tests de integración para context + hooks

Performance
Virtualización de listas grandes (si aplica)

Code splitting por rutas

Lazy loading de componentes pesados

Optimización de re-renders con React.memo donde sea necesario

Bundle analysis y optimización de imports

Data Mocking
Crear dataset de prueba con:

20-30 alertas con datos realistas

Cada alerta con 5-15 evidencias relacionadas

Mezcla de severidades (critical, high, medium, low)

Variedad de estados (open, closed, investigating, pending)

Fixtures reutilizables entre development y testing

Calidad de Código
Principios SOLID aplicados a componentes y hooks

TypeScript estricto con interfaces bien definidas

Custom hooks para lógica reutilizable

Patrón de composición sobre herencia

Documentación JSDoc para funciones complejas

Estructura de carpetas por feature/domain

Linting estricto (ESLint con reglas Airbnb o similares)

Entregables Esperados
Código fuente completo con estructura profesional

Tests unitarios y de integración con MSW

Tests E2E con Cypress para flujos críticos

Documentación de arquitectura y decisiones técnicas

Scripts de build optimizados para production

Configuration management para diferentes ambientes

Error tracking implementado (Sentry o similar)

Performance monitoring básico

Restricciones y Consideraciones
NO usar Redux, MobX, o cualquier otra librería de estado externa (solo Context + useReducer)

NO exponer tokens JWT en localStorage sin encriptación

NO permitir re-renders innecesarios en listas grandes

NO mezclar lógica de negocio con componentes UI

Siempre validar schemas de datos entrantes con Zod o similar

Implementar logging estructurado para debugging en producción

Considerar accessibility (WCAG AA mínimo) en todos los componentes

Criterios de Aceptación
✅ Todas las funcionalidades descritas implementadas

✅ Tests pasando en CI/CD pipeline

✅ Performance: First Contentful Paint < 1.5s

✅ Bundle size optimizado (< 200KB gzipped inicial)

✅ Zero vulnerabilities críticas en dependencias

✅ Responsive design funcionando en mobile/desktop

✅ Manejo elegante de estados de error/loading

✅ Código mantenible y extensible siguiendo SOLID

El agente debe proporcionar una solución completa, lista para producción, que balancee performance, seguridad y mantenibilidad a largo plazo.

## Manejo de Token Expiration en Frontend

```javascript
async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('access_token');
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      const refreshResponse = await fetch('/api/v1/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${data.access}`,
          },
        });
      } else {
        window.location.href = '/login';
      }
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```