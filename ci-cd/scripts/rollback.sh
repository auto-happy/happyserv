#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ROLLBACK_LOG="$PROJECT_ROOT/logs/rollback-$TIMESTAMP.log"

ENV="${1:-dev}"
SERVICE="${2:-}"
VERSION="${3:-previous}"

mkdir -p "$PROJECT_ROOT/logs" "$PROJECT_ROOT/backups/rollback"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$ROLLBACK_LOG"; }

log "=== HappyServ Rollback Script ==="
log "Environment: $ENV"
log "Service: $SERVICE"
log "Version: $VERSION"

if [ -z "$SERVICE" ]; then
    log "ERROR: Service name required"
    echo "Usage: $0 <env> <service> [version]"
    exit 1
fi

BACKUP_DIR="$PROJECT_ROOT/backups/rollback/$SERVICE"
if [ ! -d "$BACKUP_DIR" ]; then
    log "ERROR: No backup found for $SERVICE at $BACKUP_DIR"
    exit 1
fi

log "Stopping $SERVICE..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" stop "$SERVICE" 2>&1 | tee -a "$ROLLBACK_LOG"

log "Restoring Docker image for $SERVICE..."
if [ "$VERSION" = "previous" ]; then
    IMAGE_TAG=$(docker images "happyserv/$SERVICE" --format "{{.Tag}}" | sort -r | sed -n '2p')
    if [ -z "$IMAGE_TAG" ]; then
        log "ERROR: No previous image found for $SERVICE"
        exit 1
    fi
    docker tag "happyserv/$SERVICE:$IMAGE_TAG" "happyserv/$SERVICE:latest"
else
    docker tag "happyserv/$SERVICE:$VERSION" "happyserv/$SERVICE:latest"
fi

log "Restoring configuration files..."
if [ -d "$BACKUP_DIR/config" ]; then
    cp -r "$BACKUP_DIR/config/"* "$PROJECT_ROOT/$SERVICE/" 2>/dev/null || true
fi

log "Restarting $SERVICE..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" up -d "$SERVICE" 2>&1 | tee -a "$ROLLBACK_LOG"

log "Running health check..."
"$SCRIPT_DIR/verify.sh" "$ENV" "$SERVICE" || log "WARNING: Health check failed after rollback"

log "=== Rollback Complete ==="
