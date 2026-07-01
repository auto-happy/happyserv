#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/var/log/happyserv/network-logging.conf"

mkdir -p /var/log/happyserv

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== HappyServ Network Logging Setup ==="

cat > "$LOG_FILE" << 'CONF'
# HappyServ Network Logging Configuration
# Log all incoming/outgoing connections (debug only)

# Logging rules will be applied via iptables/ufw logging
# This file documents the logging setup

LogLevel: info
LogPrefix: HAPPYSERV-NET
LogTarget: /var/log/happyserv/network.log
LogRotate: daily
LogRetention: 30d
CONF

log "Configuration créée: $LOG_FILE"

log "Activation du logging UFW..."
ufw logging medium 2>&1 || true

log "=== Network Logging Setup Complete ==="
log "Logs: /var/log/ufw.log"
log "Config: $LOG_FILE"
