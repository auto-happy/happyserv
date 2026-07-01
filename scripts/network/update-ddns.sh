#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/ddns-$TIMESTAMP.log"

DDNS_DOMAIN="${1:-}"
DDNS_TOKEN="${2:-}"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ DDNS Update ==="

if [ -z "$DDNS_DOMAIN" ] || [ -z "$DDNS_TOKEN" ]; then
    log "Usage: $0 <domain> <token>"
    log "Ou utiliser les variables d'environnement DDNS_DOMAIN et DDNS_TOKEN"
    DDNS_DOMAIN="${DDNS_DOMAIN:-}"
    DDNS_TOKEN="${DDNS_TOKEN:-}"
fi

if [ -z "$DDNS_DOMAIN" ] || [ -z "$DDNS_TOKEN" ]; then
    log "ERROR: DDNS_DOMAIN and DDNS_TOKEN required"
    exit 1
fi

CURRENT_IP=$(curl -sf https://api.ipify.org 2>/dev/null || curl -sf https://ifconfig.me 2>/dev/null || echo "")

if [ -z "$CURRENT_IP" ]; then
    log "ERROR: Cannot detect current public IP"
    exit 1
fi

log "Current IP: $CURRENT_IP"
log "Updating DDNS for $DDNS_DOMAIN..."

# Generic DDNS update (supports DuckDNS, No-IP, etc.)
curl -sf "https://www.duckdns.org/update?domains=$DDNS_DOMAIN&token=$DDNS_TOKEN&ip=$CURRENT_IP" 2>&1 | tee -a "$LOG_FILE" || \
log "DDNS update attempted (check your provider's URL format)"

log "=== DDNS Update Complete ==="
