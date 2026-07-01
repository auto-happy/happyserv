# Performances — Limites et Indicateurs

## Limites

| Ressource | Limite | Action |
|-----------|--------|--------|
| CPU | 80% sur 5 min | Alerter |
| RAM | 90% utilisé | Alerter, scaling |
| Disque | 85% utilisé | Alerter, nettoyer |
| Disque | 95% utilisé | Critique, action immédiate |
| Connexions API simultanées | 500 | Rate limiting |
| Taille upload | 10 MB | Rejeter |
| Temps réponse API | 500 ms (p95) | Alerter si dépassé |
| Taux d'erreur API | 1% | Alerter |
| Connexions DB | 100 actives | Pool max |

## Indicateurs de performance (KPI)

| Indicateur | Cible | Méthode |
|------------|-------|---------|
| Uptime services | 99.9% | Prometheus |
| Temps réponse moyen API | < 200ms | Prometheus |
| Taux d'erreur 5xx | < 0.1% | Logs Nginx/API |
| Temps de chargement page | < 2s | Lighthouse |
| Score Lighthouse | > 90 | Audit mensuel |
| Temps de backup | < 30 min | Logs backup |
| Taille base de données | < 10 GB | pg_database_size |
| Connexions actives | < 50 | pg_stat_activity |

## Scaling

### Vertical
- Augmenter RAM/CPU du serveur
- Augmenter pool connections PostgreSQL
- Augmenter max_clients Nginx

### Horizontal
- Multiplier les instances API derrière Nginx
- Réplication PostgreSQL (lecture)
- Cache Redis distribué

## Optimisations appliquées

- Compression Gzip Nginx
- Cache statique (1 an pour assets build)
- Minification CSS/JS/HTML
- Images WebP
- Lazy loading
- Connection pooling PostgreSQL
- Cache Redis pour sessions
- Rate limiting par IP
- CDN pour assets statiques
