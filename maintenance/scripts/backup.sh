#!/usr/bin/env bash
#=============================================================================
# Backup — HappyServ
# Backups quotidiens (DB + configs), hebdomadaires (+ apps + SSL),
# mensuels (archive complète). Vérification intégrité. Rotation automatique.
#=============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../config/maintenance.conf"
LOG_FILE="${SCRIPT_DIR}/../logs/health-check.log"
REPORT_FILE="${SCRIPT_DIR}/../reports/backup-report.md"

[[ -f "$CONFIG_FILE" ]] && source "$CONFIG_FILE"

: "${COMPOSE_FILE:=/home/happyserv/docker/compose/prod/docker-compose.yml}"
: "${BACKUP_DIR:=/backup}"
: "${RETENTION_DAILY:=7}"
: "${RETENTION_WEEKLY:=4}"
: "${RETENTION_MONTHLY:=3}"
: "${NOTIFY_SCRIPT:=${SCRIPT_DIR}/notify.sh}"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE=$(date '+%Y%m%d')
DAY_OF_WEEK=$(date '+%u')   # 1=lun..7=dim
DAY_OF_MONTH=$(date '+%d')

log() {
    local level="$1"
    local message="$2"
    echo "[${TIMESTAMP}] [BACKUP] [${level}] ${message}" >> "$LOG_FILE"
    echo "[${level}] ${message}"
}

ensure_dirs() {
    mkdir -p "${BACKUP_DIR}/{daily,weekly,monthly}"
}

cleanup_old() {
    local dir="${BACKUP_DIR}/$1"
    local retention="$2"
    log "INFO" "Cleaning ${dir} (retention: ${retention})"
    find "$dir" -type f -mtime "+${retention}" -delete 2>/dev/null || true
}

verify_backup() {
    local file="$1"
    local type="$2"
    case "$type" in
        sql)
            pg_restore -l "$file" >/dev/null 2>&1
            ;;
        sql_gz)
            gunzip -t "$file" >/dev/null 2>&1
            ;;
        tar_gz)
            tar tzf "$file" >/dev/null 2>&1
            ;;
        *)
            return 1
            ;;
    esac
}

backup_database() {
    local dest="$1"
    log "INFO" "Backing up database to ${dest}"
    docker compose -f "$COMPOSE_FILE" exec -T postgres \
        pg_dump -U happyserv -Z9 -Fc happyserv > "${dest}" 2>/dev/null
    if verify_backup "${dest}" "sql"; then
        log "INFO" "Database backup verified OK"
        return 0
    else
        log "ERROR" "Database backup verification FAILED"
        return 1
    fi
}

backup_config() {
    local dest="$1"
    log "INFO" "Backing up configs to ${dest}"
    tar czf "${dest}" \
        -C /home/happyserv config/ docker/ docker-compose.yml 2>/dev/null
    if verify_backup "${dest}" "tar_gz"; then
        log "INFO" "Config backup verified OK"
        return 0
    else
        log "ERROR" "Config backup verification FAILED"
        return 1
    fi
}

backup_apps() {
    local dest="$1"
    log "INFO" "Backing up applications to ${dest}"
    tar czf "${dest}" \
        --exclude=node_modules --exclude=.git \
        -C /home/happyserv api/ website-app/ website-download/ client/ 2>/dev/null
    if verify_backup "${dest}" "tar_gz"; then
        log "INFO" "Apps backup verified OK"
        return 0
    else
        log "ERROR" "Apps backup verification FAILED"
        return 1
    fi
}

backup_ssl() {
    local dest="$1"
    log "INFO" "Backing up SSL certificates to ${dest}"
    docker run --rm -v nginx_certs:/source:ro -v /tmp:/dest \
        alpine tar czf "/dest/certs-${DATE}.tar.gz" -C /source . 2>/dev/null
    mv "/tmp/certs-${DATE}.tar.gz" "${dest}" 2>/dev/null || true
}

generate_report() {
    local type="$1"
    local status="$2"
    local files=""
    local files_list=()
    local total_size=0

    case "$type" in
        daily) files_list=("${BACKUP_DIR}/daily/"*);;
        weekly) files_list=("${BACKUP_DIR}/weekly/"*);;
        monthly) files_list=("${BACKUP_DIR}/monthly/"*);;
    esac

    for f in "${files_list[@]}"; do
        if [[ -f "$f" ]]; then
            local size
            size=$(du -h "$f" | cut -f1)
            total_size=$((total_size + $(stat -c%s "$f" 2>/dev/null || echo 0)))
            files+="  - $(basename "$f"): ${size}"$'\n'
        fi
    done

    cat > "$REPORT_FILE" <<EOF
# Rapport de Backup — ${type^}

**Date :** ${TIMESTAMP}
**Statut :** ${status}
**Fichiers :**

${files}
---

EOF
}

# === MAIN ===
log "INFO" "=== Backup Start ==="
ensure_dirs
BACKUP_STATUS="OK"

# Daily backup (DB + config)
DB_FILE="${BACKUP_DIR}/daily/happyserv-db-${DATE}.dump"
CONFIG_FILE_BACKUP="${BACKUP_DIR}/daily/happyserv-config-${DATE}.tar.gz"

if ! backup_database "$DB_FILE"; then
    BACKUP_STATUS="PARTIAL"
    log "ERROR" "Daily database backup FAILED"
fi

if ! backup_config "$CONFIG_FILE_BACKUP"; then
    BACKUP_STATUS="PARTIAL"
    log "ERROR" "Daily config backup FAILED"
fi

# Weekly backup (dimanche)
if [[ "$DAY_OF_WEEK" == "7" ]]; then
    APPS_FILE="${BACKUP_DIR}/weekly/happyserv-apps-${DATE}.tar.gz"
    SSL_FILE="${BACKUP_DIR}/weekly/happyserv-certs-${DATE}.tar.gz"

    if ! backup_apps "$APPS_FILE"; then
        BACKUP_STATUS="PARTIAL"
        log "ERROR" "Weekly apps backup FAILED"
    fi
    backup_ssl "$SSL_FILE"
fi

# Monthly backup (1er du mois)
if [[ "$DAY_OF_MONTH" == "01" ]]; then
    FULL_FILE="${BACKUP_DIR}/monthly/happyserv-full-${DATE}.tar.gz"
    log "INFO" "Monthly full backup to ${FULL_FILE}"
    tar czf "${FULL_FILE}" \
        --exclude=node_modules --exclude=.git --exclude='*.log' --exclude='*.tmp' \
        -C /home/happyserv . 2>/dev/null
fi

# Rotation
cleanup_old "daily" "$RETENTION_DAILY"
cleanup_old "weekly" "$((RETENTION_WEEKLY * 7))"
cleanup_old "monthly" "$((RETENTION_MONTHLY * 30))"

# Report
generate_report "$([ "$DAY_OF_WEEK" == "7" ] && echo "weekly" || echo "daily")" "$BACKUP_STATUS"

log "INFO" "=== Backup Complete: ${BACKUP_STATUS} ==="

if [[ "$BACKUP_STATUS" != "OK" ]] && [[ -x "$NOTIFY_SCRIPT" ]]; then
    "$NOTIFY_SCRIPT" "WARNING" "Backup completed with errors" "Status: ${BACKUP_STATUS}"
fi

exit $([ "$BACKUP_STATUS" == "OK" ] && echo 0 || echo 1)
