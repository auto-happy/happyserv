# Politiques de Sécurité — HappyServ

## Gestion des Privilèges

### Principe du moindre privilège
- Chaque service Docker fonctionne avec ses propres credentials
- Les conteneurs utilisent `no-new-privileges: true`
- Les volumes sont en read-only quand possible
- PostgreSQL utilise l'utilisateur `postgres` (non-root)
- API utilise l'utilisateur `node` (non-root)

### Accès SSH
- Authentification par clé uniquement (pas de mot de passe)
- Pas de connexion root
- Utilisateurs autorisés : `deploy`, `happyserv`
- Rate limiting via Fail2Ban (5 tentatives/10 min → bannissement 1h)

## Gestion des Secrets

### Types de secrets
- **JWT Secrets** — Signature des tokens d'authentification
- **JWT Refresh Secrets** — Signature des refresh tokens
- **DB Passwords** — Accès aux bases de données
- **API Keys** — Authentification inter-services

### Rotation
- JWT secrets : rotation mensuelle
- DB passwords : rotation trimestrielle
- API keys : rotation semestrielle
- Rotation immédiate en cas de compromission suspectée

### Stockage
- Fichiers `.env.*` avec permissions 600
- Backup des secrets dans `/home/happyserv/security/reports/secrets-backup-*/`
- Jamais dans le dépôt git
- Jamais dans les logs

## Gestion des Backups

### Politique de rétention
- **Quotidiens** : 7 jours
- **Hebdomadaires** : 4 semaines
- **Mensuels** : 3 mois

### Contenu des backups
- **Quotidiens** : base de données, configurations
- **Hebdomadaires** : + applications, certificats SSL
- **Mensuels** : archive complète

### Vérification
- Test de restauration mensuel
- Vérification d'intégrité après chaque backup
- Rapport de backup généré automatiquement

## Surveillance Continue

### Points de contrôle
| Intervalle | Vérification |
|------------|-------------|
| 5 min | Health check sites web |
| 5 min | Statut conteneurs Docker |
| 5 min | Espace disque |
| 15 min | Fail2Ban status |
| 1 h | Certificats SSL |
| 1 j | Audit de sécurité |

### Alertes
- Slack #incidents pour Sévérité 1-2
- Email pour Sévérité 3-4
- Log systemd pour toutes les alertes

## Conformité RGPD

### Données personnelles stockées
- Email (compte utilisateur)
- Nom (compte utilisateur)
- Logs de connexion (conservation 90 jours)
- Données de télémétrie (anonymisées)

### Droits des utilisateurs
- Droit d'accès : via l'API `/api/users/me`
- Droit de rectification : via le profil
- Droit à l'effacement : via la fonction supprimer compte
- Droit à la portabilité : export JSON des données

### Sécurité des données
- Transport : TLS 1.3 uniquement
- Stockage : PostgreSQL (données chiffrées en transit)
- Logs : aucun mot de passe ou secret dans les logs
- Session : JWT avec expiration courte + refresh token
