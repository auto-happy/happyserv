#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/check-ssl-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ SSL Certificate Check ==="

DOMAINS=("telehappy.fr" "happyserv.fr" "api.happyserv.fr")
RENEW_DAYS=30
NEED_RENEW=0

for domain in "${DOMAINS[@]}"; do
    CERT_PATH="/etc/letsencrypt/live/$domain/fullchain.pem"
    if [ -f "$CERT_PATH" ]; then
        EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_PATH" | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y" "$EXPIRY" +%s 2>/dev/null || echo 0)
        NOW_EPOCH=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
        
        if [ "$DAYS_LEFT" -le 0 ]; then
            log "❌ $domain: EXPIRÉ !"
            NEED_RENEW=1
        elif [ "$DAYS_LEFT" -le "$RENEW_DAYS" ]; then
            log "⚠️ $domain: expire dans $DAYS_LEFT jours (seuil: $RENEW_DAYS)"
            NEED_RENEW=1
        else
            log "✅ $domain: OK ($DAYS_LEFT jours restants)"
        fi
    else
        log "⚠️ $domain: aucun certificat trouvé"
    fi
done

if [ "$NEED_RENEW" -eq 1 ]; then
    log "Renouvellement nécessaire..."
    certbot renew --non-interactive --quiet 2>&1 | tee -a "$LOG_FILE" || true
    log "Reload Nginx..."
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" exec nginx nginx -s reload 2>/dev/null || \
    docker exec happyserv-nginx nginx -s reload 2>/dev/null || true
fi

log "=== SSL Check Complete ==="
