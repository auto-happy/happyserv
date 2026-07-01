#!/usr/bin/env bash
#=============================================================================
# Auto-Repair — HappyServ
# Vérifie et répare automatiquement les services défaillants.
# Évite les boucles infinies : max 3 runs par heure.
#=============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../config/maintenance.conf"
LOG_FILE="${SCRIPT_DIR}/../logs/health-check.log"
STATE_FILE="${SCRIPT_DIR}/../reports/.auto-repair-state"

# Load config
[[ -f "$CONFIG_FILE" ]] && source "$CONFIG_FILE"

: "${COMPOSE_FILE:=/home/happyserv/docker/compose/prod/docker-compose.yml}"
: "${NOTIFY_SCRIPT:=${SCRIPT_DIR}/notify.sh}"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
REPAIRED=0

log() {
    local level="$1"
    local message="$2"
    echo "[${TIMESTAMP}] [AUTO-REPAIR] [${level}] ${message}" >> "$LOG_FILE"
    echo "[${level}] ${message}"
}

# Check run limit (max 3 runs per hour)
check_run_limit() {
    local hour=$(date +%H)
    local runs_today=0
    if [[ -f "$STATE_FILE" ]]; then
        source "$STATE_FILE"
        if [[ "$LAST_HOUR" == "$hour" ]]; then
            runs_today="${RUNS_IN_HOUR}"
        else
            runs_today=0
        fi
    fi

    if [[ "$runs_today" -ge 3 ]]; then
        log "WARN" "Max runs per hour reached (${runs_today}/3). Skipping."
        return 1
    fi
    return 0
}

save_state() {
    local hour=$(date +%H)
    local runs=1
    if [[ -f "$STATE_FILE" ]]; then
        source "$STATE_FILE"
        if [[ "$LAST_HOUR" == "$hour" ]]; then
            runs=$((RUNS_IN_HOUR + 1))
        fi
    fi
    cat > "$STATE_FILE" <<EOF
LAST_HOUR=${hour}
RUNS_IN_HOUR=${runs}
LAST_RUN=${TIMESTAMP}
EOF
}

try_repair() {
    local service="$1"
    local container="$2"

    log "INFO" "Attempting to repair ${service} (${container})..."

    case "$service" in
        container)
            docker compose -f "$COMPOSE_FILE" restart "$container" 2>/dev/null || \
            docker compose -f "$COMPOSE_FILE" up -d "$container" 2>/dev/null || \
            log "ERROR" "Failed to restart container: ${container}"
            ;;
        nginx)
            docker compose -f "$COMPOSE_FILE" restart nginx 2>/dev/null || \
            docker compose -f "$COMPOSE_FILE" up -d nginx 2>/dev/null
            ;;
        api)
            docker compose -f "$COMPOSE_FILE" restart api 2>/dev/null || \
            docker compose -f "$COMPOSE_FILE" up -d api 2>/dev/null
            ;;
        postgres)
            docker compose -f "$COMPOSE_FILE" restart postgres 2>/dev/null || \
            docker compose -f "$COMPOSE_FILE" up -d postgres 2>/dev/null
            ;;
        redis)
            docker compose -f "$COMPOSE_FILE" restart redis 2>/dev/null || \
            docker compose -f "$COMPOSE_FILE" up -d redis 2>/dev/null
            ;;
        docker)
            systemctl restart docker 2>/dev/null || log "ERROR" "Failed to restart Docker daemon"
            ;;
    esac

    log "INFO" "Repair attempt completed for ${service}"
    ((REPAIRED++))
}

# === MAIN ===
log "INFO" "=== Auto-Repair Start ==="

check_run_limit || exit 0

# 1. Check Docker containers
log "INFO" "Checking Docker containers..."
for container in happyserv-nginx happyserv-api happyserv-portal happyserv-telehappy happyserv-postgres happyserv-redis; do
    if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${container}$"; then
        log "ERROR" "Container DOWN: ${container}"
        try_repair "container" "$container"
    fi
done

# 2. Check Nginx responsiveness
log "INFO" "Checking Nginx..."
if ! curl -s -o /dev/null -w "%{http_code}" --max-time 5 https://telehappy.fr 2>/dev/null | grep -q "^[23]"; then
    log "ERROR" "Nginx not responding"
    try_repair "nginx"
fi

# 3. Check API health
log "INFO" "Checking API..."
if ! curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/health 2>/dev/null | grep -q "^[23]"; then
    log "ERROR" "API not responding"
    try_repair "api"
fi

# 4. Check PostgreSQL
log "INFO" "Checking PostgreSQL..."
if ! docker compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U happyserv 2>/dev/null; then
    log "ERROR" "PostgreSQL not responding"
    try_repair "postgres"
fi

# 5. Check Redis
log "INFO" "Checking Redis..."
if ! docker compose -f "$COMPOSE_FILE" exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
    log "ERROR" "Redis not responding"
    try_repair "redis"
fi

# 6. Check certificates
log "INFO" "Checking SSL certificates..."
for domain in telehappy.fr happyserv.fr; do
    local days
    days=$(echo | openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null | \
           openssl x509 -noout -enddate 2>/dev/null | \
           sed 's/notAfter=//' | \
           xargs -I{} date -d {} +%s 2>/dev/null | \
           awk '{printf "%d", ($1 - systime()) / 86400}' 2>/dev/null || echo "0")
    if [[ "$days" -lt 7 ]]; then
        log "WARN" "SSL certificate for ${domain} expires in ${days}d"
        docker compose -f "$COMPOSE_FILE" run --rm certbot renew 2>/dev/null || true
    fi
done

# 7. Check disk space
log "INFO" "Checking disk space..."
local usage
usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [[ "$usage" -gt 90 ]]; then
    log "WARN" "Disk usage at ${usage}%"
    # Clean Docker
    docker system prune -f 2>/dev/null || true
    # Clean logs
    find /var/log -name "*.log" -mtime +7 -delete 2>/dev/null || true
fi

# 8. Check memory
log "INFO" "Checking memory..."
local total used percent
total=$(free -m | awk '/^Mem:/{print $2}')
used=$(free -m | awk '/^Mem:/{print $3}')
percent=$((used * 100 / total))
if [[ "$percent" -gt 90 ]]; then
    log "WARN" "Memory usage at ${percent}%"
    docker compose -f "$COMPOSE_FILE" restart api 2>/dev/null || true
fi

# 9. Check Docker daemon
log "INFO" "Checking Docker daemon..."
if ! docker info >/dev/null 2>&1; then
    log "ERROR" "Docker daemon not responding"
    try_repair "docker"
fi

# Save state
save_state

log "INFO" "=== Auto-Repair Complete: ${REPAIRED} repairs ==="

if [[ "$REPAIRED" -gt 0 ]]; then
    if [[ -x "$NOTIFY_SCRIPT" ]]; then
        "$NOTIFY_SCRIPT" "INFO" "Auto-repair completed" "${REPAIRED} service(s) repaired"
    fi
fi

exit 0
