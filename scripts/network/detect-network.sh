#!/usr/bin/env bash
set -euo pipefail

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== HappyServ Network Detection ==="

INTERFACES=$(ip -o link show | awk -F': ' '{print $2}' | grep -v lo)

log "Interfaces détectées:"
for iface in $INTERFACES; do
    IP=$(ip -4 addr show "$iface" 2>/dev/null | grep inet | awk '{print $2}' | cut -d/ -f1 || echo "Aucune IP")
    MAC=$(ip link show "$iface" | grep ether | awk '{print $2}' || echo "N/A")
    STATUS=$(ip link show "$iface" | grep -q "UP" && echo "UP" || echo "DOWN")
    log "  $iface: IP=$IP MAC=$MAC STATUT=$STATUS"
done

log "--- Passerelle ---"
GATEWAY=$(ip route | grep default | awk '{print $3}' || echo "Non trouvée")
log "Passerelle par défaut: $GATEWAY"

log "--- DNS ---"
for dns in $(grep nameserver /etc/resolv.conf | awk '{print $2}'); do
    log "DNS: $dns"
done

log "--- Connectivité ---"
for target in "8.8.8.8" "1.1.1.1" "github.com"; do
    if ping -c 1 -W 2 "$target" &>/dev/null; then
        log "✅ $target accessible"
    else
        log "❌ $target inaccessible"
    fi
done
