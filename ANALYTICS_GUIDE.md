# Platform Analytics and Monitoring Guide

## Overview

ChainTotal Risk Assessment Agent includes comprehensive analytics, revenue tracking, and fraud detection capabilities to monitor platform health, track revenue, and prevent abuse.

## Components

### 1. Query Analytics (`src/analytics/queryAnalytics.ts`)

Tracks and logs all query-related metrics for analytics and monitoring.

#### Query Analytics Record

```typescript
{
  query_id: "uuid",
  user_wallet: "G...",
  query_type: "wallet|token|dapp|nft|website",
  payment_status: "success|failed|cached",
  tx_hash: "...",
  risk_score_returned: 0-100,
  processing_time_ms: 1234,
  cache_hit: true/false,
  timestamp: "2026-04-18T14:30:00Z",
  error_code: "PAYMENT_FAILED|ANALYSIS_FAILED",
  retry_count: 0-3
}
```

#### Daily Metrics

```typescript
{
  date: "2026-04-18",
  total_queries: 150,
  successful_queries: 120,
  failed_queries: 30,
  cache_hits: 45,
  total_revenue_x402: 105,
  unique_users: 25,
  average_processing_time_ms: 1234,
  payment_success_rate: 80.0
}
```

#### Asset Query Statistics

```typescript
{
  asset_identifier: "wallet",
  asset_type: "wallet",
  query_count: 50,
  last_queried: "2026-04-18T14:30:00Z",
  average_risk_score: 42.5
}
```

#### Methods

- `logQuery(record)` - Log a query execution
- `getDailyMetrics(date)` - Get metrics for specific date
- `getMetricsRange(startDate, endDate)` - Get metrics for date range
- `getTopQueriedAssets(limit)` - Get most queried asset types
- `getUserQueries(userWallet, limit)` - Get queries by user
- `getRecentQueries(limit)` - Get recent queries
- `getPaymentSuccessRate()` - Get overall payment success rate
- `getCacheHitRate()` - Get cache hit rate
- `getAverageProcessingTime()` - Get average processing time
- `exportAnalytics()` - Export all analytics data
- `generateSummary()` - Generate analytics summary

### 2. Revenue Tracker (`src/analytics/revenueTracker.ts`)

Tracks revenue metrics and transaction volumes.

#### Revenue Metrics

```typescript
{
  date: "2026-04-18",
  total_transactions: 100,
  total_revenue_x402: 85,
  successful_payments: 85,
  failed_payments: 15,
  average_queries_per_user: 4.2,
  payment_success_rate: 85.0
}
```

#### User Revenue Statistics

```typescript
{
  user_wallet: "G...",
  total_spent_x402: 25,
  total_queries: 30,
  first_query: "2026-04-01T10:00:00Z",
  last_query: "2026-04-18T14:30:00Z",
  average_spend_per_query: 0.83
}
```

#### Methods

- `recordTransaction(txHash, userWallet, amount, status, timestamp)` - Record a transaction
- `getDailyRevenue(date)` - Get revenue for specific date
- `getRevenueRange(startDate, endDate)` - Get revenue for date range
- `getTotalRevenue()` - Get total revenue
- `getTopSpenders(limit)` - Get top spending users
- `getUserStats(userWallet)` - Get user revenue stats
- `getAverageQueriesPerUser()` - Get average queries per user
- `getPaymentSuccessRate()` - Get payment success rate
- `generateSummary()` - Generate revenue summary
- `exportData()` - Export revenue data

### 3. Fraud Detector (`src/analytics/fraudDetector.ts`)

Detects and prevents fraudulent behavior patterns.

#### Fraud Alert

```typescript
{
  alert_id: "alert_123...",
  user_wallet: "G...",
  alert_type: "bulk_query|rapid_query|bot_behavior|unusual_payment",
  severity: "low|medium|high",
  description: "Bulk query detected: 10 queries in 30 seconds",
  timestamp: "2026-04-18T14:30:00Z",
  metadata: {
    queries_in_30s: 10
  }
}
```

#### User Behavior Profile

```typescript
{
  user_wallet: "G...",
  total_queries: 50,
  queries_last_minute: 2,
  queries_last_hour: 15,
  queries_last_day: 50,
  first_seen: "2026-04-01T10:00:00Z",
  last_seen: "2026-04-18T14:30:00Z",
  blocked: false,
  block_reason: "Automated bot behavior detected",
  block_until: "2026-04-19T14:30:00Z"
}
```

#### Rate Limits

- **Per Minute**: 5 queries
- **Per Hour**: 50 queries
- **Per Day**: 200 queries
- **Bulk Query Threshold**: 10 queries in 30 seconds
- **Bot Pattern Threshold**: 20 queries with consistent intervals

#### Detection Patterns

1. **Bulk Query Detection**
   - Triggers when 10+ queries in 30 seconds
   - Severity: HIGH
   - Action: Alert

2. **Rapid Query Detection**
   - Triggers when rate limits exceeded
   - Severity: MEDIUM-HIGH
   - Action: Block user (1-24 hours)

3. **Bot Behavior Detection**
   - Detects consistent query intervals (low std deviation)
   - Triggers when 20+ queries with <1s variation
   - Severity: HIGH
   - Action: Block user (24 hours)

4. **Unusual Payment Detection**
   - Detects payment amounts != 1 x402
   - Severity: MEDIUM
   - Action: Alert

#### Methods

- `checkUserAllowed(userWallet)` - Check if user can make query
- `recordQuery(userWallet, assetIdentifier)` - Record a query
- `recordPayment(userWallet, amount, status)` - Record a payment
- `getUserProfile(userWallet)` - Get user behavior profile
- `getFraudAlerts(limit)` - Get fraud alerts
- `getBlockedUsers()` - Get list of blocked users
- `unblockUser(userWallet)` - Manually unblock user
- `generateSummary()` - Generate fraud detection summary
- `exportData()` - Export fraud detection data

## CLI Commands

### Analytics Commands

```bash
# Show platform analytics summary
analytics

# Show revenue summary
revenue

# Show fraud detection summary
fraud

# Show circuit breaker status
circuit
```

### Example Output

#### Analytics Summary

```
📊 Platform Analytics Summary
═══════════════════════════════════════
Total Queries: 150
Payment Success Rate: 80.0%
Cache Hit Rate: 30.0%
Avg Processing Time: 1234ms

Top Queried Asset Types:
  1. wallet: 75 queries
  2. token: 40 queries
  3. dapp: 20 queries
  4. nft: 10 queries
  5. website: 5 queries
═══════════════════════════════════════
```

#### Revenue Summary

```
💰 Revenue Summary
═══════════════════════════════════════
Total Revenue: 120 x402
Total Transactions: 150
Avg Queries/User: 6.0
Payment Success Rate: 80.0%

Top Spenders:
  1. GCZAMPLE7I...: 25 x402 (30 queries)
  2. GXAMPLE123...: 20 x402 (25 queries)
  3. GYAMPLE456...: 15 x402 (20 queries)
  4. GZAMPLE789...: 12 x402 (15 queries)
  5. GAMPLE012...: 10 x402 (12 queries)
═══════════════════════════════════════
```

#### Fraud Detection Summary

```
🛡️  Fraud Detection Summary
═══════════════════════════════════════
Total Users Tracked: 50
Blocked Users: 2
Total Alerts: 15

Rate Limits:
  • 5 queries/minute
  • 50 queries/hour
  • 200 queries/day

Recent Alerts:
  1. [HIGH] GCZAMPLE7I...: bot_behavior
  2. [MEDIUM] GXAMPLE123...: rapid_query
  3. [HIGH] GYAMPLE456...: bulk_query
═══════════════════════════════════════
```

## Integration with Agent Loop

The analytics components are integrated into the AgentLoop execution flow:

### 1. Fraud Check (Before Execution)

```typescript
const fraudCheck = this.fraudDetector.checkUserAllowed(userWallet);
if (!fraudCheck.allowed) {
  // Block request and return error
}
```

### 2. Query Logging (After Execution)

```typescript
this.queryAnalytics.logQuery({
  query_id: queryId,
  user_wallet: userWallet,
  query_type: assetType,
  payment_status: 'success',
  tx_hash: txHash,
  risk_score_returned: riskScore,
  processing_time_ms: executionTime,
  cache_hit: false,
  timestamp: new Date().toISOString()
});
```

### 3. Revenue Tracking (After Payment)

```typescript
this.revenueTracker.recordTransaction(
  txHash,
  userWallet,
  1,
  'success',
  new Date().toISOString()
);
```

### 4. Fraud Recording (After Query)

```typescript
this.fraudDetector.recordQuery(userWallet, assetIdentifier);
this.fraudDetector.recordPayment(userWallet, 1, 'success');
```

## Data Export

All analytics components support data export for backup or external analysis:

```typescript
// Export query analytics
const analyticsData = queryAnalytics.exportAnalytics();
// Returns: { queryLog, dailyMetrics, assetStats }

// Export revenue data
const revenueData = revenueTracker.exportData();
// Returns: { dailyRevenue, userRevenue, transactionLog }

// Export fraud detection data
const fraudData = fraudDetector.exportData();
// Returns: { userProfiles, fraudAlerts, blockedUsers }
```

## Monitoring Best Practices

### 1. Daily Monitoring

- Check daily metrics for anomalies
- Review payment success rate
- Monitor cache hit rate
- Check fraud alerts

### 2. Weekly Review

- Analyze top queried assets
- Review top spenders
- Check blocked users
- Analyze fraud patterns

### 3. Monthly Analysis

- Revenue trends
- User growth
- Query patterns
- Fraud detection effectiveness

## Performance Considerations

### Memory Management

- Query logs: Keep last 10,000 records
- Transaction logs: Keep last 50,000 records
- Fraud alerts: Keep last 1,000 alerts
- Timestamps: Keep last 24 hours per user

### Cleanup Strategies

- Automatic cleanup on size limits
- Periodic cleanup of old data
- Export before cleanup for archival

## Security Considerations

### Data Privacy

- User wallets are public keys (no private data)
- No PII stored
- GDPR compliant
- Data minimization

### Access Control

- Analytics data is internal only
- No external API exposure
- Admin-only access to fraud data

## Future Enhancements

### 1. Advanced Analytics

- [ ] Machine learning for fraud detection
- [ ] Predictive analytics for revenue
- [ ] Anomaly detection algorithms
- [ ] User segmentation

### 2. Real-time Monitoring

- [ ] WebSocket for real-time updates
- [ ] Dashboard UI
- [ ] Alert notifications
- [ ] Grafana integration

### 3. External Integration

- [ ] Export to data warehouse
- [ ] Integration with BI tools
- [ ] API for analytics access
- [ ] Webhook notifications

## Troubleshooting

### High False Positive Rate

- Adjust rate limits in FraudDetector
- Tune bot detection thresholds
- Review blocked users regularly

### Low Cache Hit Rate

- Check cache TTL settings
- Analyze query patterns
- Consider increasing cache duration

### Payment Success Rate Issues

- Check Stellar network status
- Review payment timeout settings
- Analyze failed payment reasons

---

**Version**: 1.2.0
**Date**: 2026-04-18
**Status**: ✅ COMPLETE
