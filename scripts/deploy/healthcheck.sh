#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/healthcheck-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Health Check ==="

FAILED=0

check_url() {
    local url="$1"
    local name="$2"
    if curl -sf -o /dev/null --max-time 10 "$url"; then
        log "✅ $name ($url) UP"
    else
        log "❌ $name ($url) DOWN"
        FAILED=1
    fi
}

check_dns() {
    local domain="$1"
    if host "$domain" > /dev/null 2>&1; then
        log "✅ DNS $domain résolu"
    else
        log "❌ DNS $domain NON résolu"
        FAILED=1
    fi
}

check_container() {
    local container="$1"
    if docker ps --format '{{.Names}}' | grep -q "^$container$"; then
        log "✅ Conteneur $container OK"
    else
        log "❌ Conteneur $container manquant"
        FAILED=1
    fi
}

log "--- URLs ---"
check_url "https://telehappy.fr" "Telehappy.fr"
check_url "https://happyserv.fr" "HappyServ.fr"
check_url "https://api.happyserv.fr/health" "API Health"

log "--- DNS ---"
check_dns "telehappy.fr"
check_dns "happyserv.fr"
check_dns "api.happyserv.fr"

log "--- Conteneurs ---"
check_container "happyserv-nginx"
check_container "happyserv-api"
check_container "happyserv-portal"
check_container "happyserv-postgres"
check_container "happyserv-redis"

log "--- Disque ---"
DISK=$(df -h / | awk 'NR==2 {print $5}')
log "Disque: $DISK"

log "--- Mémoire ---"
MEM=$(free -h | awk 'NR==2 {print $7}')
log "Mémoire libre: $MEM"

log "--- CPU ---"
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
log "CPU utilisé: $CPU%"

exit "$FAILED"
