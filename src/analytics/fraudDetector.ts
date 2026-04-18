/**
 * Fraud Detector
 * 
 * Detects and prevents fraudulent behavior patterns
 */

export interface FraudAlert {
  alert_id: string;
  user_wallet: string;
  alert_type: 'bulk_query' | 'rapid_query' | 'bot_behavior' | 'unusual_payment';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface UserBehaviorProfile {
  user_wallet: string;
  total_queries: number;
  queries_last_minute: number;
  queries_last_hour: number;
  queries_last_day: number;
  first_seen: string;
  last_seen: string;
  blocked: boolean;
  block_reason?: string;
  block_until?: string;
}

export class FraudDetector {
  private userProfiles: Map<string, UserBehaviorProfile> = new Map();
  private queryTimestamps: Map<string, number[]> = new Map(); // user -> timestamps
  private fraudAlerts: FraudAlert[] = [];
  private blockedUsers: Set<string> = new Set();

  // Configuration
  private readonly MAX_QUERIES_PER_MINUTE = 5;
  private readonly MAX_QUERIES_PER_HOUR = 50;
  private readonly MAX_QUERIES_PER_DAY = 200;
  private readonly BULK_QUERY_THRESHOLD = 10; // 10 queries in 30 seconds
  private readonly BOT_PATTERN_THRESHOLD = 20; // 20 queries with same interval
  private readonly BLOCK_DURATION_MS = 3600000; // 1 hour

  /**
   * Check if user is allowed to make a query
   */
  checkUserAllowed(userWallet: string): {
    allowed: boolean;
    reason?: string;
    block_until?: string;
  } {
    // Check if user is blocked
    if (this.isUserBlocked(userWallet)) {
      const profile = this.userProfiles.get(userWallet);
      return {
        allowed: false,
        reason: profile?.block_reason || 'User is blocked',
        block_until: profile?.block_until
      };
    }

    // Check rate limits
    const profile = this.getOrCreateProfile(userWallet);
    const now = Date.now();

    // Update query counts
    this.updateQueryCounts(userWallet, now);

    // Check per-minute limit
    if (profile.queries_last_minute >= this.MAX_QUERIES_PER_MINUTE) {
      this.blockUser(
        userWallet,
        'rapid_query',
        `Exceeded ${this.MAX_QUERIES_PER_MINUTE} queries per minute limit`,
        this.BLOCK_DURATION_MS
      );
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${this.MAX_QUERIES_PER_MINUTE} queries/minute`,
        block_until: this.userProfiles.get(userWallet)?.block_until
      };
    }

    // Check per-hour limit
    if (profile.queries_last_hour >= this.MAX_QUERIES_PER_HOUR) {
      this.blockUser(
        userWallet,
        'bulk_query',
        `Exceeded ${this.MAX_QUERIES_PER_HOUR} queries per hour limit`,
        this.BLOCK_DURATION_MS * 2
      );
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${this.MAX_QUERIES_PER_HOUR} queries/hour`,
        block_until: this.userProfiles.get(userWallet)?.block_until
      };
    }

    // Check per-day limit
    if (profile.queries_last_day >= this.MAX_QUERIES_PER_DAY) {
      this.blockUser(
        userWallet,
        'bulk_query',
        `Exceeded ${this.MAX_QUERIES_PER_DAY} queries per day limit`,
        this.BLOCK_DURATION_MS * 24
      );
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${this.MAX_QUERIES_PER_DAY} queries/day`,
        block_until: this.userProfiles.get(userWallet)?.block_until
      };
    }

    return { allowed: true };
  }

  /**
   * Record a query
   */
  recordQuery(userWallet: string, assetIdentifier: string): void {
    const now = Date.now();
    const profile = this.getOrCreateProfile(userWallet);

    // Add timestamp
    const timestamps = this.queryTimestamps.get(userWallet) || [];
    timestamps.push(now);
    this.queryTimestamps.set(userWallet, timestamps);

    // Update profile
    profile.total_queries++;
    profile.last_seen = new Date(now).toISOString();

    // Check for fraud patterns
    this.detectBulkQuery(userWallet, timestamps);
    this.detectBotBehavior(userWallet, timestamps);

    // Cleanup old timestamps (keep last 24 hours)
    const oneDayAgo = now - 86400000;
    const recentTimestamps = timestamps.filter(t => t > oneDayAgo);
    this.queryTimestamps.set(userWallet, recentTimestamps);
  }

  /**
   * Record a payment
   */
  recordPayment(userWallet: string, amount: number, status: 'success' | 'failed'): void {
    // Check for unusual payment amounts
    if (amount !== 1) {
      this.createAlert(
        userWallet,
        'unusual_payment',
        'medium',
        `Unusual payment amount: ${amount} x402 (expected 1)`,
        { amount, status }
      );
    }
  }

  /**
   * Get or create user profile
   */
  private getOrCreateProfile(userWallet: string): UserBehaviorProfile {
    let profile = this.userProfiles.get(userWallet);
    
    if (!profile) {
      const now = new Date().toISOString();
      profile = {
        user_wallet: userWallet,
        total_queries: 0,
        queries_last_minute: 0,
        queries_last_hour: 0,
        queries_last_day: 0,
        first_seen: now,
        last_seen: now,
        blocked: false
      };
      this.userProfiles.set(userWallet, profile);
    }

    return profile;
  }

  /**
   * Update query counts for time windows
   */
  private updateQueryCounts(userWallet: string, now: number): void {
    const profile = this.getOrCreateProfile(userWallet);
    const timestamps = this.queryTimestamps.get(userWallet) || [];

    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;
    const oneDayAgo = now - 86400000;

    profile.queries_last_minute = timestamps.filter(t => t > oneMinuteAgo).length;
    profile.queries_last_hour = timestamps.filter(t => t > oneHourAgo).length;
    profile.queries_last_day = timestamps.filter(t => t > oneDayAgo).length;
  }

  /**
   * Detect bulk query pattern
   */
  private detectBulkQuery(userWallet: string, timestamps: number[]): void {
    if (timestamps.length < this.BULK_QUERY_THRESHOLD) return;

    const now = Date.now();
    const thirtySecondsAgo = now - 30000;
    const recentQueries = timestamps.filter(t => t > thirtySecondsAgo).length;

    if (recentQueries >= this.BULK_QUERY_THRESHOLD) {
      this.createAlert(
        userWallet,
        'bulk_query',
        'high',
        `Bulk query detected: ${recentQueries} queries in 30 seconds`,
        { queries_in_30s: recentQueries }
      );
    }
  }

  /**
   * Detect bot behavior pattern
   */
  private detectBotBehavior(userWallet: string, timestamps: number[]): void {
    if (timestamps.length < this.BOT_PATTERN_THRESHOLD) return;

    // Check for consistent intervals (bot-like behavior)
    const recentTimestamps = timestamps.slice(-this.BOT_PATTERN_THRESHOLD);
    const intervals: number[] = [];

    for (let i = 1; i < recentTimestamps.length; i++) {
      intervals.push(recentTimestamps[i] - recentTimestamps[i - 1]);
    }

    // Calculate standard deviation of intervals
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avgInterval, 2);
    }, 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // If intervals are very consistent (low std dev), likely a bot
    if (stdDev < 1000 && avgInterval < 10000) { // Less than 1s variation, avg < 10s
      this.createAlert(
        userWallet,
        'bot_behavior',
        'high',
        `Bot-like behavior detected: consistent ${avgInterval.toFixed(0)}ms intervals`,
        { 
          average_interval_ms: avgInterval,
          std_deviation: stdDev,
          sample_size: intervals.length
        }
      );

      // Block user
      this.blockUser(
        userWallet,
        'bot_behavior',
        'Automated bot behavior detected',
        this.BLOCK_DURATION_MS * 24 // 24 hours
      );
    }
  }

  /**
   * Block a user
   */
  private blockUser(
    userWallet: string,
    reason: string,
    description: string,
    durationMs: number
  ): void {
    const profile = this.getOrCreateProfile(userWallet);
    const blockUntil = new Date(Date.now() + durationMs).toISOString();

    profile.blocked = true;
    profile.block_reason = description;
    profile.block_until = blockUntil;

    this.blockedUsers.add(userWallet);

    console.log(`\n🚨 User Blocked: ${userWallet.substring(0, 10)}...`);
    console.log(`   Reason: ${description}`);
    console.log(`   Block Until: ${blockUntil}\n`);
  }

  /**
   * Check if user is blocked
   */
  private isUserBlocked(userWallet: string): boolean {
    const profile = this.userProfiles.get(userWallet);
    
    if (!profile || !profile.blocked) return false;

    // Check if block has expired
    if (profile.block_until) {
      const blockUntil = new Date(profile.block_until).getTime();
      const now = Date.now();

      if (now > blockUntil) {
        // Unblock user
        profile.blocked = false;
        profile.block_reason = undefined;
        profile.block_until = undefined;
        this.blockedUsers.delete(userWallet);
        return false;
      }
    }

    return true;
  }

  /**
   * Create fraud alert
   */
  private createAlert(
    userWallet: string,
    alertType: FraudAlert['alert_type'],
    severity: FraudAlert['severity'],
    description: string,
    metadata: Record<string, any>
  ): void {
    const alert: FraudAlert = {
      alert_id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_wallet: userWallet,
      alert_type: alertType,
      severity,
      description,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.fraudAlerts.push(alert);

    // Log alert
    console.log(`\n⚠️  Fraud Alert [${severity.toUpperCase()}]`);
    console.log(`   User: ${userWallet.substring(0, 10)}...`);
    console.log(`   Type: ${alertType}`);
    console.log(`   ${description}\n`);

    // Cleanup old alerts (keep last 1000)
    if (this.fraudAlerts.length > 1000) {
      this.fraudAlerts = this.fraudAlerts.slice(-1000);
    }
  }

  /**
   * Get user profile
   */
  getUserProfile(userWallet: string): UserBehaviorProfile | null {
    return this.userProfiles.get(userWallet) || null;
  }

  /**
   * Get fraud alerts
   */
  getFraudAlerts(limit: number = 100): FraudAlert[] {
    return this.fraudAlerts.slice(-limit);
  }

  /**
   * Get blocked users
   */
  getBlockedUsers(): UserBehaviorProfile[] {
    return Array.from(this.blockedUsers)
      .map(wallet => this.userProfiles.get(wallet))
      .filter(profile => profile !== undefined) as UserBehaviorProfile[];
  }

  /**
   * Manually unblock user
   */
  unblockUser(userWallet: string): boolean {
    const profile = this.userProfiles.get(userWallet);
    
    if (!profile) return false;

    profile.blocked = false;
    profile.block_reason = undefined;
    profile.block_until = undefined;
    this.blockedUsers.delete(userWallet);

    console.log(`✅ User unblocked: ${userWallet.substring(0, 10)}...`);
    return true;
  }

  /**
   * Generate fraud detection summary
   */
  generateSummary(): string {
    const totalUsers = this.userProfiles.size;
    const blockedUsers = this.blockedUsers.size;
    const recentAlerts = this.fraudAlerts.slice(-10);

    let summary = '\n🛡️  Fraud Detection Summary\n';
    summary += '═══════════════════════════════════════\n';
    summary += `Total Users Tracked: ${totalUsers}\n`;
    summary += `Blocked Users: ${blockedUsers}\n`;
    summary += `Total Alerts: ${this.fraudAlerts.length}\n`;
    summary += '\nRate Limits:\n';
    summary += `  • ${this.MAX_QUERIES_PER_MINUTE} queries/minute\n`;
    summary += `  • ${this.MAX_QUERIES_PER_HOUR} queries/hour\n`;
    summary += `  • ${this.MAX_QUERIES_PER_DAY} queries/day\n`;
    
    if (recentAlerts.length > 0) {
      summary += '\nRecent Alerts:\n';
      recentAlerts.forEach((alert, index) => {
        const wallet = alert.user_wallet.substring(0, 10) + '...';
        summary += `  ${index + 1}. [${alert.severity.toUpperCase()}] ${wallet}: ${alert.alert_type}\n`;
      });
    }
    
    summary += '═══════════════════════════════════════\n';

    return summary;
  }

  /**
   * Export fraud detection data
   */
  exportData(): {
    userProfiles: UserBehaviorProfile[];
    fraudAlerts: FraudAlert[];
    blockedUsers: string[];
  } {
    return {
      userProfiles: Array.from(this.userProfiles.values()),
      fraudAlerts: this.fraudAlerts,
      blockedUsers: Array.from(this.blockedUsers)
    };
  }
}
