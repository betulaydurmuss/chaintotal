import { ChainTotalAgent } from '../agent';
import { IntentResult, UserIntent } from './intentClassifier';
import { AnalysisRequest } from '../types';

export class IntentHandler {
  private agent: ChainTotalAgent;

  constructor(agent: ChainTotalAgent) {
    this.agent = agent;
  }

  /**
   * Tanınan intent'e göre uygun aksiyonu gerçekleştirir
   */
  async handleIntent(intentResult: IntentResult, userWallet: string): Promise<string> {
    console.log(`\n🎯 Intent İşleniyor: ${intentResult.intent}`);
    console.log(`📊 Güven: ${(intentResult.confidence * 100).toFixed(1)}%\n`);

    switch (intentResult.intent) {
      case UserIntent.QUERY_RISK_SCORE:
        return await this.handleQueryRiskScore(intentResult, userWallet);
      
      case UserIntent.CHECK_PAYMENT_STATUS:
        return this.handleCheckPaymentStatus(intentResult);
      
      case UserIntent.VIEW_HISTORY:
        return this.handleViewHistory(intentResult);
      
      case UserIntent.GET_HELP:
        return this.handleGetHelp(intentResult);
      
      case UserIntent.UNKNOWN:
      default:
        return this.handleUnknown(intentResult);
    }
  }

  /**
   * Risk skoru sorgulama intent'ini işler
   */
  private async handleQueryRiskScore(intentResult: IntentResult, userWallet: string): Promise<string> {
    const { assetType, identifier } = intentResult.parameters;

    if (!assetType || !identifier) {
      return `❌ Varlık tipi veya tanımlayıcı bulunamadı.\n\nÖrnek kullanım:\n- "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb cüzdan adresini analiz et"\n- "BTC token güvenli mi?"\n- "https://example.com sitesi hakkında bilgi ver"`;
    }

    try {
      const request: AnalysisRequest = {
        assetType,
        identifier,
        userWallet
      };

      const result = await this.agent.analyzeAsset(request);

      if (!result.success) {
        return `❌ Analiz başarısız oldu. Lütfen tekrar deneyin.`;
      }

      // Sonucu formatla
      let response = `✅ Analiz Tamamlandı!\n\n`;
      response += `📊 Risk Skoru: ${result.riskScore.score}/100\n`;
      response += `🎯 Risk Seviyesi: ${result.riskScore.level}\n\n`;
      
      response += `📋 Risk Faktörleri:\n`;
      result.riskScore.factors.forEach(factor => {
        response += `   • ${factor.category}: ${factor.score}/100\n`;
        response += `     ${factor.description}\n`;
      });

      response += `\n💳 Transaction ID: ${result.transactionId}\n`;
      response += `⏰ Zaman: ${new Date(result.timestamp).toLocaleString('tr-TR')}`;

      return response;

    } catch (error: any) {
      return `❌ Hata: ${error.message}`;
    }
  }

  /**
   * Ödeme durumu kontrolü intent'ini işler
   */
  private handleCheckPaymentStatus(intentResult: IntentResult): string {
    // Gerçek uygulamada veritabanından son işlem sorgulanır
    return `💳 Ödeme Durumu Kontrolü\n\n` +
           `Bu özellik henüz geliştirilme aşamasında.\n\n` +
           `Şu anda yapabilecekleriniz:\n` +
           `- Yeni bir analiz başlatın\n` +
           `- Stellar hesabınızı kontrol edin\n` +
           `- x402 token bakiyenizi görüntüleyin`;
  }

  /**
   * Geçmiş görüntüleme intent'ini işler
   */
  private handleViewHistory(intentResult: IntentResult): string {
    const limit = intentResult.parameters.limit || 10;
    
    // Gerçek uygulamada veritabanından geçmiş sorgulanır
    return `📜 Analiz Geçmişi\n\n` +
           `Son ${limit} analiz sonucu gösteriliyor...\n\n` +
           `Bu özellik henüz geliştirilme aşamasında.\n\n` +
           `Yakında:\n` +
           `- Tüm geçmiş analizlerinizi görüntüleyin\n` +
           `- Filtreleme ve arama yapın\n` +
           `- Detaylı raporları tekrar inceleyin`;
  }

  /**
   * Yardım talebi intent'ini işler
   */
  private handleGetHelp(intentResult: IntentResult): string {
    return `🤖 ChainTotal Risk Assessment Agent - Yardım\n\n` +
           `═══════════════════════════════════════════\n\n` +
           `📋 Nasıl Kullanılır?\n\n` +
           `1️⃣ Varlık Analizi:\n` +
           `   • "0x1234... cüzdan adresini analiz et"\n` +
           `   • "BTC token güvenli mi?"\n` +
           `   • "https://example.com sitesi hakkında bilgi ver"\n` +
           `   • "Bu NFT koleksiyonu riskli mi?"\n\n` +
           `2️⃣ Ödeme Sistemi:\n` +
           `   • Her analiz için 1 x402 token gereklidir\n` +
           `   • Stellar ağı üzerinden otomatik ödeme\n` +
           `   • Yetersiz bakiyede işlem yapılmaz\n\n` +
           `3️⃣ Risk Skorlama:\n` +
           `   • 0-30: Düşük Risk (Yeşil) ✅\n` +
           `   • 31-60: Orta Risk (Sarı) ⚠️\n` +
           `   • 61-100: Yüksek Risk (Kırmızı) ❌\n\n` +
           `4️⃣ Risk Faktörleri:\n` +
           `   • Topluluk Sinyalleri (30%)\n` +
           `   • Teknik Analiz (40%)\n` +
           `   • Varlık Tipi Analizi (30%)\n\n` +
           `📊 Desteklenen Varlıklar:\n` +
           `   • Cüzdan Adresleri (Ethereum, Stellar)\n` +
           `   • Token'lar (ERC-20, vb.)\n` +
           `   • dApp'ler\n` +
           `   • NFT Koleksiyonları\n` +
           `   • Website'ler\n\n` +
           `💡 İpucu: Doğal dilde yazabilirsiniz!\n` +
           `   "Bu adres güvenli mi?" gibi sorular sorun.`;
  }

  /**
   * Bilinmeyen intent'i işler
   */
  private handleUnknown(intentResult: IntentResult): string {
    return `❓ Üzgünüm, isteğinizi anlayamadım.\n\n` +
           `Şunları deneyebilirsiniz:\n\n` +
           `📊 Risk Analizi:\n` +
           `   • "0x1234... adresini analiz et"\n` +
           `   • "BTC token güvenli mi?"\n\n` +
           `💳 Ödeme Kontrolü:\n` +
           `   • "Ödeme durumu nedir?"\n` +
           `   • "Son işlemim neden başarısız oldu?"\n\n` +
           `📜 Geçmiş:\n` +
           `   • "Son 5 analiz sonucumu göster"\n` +
           `   • "Geçmiş sorgularımı listele"\n\n` +
           `❓ Yardım:\n` +
           `   • "Nasıl kullanılıyor?"\n` +
           `   • "Risk skoru nasıl hesaplanıyor?"\n\n` +
           `Daha fazla bilgi için "yardım" yazın.`;
  }
}
