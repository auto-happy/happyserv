# Environnement de Production

## Configuration

- **URL** : https://happyserv.fr
- **Domaine** : happyserv.fr, telehappy.fr
- **SSL** : Let's Encrypt (renouvellement automatique)
- **Base de données** : PostgreSQL avec réplication
- **Redis** : Cluster Redis

## Accès

- **Serveur** : happyserv.fr
- **SSH** : clé déployée (accès restreint)
- **Docker** : Docker CE (rootless)

## Déploiement

```bash
# Déploiement automatique via CI/CD (recommandé)
# Ou manuellement:
ssh deploy@happyserv.fr
cd /home/happyserv
git pull origin main
./ci-cd/scripts/deploy.sh prod
```

## Variables d'environnement

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Mode production |
| `DB_HOST` | `postgres` | Hôte PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `REDIS_HOST` | `redis` | Hôte Redis |
| `REDIS_PORT` | `6379` | Port Redis |
| `JWT_SECRET` | _(secret)_ | Clé JWT |
| `API_URL` | `https://api.happyserv.fr` | URL API |
| `PORTAL_URL` | `https://happyserv.fr` | URL Portail |

## Sécurité

- UFW : ports 22, 80, 443 uniquement
- Fail2Ban : protection SSH, Nginx, API
- Docker : read-only filesystem, no-new-privileges
- SSL : Let's Encrypt (renouvellement automatique)
- Backups : quotidiens, hebdomadaires, mensuels
- Monitoring : continu avec alertes

## Procédures

### Rollback

```bash
./ci-cd/scripts/rollback.sh prod <service>
```

### Backup

```bash
./scripts/backup/backup-full.sh prod
```

### Maintenance

```bash
# Mode maintenance
docker compose stop nginx
# ... opérations ...
docker compose start nginx
```

## SLA

- Disponibilité cible : 99.9%
- Fenêtre de maintenance : dimanche 02h00-04h00
- Temps de réponse incident : < 30 minutes
