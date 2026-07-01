#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/notify-alert-$TIMESTAMP.log"

SEVERITY="${1:-info}"
MESSAGE="${2:-No message}"
CHANNEL="${3:-slack}"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

notify_slack() {
    local webhook="${SLACK_WEBHOOK_URL:-}"
    if [ -z "$webhook" ]; then
        log "⚠️ SLACK_WEBHOOK_URL not set, skipping Slack notification"
        return
    fi
    local color="$1"
    local msg="$2"
    curl -sf -X POST -H "Content-type: application/json" \
        --data "{\"attachments\":[{\"color\":\"$color\",\"text\":\"[$SEVERITY] $msg\",\"ts\":$(date +%s)}]}" \
        "$webhook" 2>/dev/null && log "✅ Slack notified" || log "⚠️ Slack notification failed"
}

notify_journal() {
    logger -t "happyserv-alert" -p "user.$1" "$2"
    log "✅ Journal notified"
}

case "$SEVERITY" in
    critical|emergency)
        notify_slack "danger" "$MESSAGE"
        notify_journal "emerg" "$MESSAGE"
        log "CRITICAL: $MESSAGE"
        ;;
    error)
        notify_slack "danger" "$MESSAGE"
        notify_journal "err" "$MESSAGE"
        log "ERROR: $MESSAGE"
        ;;
    warning)
        notify_slack "warning" "$MESSAGE"
        notify_journal "warning" "$MESSAGE"
        log "WARNING: $MESSAGE"
        ;;
    info)
        notify_slack "good" "$MESSAGE"
        notify_journal "info" "$MESSAGE"
        log "INFO: $MESSAGE"
        ;;
esac

log "Notification sent: [$SEVERITY] $MESSAGE via $CHANNEL"
