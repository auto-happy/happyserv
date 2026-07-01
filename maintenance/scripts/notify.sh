#!/usr/bin/env bash
#=============================================================================
# Notify — HappyServ
# Notifications email/webhook/journal avec dédoublonnage (5 min),
# sévérités, format Slack-compatible.
#=============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../config/maintenance.conf"
DEDUP_DIR="/tmp/happyserv-notify-dedup"

[[ -f "$CONFIG_FILE" ]] && source "$CONFIG_FILE"

: "${SLACK_WEBHOOK_URL:=}"
: "${EMAIL_TO:=ops@happyserv.fr}"
: "${DEDUP_INTERVAL:=300}"  # 5 minutes

SEVERITY="${1:-INFO}"
TITLE="${2:-Notification}"
MESSAGE="${3:-}"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Deduplication
dedup_key=$(echo "${SEVERITY}-${TITLE}-${MESSAGE}" | md5sum | cut -d' ' -f1)
dedup_file="${DEDUP_DIR}/${dedup_key}"

if [[ -f "$dedup_file" ]]; then
    local last_ts
    last_ts=$(cat "$dedup_file")
    local now_ts
    now_ts=$(date +%s)
    if (( now_ts - last_ts < DEDUP_INTERVAL )); then
        # Suppressed (deduplicated)
        exit 0
    fi
fi
echo "$(date +%s)" > "$dedup_file"
mkdir -p "$DEDUP_DIR"

# Journal
echo "[${TIMESTAMP}] [${SEVERITY}] ${TITLE} — ${MESSAGE}" | systemd-cat -t happyserv-notify -p "${SEVERITY,,}" 2>/dev/null || true

# Slack webhook
if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
    local color
    case "$SEVERITY" in
        CRITICAL) color="danger" ;;
        WARNING) color="warning" ;;
        INFO) color="good" ;;
        *) color="#808080" ;;
    esac

    curl -s -X POST "$SLACK_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"attachments\": [{
                \"color\": \"${color}\",
                \"title\": \"${TITLE}\",
                \"text\": \"${MESSAGE}\",
                \"ts\": $(date +%s),
                \"footer\": \"HappyServ Monitoring\"
            }]
        }" 2>/dev/null || true
fi

# Email (if configured)
if command -v mail >/dev/null 2>&1; then
    echo "${MESSAGE}" | mail -s "[${SEVERITY}] ${TITLE}" "$EMAIL_TO" 2>/dev/null || true
fi

exit 0
