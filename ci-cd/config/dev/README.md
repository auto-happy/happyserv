# Environnement de Développement

## Configuration

- **URL** : http://dev.happyserv.local
- **Domaine** : dev.happyserv.local
- **SSL** : Auto-signé (mkcert)
- **Base de données** : PostgreSQL locale
- **Redis** : Local

## Accès

- **Serveur** : localhost
- **SSH** : utilisateur local
- **Docker** : Docker Desktop / Docker CE

## Démarrage

```bash
# Cloner le dépôt
git clone git@github.com:happyserv/happyserv.git
cd happyserv

# Copier la configuration
cp .env.dev.example .env.dev

# Démarrer les services
docker compose -f docker-compose.yml up -d

# Voir les logs
docker compose logs -f
```

## Variables d'environnement

| Variable | Valeur par défaut | Description |
|----------|------------------|-------------|
| `NODE_ENV` | `development` | Mode Node.js |
| `DB_HOST` | `localhost` | Hôte PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `REDIS_HOST` | `localhost` | Hôte Redis |
| `REDIS_PORT` | `6379` | Port Redis |

## Services

| Service | Port | URL |
|---------|------|-----|
| API | 3000 | http://localhost:3000 |
| Portal | 5173 | http://localhost:5173 |
| Telehappy | 5174 | http://localhost:5174 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| Nginx | 80 | http://localhost:80 |

## Déploiement

```bash
./ci-cd/scripts/deploy.sh dev
```
