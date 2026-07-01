#!/usr/bin/env bash
set -euo pipefail

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== HappyServ XRDP Setup ==="

if ! command -v xrdp &>/dev/null; then
    log "Installing XRDP and desktop..."
    apt-get update -qq
    apt-get install -y -qq xrdp xfce4 xfce4-goodies 2>&1
fi

log "Configuring XRDP..."
echo "startxfce4" > /etc/skel/.xsession || true

log "Configuring XRDP to use Xfce..."
cat > /etc/xrdp/startwm.sh << 'XWRAPPER'
#!/bin/bash
if [ -f /etc/xrdp/xrdp.ini ]; then
    startxfce4
fi
XWRAPPER
chmod +x /etc/xrdp/startwm.sh

log "Setting XRDP port to 3390 (standard 3389 reserved)..."
sed -i 's/port=3389/port=3390/' /etc/xrdp/xrdp.ini 2>/dev/null || true

log "Restarting XRDP..."
systemctl enable --now xrdp 2>&1 || true
systemctl restart xrdp 2>&1 || true

log "Adding UFW rule for XRDP..."
ufw allow 3390/tcp comment 'XRDP' 2>/dev/null || true

log "=== XRDP Setup Complete ==="
log "Connect to: <IP>:3390"
