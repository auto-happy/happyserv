#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECURITY_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$SECURITY_DIR/reports/rotate-$TIMESTAMP.log"
BACKUP_DIR="$SECURITY_DIR/reports/secrets-backup-$TIMESTAMP"

mkdir -p "$SECURITY_DIR/reports" "$BACKUP_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Secrets Rotation ==="

log "1. Backing up current secrets..."
for file in .env.prod .env.production .env.test docker-compose.yml; do
    if [ -f "/home/happyserv/$file" ]; then
        cp "/home/happyserv/$file" "$BACKUP_DIR/$file"
        log "Backed up $file"
    fi
done

log "2. Rotating JWT secrets..."
NEW_JWT_SECRET=$(openssl rand -base64 64)
NEW_JWT_REFRESH_SECRET=$(openssl rand -base64 64)
log "Generated new JWT secrets"

log "3. Rotating database passwords..."
NEW_DB_PASSWORD=$(openssl rand -base64 32)
log "Generated new database password"

log "4. Rotating API keys..."
NEW_API_KEY=$(openssl rand -hex 32)
log "Generated new API key"

log "5. Updating environment files..."
if [ -f "/home/happyserv/.env.prod" ]; then
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$NEW_JWT_SECRET/" "/home/happyserv/.env.prod"
    sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$NEW_JWT_REFRESH_SECRET/" "/home/happyserv/.env.prod" 2>/dev/null || true
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$NEW_DB_PASSWORD/" "/home/happyserv/.env.prod"
    sed -i "s/API_KEY=.*/API_KEY=$NEW_API_KEY/" "/home/happyserv/.env.prod" 2>/dev/null || true
    log "Updated .env.prod"
fi

log "6. Saving secrets summary..."
cat > "$BACKUP_DIR/secrets-summary.txt" << SEC
JWT Secret: $NEW_JWT_SECRET
JWT Refresh Secret: $NEW_JWT_REFRESH_SECRET
DB Password: $NEW_DB_PASSWORD
API Key: $NEW_API_KEY
SEC
chmod 600 "$BACKUP_DIR/secrets-summary.txt"
log "Secrets backup saved to $BACKUP_DIR"

log "7. Restarting affected services..."
docker compose -f /home/happyserv/docker-compose.yml restart api portal 2>&1 | tee -a "$LOG_FILE" || true

log "=== Secrets Rotation Complete ==="
log "Backup saved to: $BACKUP_DIR"
log "IMPORTANT: Verify all services are working correctly"
