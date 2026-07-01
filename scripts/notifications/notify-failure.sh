#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/notify-failure-$TIMESTAMP.log"

SERVICE="${1:-unknown}"
ERROR_MSG="${2:-No details}"
ACTION="${3:-investigate}"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== Service Failure Notification ==="
log "Service: $SERVICE"
log "Error: $ERROR_MSG"
log "Action: $ACTION"

# Systemd journal
logger -t "happyserv-failure" -p "user.crit" "Service $SERVICE failed: $ERROR_MSG"

# Slack (if configured)
if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    curl -sf -X POST -H "Content-type: application/json" \
        --data "{\"attachments\":[{\"color\":\"danger\",\"title\":\"❌ Service Failure: $SERVICE\",\"text\":\"**Error:** $ERROR_MSG\n**Action:** $ACTION\n**Time:** $(date)\",\"ts\":$(date +%s)}]}" \
        "${SLACK_WEBHOOK_URL}" 2>/dev/null || true
fi

# Attempt auto-repair
if [ "$ACTION" = "restart" ] || [ "$ACTION" = "auto" ]; then
    log "Attempting auto-repair for $SERVICE..."
    case "$SERVICE" in
        nginx|api|portal|postgres|redis)
            docker compose -f "$PROJECT_ROOT/docker-compose.yml" up -d "$SERVICE" 2>&1 | tee -a "$LOG_FILE" || true
            ;;
        *)
            log "No auto-repair action defined for $SERVICE"
            ;;
    esac
fi

log "=== Failure Notification Sent ==="
