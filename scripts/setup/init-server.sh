#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/init-$TIMESTAMP.log"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Server Initialization ==="

log "1. Updating system..."
apt-get update -qq 2>&1 | tee -a "$LOG_FILE"
apt-get upgrade -y -qq 2>&1 | tee -a "$LOG_FILE"

log "2. Installing core packages..."
apt-get install -y -qq \
    curl wget git \
    docker.io docker-compose-v2 \
    nginx certbot python3-certbot-nginx \
    ufw fail2ban \
    postgresql-client \
    redis-tools \
    htop iotop iftop \
    net-tools dnsutils \
    unattended-upgrades \
    logrotate \
    jq 2>&1 | tee -a "$LOG_FILE"

log "3. Installing Node.js..."
if ! command -v node &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>&1 | tee -a "$LOG_FILE"
    apt-get install -y -qq nodejs 2>&1 | tee -a "$LOG_FILE"
fi
log "Node.js version: $(node --version)"

log "4. Starting Docker..."
systemctl enable --now docker 2>&1 | tee -a "$LOG_FILE"

log "5. Creating directory structure..."
mkdir -p "$PROJECT_ROOT"/{api,portal,telehappy,client,nginx,scripts,backups,logs,maintenance,ci-cd,security,docs}

log "6. Setting up swap..."
if ! swapon --show | grep -q .; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
    log "Swap 2G créé"
fi

log "7. Setting timezone..."
timedatectl set-timezone Europe/Paris 2>/dev/null || true

log "8. Configuring log rotation for Docker..."
cat > /etc/logrotate.d/docker-containers << 'LOGROTATE'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
LOGROTATE

log "=== Server Initialization Complete ==="
log "Reboot recommended to finalize setup."
