# Gestion des Incidents

## Niveaux de sévérité

| Niveau | Délai réponse | Exemples |
|--------|---------------|----------|
| Critique (P1) | 15 min | Site inaccessible, perte de données, fuite de données |
| Élevée (P2) | 1h | Service dégradé, erreurs intermittentes |
| Moyenne (P3) | 4h | Fonctionnalité mineure impactée |
| Faible (P4) | 24h | Bug cosmétique, demande d'amélioration |

## Procédure

### Détection
- Monitoring automatique (health-check.sh)
- Alertes Prometheus/Alertmanager
- Rapports utilisateurs
- Logs d'erreurs

### Identification
1. Consulter les logs : `docker compose logs --tail=100 <service>`
2. Vérifier le health check
3. Analyser les métriques Grafana
4. Vérifier les alertes

### Résolution
1. Appliquer le plan de réponse (voir [PRA](drp.md))
2. Documenter les actions
3. Vérifier la résolution
4. Mettre à jour le statut

### Post-mortem
- Rédiger un rapport dans les 48h
- Template :

```markdown
## Rapport d'incident
**Date :** JJ/MM/AAAA HH:MM
**Sévérité :** P1/P2/P3/P4
**Durée :** XX minutes
**Cause racine :** ...
**Actions :** ...
**Prévention :** ...
```
