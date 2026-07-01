#!/usr/bin/env bash
set -euo pipefail

SECURITY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/happyserv/security-monitor-$TIMESTAMP.log"
REPORT="/tmp/security-monitor-$TIMESTAMP.txt"

mkdir -p /var/log/happyserv

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Security Monitor ==="

FAILED=0

log "1. Checking Fail2Ban status..."
if systemctl is-active --quiet fail2ban; then
    BANNED=$(fail2ban-client status 2>/dev/null | grep "Total banned" | awk '{print $4}' || echo "0")
    log "Fail2Ban actif, bannis: $BANNED"
else
    log "WARNING: Fail2Ban n'est pas actif"
    FAILED=1
fi

log "2. Checking UFW status..."
if ufw status | grep -q "Status: active"; then
    log "UFW actif"
else
    log "WARNING: UFW n'est pas actif"
    FAILED=1
fi

log "3. Checking Docker containers..."
for container in nginx api portal postgres redis; do
    if docker ps --format '{{.Names}} {{.Status}}' 2>/dev/null | grep -q "^happyserv-$container "; then
        log "✅ Conteneur $container OK"
    else
        log "❌ Conteneur $container manquant"
        FAILED=1
    fi
done

log "4. Checking disk usage..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    log "WARNING: Disk usage at ${DISK_USAGE}%"
    FAILED=1
else
    log "Disk usage: ${DISK_USAGE}%"
fi

log "5. Checking auth log for suspicious activity..."
if [ -f /var/log/auth.log ]; then
    SUSPICIOUS=$(grep -c "Failed password" /var/log/auth.log 2>/dev/null || echo 0)
    log "Failed password attempts (recent): $SUSPICIOUS"
fi

log "6. Checking SSL certificates..."
for domain in happyserv.fr telehappy.fr; do
    if [ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]; then
        EXPIRY=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$domain/fullchain.pem" | cut -d= -f2)
        log "SSL $domain expire: $EXPIRY"
    fi
done

echo "Security Monitor Report - $TIMESTAMP" > "$REPORT"
echo "Status: $([ "$FAILED" -eq 0 ] && echo "OK" || echo "ISSUES FOUND")" >> "$REPORT"

log "=== Security Monitor Complete ==="
exit "$FAILED"
