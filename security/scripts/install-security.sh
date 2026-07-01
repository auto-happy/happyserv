#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECURITY_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$SECURITY_DIR/reports/install-$TIMESTAMP.log"

mkdir -p "$SECURITY_DIR/reports"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Security Installation ==="

log "1. Updating package lists..."
apt-get update -qq 2>&1 | tee -a "$LOG_FILE"

log "2. Installing security packages..."
apt-get install -y -qq \
    ufw \
    fail2ban \
    rkhunter \
    chkrootkit \
    aide \
    auditd \
    lynis \
    unattended-upgrades \
    needrestart \
    bsd-mailx 2>&1 | tee -a "$LOG_FILE"

log "3. Configuring UFW..."
if [ -f "$SECURITY_DIR/config/ufw/ufw-configure.sh" ]; then
    bash "$SECURITY_DIR/config/ufw/ufw-configure.sh" 2>&1 | tee -a "$LOG_FILE"
fi

log "4. Configuring SSH..."
if [ -d /etc/ssh/sshd_config.d ]; then
    cp "$SECURITY_DIR/config/ssh/sshd_config.conf" /etc/ssh/sshd_config.d/99-happyserv.conf
elif [ -f /etc/ssh/sshd_config ]; then
    cat "$SECURITY_DIR/config/ssh/sshd_config.conf" >> /etc/ssh/sshd_config
fi

if [ -f "$SECURITY_DIR/config/ssh/banner" ]; then
    cp "$SECURITY_DIR/config/ssh/banner" /etc/ssh/banner
fi

log "5. Configuring Fail2Ban..."
cp "$SECURITY_DIR/config/fail2ban/jail-happyserv.conf" /etc/fail2ban/jail.d/happyserv.conf
if [ -f "$SECURITY_DIR/config/fail2ban/filter-happyserv-api.conf" ]; then
    cp "$SECURITY_DIR/config/fail2ban/filter-happyserv-api.conf" /etc/fail2ban/filter.d/happyserv-api.conf
fi
if [ -f "$SECURITY_DIR/config/fail2ban/filter-happyserv-portal.conf" ]; then
    cp "$SECURITY_DIR/config/fail2ban/filter-happyserv-portal.conf" /etc/fail2ban/filter.d/happyserv-portal.conf
fi

log "6. Configuring automatic security updates..."
cat > /etc/apt/apt.conf.d/20auto-upgrades << 'APT'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
APT

log "7. Running initial system hardening..."
if [ -f "$SECURITY_DIR/scripts/harden-system.sh" ]; then
    bash "$SECURITY_DIR/scripts/harden-system.sh" 2>&1 | tee -a "$LOG_FILE"
fi

log "8. Restarting services..."
systemctl restart sshd 2>&1 | tee -a "$LOG_FILE" || true
systemctl restart fail2ban 2>&1 | tee -a "$LOG_FILE" || true
systemctl restart ufw 2>&1 | tee -a "$LOG_FILE" || true

log "=== Security Installation Complete ==="
log "Please review the log at $LOG_FILE"
log "Reboot recommended for full hardening to take effect."
