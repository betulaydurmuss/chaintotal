import { AssetType } from '../types';

export enum UserIntent {
  QUERY_RISK_SCORE = 'QUERY_RISK_SCORE',
  CHECK_PAYMENT_STATUS = 'CHECK_PAYMENT_STATUS',
  VIEW_HISTORY = 'VIEW_HISTORY',
  GET_HELP = 'GET_HELP',
  UNKNOWN = 'UNKNOWN'
}

export interface IntentResult {
  intent: UserIntent;
  confidence: number;
  parameters: IntentParameters;
  rawInput: string;
}

export interface IntentParameters {
  assetType?: AssetType;
  identifier?: string;
  limit?: number;
  query?: string;
}

export class IntentClassifier {
  
  /**
   * Kullanıcı girdisini analiz eder ve intent'i tanır
   */
  classify(userInput: string): IntentResult {
    const normalizedInput = userInput.toLowerCase().trim();
    
    // Intent pattern'lerini kontrol et
    const intents = [
      this.checkQueryRiskScore(normalizedInput),
      this.checkPaymentStatus(normalizedInput),
      this.checkViewHistory(normalizedInput),
      this.checkGetHelp(normalizedInput)
    ];

    // En yüksek confidence'a sahip intent'i seç
    const bestMatch = intents.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    // Eğer confidence çok düşükse UNKNOWN olarak işaretle
    if (bestMatch.confidence < 0.3) {
      return {
        intent: UserIntent.UNKNOWN,
        confidence: 0,
        parameters: {},
        rawInput: userInput
      };
    }

    return {
      ...bestMatch,
      rawInput: userInput
    };
  }

  /**
   * QUERY_RISK_SCORE intent'ini kontrol eder
   */
  private checkQueryRiskScore(input: string): IntentResult {
    const patterns = [
      // Cüzdan adresi sorguları
      /(?:cüzdan|wallet|adres).*?(0x[a-fA-F0-9]{40}|[A-Z0-9]{56})/i,
      /(0x[a-fA-F0-9]{40}|[A-Z0-9]{56}).*?(?:hakkında|bilgi|analiz|risk)/i,
      
      // Token sorguları
      /(?:token|coin).*?(?:güvenli|risk|analiz|hakkında)/i,
      /([A-Z]{2,10}).*?(?:token|coin).*?(?:güvenli|risk)/i,
      
      // NFT sorguları
      /(?:nft|koleksiyon).*?(?:güvenli|risk|analiz|hakkında)/i,
      
      // dApp sorguları
      /(?:dapp|uygulama|platform).*?(?:güvenli|risk|analiz)/i,
      
      // Website sorguları
      /(?:site|website|domain).*?(?:güvenli|risk|analiz)/i,
      /(https?:\/\/[^\s]+).*?(?:güvenli|risk|analiz)/i,
      
      // Genel sorgular
      /(?:analiz|kontrol|incele|sorgula|risk|rapor).*?(?:et|yap|ver)/i,
      /(?:bu|şu).*?(?:güvenli mi|riskli mi|nasıl)/i
    ];

    let confidence = 0;
    const parameters: IntentParameters = {};

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        confidence = Math.max(confidence, 0.8);
        
        // Varlık tipini ve identifier'ı çıkar
        this.extractAssetInfo(input, match, parameters);
        break;
      }
    }

    return {
      intent: UserIntent.QUERY_RISK_SCORE,
      confidence,
      parameters,
      rawInput: input
    };
  }

  /**
   * CHECK_PAYMENT_STATUS intent'ini kontrol eder
   */
  private checkPaymentStatus(input: string): IntentResult {
    const patterns = [
      /(?:ödeme|payment).*?(?:durum|status|kontrol)/i,
      /(?:son|önceki).*?(?:işlem|transaction).*?(?:neden|niye|başarısız)/i,
      /(?:ödeme|işlem).*?(?:başarısız|failed|hata|error)/i,
      /(?:bakiye|balance).*?(?:yetersiz|yok|eksik)/i,
      /(?:para|token).*?(?:gitti mi|kesildi mi|ödendi mi)/i
    ];

    let confidence = 0;

    for (const pattern of patterns) {
      if (pattern.test(input)) {
        confidence = 0.9;
        break;
      }
    }

    return {
      intent: UserIntent.CHECK_PAYMENT_STATUS,
      confidence,
      parameters: {},
      rawInput: input
    };
  }

  /**
   * VIEW_HISTORY intent'ini kontrol eder
   */
  private checkViewHistory(input: string): IntentResult {
    const patterns = [
      /(?:geçmiş|history|önceki).*?(?:sorgular|analizler|işlemler)/i,
      /(?:daha önce|geçmişte).*?(?:sorgu|analiz|kontrol)/i,
      /(?:son|last)\s+(\d+).*?(?:analiz|sorgu|işlem)/i,
      /(?:hangi|ne).*?(?:sorguladım|analiz ettim|kontrol ettim)/i,
      /(?:liste|listele|göster).*?(?:geçmiş|history)/i
    ];

    let confidence = 0;
    const parameters: IntentParameters = {};

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        confidence = 0.85;
        
        // Limit parametresini çıkar
        if (match[1]) {
          parameters.limit = parseInt(match[1]);
        }
        break;
      }
    }

    return {
      intent: UserIntent.VIEW_HISTORY,
      confidence,
      parameters,
      rawInput: input
    };
  }

  /**
   * GET_HELP intent'ini kontrol eder
   */
  private checkGetHelp(input: string): IntentResult {
    const patterns = [
      /(?:nasıl|how).*?(?:kullan|use|çalış|work)/i,
      /(?:yardım|help|destek|support)/i,
      /(?:risk.*?skor|score).*?(?:nasıl|how).*?(?:hesap|calculate)/i,
      /(?:nedir|ne|what).*?(?:risk|skor|score)/i,
      /(?:açıkla|explain|anlat)/i,
      /(?:öğren|learn|bilgi|info|information)/i,
      /(?:başla|start|başlangıç|getting started)/i
    ];

    let confidence = 0;

    for (const pattern of patterns) {
      if (pattern.test(input)) {
        confidence = 0.9;
        break;
      }
    }

    return {
      intent: UserIntent.GET_HELP,
      confidence,
      parameters: {},
      rawInput: input
    };
  }

  /**
   * Kullanıcı girdisinden varlık tipini ve identifier'ı çıkarır
   */
  private extractAssetInfo(input: string, match: RegExpMatchArray, parameters: IntentParameters): void {
    // Ethereum cüzdan adresi
    if (/0x[a-fA-F0-9]{40}/.test(input)) {
      parameters.assetType = AssetType.WALLET;
      const addressMatch = input.match(/0x[a-fA-F0-9]{40}/);
      if (addressMatch) {
        parameters.identifier = addressMatch[0];
      }
      return;
    }

    // Stellar cüzdan adresi
    if (/G[A-Z0-9]{55}/.test(input)) {
      parameters.assetType = AssetType.WALLET;
      const addressMatch = input.match(/G[A-Z0-9]{55}/);
      if (addressMatch) {
        parameters.identifier = addressMatch[0];
      }
      return;
    }

    // URL/Website
    if (/https?:\/\/[^\s]+/.test(input)) {
      parameters.assetType = AssetType.WEBSITE;
      const urlMatch = input.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        parameters.identifier = urlMatch[0];
      }
      return;
    }

    // Token (büyük harfli kısaltma)
    if (/\b[A-Z]{2,10}\b/.test(input) && /token|coin/.test(input)) {
      parameters.assetType = AssetType.TOKEN;
      const tokenMatch = input.match(/\b[A-Z]{2,10}\b/);
      if (tokenMatch) {
        parameters.identifier = tokenMatch[0];
      }
      return;
    }

    // NFT
    if (/nft|koleksiyon/.test(input)) {
      parameters.assetType = AssetType.NFT;
      // NFT identifier'ı için daha fazla parsing gerekebilir
      return;
    }

    // dApp
    if (/dapp|uygulama/.test(input)) {
      parameters.assetType = AssetType.DAPP;
      return;
    }

    // Varsayılan: Genel sorgu
    parameters.query = input;
  }

  /**
   * Intent sonucunu insan okunabilir formatta döndürür
   */
  formatIntentResult(result: IntentResult): string {
    const intentNames = {
      [UserIntent.QUERY_RISK_SCORE]: 'Risk Skoru Sorgulama',
      [UserIntent.CHECK_PAYMENT_STATUS]: 'Ödeme Durumu Kontrolü',
      [UserIntent.VIEW_HISTORY]: 'Geçmiş Görüntüleme',
      [UserIntent.GET_HELP]: 'Yardım Talebi',
      [UserIntent.UNKNOWN]: 'Bilinmeyen'
    };

    let output = `🎯 Tanınan Intent: ${intentNames[result.intent]}\n`;
    output += `📊 Güven Skoru: ${(result.confidence * 100).toFixed(1)}%\n`;
    
    if (Object.keys(result.parameters).length > 0) {
      output += `📋 Parametreler:\n`;
      
      if (result.parameters.assetType) {
        output += `   - Varlık Tipi: ${result.parameters.assetType}\n`;
      }
      if (result.parameters.identifier) {
        output += `   - Tanımlayıcı: ${result.parameters.identifier}\n`;
      }
      if (result.parameters.limit) {
        output += `   - Limit: ${result.parameters.limit}\n`;
      }
      if (result.parameters.query) {
        output += `   - Sorgu: ${result.parameters.query}\n`;
      }
    }

    return output;
  }
}
