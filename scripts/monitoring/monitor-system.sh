#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/monitor-$TIMESTAMP.log"
REPORT="/tmp/system-monitor-$TIMESTAMP.txt"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ System Monitor ==="

FAILED=0

log "--- CPU ---"
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
log "CPU usage: ${CPU_USAGE}%"
if [ "${CPU_USAGE:-0}" -gt 90 ]; then
    log "WARNING: CPU usage above 90%"
    FAILED=1
fi

log "--- Memory ---"
MEM_TOTAL=$(free -m | awk 'NR==2 {print $2}')
MEM_FREE=$(free -m | awk 'NR==2 {print $7}')
MEM_PCT=$(( (MEM_TOTAL - MEM_FREE) * 100 / MEM_TOTAL ))
log "Memory: ${MEM_FREE}MB free (${MEM_PCT}% used)"
if [ "$MEM_PCT" -gt 90 ]; then
    log "WARNING: Memory usage above 90%"
    FAILED=1
fi

log "--- Disk ---"
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
log "Disk: ${DISK_USAGE}% used"
if [ "$DISK_USAGE" -gt 90 ]; then
    log "WARNING: Disk usage above 90%"
    FAILED=1
fi

log "--- Docker ---"
DOCKER_COUNT=$(docker ps -q 2>/dev/null | wc -l)
log "Running containers: $DOCKER_COUNT"

log "--- Network ---"
log "Connections: $(ss -tun | tail -n +3 | wc -l)"

log "--- Uptime ---"
UPTIME=$(uptime -p)
log "Uptime: $UPTIME"

echo "System Monitor Report - $TIMESTAMP" > "$REPORT"
echo "CPU: ${CPU_USAGE}% | Memory: ${MEM_PCT}% | Disk: ${DISK_USAGE}% | Containers: $DOCKER_COUNT" >> "$REPORT"
echo "Status: $([ "$FAILED" -eq 0 ] && echo "OK" || echo "ISSUES")" >> "$REPORT"

log "=== System Monitor Complete ==="
exit "$FAILED"
