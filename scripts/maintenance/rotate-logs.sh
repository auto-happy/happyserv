#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/rotate-logs-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Log Rotation ==="

RETENTION_DAYS="${1:-30}"
LOG_DIRS=(
    "$PROJECT_ROOT/logs"
    "/var/log/happyserv"
    "/var/log/nginx"
)

for dir in "${LOG_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        log "Rotation dans $dir (rétention: ${RETENTION_DAYS} jours)..."
        find "$dir" -name "*.log" -type f -mtime "+$RETENTION_DAYS" -exec rm -v {} \; 2>&1 | tee -a "$LOG_FILE" || true
        find "$dir" -name "*.gz" -type f -mtime "+$RETENTION_DAYS" -exec rm -v {} \; 2>&1 | tee -a "$LOG_FILE" || true
    fi
done

log "Rotation Docker logs..."
docker system prune -f --volumes 2>&1 | tee -a "$LOG_FILE" || true

log "=== Log Rotation Complete ==="
