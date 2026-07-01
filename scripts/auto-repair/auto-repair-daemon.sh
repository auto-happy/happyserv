#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/auto-repair-$TIMESTAMP.log"
REPORT="$PROJECT_ROOT/logs/auto-repair-$TIMESTAMP.md"

mkdir -p "$PROJECT_ROOT/logs"
RUN_LOCK="/tmp/happyserv-auto-repair.lock"
MAX_RUNS_PER_HOUR=3

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

exec 200>"$RUN_LOCK"
flock -n 200 || { log "Another instance is running, exiting."; exit 1; }

CURRENT_HOUR=$(date +%H)
RUN_COUNT=0
if [ -f /tmp/happyserv-repair-count ]; then
    RUN_COUNT=$(cat /tmp/happyserv-repair-count 2>/dev/null || echo 0)
    RUN_HOUR=$(cat /tmp/happyserv-repair-hour 2>/dev/null || echo "")
    if [ "$RUN_HOUR" != "$CURRENT_HOUR" ]; then
        RUN_COUNT=0
    fi
fi

if [ "$RUN_COUNT" -ge "$MAX_RUNS_PER_HOUR" ]; then
    log "Max runs per hour ($MAX_RUNS_PER_HOUR) reached. Skipping."
    exit 0
fi

RUN_COUNT=$((RUN_COUNT + 1))
echo "$RUN_COUNT" > /tmp/happyserv-repair-count
echo "$CURRENT_HOUR" > /tmp/happyserv-repair-hour

log "=== HappyServ Auto-Repair Daemon (Run $RUN_COUNT/$MAX_RUNS_PER_HOUR) ==="

FAILED=0
REPAIRED=0

check_and_repair() {
    local name="$1"
    local check_cmd="$2"
    local repair_cmd="$3"
    log "Checking: $name..."
    if eval "$check_cmd" >> "$LOG_FILE" 2>&1; then
        log "✅ $name OK"
    else
        log "❌ $name FAILED, attempting repair..."
        FAILED=1
        if eval "$repair_cmd" >> "$LOG_FILE" 2>&1; then
            log "✅ $name REPAIRED"
            REPAIRED=$((REPAIRED + 1))
        else
            log "❌ $name REPAIR FAILED"
        fi
    fi
}

check_and_repair "Docker daemon" \
    "docker info" \
    "systemctl restart docker && sleep 5"

check_and_repair "Nginx container" \
    "docker ps --format '{{.Names}}' | grep -q 'happyserv-nginx'" \
    "docker compose -f $PROJECT_ROOT/docker-compose.yml up -d nginx"

check_and_repair "API container" \
    "docker ps --format '{{.Names}}' | grep -q 'happyserv-api'" \
    "docker compose -f $PROJECT_ROOT/docker-compose.yml up -d api"

check_and_repair "PostgreSQL container" \
    "docker ps --format '{{.Names}}' | grep -q 'happyserv-postgres'" \
    "docker compose -f $PROJECT_ROOT/docker-compose.yml up -d postgres"

check_and_repair "Redis container" \
    "docker ps --format '{{.Names}}' | grep -q 'happyserv-redis'" \
    "docker compose -f $PROJECT_ROOT/docker-compose.yml up -d redis"

check_and_repair "Portal container" \
    "docker ps --format '{{.Names}}' | grep -q 'happyserv-portal'" \
    "docker compose -f $PROJECT_ROOT/docker-compose.yml up -d portal"

check_and_repair "Disk space (>90%)" \
    "[ \$(df / | awk 'NR==2 {print \$5}' | sed 's/%//') -le 90 ]" \
    "log 'Manual cleanup needed'"

check_and_repair "Memory (<100MB free)" \
    "[ \$(free -m | awk 'NR==2 {print \$7}') -ge 100 ]" \
    "log 'Low memory - manual intervention needed'"

check_and_repair "API health endpoint" \
    "curl -sf http://localhost:3000/health" \
    "docker compose -f $PROJECT_ROOT/docker-compose.yml restart api"

echo "# Auto-Repair Report - $TIMESTAMP" > "$REPORT"
echo "" >> "$REPORT"
echo "- **Checks performed:** 9" >> "$REPORT"
echo "- **Failures detected:** $FAILED" >> "$REPORT"
echo "- **Services repaired:** $REPAIRED" >> "$REPORT"
echo "- **Status:** $([ "$FAILED" -eq 0 ] && echo '✅ All OK' || echo '⚠️ Issues remaining')" >> "$REPORT"

log "=== Auto-Repair Complete ==="
log "Report saved to $REPORT"
