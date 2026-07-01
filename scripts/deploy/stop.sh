#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/stop-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Stop ==="

SERVICES=("${@:-}")

if [ ${#SERVICES[@]} -eq 0 ]; then
    log "Arrêt de tous les services..."
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" down 2>&1 | tee -a "$LOG_FILE" || \
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" stop 2>&1 | tee -a "$LOG_FILE"
else
    for service in "${SERVICES[@]}"; do
        log "Arrêt de $service..."
        docker compose -f "$PROJECT_ROOT/docker-compose.yml" stop "$service" 2>&1 | tee -a "$LOG_FILE" || \
        docker stop "happyserv-$service" 2>&1 | tee -a "$LOG_FILE" || true
    done
fi

log "=== Stop terminé ==="
