# HappyServ CI/CD Documentation

## Architecture CI/CD

Le pipeline CI/CD de HappyServ est conçu pour automatiser le build, le test, le déploiement et la vérification de tous les services de la plateforme.

## Pipelines Disponibles

### GitHub Actions

Le fichier `.github/workflows/deploy.yml` (ou `ci-cd/pipelines/github-actions.yml`) définit un pipeline complet avec :

1. **Quality Checks** — Lint, typecheck, tests unitaires sur une matrice de 4 modules (api, portal, telehappy, client)
2. **Build & Docker** — Construction des images Docker et publication sur GitHub Container Registry
3. **Deploy** — Déploiement SSH vers le serveur cible
4. **Notify** — Notification Slack du statut du pipeline

### GitLab CI

Le fichier `ci-cd/pipelines/gitlab-ci.yml` offre la même fonctionnalité pour GitLab CI/CD avec :

- Qualité en parallèle sur 4 modules
- Build Docker avec tag court SHA
- Déploiement SSH
- Notification Slack

## Scripts de Déploiement

### build.sh

Build tous les services (npm install, lint, typecheck, test, build, Docker image).

Usage : `./ci-cd/scripts/build.sh [service]`

### deploy.sh

Déploiement complet : backup → build → deploy → health check → migration → rapport.

Usage : `./ci-cd/scripts/deploy.sh <env> [service]`

### rollback.sh

Restaure une version précédente d'un service.

Usage : `./ci-cd/scripts/rollback.sh <env> <service> [version]`

### migrate.sh

Exécute les migrations PostgreSQL.

Usage : `./ci-cd/scripts/migrate.sh <env> [direction]`

### verify.sh

Vérification post-déploiement (URLs, conteneurs, ressources système).

Usage : `./ci-cd/scripts/verify.sh <env>`

### quality.sh

Audit qualité (dépendances, vulnérabilités, lint, types, taille bundle).

Usage : `./ci-cd/scripts/quality.sh`

### changelog.sh

Génération automatique du changelog depuis les commits.

Usage : `./ci-cd/scripts/changelog.sh [from] [to]`

## Workflow de Release

1. Développement sur branches `feature/*`
2. Merge vers `develop` → déploiement automatique sur test
3. Création de `release/X.Y.Z` → tests finaux
4. Merge vers `main` → déploiement automatique sur production
5. Tag `vX.Y.Z` → release GitHub

## Environnements

| Environnement | Branche | Déploiement | URL |
|--------------|---------|-------------|-----|
| Dev | locale | Manuel | http://localhost |
| Test | develop | Automatique | https://test.happyserv.fr |
| Prod | main | Automatique | https://happyserv.fr |

## Variables Requises

### CI/CD Secrets (GitHub)

- `DEPLOY_HOST` — Adresse du serveur
- `DEPLOY_USER` — Utilisateur SSH
- `DEPLOY_KEY` — Clé privée SSH
- `SLACK_WEBHOOK_URL` — Webhook Slack

### CI/CD Variables (GitLab)

- `SSH_PRIVATE_KEY` — Clé privée SSH
- `DEPLOY_USER` — Utilisateur SSH
- `DEPLOY_HOST` — Adresse du serveur
- `SLACK_WEBHOOK_URL` — Webhook Slack
- `CI_ENVIRONMENT_NAME` — Nom de l'environnement
