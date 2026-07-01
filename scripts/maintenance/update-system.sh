#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/update-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ System Update ==="

log "1. Backup before update..."
"$PROJECT_ROOT/scripts/backup/backup-full.sh" daily 2>&1 | tee -a "$LOG_FILE"

log "2. Updating system packages..."
apt-get update -qq 2>&1 | tee -a "$LOG_FILE"
apt-get upgrade -y -qq 2>&1 | tee -a "$LOG_FILE"
apt-get autoremove -y -qq 2>&1 | tee -a "$LOG_FILE"
apt-get autoclean -qq 2>&1 | tee -a "$LOG_FILE"

log "3. Updating Docker images..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" pull 2>&1 | tee -a "$LOG_FILE" || true

log "4. Rebuilding custom services..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" build api portal telehappy 2>&1 | tee -a "$LOG_FILE" || true

log "5. Restarting services..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" up -d 2>&1 | tee -a "$LOG_FILE"

log "6. Checking post-update..."
"$PROJECT_ROOT/ci-cd/scripts/verify.sh" prod 2>&1 | tee -a "$LOG_FILE" || true

log "=== System Update Complete ==="
