#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT="$PROJECT_ROOT/CHANGELOG.md"

FROM="${1:-}"
TO="${2:-HEAD}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== HappyServ Changelog Generator ==="

if ! git -C "$PROJECT_ROOT" rev-parse --git-dir > /dev/null 2>&1; then
    log "WARNING: Not a git repository, generating placeholder changelog"
    echo "# Changelog" > "$OUTPUT"
    echo "" >> "$OUTPUT"
    echo "Généré le $(date '+%Y-%m-%d %H:%M:%S')" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    echo "## Versions" >> "$OUTPUT"
    for f in "$PROJECT_ROOT/ci-cd/versions/"*.txt; do
        if [ -f "$f" ]; then
            name=$(basename "$f" .txt)
            version=$(cat "$f")
            echo "- **$name** : $version" >> "$OUTPUT"
        fi
    done
    log "Changelog generated at $OUTPUT"
    exit 0
fi

RANGE=""
if [ -n "$FROM" ]; then
    RANGE="${FROM}..${TO}"
else
    RANGE="$(git -C "$PROJECT_ROOT" rev-list --max-parents=0 HEAD)..${TO}"
fi

log "Generating changelog for range: $RANGE"

echo "# Changelog" > "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Généré le $(date '+%Y-%m-%d %H:%M:%S')" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## Nouvelles fonctionnalités" >> "$OUTPUT"
git -C "$PROJECT_ROOT" log "$RANGE" --grep="^feat" --pretty=format:"- %s (%h)" >> "$OUTPUT" 2>/dev/null || echo "_Aucune_" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## Corrections" >> "$OUTPUT"
git -C "$PROJECT_ROOT" log "$RANGE" --grep="^fix" --pretty=format:"- %s (%h)" >> "$OUTPUT" 2>/dev/null || echo "_Aucune_" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "## Maintenance" >> "$OUTPUT"
git -C "$PROJECT_ROOT" log "$RANGE" --grep="^(chore|refactor|style|test|docs)" --pretty=format:"- %s (%h)" >> "$OUTPUT" 2>/dev/null || echo "_Aucune_" >> "$OUTPUT"
echo "" >> "$OUTPUT"

log "Changelog generated at $OUTPUT"
