# Architecture Réseau

## Diagramme

```
                                INTERNET
                                    |
                                [Pare-feu UFW]
                                    |
                              [Nginx:80/443]
                                    |
                    +---------------+---------------+
                    |               |               |
            [telehappy.*]     [happyserv.*]    [Let's Encrypt]
                    |               |
            +-------+               +--------+
            |                                |
       [Telehappy]                        [Portal]
       (nginx:alpine)                    (nginx:alpine)
            |                                |
    backend_network                    backend_network
            |                                |
            +----------+---------------------+
                       |
                   [API:3000]
                  (Express.js)
                       |
            +----------+----------+
            |                     |
     db_network             redis_network
            |                     |
       [Postgres:5432]       [Redis:6379]
```

## Ports

| Port externe | Service | Protocole | Description |
|-------------|---------|-----------|-------------|
| 80 | nginx | HTTP | Redirection HTTPS |
| 443 | nginx | HTTPS | Trafic sécurisé |
| 22 | SSH | SSH | Admin (clés uniquement) |

## Flux réseau

```
Client → Nginx:443 → happyserv.fr → Portal → API → PostgreSQL
Client → Nginx:443 → telehappy.fr → Site statique
Client → Nginx:443 → /api/v1/* → API → PostgreSQL/Redis
Client → Nginx:443 → /ws → API WebSocket
```

## Règles UFW

```
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow from 172.20.0.0/16
ufw allow from 172.21.0.0/16
ufw allow from 172.22.0.0/16
ufw allow from 172.23.0.0/16
```

## Réseaux Docker

| Réseau | Sous-réseau | Passerelle |
|--------|------------|------------|
| frontend_network | 172.20.0.0/16 | 172.20.0.1 |
| backend_network | 172.21.0.0/16 | 172.21.0.1 |
| db_network | 172.22.0.0/16 | 172.22.0.1 |
| redis_network | 172.23.0.0/16 | 172.23.0.1 |
| monitoring_network | 172.24.0.0/16 | 172.24.0.1 |
