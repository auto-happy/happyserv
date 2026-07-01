#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/security-audit-$TIMESTAMP.log"
REPORT="$PROJECT_ROOT/logs/security-audit-report-$TIMESTAMP.md"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Security Audit ==="

FAILED=0

echo "# Security Audit Report - $TIMESTAMP" > "$REPORT"
echo "" >> "$REPORT"

check() {
    local name="$1"
    local cmd="$2"
    if eval "$cmd" >> "$LOG_FILE" 2>&1; then
        echo "✅ $name" >> "$REPORT"
        log "✅ $name"
    else
        echo "❌ $name" >> "$REPORT"
        log "❌ $name"
        FAILED=1
    fi
}

log "--- Checking system security ---"
check "UFW active" "ufw status | grep -q active"
check "No root SSH" "grep -q 'PermitRootLogin no' /etc/ssh/sshd_config 2>/dev/null || grep -rq 'PermitRootLogin no' /etc/ssh/sshd_config.d/ 2>/dev/null"
check "SSH key auth" "grep -q 'PubkeyAuthentication yes' /etc/ssh/sshd_config 2>/dev/null || grep -qr 'PubkeyAuthentication yes' /etc/ssh/sshd_config.d/ 2>/dev/null"
check "Fail2Ban active" "systemctl is-active --quiet fail2ban"
check "Docker active" "systemctl is-active --quiet docker"

log "--- Checking file permissions ---"
check ".env permissions" "[ \$(stat -c '%a' $PROJECT_ROOT/.env.prod 2>/dev/null || echo 666) -le 600 ]"

log "--- Checking Docker security ---"
for container in nginx api portal postgres redis; do
    if docker ps --format '{{.Names}}' | grep -q "happyserv-$container"; then
        echo "✅ Container $container running" >> "$REPORT"
    else
        echo "❌ Container $container not running" >> "$REPORT"
        FAILED=1
    fi
done

echo "" >> "$REPORT"
echo "## Summary" >> "$REPORT"
echo "Status: $([ "$FAILED" -eq 0 ] && echo '✅ OK' || echo '❌ Issues found')" >> "$REPORT"

log "Security audit saved to $REPORT"
exit "$FAILED"
