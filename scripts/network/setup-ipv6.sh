#!/usr/bin/env bash
set -euo pipefail

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== HappyServ IPv6 Setup ==="

log "1. Vérification du support IPv6..."
if [ ! -f /proc/net/if_inet6 ]; then
    log "IPv6 n'est pas supporté par le noyau"
    exit 1
fi
log "✅ IPv6 supporté"

log "2. Configuration sysctl pour IPv6..."
cat > /etc/sysctl.d/99-happyserv-ipv6.conf << 'SYSCTL'
net.ipv6.conf.all.accept_ra = 0
net.ipv6.conf.all.autoconf = 0
net.ipv6.conf.all.disable_ipv6 = 0
net.ipv6.conf.all.accept_redirects = 0
SYSCTL
sysctl -p /etc/sysctl.d/99-happyserv-ipv6.conf 2>&1

log "3. Vérification des interfaces..."
for iface in $(ip -o link show | awk -F': ' '{print $2}' | grep -v lo); do
    IPV6=$(ip -6 addr show "$iface" 2>/dev/null | grep inet6 | awk '{print $2}' | head -1 || echo "Aucune")
    log "  $iface: $IPV6"
done

log "=== IPv6 Setup Complete ==="
