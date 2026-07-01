# Procédure de Backup / Restauration

## Backup automatique

Le script `/home/happyserv/maintenance/scripts/backup.sh` gère les backups :

| Fréquence | Type | Rétention | Contenu |
|-----------|------|-----------|---------|
| Quotidienne | dump SQL + configs | 7 jours | DB, .env, nginx, scripts |
| Hebdomadaire | + apps + SSL | 4 semaines | + site builds, certs, logs |
| Mensuelle | archive complète | 3 mois | Tout |

## Backup manuel

### Base de données

```bash
# Backup simple
docker compose exec -T postgres pg_dump -U happyserv happyserv > /backup/db-$(date +%Y%m%d).sql

# Backup compressé
docker compose exec -T postgres pg_dump -U happyserv -Z9 happyserv > /backup/db-$(date +%Y%m%d).sql.gz

# Backup avec nettoyage
docker compose exec -T postgres pg_dump -U happyserv --clean --if-exists happyserv > /backup/db-$(date +%Y%m%d)-clean.sql
```

### Configuration

```bash
# Backup configs
tar czf /backup/config-$(date +%Y%m%d).tar.gz /home/happyserv/config/

# Backup complet projet
tar czf /backup/happyserv-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  /home/happyserv/
```

### Certificats SSL

```bash
# Backup certs (dans volume Docker)
docker run --rm -v nginx_certs:/source -v /backup:/dest \
  alpine tar czf /dest/certs-$(date +%Y%m%d).tar.gz -C /source .
```

## Restauration

### Base de données

```bash
# Restauration simple
cat /backup/db-20260630.sql | docker compose exec -T postgres psql -U happyserv -d happyserv

# Restauration compressée
gunzip -c /backup/db-20260630.sql.gz | docker compose exec -T postgres psql -U happyserv -d happyserv
```

### Configuration

```bash
# Restauration configs
tar xzf /backup/config-20260630.tar.gz -C /home/happyserv/
```

### Projet complet

```bash
# Restauration projet
tar xzf /backup/happyserv-20260630.tar.gz -C /home/happyserv/
```

## Vérification

```bash
# Vérification intégrité backup
pg_restore -l /backup/db-20260630.sql > /dev/null 2>&1 && echo "OK" || echo "CORROMPU"

# Vérification archive
tar tzf /backup/config-20260630.tar.gz > /dev/null 2>&1 && echo "OK" || echo "CORROMPU"
```
