#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT="/tmp/system-report-$TIMESTAMP.md"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== HappyServ System Report ==="

echo "# HappyServ System Report" > "$REPORT"
echo "" >> "$REPORT"
echo "Généré le $(date)" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Système" >> "$REPORT"
echo "- **Hôte:** $(hostname)" >> "$REPORT"
echo "- **OS:** $(lsb_release -ds 2>/dev/null || cat /etc/os-release 2>/dev/null | grep PRETTY_NAME | cut -d= -f2 | tr -d '\"' || echo 'N/A')" >> "$REPORT"
echo "- **Noyau:** $(uname -r)" >> "$REPORT"
echo "- **Uptime:** $(uptime -p)" >> "$REPORT"
echo "- **Architecture:** $(uname -m)" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Ressources" >> "$REPORT"
echo "- **CPU:** $(nproc) cœurs, charge: $(uptime | awk -F'load average:' '{print $2}')" >> "$REPORT"
echo "- **Mémoire totale:** $(free -h | awk 'NR==2 {print $2}')" >> "$REPORT"
echo "- **Mémoire utilisée:** $(free -h | awk 'NR==2 {print $3}')" >> "$REPORT"
echo "- **Mémoire libre:** $(free -h | awk 'NR==2 {print $7}')" >> "$REPORT"
echo "- **Disque total:** $(df -h / | awk 'NR==2 {print $2}')" >> "$REPORT"
echo "- **Disque utilisé:** $(df -h / | awk 'NR==2 {print $3}') ($(df -h / | awk 'NR==2 {print $5}'))" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Docker" >> "$REPORT"
echo "- **Conteneurs actifs:** $(docker ps -q 2>/dev/null | wc -l)" >> "$REPORT"
echo "- **Images:** $(docker images -q 2>/dev/null | sort -u | wc -l)" >> "$REPORT"
echo "- **Volumes:** $(docker volume ls -q 2>/dev/null | wc -l)" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Réseau" >> "$REPORT"
for iface in $(ip -o link show | awk -F': ' '{print $2}' | grep -v lo); do
    IP=$(ip -4 addr show "$iface" 2>/dev/null | grep inet | awk '{print $2}' || echo "N/A")
    echo "- **$iface:** $IP" >> "$REPORT"
done
echo "" >> "$REPORT"

echo "## Services" >> "$REPORT"
for svc in docker nginx postgresql redis-server fail2ban ufw; do
    STATUS=$(systemctl is-active "$svc" 2>/dev/null || echo "inactif")
    echo "- **$svc:** $STATUS" >> "$REPORT"
done

log "Report saved to $REPORT"
cat "$REPORT"
