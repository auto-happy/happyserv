#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_BASE="$PROJECT_ROOT/backups"
BACKUP_DIR="$BACKUP_BASE/daily-$TIMESTAMP"
LOG_FILE="$PROJECT_ROOT/logs/backup-$TIMESTAMP.log"
REPORT="$PROJECT_ROOT/logs/backup-report-$TIMESTAMP.md"

ENV="${1:-full}"

mkdir -p "$BACKUP_DIR" "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Backup Script ==="
log "Type: $ENV"

do_backup() {
    local name="$1"
    local source="$2"
    local dest="$3"
    log "Backing up $name..."
    if [ -d "$source" ]; then
        tar -czf "$dest" -C "$(dirname "$source")" "$(basename "$source")" 2>&1 | tee -a "$LOG_FILE"
        log "✅ $name backed up to $dest ($(du -h "$dest" | cut -f1))"
    elif [ -f "$source" ]; then
        cp "$source" "$dest"
        log "✅ $name backed up to $dest"
    else
        log "⚠️ $name not found, skipping"
    fi
}

do_db_backup() {
    log "Backing up PostgreSQL database..."
    if docker ps --format '{{.Names}}' | grep -q 'happyserv-postgres'; then
        docker exec happyserv-postgres pg_dumpall -U happyserv > "$BACKUP_DIR/database.sql" 2>/dev/null || \
        docker exec happyserv-postgres pg_dump -U happyserv happyserv > "$BACKUP_DIR/database.sql" 2>/dev/null || \
        log "⚠️ Database backup failed (non-critical if DB is empty)"
        if [ -f "$BACKUP_DIR/database.sql" ]; then
            gzip "$BACKUP_DIR/database.sql"
            log "✅ Database backed up ($(du -h "$BACKUP_DIR/database.sql.gz" | cut -f1))"
        fi
    else
        log "⚠️ PostgreSQL container not running, skipping DB backup"
    fi
}

case "$ENV" in
    daily)
        log "=== Daily Backup ==="
        do_db_backup
        do_backup "Config files" "$PROJECT_ROOT/.env.prod" "$BACKUP_DIR/env.prod.txt"
        do_backup "Nginx config" "$PROJECT_ROOT/nginx" "$BACKUP_DIR/nginx-config.tar.gz"
        log "Daily backup complete"
        ;;
    weekly)
        log "=== Weekly Backup ==="
        do_db_backup
        do_backup "Config files" "$PROJECT_ROOT/.env" "$BACKUP_DIR/env.txt"
        do_backup "SSL certificates" "/etc/letsencrypt" "$BACKUP_DIR/letsencrypt.tar.gz"
        do_backup "Nginx config" "$PROJECT_ROOT/nginx" "$BACKUP_DIR/nginx-config.tar.gz"
        do_backup "Docker Compose" "$PROJECT_ROOT/docker-compose.yml" "$BACKUP_DIR/docker-compose.yml"
        log "Weekly backup complete"
        ;;
    monthly)
        log "=== Monthly Backup ==="
        do_db_backup
        do_backup "Config files" "$PROJECT_ROOT/.env" "$BACKUP_DIR/env.txt"
        do_backup "SSL certificates" "/etc/letsencrypt" "$BACKUP_DIR/letsencrypt.tar.gz"
        do_backup "Nginx config" "$PROJECT_ROOT/nginx" "$BACKUP_DIR/nginx-config.tar.gz"
        do_backup "Docker Compose" "$PROJECT_ROOT/docker-compose.yml" "$BACKUP_DIR/docker-compose.yml"
        do_backup "API source" "$PROJECT_ROOT/api/src" "$BACKUP_DIR/api-src.tar.gz"
        do_backup "Portal source" "$PROJECT_ROOT/website-app/src" "$BACKUP_DIR/portal-src.tar.gz"
        do_backup "Scripts" "$PROJECT_ROOT/scripts" "$BACKUP_DIR/scripts.tar.gz"
        log "Monthly backup complete"
        ;;
    *)
        log "=== Full Backup ==="
        do_db_backup
        tar -czf "$BACKUP_DIR/project.tar.gz" -C "$PROJECT_ROOT" \
            --exclude=node_modules --exclude=dist --exclude=.git \
            --exclude=backups --exclude=logs \
            api portal website-app telehappy client scripts docker-compose.yml \
            nginx maintenance ci-cd security docs 2>&1 | tee -a "$LOG_FILE" || true
        log "Full backup saved to $BACKUP_DIR/project.tar.gz"
        ;;
esac

echo "# Backup Report - $TIMESTAMP" > "$REPORT"
echo "" >> "$REPORT"
echo "- **Type:** $ENV" >> "$REPORT"
echo "- **Directory:** $BACKUP_DIR" >> "$REPORT"
echo "- **Size:** $(du -sh "$BACKUP_DIR" | cut -f1)" >> "$REPORT"
echo "- **Date:** $(date)" >> "$REPORT"

log "=== Backup Complete ==="
log "Backup saved to $BACKUP_DIR"
log "Report saved to $REPORT"
