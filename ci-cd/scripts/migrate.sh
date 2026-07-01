#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
MIGRATE_LOG="$PROJECT_ROOT/logs/migrate-$TIMESTAMP.log"

ENV="${1:-dev}"
DIRECTION="${2:-up}"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$MIGRATE_LOG"; }

log "=== HappyServ Migration Script ==="
log "Environment: $ENV"
log "Direction: $DIRECTION"

if [ ! -f "$PROJECT_ROOT/.env.$ENV" ]; then
    log "ERROR: Environment file .env.$ENV not found"
    exit 1
fi

source "$PROJECT_ROOT/.env.$ENV"

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-happyserv}"
DB_USER="${DB_USER:-happyserv}"
DB_PASSWORD="${DB_PASSWORD:-}"
PGPASSWORD="$DB_PASSWORD" export PGPASSWORD

MIGRATIONS_DIR="$PROJECT_ROOT/api/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
    log "WARNING: No migrations directory found at $MIGRATIONS_DIR"
    exit 0
fi

log "Applying migrations in $MIGRATIONS_DIR..."

for migration in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
    MIGRATION_NAME=$(basename "$migration")
    log "Applying: $MIGRATION_NAME..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration" 2>&1 | tee -a "$MIGRATE_LOG"
    if [ $? -eq 0 ]; then
        log "SUCCESS: $MIGRATION_NAME applied"
    else
        log "FAILED: $MIGRATION_NAME"
        exit 1
    fi
done

log "=== Migration Complete ==="
log "All migrations applied successfully for $ENV"
