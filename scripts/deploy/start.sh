#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/start-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Start ==="

if [ ! -f "$PROJECT_ROOT/docker-compose.yml" ]; then
    log "ERROR: docker-compose.yml not found"
    exit 1
fi

log "Starting all services..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" up -d 2>&1 | tee -a "$LOG_FILE"

log "Waiting for services to be ready..."
sleep 5

"$SCRIPT_DIR/healthcheck.sh" || log "⚠️ Health check warnings"

log "=== HappyServ Started Successfully ==="
