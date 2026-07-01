# Guide Développeur HappyServ

## Architecture

```
frontend/  ← React + Vite + TypeScript (Portal)
api/       ← Express.js + TypeScript (REST API)
client/    ← TypeScript (Application desktop)
website-download/ ← React + Vite (Telehappy)
```

## Conventions

### TypeScript
- Strict mode activé
- Pas de `any` (utiliser `unknown`)
- Interfaces préfixées `I` (ex: `IUser`)
- Enums PascalCase

### Git
- Branche `main` = production
- Branches features : `feature/description`
- Commits : `type(scope): message` (conventional commits)
- Exemple : `feat(api): add license validation endpoint`

### API REST
- `/api/v1/` préfixe versionné
- JSON request/response
- Tokens JWT dans `Authorization: Bearer`
- Pagination : `?page=1&limit=20`
- Erreurs : `{ "error": "message", "code": "ERROR_CODE" }`

### Tests
- Vitest pour unit tests
- Tests dans `__tests__/`
- Nommage : `*.test.ts`

## API Endpoints

### Auth
- `POST /api/v1/auth/register` — Inscription
- `POST /api/v1/auth/login` — Connexion
- `POST /api/v1/auth/refresh` — Rafraîchir token
- `POST /api/v1/auth/logout` — Déconnexion
- `POST /api/v1/auth/forgot-password` — Mot de passe oublié
- `GET /api/v1/auth/me` — Profil connecté

### Users
- `GET /api/v1/users` — Liste (admin)
- `GET /api/v1/users/:id` — Détail (admin)
- `POST /api/v1/users` — Créer (admin)
- `PUT /api/v1/users/:id` — Modifier (admin)
- `DELETE /api/v1/users/:id` — Supprimer (admin)

### Licenses
- `GET /api/v1/licenses` — Liste
- `POST /api/v1/licenses` — Créer (admin)
- `PUT /api/v1/licenses/:id` — Modifier (admin)
- `DELETE /api/v1/licenses/:id` — Supprimer (admin)
- `POST /api/v1/licenses/validate` — Valider licence
- `POST /api/v1/licenses/:id/revoke` — Révoquer

### Devices
- `GET /api/v1/devices` — Liste
- `POST /api/v1/devices` — Enregistrer
- `DELETE /api/v1/devices/:id` — Supprimer

### Updates
- `GET /api/v1/updates/check` — Vérifier mises à jour
- `POST /api/v1/updates` — Publier version (admin)

## Base de données

```sql
-- Connexion
docker compose exec postgres psql -U happyserv -d happyserv

-- Lister les tables
\dt

-- Voir structure
\d+ users
```

## WebSocket

```javascript
const ws = new WebSocket('wss://api.happyserv.fr/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'auth', token: '...' }));
};
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
};
```
