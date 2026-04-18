/**
 * ChainTotal REST API Server
 * 
 * Express.js server that exposes all CLI functionality via HTTP endpoints
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ChainTotalAgent } from './agent';
import { IntentClassifier } from './nlp/intentClassifier';
import { AgentLoop } from './tools/agentLoop';
import { ToolExecutor } from './tools/toolExecutor';
import { PaymentService } from './stellar/paymentService';
import { DataCollector } from './analysis/dataCollector';
import { RiskCalculator } from './analysis/riskCalculator';
import { SessionManager } from './session/sessionManager';
import { CacheService } from './session/cacheService';
import { QueryAnalytics } from './analytics/queryAnalytics';
import { RevenueTracker } from './analytics/revenueTracker';
import { FraudDetector } from './analytics/fraudDetector';
import { AssetType } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

// Initialize services
const agent = new ChainTotalAgent();
const paymentService = new PaymentService();
const dataCollector = new DataCollector();
const riskCalculator = new RiskCalculator();
const sessionManager = new SessionManager();
const cacheService = new CacheService(sessionManager);
const queryAnalytics = new QueryAnalytics();
const revenueTracker = new RevenueTracker();
const fraudDetector = new FraudDetector();

const toolExecutor = new ToolExecutor(
  paymentService,
  dataCollector,
  riskCalculator,
  sessionManager,
  cacheService
);

const intentClassifier = new IntentClassifier();
const agentLoop = new AgentLoop(
  intentClassifier,
  toolExecutor,
  sessionManager,
  queryAnalytics,
  revenueTracker,
  fraudDetector
);

// Error handler middleware
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ============================================
// API ENDPOINTS
// ============================================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.2.0'
  });
});

/**
 * POST /api/analyze
 * Analyze an asset (wallet, token, dApp, NFT, website)
 */
app.post('/api/analyze', asyncHandler(async (req: Request, res: Response) => {
  const { query, userWallet } = req.body;

  if (!query || !userWallet) {
    return res.status(400).json({
      error: 'Missing required fields: query, userWallet'
    });
  }

  // Execute agent loop
  const result = await agentLoop.execute(query, userWallet);

  res.json({
    success: result.success,
    response: result.response,
    executionTime: result.executionTime,
    toolCalls: result.toolCalls.length
  });
}));

/**
 * GET /api/analytics
 * Get platform analytics summary
 */
app.get('/api/analytics', (req: Request, res: Response) => {
  const summary = {
    totalQueries: queryAnalytics.getRecentQueries(10000).length,
    paymentSuccessRate: queryAnalytics.getPaymentSuccessRate(),
    cacheHitRate: queryAnalytics.getCacheHitRate(),
    averageProcessingTime: queryAnalytics.getAverageProcessingTime(),
    topAssets: queryAnalytics.getTopQueriedAssets(5)
  };

  res.json(summary);
});

/**
 * GET /api/revenue
 * Get revenue statistics
 */
app.get('/api/revenue', (req: Request, res: Response) => {
  const stats = {
    totalRevenue: revenueTracker.getTotalRevenue(),
    averageQueriesPerUser: revenueTracker.getAverageQueriesPerUser(),
    paymentSuccessRate: revenueTracker.getPaymentSuccessRate(),
    topSpenders: revenueTracker.getTopSpenders(5)
  };

  res.json(stats);
});

/**
 * GET /api/fraud
 * Get fraud detection status
 */
app.get('/api/fraud', (req: Request, res: Response) => {
  const alerts = fraudDetector.getFraudAlerts(10);
  const blockedUsers = fraudDetector.getBlockedUsers();

  res.json({
    recentAlerts: alerts,
    blockedUsersCount: blockedUsers.length,
    blockedUsers: blockedUsers.map(u => ({
      wallet: u.user_wallet.substring(0, 10) + '...',
      blockReason: u.block_reason,
      blockUntil: u.block_until
    }))
  });
});

/**
 * GET /api/session/:userWallet/stats
 * Get user session statistics
 */
app.get('/api/session/:userWallet/stats', (req: Request, res: Response) => {
  const { userWallet } = req.params;
  const stats = sessionManager.getSessionStats(userWallet);

  if (!stats) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(stats);
});

/**
 * GET /api/session/:userWallet/history
 * Get user query history
 */
app.get('/api/session/:userWallet/history', (req: Request, res: Response) => {
  const { userWallet } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  const history = sessionManager.getQueryHistory(userWallet, limit);

  res.json(history);
});

/**
 * GET /api/session/:userWallet/payments
 * Get user payment history
 */
app.get('/api/session/:userWallet/payments', (req: Request, res: Response) => {
  const { userWallet } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  const payments = sessionManager.getPaymentLedger(userWallet, limit);

  res.json(payments);
});

/**
 * GET /api/circuit-breaker
 * Get circuit breaker status
 */
app.get('/api/circuit-breaker', (req: Request, res: Response) => {
  const status = toolExecutor.getCircuitBreakerStatus();
  res.json(status);
});

/**
 * POST /api/fraud/check
 * Check if user is allowed to make query
 */
app.post('/api/fraud/check', (req: Request, res: Response) => {
  const { userWallet } = req.body;

  if (!userWallet) {
    return res.status(400).json({ error: 'Missing userWallet' });
  }

  const check = fraudDetector.checkUserAllowed(userWallet);
  res.json(check);
});

/**
 * GET /api/cache/stats
 * Get cache statistics
 */
app.get('/api/cache/stats', (req: Request, res: Response) => {
  res.json({
    cacheSize: sessionManager.getCacheSize(),
    activeSessions: sessionManager.getActiveSessionCount(),
    cacheHitRate: queryAnalytics.getCacheHitRate()
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        🔐 ChainTotal Risk Assessment API 🔐              ║
║                                                           ║
║     Topluluk Destekli Tehdit İstihbaratı Platformu      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running on http://localhost:${PORT}
📊 API Documentation: http://localhost:${PORT}/api/health
🎨 Web UI: http://localhost:${PORT}

API Endpoints:
  POST   /api/analyze              - Analyze asset
  GET    /api/analytics             - Platform analytics
  GET    /api/revenue               - Revenue stats
  GET    /api/fraud                 - Fraud detection
  GET    /api/session/:wallet/stats - User stats
  GET    /api/circuit-breaker       - Circuit breaker status
  GET    /api/health                - Health check
  `);
});

export default app;
