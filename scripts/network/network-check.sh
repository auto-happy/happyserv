#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/tmp/network-check-$TIMESTAMP.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Network Check ==="

FAILED=0

check_host() {
    local host="$1"
    local name="$2"
    if ping -c 2 -W 3 "$host" &>/dev/null; then
        log "✅ $name ($host) joignable"
    else
        log "❌ $name ($host) injoignable"
        FAILED=1
    fi
}

check_port() {
    local host="$1"
    local port="$2"
    local name="$3"
    if nc -z -w 3 "$host" "$port" 2>/dev/null; then
        log "✅ $name port $port ouvert"
    else
        log "❌ $name port $port fermé"
        FAILED=1
    fi
}

log "--- Hôtes critiques ---"
check_host "8.8.8.8" "Google DNS"
check_host "1.1.1.1" "Cloudflare DNS"
check_host "github.com" "GitHub"
check_host "registry.npmjs.org" "NPM Registry"
check_host "hub.docker.com" "Docker Hub"

log "--- Ports locaux ---"
check_port "localhost" "80" "HTTP (Nginx)"
check_port "localhost" "443" "HTTPS (Nginx)"
check_port "localhost" "3000" "API"

log "--- Résolution DNS ---"
for domain in telehappy.fr happyserv.fr api.happyserv.fr; do
    if host "$domain" &>/dev/null; then
        IP=$(host "$domain" | grep "has address" | awk '{print $4}' | head -1)
        log "✅ $domain → $IP"
    else
        log "❌ $domain non résolu"
        FAILED=1
    fi
done

exit "$FAILED"
