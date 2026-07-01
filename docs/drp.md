# Disaster Recovery Plan — HappyServ

## Scénarios d'incident

### 1. Panne serveur complète

**Symptômes :** Serveur injoignable, tous les services down
**Sévérité :** Critique
**RTO :** 4h | **RPO :** 24h

**Procédure :**
1. Contacter hébergeur (OVH, Hetzner, etc.)
2. Déployer dernier backup sur serveur de secours
3. Restaurer base de données (backup J-1)
4. Restaurer configuration
5. Restaurer certificats SSL
6. Redémarrer services
7. Vérifier DNS (TTL réduit à 300s)
8. Vérifier fonctionnement complet

### 2. Corruption base de données

**Symptômes :** Erreurs 500, requêtes échouent
**Sévérité :** Critique
**RTO :** 2h | **RPO :** 1h

**Procédure :**
1. Arrêter API : `docker compose stop api`
2. Restaurer dernier backup valide
3. Lancer vérification : `docker compose exec postgres pg_checksums -c`
4. Redémarrer API
5. Vérifier intégrité des données

### 3. Attaque (DDoS/bruteforce)

**Symptômes :** Trafic anormal, logs d'échecs massifs
**Sévérité :** Élevée
**RTO :** 2h

**Procédure :**
1. Activer rate limiting renforcé
2. Analyser logs (Fail2Ban, Nginx)
3. Bloquer IPs malveillantes (UFW)
4. Vérifier intégrité des données
5. Forcer rotation des secrets
6. Analyser logs d'accès post-attaque

### 4. Fuite de données

**Symptômes :** Activité suspecte, données exposées
**Sévérité :** Critique
**RTO :** 1h

**Procédure :**
1. Isoler le service compromis
2. Désactiver comptes utilisateurs
3. Forcer rotation des tokens
4. Analyser logs d'accès
5. Notifier les utilisateurs (72h RGPD)
6. Audit de sécurité complet

### 5. Panne certificat SSL

**Symptômes :** Erreurs SSL dans les navigateurs
**Sévérité :** Haute
**RTO :** 1h

**Procédure :**
1. Vérifier expiration : `docker compose exec nginx openssl x509 -in /etc/nginx/certs/fullchain.pem -noout -dates`
2. Forcer renouvellement : `docker compose run --rm certbot renew --force-renewal`
3. Recharger Nginx : `docker compose exec nginx nginx -s reload`
4. Vérifier avec SSL Labs

### 6. Panne Redis

**Symptômes :** Sessions perdues, rate limiting désactivé
**Sévérité :** Moyenne
**RTO :** 30 min

**Procédure :**
1. Redémarrer Redis : `docker compose restart redis`
2. Vérifier connectivité : `docker compose exec redis redis-cli ping`
3. Les sessions seront recréées automatiquement

## Communications

| Canal | Usage |
|-------|-------|
| Email (ops@happyserv.fr) | Communications officielles |
| Webhook Slack | Notifications en temps réel |
| Journal système | Traçabilité |

## Post-mortem

Après chaque incident, rédiger un rapport incluant :
1. Chronologie complète
2. Cause racine
3. Actions prises
4. Actions préventives
5. Temps de résolution
6. Leçons apprises
