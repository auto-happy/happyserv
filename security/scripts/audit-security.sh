#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECURITY_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT="$SECURITY_DIR/reports/audit-$TIMESTAMP.md"
LOG_FILE="$SECURITY_DIR/reports/audit-$TIMESTAMP.log"

mkdir -p "$SECURITY_DIR/reports"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

log "=== HappyServ Security Audit ==="

echo "# Rapport d'Audit de Sécurité - $TIMESTAMP" > "$REPORT"
echo "" >> "$REPORT"

FAILED=0

check() {
    local name="$1"
    local cmd="$2"
    log "Checking: $name..."
    if eval "$cmd" >> "$LOG_FILE" 2>&1; then
        echo "✅ $name" >> "$REPORT"
        log "✅ $name"
    else
        echo "❌ $name" >> "$REPORT"
        log "❌ $name"
        FAILED=1
    fi
}

echo "## Vérifications Système" >> "$REPORT"
echo "" >> "$REPORT"

check "UFW est actif" "ufw status | grep -q active"
check "UFW refuse les connexions entrantes" "ufw status verbose | grep -q 'deny (incoming)'"
check "SSH sans root" "grep -q 'PermitRootLogin no' /etc/ssh/sshd_config 2>/dev/null || grep -q 'PermitRootLogin no' /etc/ssh/sshd_config.d/*.conf 2>/dev/null"
check "Authentification par clé SSH" "grep -q 'PubkeyAuthentication yes' /etc/ssh/sshd_config 2>/dev/null || grep -q 'PasswordAuthentication no' /etc/ssh/sshd_config 2>/dev/null"
check "Fail2Ban est actif" "systemctl is-active --quiet fail2ban"
check "Docker est actif" "systemctl is-active --quiet docker"

echo "" >> "$REPORT"
echo "## Vérifications Réseau" >> "$REPORT"
echo "" >> "$REPORT"

check "Port 80 (HTTP) ouvert" "ss -tlnp | grep -q ':80 '"
check "Port 443 (HTTPS) ouvert" "ss -tlnp | grep -q ':443 '"
check "Port 22 (SSH) ouvert" "ss -tlnp | grep -q ':22 '"
check "PostgreSQL pas exposé publiquement" "! ss -tlnp | grep -q '0.0.0.0:5432 '"

echo "" >> "$REPORT"
echo "## Vérifications Docker" >> "$REPORT"
echo "" >> "$REPORT"

check "Conteneurs en cours d'exécution" "docker ps --format '{{.Names}}' | grep -q happyserv"
for container in nginx api portal postgres redis; do
    if docker ps --format '{{.Names}}' | grep -q "^happyserv-$container$"; then
        echo "✅ Conteneur $container présent" >> "$REPORT"
    else
        echo "❌ Conteneur $container manquant" >> "$REPORT"
        FAILED=1
    fi
done

echo "" >> "$REPORT"
echo "## Résumé" >> "$REPORT"
echo "" >> "$REPORT"
if [ "$FAILED" -eq 0 ]; then
    echo "✅ **Audit : OK - Toutes les vérifications passées**" >> "$REPORT"
else
    echo "⚠️ **Audit : Problèmes détectés - Voir les détails ci-dessus**" >> "$REPORT"
fi

log "Audit report saved to $REPORT"
exit "$FAILED"
