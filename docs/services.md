# Fiches Techniques — Services

## Nginx

| Propriété | Valeur |
|-----------|--------|
| Image | nginx:alpine |
| Ports | 80, 443 |
| Réseau | frontend_network |
| Volumes | nginx_html, nginx_certs, nginx_logs |
| Read-only | oui |
| Capabilities | NET_BIND_SERVICE |
| tmpfs | /tmp, /var/cache/nginx |

Fichiers de configuration :
- `/etc/nginx/nginx.conf`
- `/etc/nginx/conf.d/security-headers.conf`
- `/etc/nginx/conf.d/ssl.conf`
- `/etc/nginx/sites-available/telehappy`
- `/etc/nginx/sites-available/happyserv`

## API

| Propriété | Valeur |
|-----------|--------|
| Port | 3000 (interne) |
| Réseau | backend_network, db_network, redis_network |
| Stack | Express.js + TypeScript |
| Base de données | PostgreSQL |
| Cache | Redis |
| Auth | JWT (access + refresh) |

Endpoints :
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- GET /api/v1/users
- GET /api/v1/licenses
- GET /api/v1/devices

## Portal

| Propriété | Valeur |
|-----------|--------|
| Port | 80 (interne) |
| Réseau | backend_network |
| Stack | React + Vite + TypeScript |
| Pages | Dashboard, Licences, Appareils, Stats, Admin |

## Telehappy

| Propriété | Valeur |
|-----------|--------|
| Image | nginx:alpine |
| Ports | 80, 443 |
| Réseau | frontend_network, backend_network |
| Contenu | Site statique telehappy.fr |

## PostgreSQL

| Propriété | Valeur |
|-----------|--------|
| Image | postgres:15-alpine |
| Port | 5432 (interne) |
| Réseau | db_network |
| Volume | postgres_data |
| Utilisateur | happyserv |
| Base | happyserv |
| User non-root | postgres |

Tables : users, roles, licenses, devices, notifications, audit_logs, app_settings, app_versions, sync_log

## Redis

| Propriété | Valeur |
|-----------|--------|
| Image | redis:7-alpine |
| Port | 6379 (interne) |
| Réseau | redis_network |
| Volume | redis_data |
| Utilisation | Cache sessions, rate limiting, queues |
