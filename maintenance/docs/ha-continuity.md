# Haute Disponibilité — Architecture de Continuité

## Concepts clés

HappyServ est conçu pour évoluer vers une architecture hautement disponible.
Cette section documente les stratégies et procédures.

## Réplication PostgreSQL

### Réplication en streaming (asynchrone)

```yaml
# docker-compose.ha.yml
services:
  postgres-primary:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: happyserv
      POSTGRES_PASSWORD: <password>
      POSTGRES_DB: happyserv
    volumes:
      - postgres_primary:/var/lib/postgresql/data
    networks:
      - db_network

  postgres-replica:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: happyserv
      POSTGRES_PASSWORD: <password>
      POSTGRES_DB: happyserv
    volumes:
      - postgres_replica:/var/lib/postgresql/data
    depends_on:
      - postgres-primary
    networks:
      - db_network
```

### Procédure de basculement

```bash
# Promouvoir le réplica en primaire
docker compose exec postgres-replica pg_ctl promote

# Rediriger l'API vers le nouveau primaire
# Mettre à jour DB_HOST dans la config API
```

## Multi-serveur

### Architecture

```
[Load Balancer (HAProxy/Nginx)]
    ├── Serveur 1 (primary) : Nginx, API, Portal, Postgres (primary)
    └── Serveur 2 (standby) : Nginx, API, Portal, Postgres (replica)
```

### DNS
- Round-robin DNS sur les deux serveurs
- TTL réduit à 60s pour basculement rapide

### Basculement automatique (keepalived)

```bash
# Installer keepalived
apt-get install keepalived

# Configuration VIP (Virtual IP)
# 192.168.1.100 flottant entre les deux serveurs
```

## Geo-distribution

| Région | Rôle | Services |
|--------|------|----------|
| Europe (gra) | Primary | API, Portal, Postgres, Redis |
| Europe (rbx) | Warm standby | API, Portal, Postgres (replica) |
| USA (bhs) | Read replica | Postgres (lecture seule) |

## Procédure DR multi-région

1. Détection : Health check échoue sur la région primaire
2. DNS : Mettre à jour vers la région standby
3. Promotion : Promouvoir le Postgres replica
4. Vérification : Tester tous les endpoints
5. RTO attendu : 5 minutes
6. RPO attendu : 30 secondes

## Recommandations évolutives

### K8s / Istio
- Orchestration Kubernetes pour scaling automatique
- Istio pour service mesh, traffic management, mTLS
- Horizontal Pod Autoscaler basé sur CPU/mémoire

### CI/CD avancé
- GitOps avec ArgoCD
- Canary deployments
- Blue/green deployments
- Feature flags (LaunchDarkly)

### Stockage
- PostgreSQL : Patroni + etcd pour HA management
- Redis : Redis Sentinel ou Redis Cluster
- Volumes : Rook/Ceph pour stockage distribué
