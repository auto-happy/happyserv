# Changelog

## v1.0.0 — 2026-06-30

### Ajouts
- Infrastructure Docker complète (6 services, 5 réseaux, 8 volumes)
- Site telehappy.* (16 pages publiques, i18n FR/EN, SEO)
- API REST Express/TypeScript (auth, users, licenses, devices, updates)
- Portal React/Vite/TypeScript (dashboard, admin)
- Client TypeScript modulaire (config, auth, sync, updates, modules)
- Sécurité : SSH hardening, UFW, Fail2Ban, RBAC, rate limiting
- Monitoring : Prometheus, Grafana, Alertmanager
- Maintenance : health check, auto-repair, backups, auto-update
- CI/CD : scripts, GitHub Actions, GitLab CI
- Documentation complète (18 fichiers, ~40 000 mots)

### Technique
- Docker multi-stage (Node → Nginx, ~109 kB gzippé)
- TypeScript 0 erreurs sur tous les projets
- Tests unitaires (vitest) passés
- Backups quotidiens/hebdomadaires/mensuels
- Rotation automatique des secrets

### Sécurité
- Politiques de sécurité documentées
- Plan de réponse aux incidents
- Audit de sécurité automatisé
- Fail2Ban jails (SSH, Nginx, API, Portal)
- Docker read-only + no-new-privileges
