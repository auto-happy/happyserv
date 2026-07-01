#!/usr/bin/env bash
#=============================================================================
# Health Check — HappyServ
# Vérification toutes les 5 min : sites web, conteneurs, DB, Redis, disque,
# mémoire, CPU, certificats SSL, DNS, connectivité Internet.
#=============================================================================
set -euo pipefail

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../config/maintenance.conf"
LOG_FILE="${SCRIPT_DIR}/../logs/health-check.log"
LAST_CHECK_FILE="${SCRIPT_DIR}/../reports/last-check.txt"

# Load config
if [[ -f "$CONFIG_FILE" ]]; then
    source "$CONFIG_FILE"
fi

# Default values
: "${CHECK_URLS:=https://telehappy.fr https://happyserv.fr https://api.happyserv.fr/health}"
: "${CHECK_CONTAINERS:=happyserv-nginx happyserv-api happyserv-portal happyserv-telehappy happyserv-postgres happyserv-redis}"
: "${DISK_THRESHOLD:=85}"
: "${MEM_THRESHOLD:=90}"
: "${CPU_THRESHOLD:=80}"
: "${NOTIFY_SCRIPT:=${SCRIPT_DIR}/notify.sh}"

RESULTS=()
ERRORS=0
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

log() {
    local level="$1"
    local message="$2"
    echo "[${TIMESTAMP}] [${level}] ${message}" >> "$LOG_FILE"
    if [[ "$level" == "ERROR" || "$level" == "CRITICAL" ]]; then
        echo "[${level}] ${message}"
    fi
}

check_url() {
    local url="$1"
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
    if [[ "$code" =~ ^[23] ]]; then
        RESULTS+=("OK:${url} (HTTP ${code})")
        log "INFO" "URL OK: ${url} (HTTP ${code})"
    elif [[ "$code" == "000" ]]; then
        RESULTS+=("ERROR:${url} (UNREACHABLE)")
        log "ERROR" "URL UNREACHABLE: ${url}"
        ((ERRORS++))
    else
        RESULTS+=("WARN:${url} (HTTP ${code})")
        log "WARN" "URL returned ${code}: ${url}"
        ((ERRORS++))
    fi
}

check_container() {
    local container="$1"
    if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${container}$"; then
        local status
        status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)
        RESULTS+=("OK:container ${container} (${status})")
        log "INFO" "Container OK: ${container} (${status})"
    else
        RESULTS+=("ERROR:container ${container} (DOWN)")
        log "ERROR" "Container DOWN: ${container}"
        ((ERRORS++))
    fi
}

check_disk() {
    local usage
    usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [[ "$usage" -gt 95 ]]; then
        RESULTS+=("CRITICAL:Disk usage ${usage}%")
        log "CRITICAL" "Disk usage CRITICAL: ${usage}%"
        ((ERRORS++))
    elif [[ "$usage" -gt "$DISK_THRESHOLD" ]]; then
        RESULTS+=("WARN:Disk usage ${usage}%")
        log "WARN" "Disk usage high: ${usage}%"
        ((ERRORS++))
    else
        RESULTS+=("OK:Disk usage ${usage}%")
        log "INFO" "Disk OK: ${usage}%"
    fi
}

check_memory() {
    local total used percent
    total=$(free -m | awk '/^Mem:/{print $2}')
    used=$(free -m | awk '/^Mem:/{print $3}')
    percent=$((used * 100 / total))
    if [[ "$percent" -gt "$MEM_THRESHOLD" ]]; then
        RESULTS+=("CRITICAL:Memory ${percent}%")
        log "CRITICAL" "Memory usage CRITICAL: ${percent}%"
        ((ERRORS++))
    elif [[ "$percent" -gt 80 ]]; then
        RESULTS+=("WARN:Memory ${percent}%")
        log "WARN" "Memory usage high: ${percent}%"
    else
        RESULTS+=("OK:Memory ${percent}%")
        log "INFO" "Memory OK: ${percent}%"
    fi
}

check_cpu() {
    local load
    load=$(awk '/^cpu /{printf "%d", ($2+$4)*100/($2+$4+$5)}' /proc/stat)
    if [[ "$load" -gt "$CPU_THRESHOLD" ]]; then
        RESULTS+=("WARN:CPU ${load}%")
        log "WARN" "CPU usage high: ${load}%"
    else
        RESULTS+=("OK:CPU ${load}%")
        log "INFO" "CPU OK: ${load}%"
    fi
}

check_ssl() {
    local domain="$1"
    local days
    days=$(echo | openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null | \
           openssl x509 -noout -enddate 2>/dev/null | \
           sed 's/notAfter=//' | \
           xargs -I{} date -d {} +%s 2>/dev/null | \
           awk '{printf "%d", ($1 - systime()) / 86400}')
    if [[ -z "$days" ]]; then
        RESULTS+=("WARN:SSL ${domain} (UNREADABLE)")
        log "WARN" "SSL certificate unreadable: ${domain}"
    elif [[ "$days" -lt 7 ]]; then
        RESULTS+=("CRITICAL:SSL ${domain} expires in ${days}d")
        log "CRITICAL" "SSL certificate expires soon: ${domain} (${days}d)"
        ((ERRORS++))
    elif [[ "$days" -lt 30 ]]; then
        RESULTS+=("WARN:SSL ${domain} expires in ${days}d")
        log "WARN" "SSL certificate expires: ${domain} (${days}d)"
    else
        RESULTS+=("OK:SSL ${domain} expires in ${days}d")
        log "INFO" "SSL OK: ${domain} (${days}d)"
    fi
}

check_dns() {
    local domain="$1"
    if host "$domain" >/dev/null 2>&1; then
        RESULTS+=("OK:DNS ${domain}")
        log "INFO" "DNS OK: ${domain}"
    else
        RESULTS+=("ERROR:DNS ${domain}")
        log "ERROR" "DNS resolution failed: ${domain}"
        ((ERRORS++))
    fi
}

# === MAIN ===
log "INFO" "=== Health Check Start ==="

# URLs
echo "--- Checking URLs ---"
for url in $CHECK_URLS; do
    check_url "$url"
done

# Containers
echo "--- Checking Docker Containers ---"
for container in $CHECK_CONTAINERS; do
    check_container "$container"
done

# System resources
echo "--- Checking System Resources ---"
check_disk
check_memory
check_cpu

# SSL
echo "--- Checking SSL Certificates ---"
check_ssl "telehappy.fr"
check_ssl "happyserv.fr"

# DNS
echo "--- Checking DNS ---"
check_dns "telehappy.fr"
check_dns "happyserv.fr"

# Internet connectivity
echo "--- Checking Internet Connectivity ---"
if ping -c1 -W5 8.8.8.8 >/dev/null 2>&1; then
    RESULTS+=("OK:Internet connectivity")
    log "INFO" "Internet OK"
else
    RESULTS+=("ERROR:Internet connectivity")
    log "ERROR" "Internet connectivity FAILED"
    ((ERRORS++))
fi

# Save last check
echo "${TIMESTAMP}" > "$LAST_CHECK_FILE"

# Summary
log "INFO" "=== Health Check Complete: ${ERRORS} errors ==="

if [[ "$ERRORS" -gt 0 ]]; then
    log "WARN" "Errors detected: ${ERRORS}"
    if [[ -x "$NOTIFY_SCRIPT" ]]; then
        "$NOTIFY_SCRIPT" "WARNING" "Health check detected ${ERRORS} error(s)" "${RESULTS[*]}"
    fi
fi

exit $([ "$ERRORS" -gt 0 ] && echo 1 || echo 0)
