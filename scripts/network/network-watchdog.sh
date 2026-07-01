#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/happyserv/network-watchdog-$TIMESTAMP.log"
CHECK_INTERVAL="${1:-60}"

mkdir -p /var/log/happyserv

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Network Watchdog Started (interval: ${CHECK_INTERVAL}s) ==="

FAILURES=0
MAX_FAILURES=5

while true; do
    if ! ping -c 1 -W 5 8.8.8.8 &>/dev/null; then
        FAILURES=$((FAILURES + 1))
        log "⚠️ Ping échoué ($FAILURES/$MAX_FAILURES)"
        if [ "$FAILURES" -ge "$MAX_FAILURES" ]; then
            log "❌ Réseau inaccessible, tentative de reconnexion..."
            systemctl restart networking 2>/dev/null || true
            dhclient -v 2>/dev/null || true
            FAILURES=0
        fi
    else
        if [ "$FAILURES" -gt 0 ]; then
            log "✅ Réseau rétabli après $FAILURES échecs"
            FAILURES=0
        fi
    fi
    sleep "$CHECK_INTERVAL"
done
