import * as crypto from 'crypto';
import { AssetType, AnalysisResult } from '../types';

/**
 * Session Manager
 * 
 * Oturum Yönetimi:
 * - User session state
 * - Query history
 * - Payment ledger
 * - Cache management
 * - Analytics logging
 */

export interface UserSession {
  userWalletAddress: string;
  sessionId: string;
  queryHistory: QueryRecord[];
  paymentLedger: PaymentRecord[];
  subscriptionLevel: 'free' | 'pro';
  createdAt: string;
  lastActivity: string;
  stats: SessionStats;
}

export interface QueryRecord {
  queryId: string;
  assetType: AssetType;
  assetIdentifier: string;
  riskScore: number;
  riskLevel: string;
  timestamp: string;
  cached: boolean;
}

export interface PaymentRecord {
  txHash: string;
  amount: number;
  assetCode: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

export interface SessionStats {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  cacheHits: number;
  totalPayments: number;
  totalSpent: number;
}

export interface CacheEntry {
  queryId: string;
  result: AnalysisResult;
  timestamp: string;
  expiresAt: string;
}

export class SessionManager {
  private sessions: Map<string, UserSession>;
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat
  private readonly ENCRYPTION_KEY: string;

  constructor(encryptionKey?: string) {
    this.sessions = new Map();
    this.cache = new Map();
    this.ENCRYPTION_KEY = encryptionKey || this.generateEncryptionKey();
  }

  /**
   * Yeni oturum oluştur veya mevcut oturumu getir
   */
  getOrCreateSession(userWalletAddress: string): UserSession {
    const encrypted = this.encryptData(userWalletAddress);
    
    if (this.sessions.has(encrypted)) {
      const session = this.sessions.get(encrypted)!;
      session.lastActivity = new Date().toISOString();
      return session;
    }

    const newSession: UserSession = {
      userWalletAddress: encrypted, // Şifrelenmiş
      sessionId: this.generateSessionId(),
      queryHistory: [],
      paymentLedger: [],
      subscriptionLevel: 'free',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      stats: {
        totalQueries: 0,
        successfulQueries: 0,
        failedQueries: 0,
        cacheHits: 0,
        totalPayments: 0,
        totalSpent: 0
      }
    };

    this.sessions.set(encrypted, newSession);
    console.log(`✅ Yeni oturum oluşturuldu: ${newSession.sessionId}`);
    
    return newSession;
  }

  /**
   * Cache kontrolü - 24 saat içinde aynı varlık sorgulanmış mı?
   */
  checkCache(assetType: AssetType, assetIdentifier: string): CacheEntry | null {
    const cacheKey = this.generateCacheKey(assetType, assetIdentifier);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return null;
    }

    // Expire kontrolü
    const now = new Date().getTime();
    const expiresAt = new Date(entry.expiresAt).getTime();

    if (now > expiresAt) {
      // Cache expired
      this.cache.delete(cacheKey);
      console.log(`🗑️  Cache expired: ${cacheKey}`);
      return null;
    }

    // Cache hit
    const ageInHours = Math.floor((now - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60));
    console.log(`📊 Cache hit: ${cacheKey} (${ageInHours} saat önce güncellenmiş)`);
    
    return entry;
  }

  /**
   * Analiz sonucunu cache'e ekle
   */
  cacheResult(result: AnalysisResult): void {
    const cacheKey = this.generateCacheKey(result.assetType, result.identifier);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.CACHE_TTL);

    const entry: CacheEntry = {
      queryId: result.queryId || '',
      result,
      timestamp: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    this.cache.set(cacheKey, entry);
    console.log(`💾 Cache'e kaydedildi: ${cacheKey} (24 saat geçerli)`);
  }

  /**
   * Query history'ye ekle
   */
  addQueryToHistory(
    userWalletAddress: string,
    result: AnalysisResult,
    cached: boolean = false
  ): void {
    const session = this.getOrCreateSession(userWalletAddress);

    const record: QueryRecord = {
      queryId: result.queryId || '',
      assetType: result.assetType,
      assetIdentifier: this.encryptData(result.identifier), // Şifrelenmiş
      riskScore: result.riskScore.score,
      riskLevel: result.riskScore.level,
      timestamp: result.timestamp,
      cached
    };

    session.queryHistory.push(record);
    session.stats.totalQueries++;
    
    if (result.success) {
      session.stats.successfulQueries++;
    } else {
      session.stats.failedQueries++;
    }

    if (cached) {
      session.stats.cacheHits++;
    }

    session.lastActivity = new Date().toISOString();
    
    console.log(`📝 Query history güncellendi: ${session.stats.totalQueries} toplam sorgu`);
  }

  /**
   * Payment ledger'a ekle
   */
  addPaymentToLedger(
    userWalletAddress: string,
    txHash: string,
    amount: number,
    assetCode: string,
    status: 'pending' | 'confirmed' | 'failed'
  ): void {
    const session = this.getOrCreateSession(userWalletAddress);

    const record: PaymentRecord = {
      txHash: this.encryptData(txHash), // Şifrelenmiş
      amount,
      assetCode,
      status,
      timestamp: new Date().toISOString()
    };

    session.paymentLedger.push(record);
    
    if (status === 'confirmed') {
      session.stats.totalPayments++;
      session.stats.totalSpent += amount;
    }

    session.lastActivity = new Date().toISOString();
    
    console.log(`💳 Payment ledger güncellendi: ${session.stats.totalPayments} başarılı ödeme`);
  }

  /**
   * Oturum istatistiklerini getir
   */
  getSessionStats(userWalletAddress: string): SessionStats | null {
    const encrypted = this.encryptData(userWalletAddress);
    const session = this.sessions.get(encrypted);
    
    if (!session) {
      return null;
    }

    return session.stats;
  }

  /**
   * Query history getir (son N sorgu)
   */
  getQueryHistory(userWalletAddress: string, limit: number = 10): QueryRecord[] {
    const encrypted = this.encryptData(userWalletAddress);
    const session = this.sessions.get(encrypted);
    
    if (!session) {
      return [];
    }

    // Son N sorguyu döndür
    return session.queryHistory.slice(-limit).reverse();
  }

  /**
   * Payment ledger getir (son N ödeme)
   */
  getPaymentLedger(userWalletAddress: string, limit: number = 10): PaymentRecord[] {
    const encrypted = this.encryptData(userWalletAddress);
    const session = this.sessions.get(encrypted);
    
    if (!session) {
      return [];
    }

    // Son N ödemeyi döndür
    return session.paymentLedger.slice(-limit).reverse();
  }

  /**
   * Oturum bitişi - Analytics log
   */
  endSession(userWalletAddress: string): void {
    const encrypted = this.encryptData(userWalletAddress);
    const session = this.sessions.get(encrypted);
    
    if (!session) {
      console.log('⚠️  Oturum bulunamadı');
      return;
    }

    // Analytics log
    this.logAnalytics(session);

    // Oturumu sil
    this.sessions.delete(encrypted);
    
    console.log(`👋 Oturum sonlandırıldı: ${session.sessionId}`);
  }

  /**
   * Analytics logging
   */
  private logAnalytics(session: UserSession): void {
    const duration = new Date().getTime() - new Date(session.createdAt).getTime();
    const durationMinutes = Math.floor(duration / (1000 * 60));

    const analytics = {
      sessionId: session.sessionId,
      subscriptionLevel: session.subscriptionLevel,
      duration: durationMinutes,
      stats: session.stats,
      timestamp: new Date().toISOString()
    };

    console.log('\n📊 Analytics Log:');
    console.log('═══════════════════════════════════════');
    console.log(JSON.stringify(analytics, null, 2));
    console.log('═══════════════════════════════════════\n');

    // Gerçek uygulamada analytics service'e gönderilir
    // await analyticsService.log(analytics);
  }

  /**
   * Tüm aktif oturumları temizle
   */
  clearAllSessions(): void {
    this.sessions.forEach((session, key) => {
      this.logAnalytics(session);
    });
    
    this.sessions.clear();
    console.log('🗑️  Tüm oturumlar temizlendi');
  }

  /**
   * Cache'i temizle
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️  Cache temizlendi');
  }

  /**
   * Expired cache entries'leri temizle
   */
  cleanupExpiredCache(): void {
    const now = new Date().getTime();
    let cleaned = 0;

    this.cache.forEach((entry, key) => {
      const expiresAt = new Date(entry.expiresAt).getTime();
      if (now > expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      console.log(`🗑️  ${cleaned} expired cache entry temizlendi`);
    }
  }

  /**
   * Veri şifreleme (GDPR compliance)
   */
  private encryptData(data: string): string {
    // Gerçek uygulamada AES-256 veya benzeri kullanılır
    const cipher = crypto.createCipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Veri şifre çözme
   */
  private decryptData(encryptedData: string): string {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', this.ENCRYPTION_KEY);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return encryptedData; // Şifre çözülemezse orijinali döndür
    }
  }

  /**
   * Cache key oluştur
   */
  private generateCacheKey(assetType: AssetType, assetIdentifier: string): string {
    return `${assetType}:${assetIdentifier}`.toLowerCase();
  }

  /**
   * Session ID oluştur
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Encryption key oluştur
   */
  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Oturum sayısı
   */
  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Cache boyutu
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Session özeti
   */
  getSessionSummary(userWalletAddress: string): string {
    const encrypted = this.encryptData(userWalletAddress);
    const session = this.sessions.get(encrypted);
    
    if (!session) {
      return 'Oturum bulunamadı';
    }

    const duration = new Date().getTime() - new Date(session.createdAt).getTime();
    const durationMinutes = Math.floor(duration / (1000 * 60));

    return `
📊 Oturum Özeti
═══════════════════════════════════════
Session ID: ${session.sessionId}
Subscription: ${session.subscriptionLevel}
Süre: ${durationMinutes} dakika

📈 İstatistikler:
   • Toplam Sorgu: ${session.stats.totalQueries}
   • Başarılı: ${session.stats.successfulQueries}
   • Başarısız: ${session.stats.failedQueries}
   • Cache Hit: ${session.stats.cacheHits}
   • Toplam Ödeme: ${session.stats.totalPayments}
   • Toplam Harcama: ${session.stats.totalSpent} x402

📝 Son Aktivite: ${new Date(session.lastActivity).toLocaleString('tr-TR')}
═══════════════════════════════════════
    `.trim();
  }
}
