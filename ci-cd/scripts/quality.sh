#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
QUALITY_LOG="$PROJECT_ROOT/logs/quality-$TIMESTAMP.log"
REPORT="$PROJECT_ROOT/logs/quality-report-$TIMESTAMP.md"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$QUALITY_LOG"; }

log "=== HappyServ Quality Audit ==="

SERVICES=("api" "portal" "telehappy" "client")
FAILED=0

echo "# Rapport de Qualité - $TIMESTAMP" > "$REPORT"
echo "" >> "$REPORT"
echo "## Audit dépendances" >> "$REPORT"

for service in "${SERVICES[@]}"; do
    SERVICE_DIR="$PROJECT_ROOT/$service"
    if [ ! -d "$SERVICE_DIR" ]; then
        log "Skipping $service (directory not found)"
        continue
    fi

    log "--- Auditing $service ---"

    log "Checking dependencies..."
    if [ -f "$SERVICE_DIR/package.json" ]; then
        (cd "$SERVICE_DIR" && npm audit --production 2>&1) >> "$QUALITY_LOG" || true
        VULN_COUNT=$(cd "$SERVICE_DIR" && npm audit --production 2>&1 | grep -c "high\|critical" || true)
        echo "- **$service** : $VULN_COUNT vulnérabilités hautes/critiques" >> "$REPORT"
    fi

    log "Checking bundle size..."
    if [ -d "$SERVICE_DIR/dist" ]; then
        SIZE=$(du -sh "$SERVICE_DIR/dist" 2>/dev/null | cut -f1)
        echo "- **$service** bundle size: $SIZE" >> "$REPORT"
    fi

    log "Checking lint..."
    if [ -f "$SERVICE_DIR/package.json" ]; then
        if grep -q '"lint"' "$SERVICE_DIR/package.json" 2>/dev/null; then
            (cd "$SERVICE_DIR" && npm run lint 2>&1 | tee -a "$QUALITY_LOG") || { log "Lint failed for $service"; FAILED=1; }
        fi
    fi

    log "Checking types..."
    if [ -f "$SERVICE_DIR/package.json" ]; then
        if grep -q '"typecheck"' "$SERVICE_DIR/package.json" 2>/dev/null; then
            (cd "$SERVICE_DIR" && npm run typecheck 2>&1 | tee -a "$QUALITY_LOG") || { log "Typecheck failed for $service"; FAILED=1; }
        fi
    fi
done

echo "" >> "$REPORT"
echo "## Résumé" >> "$REPORT"
echo "" >> "$REPORT"
if [ "$FAILED" -eq 0 ]; then
    echo "✅ **Qualité : OK**" >> "$REPORT"
else
    echo "❌ **Qualité : Problèmes détectés**" >> "$REPORT"
fi

log "Quality report saved to $REPORT"
exit "$FAILED"
