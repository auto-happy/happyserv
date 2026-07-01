#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

SERVICE="${1:-}"
LINES="${2:-100}"

log_service() {
    local service="$1"
    local lines="$2"
    echo "=== Logs pour $service ==="
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" logs --tail="$lines" "$service" 2>/dev/null || \
    docker logs --tail="$lines" "happyserv-$service" 2>/dev/null || \
    echo "⚠️ Service $service introuvable"
    echo ""
}

if [ -n "$SERVICE" ]; then
    log_service "$SERVICE" "$LINES"
else
    for s in nginx api portal postgres redis; do
        log_service "$s" "$LINES"
    done
fi
