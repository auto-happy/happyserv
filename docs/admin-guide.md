# Guide Administrateur HappyServ

## Création d'utilisateurs

Via l'interface admin (happyserv.fr/admin/users) :

```bash
# Ou via API directement
curl -X POST https://api.happyserv.fr/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "email": "user@example.com",
    "password": "initialPassword123!",
    "name": "John Doe",
    "role": "user"
  }'
```

## Gestion des licences

Via l'interface admin (happyserv.fr/admin/licenses) :

```bash
# Création via API
curl -X POST https://api.happyserv.fr/api/v1/licenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "user_id": 1,
    "type": "premium",
    "expires_at": "2027-06-30T00:00:00Z",
    "max_devices": 5
  }'
```

## Publication de versions

1. Aller dans Admin → Versions d'application
2. Remplir le formulaire (version, changelog, URL de téléchargement)
3. Cliquer sur Publier

```bash
# Via API
curl -X POST https://api.happyserv.fr/api/v1/updates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "version": "1.2.0",
    "platform": "linux",
    "url": "https://github.com/happyserv/client/releases/download/v1.2.0/client-linux.tar.gz",
    "checksum": "sha256:abc123...",
    "changelog": "Nouveau module monitoring",
    "mandatory": false
  }'
```

## Gestion des rôles

| Rôle | Permissions |
|------|------------|
| admin | Accès complet (users, licences, versions, logs, paramètres) |
| support | Gestion licences, consultation users |
| user | Dashboard, licences personnelles, appareils |

## Supervision

```bash
# État des services
docker compose ps

# Logs en direct
docker compose logs -f --tail=50 api

# Métriques API
curl https://api.happyserv.fr/health

# Vérification backups
ls -la /backup/
```
