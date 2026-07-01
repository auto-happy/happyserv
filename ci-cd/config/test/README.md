# Environnement de Test

## Configuration

- **URL** : https://test.happyserv.fr
- **Domaine** : test.happyserv.fr
- **SSL** : Let's Encrypt (automatique)
- **Base de données** : PostgreSQL dédiée
- **Redis** : Instance dédiée

## Accès

- **Serveur** : test.happyserv.fr
- **SSH** : clé déployée
- **Docker** : Docker CE

## Démarrage

```bash
# SSH vers le serveur de test
ssh deploy@test.happyserv.fr

# Mettre à jour le code
cd /home/happyserv
git pull origin develop

# Déployer
./ci-cd/scripts/deploy.sh test
```

## Variables d'environnement

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `test` | Mode Node.js |
| `DB_HOST` | `postgres` | Hôte PostgreSQL (conteneur) |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `REDIS_HOST` | `redis` | Hôte Redis (conteneur) |
| `REDIS_PORT` | `6379` | Port Redis |
| `API_URL` | `https://api.test.happyserv.fr` | URL API |
| `PORTAL_URL` | `https://test.happyserv.fr` | URL Portail |

## Tests

```bash
# Lancer les tests
./ci-cd/scripts/quality.sh

# Vérifier le déploiement
./ci-cd/scripts/verify.sh test
```

## Base de données

- Les migrations sont exécutées automatiquement au déploiement
- Les données de test sont chargées via seeds

## Monitoring

- Health check toutes les 5 minutes
- Alertes Slack en cas de problème
- Logs centralisés via Docker
