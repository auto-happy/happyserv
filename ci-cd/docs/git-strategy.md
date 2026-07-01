# HappyServ Git Strategy

## Branches

```
main           ← Production (protégée)
  ├─ develop   ← Intégration (protégée)
  │    ├─ feature/*   ← Nouvelles fonctionnalités
  │    ├─ fix/*       ← Corrections
  │    └─ chore/*     ← Maintenance
  └─ release/* ← Préparation de release
```

### Règles

- `main` : protégée, pas de push direct, merges via PR uniquement
- `develop` : protégée, merges via PR avec review
- `feature/*` : créée depuis `develop`, mergée vers `develop`
- `fix/*` : créée depuis `develop` ou `main` (hotfix)
- `release/X.Y.Z` : créée depuis `develop`, mergée vers `main` et `develop`

## Conventions de Commit

Utilisation de [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `chore` | Maintenance (dépendances, config) |
| `refactor` | Refactoring sans changement fonctionnel |
| `test` | Ajout ou modification de tests |
| `docs` | Documentation |
| `style` | Formatage, lint |
| `perf` | Performance |
| `ci` | CI/CD |
| `sec` | Sécurité |

### Exemples

```
feat(api): add license validation endpoint
fix(portal): correct user role display
chore(deps): update express to 4.19
ci: add GitHub Actions deployment workflow
sec(api): sanitize user input in auth route
```

## Workflow

### Nouvelle fonctionnalité

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
# ... développement ...
git add .
git commit -m "feat(scope): description"
git push origin feature/my-feature
# Créer PR vers develop
```

### Hotfix

```bash
git checkout main
git pull origin main
git checkout -b fix/critical-bug
# ... correction ...
git commit -m "fix(scope): description"
git push origin fix/critical-bug
# Créer PR vers main
# Puis merger vers develop
```

### Release

```bash
git checkout develop
git pull origin develop
git checkout -b release/1.2.0
# ... ajustements finaux ...
git commit -m "chore: bump version to 1.2.0"
git push origin release/1.2.0
# Créer PR vers main
# Après merge: tag v1.2.0
git tag v1.2.0
git push origin v1.2.0
```

## Versionnement

Semantic Versioning (SemVer) : `MAJEUR.MINEUR.PATCH`

- **MAJEUR** : Changement incompatible
- **MINEUR** : Nouvelle fonctionnalité rétrocompatible
- **PATCH** : Correction rétrocompatible

Les versions sont stockées dans `ci-cd/versions/*.txt`.
