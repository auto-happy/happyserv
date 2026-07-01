# Plan de Réponse aux Incidents — HappyServ

## Principes Généraux

- **Sévérité 1** (Critique) : indisponibilité totale, brèche de sécurité, perte de données
- **Sévérité 2** (Haute) : indisponibilité partielle, dégradation significative
- **Sévérité 3** (Moyenne) : dégradation mineure sans impact utilisateur
- **Sévérité 4** (Basse) : anomalie cosmétique, tâche de maintenance

## Procédure d'Identification

1. **Détection automatique** — Health check, monitoring, Fail2Ban
2. **Détection manuelle** — Rapport utilisateur, constat admin
3. **Analyse initiale** — Déterminer sévérité, impact, périmètre

### Symptômes courants

| Symptôme | Cause probable | Action initiale |
|----------|---------------|-----------------|
| Site inaccessible | Nginx down, certificat expiré | Vérifier conteneur nginx |
| API 502 | Backend down | Vérifier conteneur api |
| Base de données lente | Connexions max atteintes | Vérifier pool de connexions |
| Authentification impossible | JWT secret corrompu | Vérifier secret, restaurer backup |
| 429 Too Many Requests | Rate limiting atteint | Vérifier Fail2Ban logs |

## Procédure de Confinement

### Sévérité 1 (Critique)

1. **Isoler le service affecté** : `docker compose stop <service>`
2. **Bloquer le trafic entrant** : `ufw deny 80,443/tcp` (si brèche)
3. **Sauvegarder les logs** : `docker compose logs --tail=1000 <service> > incident-logs.txt`
4. **Notifier l'équipe** : via Slack #incidents

### Sévérité 2-3 (Haute/Moyenne)

1. **Activer le mode maintenance** : page statique sur Nginx
2. **Analyser les logs** : auth.log, api.log, portal.log
3. **Contacter le support si nécessaire**

## Procédure d'Analyse

1. Collecter les logs du service affecté
2. Vérifier les métriques système (CPU, mémoire, disque)
3. Analyser les logs d'accès (Fail2Ban, auth.log)
4. Identifier la cause racine
5. Documenter dans le rapport d'incident

## Procédure de Restauration

1. **Correction rapide** : appliquer le correctif
2. **Rollback si nécessaire** : `./ci-cd/scripts/rollback.sh <env> <service>`
3. **Restaurer depuis backup** : `./scripts/backup/restore.sh <date>` (si perte données)
4. **Redémarrer le service** : `docker compose up -d <service>`
5. **Vérifier le rétablissement** : `./ci-cd/scripts/verify.sh <env>`

## Post-Mortem

Pour chaque incident S1 ou S2 :
1. Rédiger un rapport post-mortem
2. Identifier les actions correctives
3. Mettre à jour les procédures de prévention
4. Planifier les correctifs dans le prochain sprint
