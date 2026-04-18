#!/bin/bash

# ChainTotal Rollback Script
# Usage: ./scripts/rollback.sh [backup_timestamp]
# Example: ./scripts/rollback.sh 20260418_143000

set -e

BACKUP_TIMESTAMP=${1}
BACKUP_DIR="backups/$BACKUP_TIMESTAMP"

echo "🔄 ChainTotal Rollback Script"
echo "=============================="
echo "Backup: $BACKUP_TIMESTAMP"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
    log_error "Backup not found: $BACKUP_DIR"
    echo ""
    echo "Available backups:"
    ls -la backups/ 2>/dev/null || echo "No backups found"
    exit 1
fi

log_info "Found backup: $BACKUP_DIR"

# Stop application
log_info "Stopping application..."
if command -v pm2 &> /dev/null; then
    pm2 stop chaintotal-production || true
else
    if [ -f ".pid" ]; then
        kill $(cat .pid) || true
    fi
fi

# Restore files
log_info "Restoring files from backup..."

if [ -f "$BACKUP_DIR/.env.production" ]; then
    cp "$BACKUP_DIR/.env.production" .env.production
    log_info "Restored .env.production"
fi

if [ -d "$BACKUP_DIR/dist" ]; then
    rm -rf dist
    cp -r "$BACKUP_DIR/dist" dist
    log_info "Restored dist folder"
fi

# Restart application
log_info "Restarting application..."
if command -v pm2 &> /dev/null; then
    pm2 restart chaintotal-production
else
    NODE_ENV=production node dist/index.js &
    echo $! > .pid
fi

log_info "✅ Rollback completed!"
echo ""
log_info "Application rolled back to: $BACKUP_TIMESTAMP"
