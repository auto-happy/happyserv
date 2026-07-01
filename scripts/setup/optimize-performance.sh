#!/usr/bin/env bash
set -euo pipefail

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== HappyServ Performance Optimization ==="

log "1. Swappiness..."
sysctl -w vm.swappiness=10
echo "vm.swappiness=10" > /etc/sysctl.d/99-happyserv-swap.conf

log "2. Inode cache..."
sysctl -w vm.vfs_cache_pressure=50
echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.d/99-happyserv-swap.conf

log "3. Network optimizations..."
sysctl -w net.core.somaxconn=65535
sysctl -w net.ipv4.tcp_max_syn_backlog=65535
sysctl -w net.core.netdev_max_backlog=65535
sysctl -w net.ipv4.tcp_fin_timeout=15
sysctl -w net.ipv4.tcp_tw_reuse=1

cat > /etc/sysctl.d/99-happyserv-network.conf << 'SYSCTL'
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=65535
net.core.netdev_max_backlog=65535
net.ipv4.tcp_fin_timeout=15
net.ipv4.tcp_tw_reuse=1
SYSCTL

log "4. File descriptor limits..."
echo "* soft nofile 65535" > /etc/security/limits.d/99-happyserv.conf
echo "* hard nofile 65535" >> /etc/security/limits.d/99-happyserv.conf

log "5. I/O scheduler..."
for disk in /sys/block/sd*/queue/scheduler; do
    if [ -f "$disk" ]; then
        echo "none" > "$disk" 2>/dev/null || true
    fi
done

log "=== Performance Optimization Complete ==="
