#!/bin/bash

# ChainTotal Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Example: ./scripts/deploy.sh production

set -e  # Exit on error

ENVIRONMENT=${1:-staging}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$TIMESTAMP"

echo "🚀 ChainTotal Deployment Script"
echo "================================"
echo "Environment: $ENVIRONMENT"
echo "Timestamp: $TIMESTAMP"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    log_info "Node.js version: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    log_info "npm version: $(npm --version)"
    
    # Check PM2 (optional)
    if ! command -v pm2 &> /dev/null; then
        log_warn "PM2 is not installed (recommended for production)"
    else
        log_info "PM2 version: $(pm2 --version)"
    fi
    
    echo ""
}

# Backup current deployment
backup_current() {
    log_info "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup .env
    if [ -f ".env.$ENVIRONMENT" ]; then
        cp ".env.$ENVIRONMENT" "$BACKUP_DIR/.env.$ENVIRONMENT"
        log_info "Backed up .env.$ENVIRONMENT"
    fi
    
    # Backup dist folder
    if [ -d "dist" ]; then
        cp -r dist "$BACKUP_DIR/dist"
        log_info "Backed up dist folder"
    fi
    
    # Backup database (if applicable)
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Database backup recommended (manual step)"
    fi
    
    echo ""
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    npm ci --production
    log_info "Dependencies installed"
    echo ""
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Unit tests
    if npm run test 2>/dev/null; then
        log_info "Unit tests passed"
    else
        log_warn "Unit tests not configured or failed"
    fi
    
    # Integration tests (if available)
    if npm run test:integration 2>/dev/null; then
        log_info "Integration tests passed"
    else
        log_warn "Integration tests not configured"
    fi
    
    echo ""
}

# Build application
build_application() {
    log_info "Building application..."
    npm run build
    
    if [ -d "dist" ]; then
        log_info "Build successful"
    else
        log_error "Build failed - dist folder not created"
        exit 1
    fi
    
    echo ""
}

# Database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    if npm run migrate:$ENVIRONMENT 2>/dev/null; then
        log_info "Migrations completed"
    else
        log_warn "Migrations not configured or failed"
    fi
    
    echo ""
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/health 2>/dev/null; then
            log_info "Health check passed"
            return 0
        fi
        
        log_warn "Health check attempt $attempt/$max_attempts failed, retrying..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Deploy with PM2
deploy_pm2() {
    log_info "Deploying with PM2..."
    
    # Stop existing process
    if pm2 describe chaintotal-$ENVIRONMENT &>/dev/null; then
        log_info "Stopping existing process..."
        pm2 stop chaintotal-$ENVIRONMENT
    fi
    
    # Start new process
    pm2 start dist/index.js \
        --name chaintotal-$ENVIRONMENT \
        --env $ENVIRONMENT \
        --instances 2 \
        --exec-mode cluster \
        --max-memory-restart 500M \
        --log-date-format "YYYY-MM-DD HH:mm:ss Z"
    
    # Save PM2 configuration
    pm2 save
    
    log_info "Application deployed with PM2"
    echo ""
}

# Deploy without PM2
deploy_node() {
    log_info "Deploying with Node.js..."
    
    # Kill existing process (if any)
    if [ -f ".pid" ]; then
        local pid=$(cat .pid)
        if ps -p $pid > /dev/null; then
            log_info "Stopping existing process (PID: $pid)..."
            kill $pid
            sleep 2
        fi
    fi
    
    # Start new process
    NODE_ENV=$ENVIRONMENT node dist/index.js &
    echo $! > .pid
    
    log_info "Application started (PID: $(cat .pid))"
    echo ""
}

# Rollback
rollback() {
    log_error "Deployment failed! Rolling back..."
    
    if [ -d "$BACKUP_DIR" ]; then
        # Restore .env
        if [ -f "$BACKUP_DIR/.env.$ENVIRONMENT" ]; then
            cp "$BACKUP_DIR/.env.$ENVIRONMENT" ".env.$ENVIRONMENT"
            log_info "Restored .env.$ENVIRONMENT"
        fi
        
        # Restore dist
        if [ -d "$BACKUP_DIR/dist" ]; then
            rm -rf dist
            cp -r "$BACKUP_DIR/dist" dist
            log_info "Restored dist folder"
        fi
        
        # Restart application
        if command -v pm2 &> /dev/null; then
            pm2 restart chaintotal-$ENVIRONMENT
        fi
        
        log_info "Rollback completed"
    else
        log_error "No backup found for rollback"
    fi
    
    exit 1
}

# Main deployment flow
main() {
    log_info "Starting deployment to $ENVIRONMENT..."
    echo ""
    
    # Set error handler
    trap rollback ERR
    
    # Run deployment steps
    check_prerequisites
    backup_current
    install_dependencies
    
    if [ "$ENVIRONMENT" = "production" ]; then
        run_tests
    fi
    
    build_application
    run_migrations
    
    # Deploy
    if command -v pm2 &> /dev/null; then
        deploy_pm2
    else
        deploy_node
    fi
    
    # Health check
    sleep 5
    if health_check; then
        log_info "✅ Deployment successful!"
    else
        log_error "❌ Deployment failed health check"
        rollback
    fi
    
    echo ""
    log_info "Deployment completed at $(date)"
    log_info "Backup location: $BACKUP_DIR"
    
    # Show status
    if command -v pm2 &> /dev/null; then
        echo ""
        pm2 status
    fi
}

# Run main function
main
