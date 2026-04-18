/**
 * PM2 Ecosystem Configuration
 * 
 * Usage:
 * - Start: pm2 start ecosystem.config.js --env production
 * - Stop: pm2 stop ecosystem.config.js
 * - Restart: pm2 restart ecosystem.config.js
 * - Logs: pm2 logs chaintotal
 */

module.exports = {
  apps: [
    {
      name: 'chaintotal-production',
      script: './dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001
      },
      // Restart configuration
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      
      // Advanced features
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'backups'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Monitoring
      instance_var: 'INSTANCE_ID',
      
      // Cron restart (optional - restart daily at 3 AM)
      cron_restart: '0 3 * * *'
    },
    
    // Worker process for background jobs (optional)
    {
      name: 'chaintotal-worker',
      script: './dist/worker.js',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'analytics'
      },
      max_memory_restart: '300M',
      autorestart: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/worker-error.log',
      out_file: './logs/worker-out.log'
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/chaintotal.git',
      path: '/var/www/chaintotal',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get install git'
    },
    staging: {
      user: 'deploy',
      host: 'your-staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/chaintotal.git',
      path: '/var/www/chaintotal-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};
