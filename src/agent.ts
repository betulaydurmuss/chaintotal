import { PaymentService } from './stellar/paymentService';
import { RiskCalculator } from './analysis/riskCalculator';
import { DataCollector } from './analysis/dataCollector';
import { SessionManager } from './session/sessionManager';
import { CacheService } from './session/cacheService';
import { AnalysisRequest, AnalysisResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export class ChainTotalAgent {
  private paymentService: PaymentService;
  private riskCalculator: RiskCalculator;
  private dataCollector: DataCollector;
  private sessionManager: SessionManager;
  private cacheService: CacheService;

  constructor() {
    this.paymentService = new PaymentService();
    this.riskCalculator = new RiskCalculator();
    this.dataCollector = new DataCollector();
    this.sessionManager = new SessionManager();
    this.cacheService = new CacheService(this.sessionManager);
  }

  async analyzeAsset(request: AnalysisRequest): Promise<AnalysisResult> {
    const queryId = uuidv4();
    
    console.log('\n🤖 ChainTotal Risk Assessment Agent');
    console.log('=====================================');
    console.log(`📋 Query ID: ${queryId}`);
    console.log(`📋 Analiz Talebi:`);
    console.log(`   Varlık Tipi: ${request.assetType}`);
    console.log(`   Tanımlayıcı: ${request.identifier}`);
    console.log(`   Kullanıcı: ${request.userWallet}`);
    console.log('');

    // Session oluştur veya getir
    const session = this.sessionManager.getOrCreateSession(request.userWallet);
    console.log(`🔐 Session ID: ${session.sessionId}\n`);

    // Cache kontrolü - 24 saat içinde aynı varlık sorgulanmış mı?
    console.log('💾 Cache Kontrolü');
    const cachedResult = await this.cacheService.getCachedResult(
      request.assetType,
      request.identifier
    );

    if (cachedResult) {
      const cacheMessage = this.cacheService.formatCacheMessage(
        cachedResult.ageInHours,
        cachedResult.result.riskScore.score
      );
      console.log(cacheMessage);
      console.log('✅ Ödeme gerekmiyor (cache hit)\n');

      // Query history'ye ekle (cached olarak)
      this.sessionManager.addQueryToHistory(request.userWallet, cachedResult.result, true);

      // Cache'den döndür
      return {
        ...cachedResult.result,
        queryId,
        timestamp: new Date().toISOString()
      };
    }

    console.log('❌ Cache miss - Yeni analiz gerekli\n');

    // 1. Ödeme kontrolü
    console.log('💳 Adım 1: Ödeme İşlemi');
    const paymentRequest = {
      userWallet: request.userWallet,
      transactionHash: request.transactionHash
    };
    
    const paymentResult = await this.paymentService.requestPayment(paymentRequest);
    
    if (!paymentResult.success) {
      console.log(`❌ Ödeme başarısız: ${paymentResult.error}`);
      
      // Ödeme gerekiyorsa, kullanıcıya ödeme detaylarını döndür
      if (paymentResult.paymentRequired && paymentResult.paymentDetails) {
        console.log('\n📋 Ödeme Detayları:');
        console.log(`   Destination: ${paymentResult.paymentDetails.destination}`);
        console.log(`   Amount: ${paymentResult.paymentDetails.amount} ${paymentResult.paymentDetails.assetCode}`);
        console.log(`   Memo: ${paymentResult.paymentDetails.memo}`);
        console.log(`   Timeout: ${paymentResult.paymentDetails.timeout / 1000}s\n`);
      }
      
      return {
        success: false,
        queryId,
        assetType: request.assetType,
        identifier: request.identifier,
        riskScore: {
          score: 0,
          level: 'Düşük Risk' as any,
          factors: []
        },
        technicalAnalysis: {
          score: 0,
          weight: 0.6,
          data: {},
          findings: []
        },
        communitySignals: [],
        recommendations: [],
        timestamp: paymentResult.timestamp,
        transactionId: undefined,
        paymentRequired: paymentResult.paymentRequired,
        paymentDetails: paymentResult.paymentDetails,
        retryAvailable: paymentResult.retryAvailable
      };
    }

    console.log(`✅ Ödeme alındı: ${paymentResult.transactionId}`);
    
    // HTTP Headers oluştur (API çağrıları için)
    if (paymentResult.paymentToken) {
      const headers = this.paymentService.getPaymentHeaders(paymentResult.paymentToken);
      console.log('🔐 Payment Headers oluşturuldu');
      if (process.env.DEBUG === 'true') {
        console.log('   Headers:', headers);
      }
    }
    console.log('');

    // 2. Varlık doğrulama
    console.log('🔍 Adım 2: Varlık Doğrulama');
    const isValid = await this.dataCollector.verifyAsset(request.assetType, request.identifier);
    
    if (!isValid) {
      console.log('❌ Geçersiz varlık!\n');
      return {
        success: false,
        queryId,
        assetType: request.assetType,
        identifier: request.identifier,
        riskScore: {
          score: 100,
          level: 'Yüksek Risk' as any,
          factors: [{
            category: 'Doğrulama',
            score: 100,
            description: 'Geçersiz varlık formatı',
            weight: 1
          }]
        },
        technicalAnalysis: {
          score: 100,
          weight: 0.6,
          data: {},
          findings: ['Geçersiz varlık formatı']
        },
        communitySignals: [],
        recommendations: ['Varlık tanımlayıcısını kontrol edin'],
        timestamp: new Date().toISOString(),
        transactionId: paymentResult.transactionId
      };
    }

    console.log('✅ Varlık doğrulandı\n');

    // 3. Veri toplama
    console.log('📊 Adım 3: Veri Toplama');
    const [communitySignals, technicalData] = await Promise.all([
      this.dataCollector.collectCommunitySignals(request.assetType, request.identifier),
      this.dataCollector.collectTechnicalData(request.assetType, request.identifier)
    ]);

    console.log(`   Topluluk Sinyalleri: ${communitySignals.length} adet`);
    console.log(`   Teknik Veriler: Toplandı\n`);

    // 4. Risk hesaplama
    console.log('🎯 Adım 4: Risk Skorlama');
    console.log('   Ağırlıklar: Teknik %60, Topluluk %40');
    const riskScore = this.riskCalculator.calculateRiskScore(
      request.assetType,
      communitySignals,
      technicalData
    );

    console.log(`   Risk Skoru: ${riskScore.score}/100`);
    console.log(`   Risk Seviyesi: ${riskScore.level}`);
    console.log('');

    // 5. Öneriler oluştur
    const recommendations = this.generateRecommendations(riskScore, technicalData);

    // 6. Sonuç
    const result: AnalysisResult = {
      success: true,
      queryId,
      assetType: request.assetType,
      identifier: request.identifier,
      riskScore,
      technicalAnalysis: {
        score: riskScore.factors.find(f => f.category === 'Teknik Analiz')?.score || 0,
        weight: 0.6,
        data: technicalData,
        findings: (riskScore.factors.find(f => f.category === 'Teknik Analiz')?.details?.findings as string[]) || []
      },
      communitySignals,
      recommendations,
      timestamp: new Date().toISOString(),
      transactionId: paymentResult.transactionId
    };

    // Cache'e kaydet (24 saat geçerli)
    this.sessionManager.cacheResult(result);

    // Query history'ye ekle
    this.sessionManager.addQueryToHistory(request.userWallet, result, false);

    // Payment ledger'a ekle
    if (paymentResult.transactionId) {
      this.sessionManager.addPaymentToLedger(
        request.userWallet,
        paymentResult.transactionId,
        1, // amount
        'x402',
        'confirmed'
      );
    }

    this.printResult(result);

    return result;
  }

  /**
   * Session istatistiklerini getir
   */
  getSessionStats(userWallet: string) {
    return this.sessionManager.getSessionStats(userWallet);
  }

  /**
   * Query history getir
   */
  getQueryHistory(userWallet: string, limit: number = 10) {
    return this.sessionManager.getQueryHistory(userWallet, limit);
  }

  /**
   * Payment ledger getir
   */
  getPaymentLedger(userWallet: string, limit: number = 10) {
    return this.sessionManager.getPaymentLedger(userWallet, limit);
  }

  /**
   * Session özeti
   */
  getSessionSummary(userWallet: string): string {
    return this.sessionManager.getSessionSummary(userWallet);
  }

  /**
   * Oturumu sonlandır
   */
  endSession(userWallet: string): void {
    this.sessionManager.endSession(userWallet);
  }

  /**
   * Cache temizle
   */
  clearCache(): void {
    this.sessionManager.clearCache();
  }

  /**
   * Risk skoruna göre öneriler oluştur
   */
  private generateRecommendations(riskScore: any, technicalData: any): string[] {
    const recommendations: string[] = [];

    if (riskScore.score >= 70) {
      recommendations.push('⚠️ YÜKSEK RİSK: Bu varlıkla etkileşime girmekten kaçının');
      recommendations.push('🔍 Detaylı araştırma yapın ve alternatif varlıkları değerlendirin');
    } else if (riskScore.score >= 40) {
      recommendations.push('⚠️ ORTA RİSK: Dikkatli olun ve küçük miktarlarla başlayın');
      recommendations.push('📊 Topluluk geri bildirimlerini takip edin');
    } else {
      recommendations.push('✅ DÜŞÜK RİSK: Genel olarak güvenli görünüyor');
      recommendations.push('💡 Yine de kendi araştırmanızı yapın (DYOR)');
    }

    // Teknik verilere göre özel öneriler
    if (technicalData.knownScam) {
      recommendations.push('🚨 Bilinen dolandırıcılık - Kesinlikle uzak durun!');
    }

    if (technicalData.contractVerified === false) {
      recommendations.push('⚠️ Kontrat doğrulanmamış - Ekstra dikkatli olun');
    }

    if (technicalData.knownVulnerabilities && technicalData.knownVulnerabilities.length > 0) {
      recommendations.push('🔴 Güvenlik açıkları tespit edildi - Uzman görüşü alın');
    }

    if (technicalData.interactionWithScams) {
      recommendations.push('⚠️ Dolandırıcılıklarla etkileşim tespit edildi');
    }

    return recommendations;
  }

  /**
   * Sonucu formatla ve yazdır
   */
  private printResult(result: AnalysisResult): void {
    console.log('📄 Analiz Sonucu (JSON)');
    console.log('=====================================');
    
    // JSON output format
    const output = {
      query_id: result.queryId,
      asset_type: result.assetType,
      asset_identifier: result.identifier,
      risk_score: result.riskScore.score,
      risk_level: result.riskScore.level,
      technical_analysis: {
        score: result.technicalAnalysis.score,
        weight: result.technicalAnalysis.weight,
        findings: result.technicalAnalysis.findings,
        data: result.technicalAnalysis.data
      },
      community_signals: result.communitySignals.map(signal => ({
        source: signal.source,
        type: signal.type,
        confidence: signal.confidence,
        description: signal.description,
        mention_frequency: signal.mentionFrequency,
        sentiment: signal.sentiment,
        community_growth_rate: signal.communityGrowthRate,
        reporter_count: signal.reporterCount,
        blacklist_status: signal.blacklistStatus,
        scam_reports: signal.scamReports,
        security_audit_history: signal.securityAuditHistory
      })),
      recommendations: result.recommendations,
      timestamp: result.timestamp,
      transaction_id: result.transactionId
    };
    
    console.log(JSON.stringify(output, null, 2));
    console.log('=====================================\n');
  }
}
