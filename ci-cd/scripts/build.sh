#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BUILD_LOG="$PROJECT_ROOT/logs/build-$TIMESTAMP.log"
REPORT="$PROJECT_ROOT/logs/build-report-$TIMESTAMP.md"

mkdir -p "$PROJECT_ROOT/logs"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$BUILD_LOG"; }

log "=== HappyServ Build Script ==="
log "Project root: $PROJECT_ROOT"
log "Timestamp: $TIMESTAMP"

SERVICES=("api" "portal" "telehappy" "client")
FAILED=()

for service in "${SERVICES[@]}"; do
    log "--- Building $service ---"
    SERVICE_DIR="$PROJECT_ROOT/$service"
    if [ ! -d "$SERVICE_DIR" ]; then
        log "WARNING: $SERVICE_DIR not found, skipping"
        continue
    fi

    log "Installing dependencies for $service..."
    (cd "$SERVICE_DIR" && npm install 2>&1 | tee -a "$BUILD_LOG") || { log "FAILED: npm install $service"; FAILED+=("$service"); continue; }

    log "Running lint for $service..."
    (cd "$SERVICE_DIR" && npm run lint 2>&1 | tee -a "$BUILD_LOG") || { log "FAILED: lint $service"; FAILED+=("$service"); continue; }

    log "Running typecheck for $service..."
    (cd "$SERVICE_DIR" && npm run typecheck 2>&1 | tee -a "$BUILD_LOG") || { log "FAILED: typecheck $service"; FAILED+=("$service"); continue; }

    log "Running tests for $service..."
    (cd "$SERVICE_DIR" && npm test 2>&1 | tee -a "$BUILD_LOG") || { log "FAILED: tests $service"; FAILED+=("$service"); continue; }

    log "Building $service..."
    (cd "$SERVICE_DIR" && npm run build 2>&1 | tee -a "$BUILD_LOG") || { log "FAILED: build $service"; FAILED+=("$service"); continue; }

    log "Building Docker image for $service..."
    (cd "$SERVICE_DIR" && docker build -t "happyserv/$service:latest" -t "happyserv/$service:$TIMESTAMP" . 2>&1 | tee -a "$BUILD_LOG") || { log "FAILED: docker build $service"; FAILED+=("$service"); continue; }

    log "SUCCESS: $service built successfully"
done

log "=== Build Summary ==="
echo "# Rapport de Build - $TIMESTAMP" > "$REPORT"
echo "" >> "$REPORT"
echo "| Service | Statut |" >> "$REPORT"
echo "|---------|--------|" >> "$REPORT"
for service in "${SERVICES[@]}"; do
    if [[ " ${FAILED[*]} " =~ " ${service} " ]]; then
        echo "| $service | ❌ ÉCHEC |" >> "$REPORT"
    else
        echo "| $service | ✅ SUCCÈS |" >> "$REPORT"
    fi
done

if [ ${#FAILED[@]} -eq 0 ]; then
    log "ALL SERVICES BUILT SUCCESSFULLY"
    exit 0
else
    log "FAILED SERVICES: ${FAILED[*]}"
    exit 1
fi
