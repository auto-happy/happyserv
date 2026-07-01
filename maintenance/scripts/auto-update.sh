#!/usr/bin/env bash
#=============================================================================
# Auto-Update — HappyServ
# Mise à jour automatique la nuit (02h-03h) : backup avant, apt, docker,
# rebuild services, renouvellement certs, vérification post-update. Rollback.
#=============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../config/maintenance.conf"
LOG_FILE="${SCRIPT_DIR}/../logs/health-check.log"

[[ -f "$CONFIG_FILE" ]] && source "$CONFIG_FILE"

: "${COMPOSE_FILE:=/home/happyserv/docker/compose/prod/docker-compose.yml}"
: "${BACKUP_SCRIPT:=${SCRIPT_DIR}/backup.sh}"
: "${NOTIFY_SCRIPT:=${SCRIPT_DIR}/notify.sh}"
: "${ROLLBACK_DIR:=/backup/rollback}"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
CURRENT_VERSION_FILE="/home/happyserv/VERSION"
ROLLBACK_VERSION_FILE="${ROLLBACK_DIR}/previous-version.txt"
ERRORS=0

log() {
    local level="$1"
    local message="$2"
    echo "[${TIMESTAMP}] [AUTO-UPDATE] [${level}] ${message}" >> "$LOG_FILE"
    echo "[${level}] ${message}"
}

rollback() {
    log "WARN" "ROLLBACK initiated"
    if [[ -f "$ROLLBACK_VERSION_FILE" ]]; then
        local prev_version
        prev_version=$(cat "$ROLLBACK_VERSION_FILE")
        log "INFO" "Rolling back to version ${prev_version}"

        # Restore docker compose
        docker compose -f "$COMPOSE_FILE" down 2>/dev/null || true
        docker compose -f "$COMPOSE_FILE" up -d 2>/dev/null || true

        log "INFO" "Rollback complete"
        if [[ -x "$NOTIFY_SCRIPT" ]]; then
            "$NOTIFY_SCRIPT" "CRITICAL" "Auto-update rollback triggered" "Rolled back to ${prev_version}"
        fi
    fi
    exit 1
}

# === MAIN ===
log "INFO" "=== Auto-Update Start ==="

# 1. Backup before update
log "INFO" "Running pre-update backup..."
if [[ -x "$BACKUP_SCRIPT" ]]; then
    "$BACKUP_SCRIPT" || log "WARN" "Pre-update backup completed with warnings"
fi

# 2. Save current version
if [[ -f "$CURRENT_VERSION_FILE" ]]; then
    cp "$CURRENT_VERSION_FILE" "$ROLLBACK_VERSION_FILE"
fi

# 3. System updates
log "INFO" "Running system updates..."
apt-get update -qq 2>/dev/null || { log "ERROR" "apt-get update failed"; ((ERRORS++)); }
apt-get upgrade -y -qq 2>/dev/null || { log "ERROR" "apt-get upgrade failed"; ((ERRORS++)); }
apt-get autoremove -y -qq 2>/dev/null || true
apt-get autoclean -qq 2>/dev/null || true

# 4. Docker updates
log "INFO" "Pulling Docker images..."
docker pull nginx:alpine 2>/dev/null || { log "ERROR" "Failed to pull nginx"; ((ERRORS++)); }
docker pull postgres:15-alpine 2>/dev/null || { log "ERROR" "Failed to pull postgres"; ((ERRORS++)); }
docker pull redis:7-alpine 2>/dev/null || { log "ERROR" "Failed to pull redis"; ((ERRORS++)); }

# 5. Rebuild custom services
log "INFO" "Rebuilding custom services..."
docker compose -f "$COMPOSE_FILE" build api 2>/dev/null || { log "ERROR" "Failed to build api"; ((ERRORS++)); }
docker compose -f "$COMPOSE_FILE" build portal 2>/dev/null || { log "ERROR" "Failed to build portal"; ((ERRORS++)); }

# 6. Redeploy
log "INFO" "Redeploying services..."
docker compose -f "$COMPOSE_FILE" up -d --force-recreate 2>/dev/null || {
    log "ERROR" "Failed to redeploy services"
    rollback
}

# 7. Certificate renewal
log "INFO" "Checking SSL certificates..."
docker compose -f "$COMPOSE_FILE" run --rm certbot renew 2>/dev/null || true

# 8. Post-update verification
log "INFO" "Running post-update verification..."
sleep 5

# Check all containers
for container in happyserv-nginx happyserv-api happyserv-portal happyserv-telehappy happyserv-postgres happyserv-redis; do
    if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${container}$"; then
        log "ERROR" "Container ${container} not running after update"
        ((ERRORS++))
    fi
done

# Check URLs
for url in https://telehappy.fr https://happyserv.fr https://api.happyserv.fr/health; do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
    if ! [[ "$code" =~ ^[23] ]]; then
        log "ERROR" "URL ${url} returned ${code} after update"
        ((ERRORS++))
    fi
done

# 9. Cleanup
log "INFO" "Cleaning up..."
docker system prune -f 2>/dev/null || true
docker image prune -f 2>/dev/null || true

# 10. Update version file
echo "1.0.0-$(date +%Y%m%d%H%M)" > "$CURRENT_VERSION_FILE"

log "INFO" "=== Auto-Update Complete: ${ERRORS} errors ==="

if [[ "$ERRORS" -gt 0 ]]; then
    if [[ -x "$NOTIFY_SCRIPT" ]]; then
        "$NOTIFY_SCRIPT" "WARNING" "Auto-update completed with ${ERRORS} errors" \
            "Check logs for details"
    fi
else
    if [[ -x "$NOTIFY_SCRIPT" ]]; then
        "$NOTIFY_SCRIPT" "INFO" "Auto-update completed successfully" \
            "All services updated"
    fi
fi

exit $([ "$ERRORS" -eq 0 ] && echo 0 || echo 1)
