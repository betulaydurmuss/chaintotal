/**
 * Query Analytics
 * 
 * Tracks and logs all query-related metrics for analytics and monitoring
 */

import { AssetType } from '../types';

export interface QueryAnalyticsRecord {
  query_id: string;
  user_wallet: string;
  query_type: AssetType;
  payment_status: 'success' | 'failed' | 'cached';
  tx_hash?: string;
  risk_score_returned: number;
  processing_time_ms: number;
  cache_hit: boolean;
  timestamp: string;
  error_code?: string;
  retry_count?: number;
}

export interface DailyMetrics {
  date: string;
  total_queries: number;
  successful_queries: number;
  failed_queries: number;
  cache_hits: number;
  total_revenue_x402: number;
  unique_users: number;
  average_processing_time_ms: number;
  payment_success_rate: number;
}

export interface AssetQueryStats {
  asset_identifier: string;
  asset_type: AssetType;
  query_count: number;
  last_queried: string;
  average_risk_score: number;
}

export class QueryAnalytics {
  private queryLog: QueryAnalyticsRecord[] = [];
  private dailyMetrics: Map<string, DailyMetrics> = new Map();
  private assetQueryStats: Map<string, AssetQueryStats> = new Map();

  /**
   * Log a query execution
   */
  logQuery(record: QueryAnalyticsRecord): void {
    // Add to query log
    this.queryLog.push(record);

    // Update daily metrics
    this.updateDailyMetrics(record);

    // Update asset stats
    this.updateAssetStats(record);

    // Log to console (in production, this would go to a logging service)
    if (process.env.ANALYTICS_LOGGING === 'true') {
      console.log('\n📊 Query Analytics:');
      console.log(JSON.stringify(record, null, 2));
    }

    // Cleanup old logs (keep last 10000 records)
    if (this.queryLog.length > 10000) {
      this.queryLog = this.queryLog.slice(-10000);
    }
  }

  /**
   * Update daily metrics
   */
  private updateDailyMetrics(record: QueryAnalyticsRecord): void {
    const date = record.timestamp.split('T')[0]; // Get YYYY-MM-DD
    
    let metrics = this.dailyMetrics.get(date);
    
    if (!metrics) {
      metrics = {
        date,
        total_queries: 0,
        successful_queries: 0,
        failed_queries: 0,
        cache_hits: 0,
        total_revenue_x402: 0,
        unique_users: 0,
        average_processing_time_ms: 0,
        payment_success_rate: 0
      };
      this.dailyMetrics.set(date, metrics);
    }

    // Update metrics
    metrics.total_queries++;
    
    if (record.payment_status === 'success') {
      metrics.successful_queries++;
      metrics.total_revenue_x402 += 1; // 1 x402 per query
    } else if (record.payment_status === 'failed') {
      metrics.failed_queries++;
    }

    if (record.cache_hit) {
      metrics.cache_hits++;
    }

    // Update average processing time
    const totalTime = metrics.average_processing_time_ms * (metrics.total_queries - 1);
    metrics.average_processing_time_ms = (totalTime + record.processing_time_ms) / metrics.total_queries;

    // Update payment success rate
    const paidQueries = metrics.successful_queries + metrics.failed_queries;
    if (paidQueries > 0) {
      metrics.payment_success_rate = (metrics.successful_queries / paidQueries) * 100;
    }

    // Update unique users (simplified - in production use Set)
    const uniqueUsers = new Set(
      this.queryLog
        .filter(q => q.timestamp.startsWith(date))
        .map(q => q.user_wallet)
    );
    metrics.unique_users = uniqueUsers.size;
  }

  /**
   * Update asset query statistics
   */
  private updateAssetStats(record: QueryAnalyticsRecord): void {
    // Extract asset identifier from query (simplified)
    const assetKey = `${record.query_type}`;
    
    let stats = this.assetQueryStats.get(assetKey);
    
    if (!stats) {
      stats = {
        asset_identifier: assetKey,
        asset_type: record.query_type,
        query_count: 0,
        last_queried: record.timestamp,
        average_risk_score: 0
      };
      this.assetQueryStats.set(assetKey, stats);
    }

    // Update stats
    stats.query_count++;
    stats.last_queried = record.timestamp;
    
    // Update average risk score
    const totalScore = stats.average_risk_score * (stats.query_count - 1);
    stats.average_risk_score = (totalScore + record.risk_score_returned) / stats.query_count;
  }

  /**
   * Get daily metrics for a specific date
   */
  getDailyMetrics(date: string): DailyMetrics | null {
    return this.dailyMetrics.get(date) || null;
  }

  /**
   * Get metrics for date range
   */
  getMetricsRange(startDate: string, endDate: string): DailyMetrics[] {
    const metrics: DailyMetrics[] = [];
    
    for (const [date, metric] of this.dailyMetrics.entries()) {
      if (date >= startDate && date <= endDate) {
        metrics.push(metric);
      }
    }

    return metrics.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get top queried assets
   */
  getTopQueriedAssets(limit: number = 10): AssetQueryStats[] {
    return Array.from(this.assetQueryStats.values())
      .sort((a, b) => b.query_count - a.query_count)
      .slice(0, limit);
  }

  /**
   * Get queries by user
   */
  getUserQueries(userWallet: string, limit: number = 100): QueryAnalyticsRecord[] {
    return this.queryLog
      .filter(q => q.user_wallet === userWallet)
      .slice(-limit);
  }

  /**
   * Get recent queries
   */
  getRecentQueries(limit: number = 100): QueryAnalyticsRecord[] {
    return this.queryLog.slice(-limit);
  }

  /**
   * Get payment success rate
   */
  getPaymentSuccessRate(): number {
    const paidQueries = this.queryLog.filter(
      q => q.payment_status === 'success' || q.payment_status === 'failed'
    );
    
    if (paidQueries.length === 0) return 0;
    
    const successful = paidQueries.filter(q => q.payment_status === 'success').length;
    return (successful / paidQueries.length) * 100;
  }

  /**
   * Get cache hit rate
   */
  getCacheHitRate(): number {
    if (this.queryLog.length === 0) return 0;
    
    const cacheHits = this.queryLog.filter(q => q.cache_hit).length;
    return (cacheHits / this.queryLog.length) * 100;
  }

  /**
   * Get average processing time
   */
  getAverageProcessingTime(): number {
    if (this.queryLog.length === 0) return 0;
    
    const totalTime = this.queryLog.reduce((sum, q) => sum + q.processing_time_ms, 0);
    return totalTime / this.queryLog.length;
  }

  /**
   * Export analytics data (for backup or external analysis)
   */
  exportAnalytics(): {
    queryLog: QueryAnalyticsRecord[];
    dailyMetrics: DailyMetrics[];
    assetStats: AssetQueryStats[];
  } {
    return {
      queryLog: this.queryLog,
      dailyMetrics: Array.from(this.dailyMetrics.values()),
      assetStats: Array.from(this.assetQueryStats.values())
    };
  }

  /**
   * Generate analytics summary
   */
  generateSummary(): string {
    const totalQueries = this.queryLog.length;
    const paymentSuccessRate = this.getPaymentSuccessRate();
    const cacheHitRate = this.getCacheHitRate();
    const avgProcessingTime = this.getAverageProcessingTime();
    const topAssets = this.getTopQueriedAssets(5);

    let summary = '\n📊 Platform Analytics Summary\n';
    summary += '═══════════════════════════════════════\n';
    summary += `Total Queries: ${totalQueries}\n`;
    summary += `Payment Success Rate: ${paymentSuccessRate.toFixed(1)}%\n`;
    summary += `Cache Hit Rate: ${cacheHitRate.toFixed(1)}%\n`;
    summary += `Avg Processing Time: ${avgProcessingTime.toFixed(0)}ms\n`;
    summary += '\nTop Queried Asset Types:\n';
    
    topAssets.forEach((asset, index) => {
      summary += `  ${index + 1}. ${asset.asset_type}: ${asset.query_count} queries\n`;
    });
    
    summary += '═══════════════════════════════════════\n';

    return summary;
  }
}
