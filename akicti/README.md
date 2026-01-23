# Akicti - Evidence Inbox Backend

Backend Django + DRF para la plataforma Akicti con autenticación JWT robusta.

## Características Implementadas

### Autenticación JWT Avanzada
- Rotación de refresh tokens (ROTATE_REFRESH_TOKENS = True)
- Blacklisting de refresh tokens comprometidos
- Tokens de acceso cortos (30 minutos)
- Refresh tokens con expiración (7 días)
- Almacenamiento de refresh tokens en base de datos para invalidación
- Endpoint para logout que blacklistee el refresh token

### Modelos
- **Alert**: Gestiona alertas con severidad (low/medium/high/critical), estado (open/in_progress/closed) y ownership
- **Evidence**: Evidencias asociadas a alertas con fuente (twitter/linkedin/instagram/web/agent), revisión y tracking de quién revisó y cuándo

### Endpoints API (/api/v1/)

#### Autenticación
- `POST /auth/register/` - Crear usuario, retornar tokens
- `POST /auth/login/` - Obtener tokens JWT
- `POST /auth/logout/` - Blacklist refresh token
- `POST /auth/token/refresh/` - Rotar refresh token
- `POST /auth/token/verify/` - Verificar token

#### Alerts
- `GET /alerts/` - Listar alerts (requiere autenticación)
  - Filtros: ?severity=high&status=open
  - Búsqueda: ?search=phishing
  - Paginación: ?page=1&page_size=20
  - Orden: -created_at
  - Solo ver alerts del usuario o todos si es admin
- `GET /alerts/<id>/` - Detalle de alert (requiere autenticación y ownership o admin)
- `GET /alerts/<id>/evidences/` - Listar evidencias de alert
- `POST /alerts/` - Crear nueva alert (requiere autenticación)

#### Evidences
- `PATCH /evidences/<id>/` - Actualizar estado de revisión
  - Solo actualizar is_reviewed
  - Auto-set reviewed_by y reviewed_at cuando is_reviewed=True
  - Validación: solo owner del alert o admin puede revisar

## Configuración JWT Segura

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
```

## Requisitos Técnicos

- Cache (Redis o LocMem para desarrollo)
- Rate limiting diferenciado (más estricto para login/register)
- Auditoría de logs (logins, review de evidencias)
- CORS configurado para dominios frontend específicos
- Headers de seguridad (HSTS, CSP, X-Frame-Options)
- Validación de password strength en registro
- Throttling por usuario para prevenir abuso

## Estructura del Proyecto

```
akicti/
├── akicti/          # Configuración del proyecto
├── alerts/           # App de alerts/evidences
│   ├── models.py     # Modelos Alert y Evidence
│   ├── serializers.py # Serializers de DRF
│   ├── views.py      # ViewSets de DRF
│   ├── permissions.py # Permisos custom
│   ├── urls.py       # URLs de la app
│   └── admin.py      # Configuración admin
├── users/            # App para autenticación
│   ├── serializers.py # Serializers de usuario
│   ├── views.py      # Vistas de autenticación
│   ├── throttling.py # Throttles custom
│   ├── urls.py       # URLs de autenticación
│   └── admin.py      # Configuración admin
├── manage.py
├── requirements.txt
├── .env.example
└── API_COLLECTION.md # Colección de cURL/Postman
```

## Instalación

1. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus valores
```

4. Ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Crear superusuario:
```bash
python manage.py createsuperuser
```

6. Ejecutar servidor:
```bash
python manage.py runserver
```

## Ejecutar Tests

```bash
python manage.py test alerts users
```

## Códigos de Estado HTTP

### 401 UNAUTHORIZED
No autenticado / Credenciales inválidas

### 403 FORBIDDEN
Autenticado pero no autorizado (permisos insuficientes)

### 400 BAD REQUEST
Petición malformada / Validación fallida

### 404 NOT FOUND
Recurso no existe

### 429 TOO MANY REQUESTS
Rate limiting excedido

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

## Scripts Auxiliares

Generar SECRET_KEY segura:
```bash
python generate_secret_key.py
```