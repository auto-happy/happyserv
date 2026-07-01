# Référence des Scripts Bash

## Maintenance

| Script | Description | Fréquence |
|--------|-------------|-----------|
| `maintenance/scripts/health-check.sh` | Vérification 5 min (sites, conteneurs, DB, CPU, disque) | Toutes les 5 min |
| `maintenance/scripts/auto-repair.sh` | Auto-réparation (9 aspects, max 3 runs/h) | Continue |
| `maintenance/scripts/backup.sh` | Backup DB + configs + rotation | Quotidien/Hebdo/Mensuel |
| `maintenance/scripts/auto-update.sh` | Mise à jour automatique nuit (02-03h) | Quotidien |
| `maintenance/scripts/generate-report.sh` | Rapports daily/weekly/monthly | Variable |
| `maintenance/scripts/notify.sh` | Notifications email/webhook/journal | Sur événement |

## Sécurité

| Script | Description |
|--------|-------------|
| `security/scripts/harden-system.sh` | Durcissement système (kernel, permissions, audit) |
| `security/scripts/install-security.sh` | Installation SSH + UFW + Fail2Ban + sysctl |
| `security/scripts/rotate-secrets.sh` | Rotation JWT/DB/API keys |
| `security/scripts/audit-security.sh` | Audit complet avec rapport Markdown |

## CI/CD

| Script | Description |
|--------|-------------|
| `ci-cd/scripts/build.sh` | Build tout le projet |
| `ci-cd/scripts/deploy.sh` | Déploiement production |
| `ci-cd/scripts/rollback.sh` | Rollback vers version précédente |
| `ci-cd/scripts/migrate.sh` | Migration base de données |
| `ci-cd/scripts/verify.sh` | Vérification post-déploiement |
| `ci-cd/scripts/changelog.sh` | Génération changelog |
| `ci-cd/scripts/quality.sh` | Tests + lint + typecheck |

## Systemd

| Unité | Description |
|-------|-------------|
| `happyserv-health-check.service/timer` | Health check automatisé |
| `happyserv-auto-repair.service/timer` | Auto-réparation |
| `happyserv-backup-daily.service/timer` | Backup quotidien |
| `happyserv-auto-update.service/timer` | Mise à jour automatique |
