#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERIFY_LOG="$PROJECT_ROOT/logs/verify-$TIMESTAMP.log"
REPORT="$PROJECT_ROOT/logs/verify-report-$TIMESTAMP.md"

ENV="${1:-dev}"
SERVICE="${2:-}"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$VERIFY_LOG"; }

log "=== HappyServ Post-Deploy Verification ==="
log "Environment: $ENV"

FAILED=0

check_url() {
    local url="$1"
    local name="$2"
    log "Checking $name at $url..."
    if curl -sf -o /dev/null --max-time 10 "$url"; then
        log "✅ $name is UP"
        return 0
    else
        log "❌ $name is DOWN"
        FAILED=1
        return 1
    fi
}

check_container() {
    local container="$1"
    log "Checking container $container..."
    if docker ps --format '{{.Names}}' | grep -q "^$container$"; then
        local status=$(docker inspect "$container" --format '{{.State.Status}}')
        if [ "$status" = "running" ]; then
            log "✅ Container $container is running"
            return 0
        else
            log "❌ Container $container status: $status"
            FAILED=1
            return 1
        fi
    else
        log "❌ Container $container not found"
        FAILED=1
        return 1
    fi
}

log "--- Checking URLs ---"
case "$ENV" in
    prod|production)
        check_url "https://telehappy.fr" "Telehappy.fr"
        check_url "https://happyserv.fr" "HappyServ.fr"
        check_url "https://api.happyserv.fr/health" "API Health"
        ;;
    test)
        check_url "https://test.telehappy.fr" "Test Telehappy"
        check_url "https://test.happyserv.fr" "Test HappyServ"
        ;;
    dev)
        check_url "http://localhost:80" "Nginx"
        check_url "http://localhost:3000/health" "API Health"
        ;;
esac

log "--- Checking Docker Containers ---"
for container in nginx api portal postgres redis; do
    check_container "happyserv-$container"
done

log "--- Checking System Health ---"
log "Disk usage:"
df -h / | tail -1 | tee -a "$VERIFY_LOG"
log "Memory:"
free -h | tee -a "$VERIFY_LOG"

echo "# Rapport de Vérification - $TIMESTAMP" > "$REPORT"
echo "" >> "$REPORT"
echo "- **Environnement :** $ENV" >> "$REPORT"
echo "- **Date :** $TIMESTAMP" >> "$REPORT"
if [ "$FAILED" -eq 0 ]; then
    echo "- **Statut :** ✅ Tout OK" >> "$REPORT"
else
    echo "- **Statut :** ⚠️ Problèmes détectés" >> "$REPORT"
fi

log "Report saved to $REPORT"
exit "$FAILED"
