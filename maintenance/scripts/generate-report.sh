#!/usr/bin/env bash
#=============================================================================
# Generate Report — HappyServ
# Rapports périodiques (daily/weekly/monthly) avec métriques système,
# health check, état Docker, sauvegardes, auto-réparation.
#=============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../config/maintenance.conf"
REPORT_DIR="${SCRIPT_DIR}/../reports"
HEALTH_LOG="${SCRIPT_DIR}/../logs/health-check.log"

[[ -f "$CONFIG_FILE" ]] && source "$CONFIG_FILE"

: "${REPORT_TYPE:=daily}"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE=$(date '+%Y%m%d')

generate_daily() {
    local file="${REPORT_DIR}/daily/rapport-daily-${DATE}.md"

    cat > "$file" <<EOF
# Rapport Quotidien — ${DATE}

## Résumé

- **Date :** ${TIMESTAMP}
- **Type :** Quotidien

## Métriques Système

| Métrique | Valeur |
|----------|--------|
| Uptime | $(uptime -p) |
| Charge CPU | $(uptime | awk -F'load average:' '{print $2}') |
| Mémoire utilisée | $(free -h | awk '/^Mem:/{print $3 "/" $2}') |
| Disque utilisé | $(df -h / | tail -1 | awk '{print $5 " (" $3 "/" $2 ")"}') |
| Processus | $(ps aux | wc -l) |

## Conteneurs Docker

$(docker ps --format 'table {{.Names}}\t{{.Status}}' 2>/dev/null || echo "N/A")

## Dernier Health Check

$(tail -20 "${HEALTH_LOG}" 2>/dev/null || echo "N/A")

## Backups

$(ls -lh "${REPORT_DIR}/../logs/health-check.log" 2>/dev/null || echo "N/A")

---
*Généré automatiquement par maintenance/scripts/generate-report.sh*
EOF

    echo "Daily report generated: ${file}"
}

generate_weekly() {
    local file="${REPORT_DIR}/daily/rapport-weekly-${DATE}.md"

    local total_logs size_logs
    total_logs=$(wc -l < "${HEALTH_LOG}" 2>/dev/null || echo 0)
    size_logs=$(du -h "${HEALTH_LOG}" 2>/dev/null | cut -f1 || echo "N/A")

    cat > "$file" <<EOF
# Rapport Hebdomadaire — ${DATE}

## Résumé

- **Période :** $(date -d '7 days ago' '+%Y-%m-%d') — ${DATE}
- **Total entrées health check :** ${total_logs}
- **Taille logs :** ${size_logs}

## Métriques Système

| Métrique | Moyenne | Max |
|----------|---------|-----|
| CPU | $(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}') | - |
| Mémoire | $(free -h | awk '/^Mem:/{print $3 "/" $2}') | - |
| Disque | $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}') | - |

## Sauvegardes

$(ls -lh /backup/daily/ 2>/dev/null || echo "Aucune sauvegarde")

## Recommandations

$(check_recommendations)

---
*Généré automatiquement*
EOF

    echo "Weekly report generated: ${file}"
}

generate_monthly() {
    local file="${REPORT_DIR}/daily/rapport-monthly-${DATE}.md"

    cat > "$file" <<EOF
# Rapport Mensuel — ${DATE}

## Résumé du mois

- **Période :** $(date -d '30 days ago' '+%Y-%m-%d') — ${DATE}
- **Uptime serveur :** $(uptime -p)

## Statistiques

| Métrique | Valeur |
|----------|--------|
| Uptime moyen services | $(docker ps --format '{{.Names}}' 2>/dev/null | wc -l)/6 conteneurs actifs |
| Espace disque | $(df -h / | tail -1 | awk '{print $5}') |
| Taille base de données | $(docker compose exec -T postgres psql -U happyserv -t -c "SELECT pg_size_pretty(pg_database_size('happyserv'));" 2>/dev/null || echo "N/A") |

## Sauvegardes

| Mois | Taille | Fichiers |
|------|--------|----------|
| Ce mois | $(du -sh /backup/monthly/ 2>/dev/null | cut -f1 || echo "N/A") | $(ls /backup/monthly/ 2>/dev/null | wc -l) |

## Audit de sécurité

- Dernier audit : $(date -r "${SCRIPT_DIR}/../../security/scripts/audit-security.sh" 2>/dev/null || echo "Jamais")
- État du pare-feu : $(ufw status verbose 2>/dev/null | head -1 || echo "N/A")

---
*Généré automatiquement*
EOF

    echo "Monthly report generated: ${file}"
}

check_recommendations() {
    local disk_usage
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [[ "$disk_usage" -gt 80 ]]; then
        echo "- ⚠️ Espace disque élevé (${disk_usage}%)"
    fi
    if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q "happyserv-"; then
        echo "- ⚠️ Certains conteneurs ne sont pas en cours d'exécution"
    fi
    echo "- Aucune recommandation"
}

# === MAIN ===
mkdir -p "${REPORT_DIR}/daily"

case "$REPORT_TYPE" in
    daily) generate_daily ;;
    weekly) generate_weekly ;;
    monthly) generate_monthly ;;
    *)
        echo "Usage: REPORT_TYPE=daily|weekly|monthly $0"
        exit 1
        ;;
esac

exit 0
