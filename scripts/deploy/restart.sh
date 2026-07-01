#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/restart-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

SERVICES=("${@:-nginx api portal}")

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Restart ==="

for service in "${SERVICES[@]}"; do
    log "Redémarrage de $service..."
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" restart "$service" 2>&1 | tee -a "$LOG_FILE" || \
    docker restart "happyserv-$service" 2>&1 | tee -a "$LOG_FILE" || \
    log "⚠️ Échec du redémarrage de $service"
done

log "=== Restart terminé ==="
