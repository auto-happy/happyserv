# Guide Docker HappyServ

## Images

```bash
# Build API
docker build -t happyserv-api:latest -f docker/services/node/Dockerfile api/

# Build Portal
docker build -t happyserv-portal:latest -f docker/services/node/Dockerfile website-app/

# Build Telehappy
docker build -t happyserv-telehappy:latest -f docker/services/node/Dockerfile website-download/
```

## Docker Compose

```bash
# Production
docker compose -f docker/compose/prod/docker-compose.yml up -d

# Dev
docker compose -f docker/compose/dev/docker-compose.yml up -d

# Test
docker compose -f docker/compose/test/docker-compose.yml up -d
```

## Commandes utiles

```bash
# Logs
docker compose logs -f api
docker compose logs -f nginx

# Exécution
docker compose exec postgres psql -U happyserv -d happyserv

# Backup DB
docker compose exec postgres pg_dump -U happyserv happyserv > backup.sql

# Restore DB
cat backup.sql | docker compose exec -T postgres psql -U happyserv -d happyserv

# Clean
docker compose down -v  # Attention : supprime les volumes
docker system prune -a  # Nettoie tout
```

## Réseaux

```bash
# Liste
docker network ls

# Inspection
docker network inspect frontend_network

# Création (si nécessaire)
docker network create frontend_network
docker network create backend_network
docker network create db_network
docker network create redis_network
```

## Volumes

```bash
# Liste
docker volume ls

# Backup volume
docker run --rm -v postgres_data:/source -v /backup:/dest alpine tar czf /dest/postgres_data.tar.gz -C /source .

# Restore volume
docker run --rm -v postgres_data:/dest -v /backup:/source alpine tar xzf /source/postgres_data.tar.gz -C /dest
```
