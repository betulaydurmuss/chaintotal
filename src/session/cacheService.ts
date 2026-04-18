import { SessionManager, CacheEntry } from './sessionManager';
import { AssetType, AnalysisResult } from '../types';

/**
 * Cache Service
 * 
 * Cache yönetimi ve optimizasyonu
 */
export class CacheService {
  private sessionManager: SessionManager;

  constructor(sessionManager: SessionManager) {
    this.sessionManager = sessionManager;
  }

  /**
   * Cache'den sonuç getir veya null döndür
   */
  async getCachedResult(
    assetType: AssetType,
    assetIdentifier: string
  ): Promise<{ result: AnalysisResult; ageInHours: number } | null> {
    const cacheEntry = this.sessionManager.checkCache(assetType, assetIdentifier);

    if (!cacheEntry) {
      return null;
    }

    // Cache yaşını hesapla
    const now = new Date().getTime();
    const timestamp = new Date(cacheEntry.timestamp).getTime();
    const ageInHours = Math.floor((now - timestamp) / (1000 * 60 * 60));

    return {
      result: cacheEntry.result,
      ageInHours
    };
  }

  /**
   * Cache mesajı oluştur
   */
  formatCacheMessage(ageInHours: number, riskScore: number): string {
    let timeText = '';
    
    if (ageInHours === 0) {
      timeText = 'az önce';
    } else if (ageInHours === 1) {
      timeText = '1 saat önce';
    } else if (ageInHours < 24) {
      timeText = `${ageInHours} saat önce`;
    } else {
      timeText = '24 saat içinde';
    }

    return `📊 Cache'den: Risk Score = ${riskScore}/100 (${timeText} güncellenmiş)`;
  }

  /**
   * Cache istatistikleri
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    oldestEntry: string | null;
  } {
    const size = this.sessionManager.getCacheSize();
    
    // Hit rate hesaplama için session stats kullan
    // Bu basitleştirilmiş bir örnek
    
    return {
      size,
      hitRate: 0, // Gerçek uygulamada hesaplanır
      oldestEntry: null
    };
  }

  /**
   * Cache temizleme stratejisi
   */
  async cleanupStrategy(): Promise<void> {
    // Expired entries'leri temizle
    this.sessionManager.cleanupExpiredCache();

    // Gerçek uygulamada:
    // - LRU (Least Recently Used) stratejisi
    // - Memory limit kontrolü
    // - Scheduled cleanup
  }
}
