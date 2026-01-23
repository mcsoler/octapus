# Akicti API - Postman Collection & cURL Commands

## Setup
Base URL: http://localhost:8000

## 1. REGISTER
### Request
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "StrongPass123!",
    "password_confirm": "StrongPass123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Response (201 Created)
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 2. LOGIN
### Request
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "StrongPass123!"
  }'
```

### Response (200 OK)
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 3. TOKEN REFRESH (Rotation)
### Request
```bash
curl -X POST http://localhost:8000/api/v1/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'
```

### Response (200 OK)
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 4. TOKEN VERIFY
### Request
```bash
curl -X POST http://localhost:8000/api/v1/auth/token/verify/ \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'
```

### Response (200 OK)
```json
{}
```

## 5. LOGOUT (Blacklist)
### Request
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'
```

### Response (200 OK)
```json
{
  "detail": "Successfully logged out"
}
```

## 6. CREATE ALERT
### Request
```bash
curl -X POST http://localhost:8000/api/v1/alerts/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "title": "Phishing Attack Detected",
    "severity": "high",
    "status": "open"
  }'
```

### Response (201 Created)
```json
{
  "id": 1,
  "title": "Phishing Attack Detected",
  "severity": "high",
  "status": "open",
  "created_at": "2026-01-20T23:00:00Z",
  "owner": 1,
  "evidences": []
}
```

## 7. LIST ALERTS (with filters, search, pagination)
### Request
```bash
# Basic list
curl -X GET http://localhost:8000/api/v1/alerts/ \
  -H "Authorization: Bearer <your_access_token>"

# With filters
curl -X GET "http://localhost:8000/api/v1/alerts/?severity=high&status=open" \
  -H "Authorization: Bearer <your_access_token>"

# With search
curl -X GET "http://localhost:8000/api/v1/alerts/?search=phishing" \
  -H "Authorization: Bearer <your_access_token>"

# With pagination
curl -X GET "http://localhost:8000/api/v1/alerts/?page=1&page_size=20" \
  -H "Authorization: Bearer <your_access_token>"
```

### Response (200 OK)
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Phishing Attack Detected",
      "severity": "high",
      "status": "open",
      "created_at": "2026-01-20T23:00:00Z",
      "owner": 1,
      "evidences_count": 0
    }
  ]
}
```

## 8. GET ALERT DETAIL
### Request
```bash
curl -X GET http://localhost:8000/api/v1/alerts/1/ \
  -H "Authorization: Bearer <your_access_token>"
```

### Response (200 OK)
```json
{
  "id": 1,
  "title": "Phishing Attack Detected",
  "severity": "high",
  "status": "open",
  "created_at": "2026-01-20T23:00:00Z",
  "owner": 1,
  "evidences": []
}
```

## 9. GET ALERT EVIDENCES
### Request
```bash
curl -X GET http://localhost:8000/api/v1/alerts/1/evidences/ \
  -H "Authorization: Bearer <your_access_token>"
```

### Response (200 OK)
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

## 10. UPDATE EVIDENCE (PATCH)
### Request
```bash
curl -X PATCH http://localhost:8000/api/v1/evidences/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "is_reviewed": true
  }'
```

### Response (200 OK)
```json
{
  "id": 1,
  "source": "twitter",
  "summary": "Suspicious activity detected",
  "is_reviewed": true,
  "created_at": "2026-01-20T23:00:00Z",
  "reviewed_by": 1,
  "reviewed_at": "2026-01-20T23:05:00Z"
}
```

## HTTP Error Responses

### 401 Unauthorized
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid"
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 429 Too Many Requests
```json
{
  "detail": "Request was throttled. Expected available in 60 seconds."
}
```

## Handling Token Expiration in Frontend

```javascript
// Refresh token when access token expires
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
      // Token expired, refresh it
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
        
        // Retry the original request
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${data.access}`,
          },
        });
      } else {
        // Refresh token invalid, redirect to login
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