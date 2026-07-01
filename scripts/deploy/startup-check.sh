#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/startup-check-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Startup Check ==="

FAILED=0

log "1. Checking docker-compose.yml..."
if [ -f "$PROJECT_ROOT/docker-compose.yml" ]; then
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" config > /dev/null 2>&1 && log "✅ docker-compose.yml valide" || { log "❌ docker-compose.yml invalide"; FAILED=1; }
else
    log "❌ docker-compose.yml introuvable"; FAILED=1
fi

log "2. Checking required directories..."
for dir in api portal nginx scripts maintenance; do
    [ -d "$PROJECT_ROOT/$dir" ] && log "✅ $dir présent" || { log "❌ $dir manquant"; FAILED=1; }
done

log "3. Checking environment files..."
[ -f "$PROJECT_ROOT/.env" ] && log "✅ .env présent" || log "⚠️ .env manquant"

log "4. Checking Docker..."
docker info > /dev/null 2>&1 && log "✅ Docker OK" || { log "❌ Docker indisponible"; FAILED=1; }

log "5. Checking ports..."
for port in 80 443; do
    if ss -tlnp | grep -q ":$port "; then
        log "✅ Port $port déjà utilisé (attendu)"
    else
        log "ℹ️ Port $port libre (sera utilisé par Nginx)"
    fi
done

log "=== Startup Check Complete ==="
exit "$FAILED"
