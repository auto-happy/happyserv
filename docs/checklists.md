# Checklists HappyServ

## Pré-déploiement

- [ ] Tests unitaires passés (vitest)
- [ ] TypeScript 0 erreurs (tsc --noEmit)
- [ ] Build Docker réussi (docker compose build)
- [ ] Variables d'environnement configurées
- [ ] Migration DB appliquée
- [ ] Certificats SSL valides
- [ ] DNS propagé
- [ ] Ports firewall ouverts
- [ ] Rate limiting configuré
- [ ] Backup récent disponible
- [ ] Monitoring opérationnel
- [ ] Notifications configurées

## Post-déploiement

- [ ] Services démarrés (docker compose ps)
- [ ] Health check OK (curl /health)
- [ ] Sites accessibles (telehappy.fr, happyserv.fr)
- [ ] Login fonctionnel
- [ ] API endpoints répondent
- [ ] WebSocket connecté
- [ ] Certificats SSL valides (SSL Labs A+)
- [ ] Logs sans erreurs
- [ ] Métriques s'affichent (Grafana)
- [ ] Backups programmés actifs
- [ ] Notifications envoyées

## Quotidien

- [ ] Vérifier tableau de bord monitoring
- [ ] Consulter logs d'erreurs
- [ ] Vérifier espace disque
- [ ] Vérifier backups du jour
- [ ] Vérifier certificats SSL

## Hebdomadaire

- [ ] Analyse des logs de sécurité
- [ ] Vérification des mises à jour disponibles
- [ ] Nettoyage des fichiers temporaires
- [ ] Revue des performances

## Mensuel

- [ ] Audit de sécurité complet
- [ ] Rotation des logs
- [ ] Test de restauration backup
- [ ] Mise à jour documentation
