CONTEXTO:
Estoy construyendo Akicti, una plataforma con arquitectura REST desacoplada: Frontend (React) consume APIs en JSON expuestas por Backend (Django) con autenticación JWT robusta.

OBJETIVO BACKEND:
Implementar la funcionalidad "Evidence Inbox" con Django + DRF incluyendo autenticación JWT con rotación de refresh tokens y blacklisting.

REQUISITOS ESPECÍFICOS:

1. AUTENTICACIÓN JWT AVANZADA:
   - Usar `djangorestframework-simplejwt` con configuraciones de seguridad
   - Implementar rotación de refresh tokens (ROTATE_REFRESH_TOKENS = True)
   - Blacklisting de refresh tokens comprometidos
   - Tokens de acceso cortos (15-30 minutos)
   - Refresh tokens con expiración (7 días)
   - Almacenamiento de refresh tokens en base de datos para invalidación
   - Endpoint para logout que blacklistee el refresh token

2. MODELOS:
   - Alert:
     * id (autoincremental)
     * title (CharField, max_length=200)
     * severity (choices: low/medium/high/critical)
     * status (choices: open/in_progress/closed)
     * created_at (DateTimeField auto_now_add=True)
     * owner (ForeignKey a User, related_name='alerts')  # Para ownership
   
   - Evidence:
     * id (autoincremental)
     * alert (ForeignKey a Alert, related_name='evidences', on_delete=models.CASCADE)
     * source (choices: twitter/linkedin/instagram/web/agent)
     * summary (TextField)
     * is_reviewed (BooleanField, default=False)
     * created_at (DateTimeField auto_now_add=True)
     * reviewed_by (ForeignKey a User, null=True, blank=True)  # Quién revisó
     * reviewed_at (DateTimeField, null=True, blank=True)  # Cuándo se revisó

3. ENDPOINTS (todos en /api/v1/):
   a) AUTENTICACIÓN:
      - POST /auth/register/ (crear usuario, retornar tokens)
      - POST /auth/login/ (obtener tokens JWT)
      - POST /auth/logout/ (blacklist refresh token)
      - POST /auth/token/refresh/ (rotar refresh token)
      - POST /auth/token/verify/ (verificar token)
   
   b) ALERTS:
      - GET /alerts/ (requiere autenticación)
         * Filtros: ?severity=high&status=open
         * Búsqueda: ?search=phishing
         * Paginación: ?page=1&page_size=20
         * Orden: -created_at
         * Solo ver alerts del usuario o todos si es admin
      
      - GET /alerts/<id>/ (requiere autenticación)
         * Si no es owner o admin → 403
      
      - GET /alerts/<id>/evidences/ (requiere autenticación)
         * Paginación de evidencias
         * Orden: -created_at
   
   c) EVIDENCES:
      - PATCH /evidences/<id>/ (requiere autenticación)
         * Solo actualizar is_reviewed
         * Auto-set reviewed_by y reviewed_at cuando is_reviewed=True
         * Validación: solo owner del alert o admin puede revisar

4. CONFIGURACIÓN JWT SEGURA:
```python
# settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,  # IMPORTANTE
    'BLACKLIST_AFTER_ROTATION': True,  # IMPORTANTE
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,  # Desde .env
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}
REQUISITOS TÉCNICOS AVANZADOS:

Cache para reducir carga de verificación JWT (Redis )

Rate limiting diferenciado: más estricto para login/register

Auditoría de logs: registrar logins, review de evidencias

CORS configurado solo para dominios frontend específicos

Headers de seguridad (HSTS, CSP, X-Frame-Options)

Validación de password strength en registro

Throttling por usuario para prevenir abuso

ESTRUCTURA DE APPS:

akicti/ (proyecto principal)

alerts/ (app de alerts/evidences)

users/ (app para autenticación extendida)

models.py (UserProfile si necesitas campos extra)

serializers.py (RegisterSerializer, UserSerializer)

views.py (RegisterView, LogoutView)

permissions.py (IsOwnerOrAdmin, IsAdmin)

MIGRACIONES NECESARIAS:

User model personalizado (si aplica)

OutstandingToken y BlacklistedToken de simplejwt

Alert y Evidence con relaciones a User

VALIDACIONES DE SEGURIDAD:

Rate limit: 5 intentos de login por minuto por IP

Validar que refresh tokens solo se usen una vez

Sanitizar todos los inputs de búsqueda

Prevenir IDOR en alerts/<id>/ (verificar ownership)

SQL injection protection en filtros

XSS protection en summary/text fields

TESTS IMPERATIVOS:

Test de rotación de tokens (refresh → nuevo access y refresh)

Test de blacklist después de logout

Test de permisos de ownership

Test de rate limiting

Test de validación de campos en PATCH

IMPORTANTE:

Implementa todo el flujo de JWT con rotación y blacklisting

Incluye script para generar SECRET_KEY segura

Proporciona colección de Postman/curl para test

Muestra cómo manejar token expiration en frontend

Incluye manejo de responses HTTP con mensajes claros:

ESTADOS HTTP DE AUTENTICACIÓN/AUTORIZACIÓN
🚨 401 UNAUTHORIZED
Significado: No autenticado / Credenciales inválidas
Causas:

Sin token/credenciales

Token expirado

Token malformado

Credenciales incorrectas
Respuesta típica: WWW-Authenticate header

🚫 403 FORBIDDEN
Significado: Autenticado pero no autorizado
Causas:

Usuario no tiene permisos para el recurso

Owner intenta acceder a recurso de otro

Usuario regular intenta acceder a ruta admin
No incluye: Header de autenticación

📋 RESTO DE ERRORES CLIENTE 4xx
400 BAD REQUEST
Petición malformada (JSON inválido)

Parámetros faltantes/incorrectos

Validación fallida

404 NOT FOUND
Recurso no existe

Endpoint incorrecto

405 METHOD NOT ALLOWED
Método HTTP no permitido para la ruta

Ej: PUT en endpoint que solo acepta GET

409 CONFLICT
Conflicto con estado actual

Ej: Email ya registrado, recurso duplicado

429 TOO MANY REQUESTS
Rate limiting

Demasiadas peticiones en corto tiempo
