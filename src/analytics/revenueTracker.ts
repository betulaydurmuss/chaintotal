/**
 * Revenue Tracker
 * 
 * Tracks revenue metrics and transaction volumes
 */

export interface RevenueMetrics {
  date: string;
  total_transactions: number;
  total_revenue_x402: number;
  successful_payments: number;
  failed_payments: number;
  average_queries_per_user: number;
  payment_success_rate: number;
}

export interface UserRevenueStats {
  user_wallet: string;
  total_spent_x402: number;
  total_queries: number;
  first_query: string;
  last_query: string;
  average_spend_per_query: number;
}

export class RevenueTracker {
  private dailyRevenue: Map<string, RevenueMetrics> = new Map();
  private userRevenue: Map<string, UserRevenueStats> = new Map();
  private transactionLog: Array<{
    tx_hash: string;
    user_wallet: string;
    amount_x402: number;
    status: 'success' | 'failed';
    timestamp: string;
  }> = [];

  /**
   * Record a transaction
   */
  recordTransaction(
    txHash: string,
    userWallet: string,
    amountX402: number,
    status: 'success' | 'failed',
    timestamp: string
  ): void {
    // Add to transaction log
    this.transactionLog.push({
      tx_hash: txHash,
      user_wallet: userWallet,
      amount_x402: amountX402,
      status,
      timestamp
    });

    // Update daily revenue
    this.updateDailyRevenue(amountX402, status, timestamp, userWallet);

    // Update user revenue
    this.updateUserRevenue(userWallet, amountX402, status, timestamp);

    // Cleanup old transactions (keep last 50000)
    if (this.transactionLog.length > 50000) {
      this.transactionLog = this.transactionLog.slice(-50000);
    }
  }

  /**
   * Update daily revenue metrics
   */
  private updateDailyRevenue(
    amount: number,
    status: 'success' | 'failed',
    timestamp: string,
    userWallet: string
  ): void {
    const date = timestamp.split('T')[0];
    
    let metrics = this.dailyRevenue.get(date);
    
    if (!metrics) {
      metrics = {
        date,
        total_transactions: 0,
        total_revenue_x402: 0,
        successful_payments: 0,
        failed_payments: 0,
        average_queries_per_user: 0,
        payment_success_rate: 0
      };
      this.dailyRevenue.set(date, metrics);
    }

    metrics.total_transactions++;
    
    if (status === 'success') {
      metrics.total_revenue_x402 += amount;
      metrics.successful_payments++;
    } else {
      metrics.failed_payments++;
    }

    // Update payment success rate
    const totalPayments = metrics.successful_payments + metrics.failed_payments;
    metrics.payment_success_rate = (metrics.successful_payments / totalPayments) * 100;

    // Update average queries per user
    const uniqueUsers = new Set(
      this.transactionLog
        .filter(t => t.timestamp.startsWith(date))
        .map(t => t.user_wallet)
    );
    metrics.average_queries_per_user = metrics.total_transactions / uniqueUsers.size;
  }

  /**
   * Update user revenue statistics
   */
  private updateUserRevenue(
    userWallet: string,
    amount: number,
    status: 'success' | 'failed',
    timestamp: string
  ): void {
    let stats = this.userRevenue.get(userWallet);
    
    if (!stats) {
      stats = {
        user_wallet: userWallet,
        total_spent_x402: 0,
        total_queries: 0,
        first_query: timestamp,
        last_query: timestamp,
        average_spend_per_query: 0
      };
      this.userRevenue.set(userWallet, stats);
    }

    stats.total_queries++;
    stats.last_query = timestamp;
    
    if (status === 'success') {
      stats.total_spent_x402 += amount;
    }

    stats.average_spend_per_query = stats.total_spent_x402 / stats.total_queries;
  }

  /**
   * Get daily revenue for a specific date
   */
  getDailyRevenue(date: string): RevenueMetrics | null {
    return this.dailyRevenue.get(date) || null;
  }

  /**
   * Get revenue for date range
   */
  getRevenueRange(startDate: string, endDate: string): RevenueMetrics[] {
    const metrics: RevenueMetrics[] = [];
    
    for (const [date, metric] of this.dailyRevenue.entries()) {
      if (date >= startDate && date <= endDate) {
        metrics.push(metric);
      }
    }

    return metrics.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get total revenue
   */
  getTotalRevenue(): number {
    return Array.from(this.dailyRevenue.values())
      .reduce((sum, m) => sum + m.total_revenue_x402, 0);
  }

  /**
   * Get top spending users
   */
  getTopSpenders(limit: number = 10): UserRevenueStats[] {
    return Array.from(this.userRevenue.values())
      .sort((a, b) => b.total_spent_x402 - a.total_spent_x402)
      .slice(0, limit);
  }

  /**
   * Get user revenue stats
   */
  getUserStats(userWallet: string): UserRevenueStats | null {
    return this.userRevenue.get(userWallet) || null;
  }

  /**
   * Get average queries per user
   */
  getAverageQueriesPerUser(): number {
    if (this.userRevenue.size === 0) return 0;
    
    const totalQueries = Array.from(this.userRevenue.values())
      .reduce((sum, u) => sum + u.total_queries, 0);
    
    return totalQueries / this.userRevenue.size;
  }

  /**
   * Get payment success rate
   */
  getPaymentSuccessRate(): number {
    const successful = this.transactionLog.filter(t => t.status === 'success').length;
    const total = this.transactionLog.length;
    
    if (total === 0) return 0;
    
    return (successful / total) * 100;
  }

  /**
   * Generate revenue summary
   */
  generateSummary(): string {
    const totalRevenue = this.getTotalRevenue();
    const totalTransactions = this.transactionLog.length;
    const avgQueriesPerUser = this.getAverageQueriesPerUser();
    const paymentSuccessRate = this.getPaymentSuccessRate();
    const topSpenders = this.getTopSpenders(5);

    let summary = '\n💰 Revenue Summary\n';
    summary += '═══════════════════════════════════════\n';
    summary += `Total Revenue: ${totalRevenue} x402\n`;
    summary += `Total Transactions: ${totalTransactions}\n`;
    summary += `Avg Queries/User: ${avgQueriesPerUser.toFixed(1)}\n`;
    summary += `Payment Success Rate: ${paymentSuccessRate.toFixed(1)}%\n`;
    summary += '\nTop Spenders:\n';
    
    topSpenders.forEach((user, index) => {
      const wallet = user.user_wallet.substring(0, 10) + '...';
      summary += `  ${index + 1}. ${wallet}: ${user.total_spent_x402} x402 (${user.total_queries} queries)\n`;
    });
    
    summary += '═══════════════════════════════════════\n';

    return summary;
  }

  /**
   * Export revenue data
   */
  exportData(): {
    dailyRevenue: RevenueMetrics[];
    userRevenue: UserRevenueStats[];
    transactionLog: Array<{
      tx_hash: string;
      user_wallet: string;
      amount_x402: number;
      status: string;
      timestamp: string;
    }>;
  } {
    return {
      dailyRevenue: Array.from(this.dailyRevenue.values()),
      userRevenue: Array.from(this.userRevenue.values()),
      transactionLog: this.transactionLog
    };
  }
}
