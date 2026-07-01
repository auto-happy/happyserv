# Infrastructure HappyServ

## Vue d'ensemble

6 services Docker, 5 réseaux isolés, 8 volumes persistants.

## Services

| Service | Image | Ports | Réseau | Volume |
|---------|-------|-------|--------|--------|
| nginx | nginx:alpine | 80, 443 | frontend_network | nginx_html, nginx_certs, nginx_logs |
| api | happyserv-api | 3000 | backend_network | api_logs |
| portal | happyserv-portal | 80 (interne) | backend_network | — |
| telehappy | nginx:alpine | 80, 443 | backend_network | telehappy_html |
| postgres | postgres:15-alpine | 5432 | db_network | postgres_data |
| redis | redis:7-alpine | 6379 | redis_network | redis_data |

## Réseaux

| Réseau | Sous-réseau | Services |
|--------|------------|----------|
| frontend_network | 172.20.0.0/16 | nginx, telehappy |
| backend_network | 172.21.0.0/16 | api, portal, telehappy |
| db_network | 172.22.0.0/16 | api, postgres |
| redis_network | 172.23.0.0/16 | api, redis |
| monitoring_network | 172.24.0.0/16 | prometheus, grafana, alertmanager |

## Volumes

| Volume | Type | Contenu |
|--------|------|---------|
| postgres_data | persist | Données PostgreSQL |
| redis_data | persist | Données Redis |
| nginx_html | persist | Static files servis par Nginx |
| nginx_certs | persist | Certificats SSL Let's Encrypt |
| nginx_logs | persist | Logs Nginx (rotation) |
| api_logs | persist | Logs API |
| telehappy_html | bind | Site telehappy build |
| grafana_data | persist | Données Grafana |
