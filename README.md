Archivos Creados

  Directorio raiz /home/soler/octapus/:
  - docker-compose.yml - Orquestacion de los 3 servicios
  - .env - Variables de entorno
  - .dockerignore - Archivos a ignorar en el build

  Backend Django /home/soler/octapus/akicti/:
  - Dockerfile - Imagen Python 3.12 + Gunicorn
  - entrypoint.sh - Script de inicializacion (migraciones + servidor)
  - .dockerignore - Exclusiones del build

  Frontend React /home/soler/octapus/frontend-akicti/:
  - Dockerfile - Multi-stage build (Node + Nginx)
  - nginx.conf - Configuracion con proxy al backend
  - .dockerignore - Exclusiones del build

  Servicios
  ┌──────────────────┬────────────────┬────────────────┬────────────────────┐
  │     Servicio     │ Puerto Externo │ Puerto Interno │       Imagen       │
  ├──────────────────┼────────────────┼────────────────┼────────────────────┤
  │ db (PostgreSQL)  │ 3310           │ 5432           │ postgres:16-alpine │
  ├──────────────────┼────────────────┼────────────────┼────────────────────┤
  │ backend (Django) │ 8000           │ 8000           │ python:3.12-slim   │
  ├──────────────────┼────────────────┼────────────────┼────────────────────┤
  │ frontend (React) │ 3000           │ 80             │ nginx:alpine       │
  └──────────────────┴────────────────┴────────────────┴────────────────────┘
  Como usar

  # Crear al directorio con venv para el proyecto
  python3 -m venv mi_proyecto
  
  # Entrar y activar proyecto
  cd mi_proyecto
  source bin/activate

  # Ingresar al proyecto y clonar repositorio
  git clone http://url.repositorio

  # Verificar docker y docker-compose 
  docker --version 
  docker-compose --version

  # Construir y levantar todos los servicios
  docker compose up --build -d

  # Ver logs
  docker compose logs -f

  # Solo la base de datos
  docker compose up db -d

  # Detener todo
  docker compose down

  # Detener y eliminar volumenes (CUIDADO: borra datos)
  docker compose down -v

  Conexion a PostgreSQL

  - Host: localhost
  - Puerto: 3310
  - Database: akicti_db
  - Usuario: akicti_user
  - Password: akicti_secure_password_123

  # Conectar desde terminal
  psql -h localhost -p 3310 -U akicti_user -d akicti_db
