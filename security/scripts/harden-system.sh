#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECURITY_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$SECURITY_DIR/reports/harden-$TIMESTAMP.log"

mkdir -p "$SECURITY_DIR/reports"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ System Hardening ==="

log "1. Configuring kernel parameters..."
cat > /etc/sysctl.d/99-happyserv-hardening.conf << 'SYSCTL'
# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
# Ignore source routed packets
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
# Enable TCP SYN cookies
net.ipv4.tcp_syncookies = 1
# Enable bad error message protection
net.ipv4.icmp_ignore_bogus_error_responses = 1
# Log martian packets
net.ipv4.conf.all.log_martians = 1
# Disable IPv6 router solicitations
net.ipv6.conf.all.router_solicitations = 0
# Increase backlog
net.core.netdev_max_backlog = 5000
# Increase TCP max syn backlog
net.ipv4.tcp_max_syn_backlog = 2048
# Disable ICMP redirect acceptance
net.ipv4.conf.all.secure_redirects = 0
# Enable RFC-recommended source validation
net.ipv4.conf.all.arp_ignore = 1
net.ipv4.conf.all.arp_announce = 2
SYSCTL
sysctl -p /etc/sysctl.d/99-happyserv-hardening.conf 2>&1 | tee -a "$LOG_FILE"

log "2. Setting filesystem permissions..."
chmod 700 /root
chmod 700 /home/* 2>/dev/null || true

log "3. Disabling core dumps..."
echo "* hard core 0" > /etc/security/limits.d/99-happyserv.conf
echo "* soft core 0" >> /etc/security/limits.d/99-happyserv.conf

log "4. Configuring auditd..."
if command -v auditctl &>/dev/null; then
    auditctl -e 1 2>&1 | tee -a "$LOG_FILE" || true
fi

log "5. Setting umask..."
echo "umask 027" > /etc/profile.d/umask.sh

log "6. Disabling unused filesystems..."
echo "install cramfs /bin/true" > /etc/modprobe.d/disable-filesystems.conf
echo "install freevxfs /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
echo "install jffs2 /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
echo "install hfs /bin/true" >> /etc/modprobe.d/disable-filesystems.conf
echo "install hfsplus /bin/true" >> /etc/modprobe.d/disable-filesystems.conf

log "=== Hardening Complete ==="
log "System hardened. Some changes require reboot to take full effect."
