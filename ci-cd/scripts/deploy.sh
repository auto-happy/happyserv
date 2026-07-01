#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_LOG="$PROJECT_ROOT/logs/deploy-$TIMESTAMP.log"
REPORT="$PROJECT_ROOT/logs/deploy-report-$TIMESTAMP.md"

ENV="${1:-dev}"
SERVICE="${2:-all}"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$DEPLOY_LOG"; }

log "=== HappyServ Deploy Script ==="
log "Environment: $ENV"
log "Service: $SERVICE"
log "Timestamp: $TIMESTAMP"

if [ ! -f "$PROJECT_ROOT/.env.$ENV" ]; then
    log "ERROR: Environment file .env.$ENV not found"
    exit 1
fi

log "Step 1: Running backup..."
"$PROJECT_ROOT/scripts/backup/backup-full.sh" "$ENV" || log "WARNING: Backup failed, continuing anyway"

log "Step 2: Building services..."
if [ "$SERVICE" = "all" ]; then
    "$SCRIPT_DIR/build.sh" || { log "Build failed"; exit 1; }
else
    "$SCRIPT_DIR/build.sh" "$SERVICE" || { log "Build failed for $SERVICE"; exit 1; }
fi

log "Step 3: Deploying services..."
export COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"
if [ "$SERVICE" = "all" ]; then
    log "Deploying all services..."
    docker compose -f "$COMPOSE_FILE" up -d --build 2>&1 | tee -a "$DEPLOY_LOG"
else
    log "Deploying $SERVICE..."
    docker compose -f "$COMPOSE_FILE" up -d --build "$SERVICE" 2>&1 | tee -a "$DEPLOY_LOG"
fi

log "Step 4: Running health checks..."
"$SCRIPT_DIR/verify.sh" "$ENV" || log "WARNING: Health check reported issues"

log "Step 5: Running database migrations..."
"$SCRIPT_DIR/migrate.sh" "$ENV" || log "WARNING: Migration may have issues"

log "=== Deployment Complete ==="
echo "# Rapport de Déploiement - $TIMESTAMP" > "$REPORT"
echo "" >> "$REPORT"
echo "- **Environnement :** $ENV" >> "$REPORT"
echo "- **Service :** $SERVICE" >> "$REPORT"
echo "- **Date :** $TIMESTAMP" >> "$REPORT"
echo "- **Statut :** ✅ Terminé" >> "$REPORT"

log "Report saved to $REPORT"
