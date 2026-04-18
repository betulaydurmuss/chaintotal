/**
 * Error Handler
 * 
 * Tüm hata senaryolarını yönetir ve kullanıcı dostu mesajlar döndürür
 */

export enum ErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  PAYMENT_TIMEOUT = 'PAYMENT_TIMEOUT',
  ASSET_NOT_FOUND = 'ASSET_NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DOUBLE_SPEND = 'DOUBLE_SPEND',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  INVALID_TRANSACTION = 'INVALID_TRANSACTION',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ErrorResponse {
  success: false;
  errorCode: ErrorCode;
  message: string;
  userMessage: string;
  retryAvailable: boolean;
  fallbackAction?: {
    type: 'faucet' | 'retry' | 'wait' | 'correct_input';
    description: string;
    link?: string;
  };
  timestamp: string;
}

export class ErrorHandler {
  
  /**
   * Senaryo 1: Yetersiz Bakiye
   */
  static insufficientBalance(currentBalance: number, requiredAmount: number): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.INSUFFICIENT_BALANCE,
      message: `Insufficient balance: ${currentBalance} x402, required: ${requiredAmount} x402`,
      userMessage: `❌ Yetersiz bakiye. Hesabınıza ${requiredAmount} x402 token yükleyin ve tekrar deneyin.\n\n` +
                   `💰 Mevcut Bakiye: ${currentBalance} x402\n` +
                   `📊 Gerekli Miktar: ${requiredAmount} x402\n` +
                   `📉 Eksik: ${requiredAmount - currentBalance} x402`,
      retryAvailable: false,
      fallbackAction: {
        type: 'faucet',
        description: 'x402 token almak için faucet kullanın',
        link: 'https://faucet.chaintotal.io' // Örnek link
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Senaryo 2: Ödeme Timeout
   */
  static paymentTimeout(elapsedTime: number): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.PAYMENT_TIMEOUT,
      message: `Payment timeout after ${elapsedTime}ms`,
      userMessage: `⏱️ Ödeme işlemi timeout (${Math.round(elapsedTime / 1000)}s).\n\n` +
                   `Lütfen bağlantınızı kontrol edin ve tekrar deneyin.\n\n` +
                   `💡 İpuçları:\n` +
                   `   • İnternet bağlantınızı kontrol edin\n` +
                   `   • Stellar ağı durumunu kontrol edin\n` +
                   `   • Birkaç saniye bekleyip tekrar deneyin`,
      retryAvailable: true,
      fallbackAction: {
        type: 'retry',
        description: 'Retry butonuna tıklayarak tekrar deneyin'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Senaryo 3: Varlık Bulunamadı (İlk Kez Sorgulanan)
   */
  static assetNotFound(assetType: string, identifier: string): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.ASSET_NOT_FOUND,
      message: `Asset not found: ${assetType} - ${identifier}`,
      userMessage: `🔄 Bu varlık ilk kez sorgulanıyor. Veri toplanıyor...\n\n` +
                   `⏳ Tahmini Süre: 2-5 dakika\n\n` +
                   `📊 İşlemler:\n` +
                   `   ✓ Blockchain verisi toplanıyor\n` +
                   `   ✓ Topluluk sinyalleri analiz ediliyor\n` +
                   `   ✓ Risk skoru hesaplanıyor\n\n` +
                   `💡 Lütfen bekleyin, sonuç hazır olduğunda bildirim alacaksınız.`,
      retryAvailable: false,
      fallbackAction: {
        type: 'wait',
        description: 'Veri toplama işlemi devam ediyor, lütfen bekleyin'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Senaryo 4: Geçersiz Giriş
   */
  static invalidInput(inputType: string, providedValue: string, expectedFormat: string): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.INVALID_INPUT,
      message: `Invalid input: ${inputType} - ${providedValue}`,
      userMessage: `⚠️ Geçersiz giriş formatı.\n\n` +
                   `❌ Girilen: ${providedValue}\n` +
                   `✅ Beklenen: ${expectedFormat}\n\n` +
                   `📝 Geçerli Format Örnekleri:\n` +
                   this.getFormatExamples(inputType),
      retryAvailable: false,
      fallbackAction: {
        type: 'correct_input',
        description: 'Lütfen geçerli bir format girin'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Network Error
   */
  static networkError(details: string): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.NETWORK_ERROR,
      message: `Network error: ${details}`,
      userMessage: `🌐 Ağ bağlantı hatası.\n\n` +
                   `${details}\n\n` +
                   `💡 Lütfen:\n` +
                   `   • İnternet bağlantınızı kontrol edin\n` +
                   `   • VPN kullanıyorsanız kapatmayı deneyin\n` +
                   `   • Birkaç dakika sonra tekrar deneyin`,
      retryAvailable: true,
      fallbackAction: {
        type: 'retry',
        description: 'Bağlantı sorununu çözdükten sonra tekrar deneyin'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Double Spend Error
   */
  static doubleSpend(transactionHash: string): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.DOUBLE_SPEND,
      message: `Double spend detected: ${transactionHash}`,
      userMessage: `🚫 Bu transaction daha önce kullanılmış.\n\n` +
                   `Transaction Hash: ${transactionHash}\n\n` +
                   `⚠️ Güvenlik nedeniyle aynı transaction tekrar kullanamaz.\n` +
                   `Lütfen yeni bir ödeme yapın.`,
      retryAvailable: false,
      fallbackAction: {
        type: 'retry',
        description: 'Yeni bir ödeme yapın'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Transaction Failed
   */
  static transactionFailed(reason: string): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.TRANSACTION_FAILED,
      message: `Transaction failed: ${reason}`,
      userMessage: `❌ Transaction başarısız oldu.\n\n` +
                   `Sebep: ${reason}\n\n` +
                   `💡 Olası Çözümler:\n` +
                   `   • Bakiyenizi kontrol edin\n` +
                   `   • Transaction fee'nizi kontrol edin\n` +
                   `   • Trustline eklenmiş mi kontrol edin`,
      retryAvailable: true,
      fallbackAction: {
        type: 'retry',
        description: 'Sorunu çözdükten sonra tekrar deneyin'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Invalid Transaction
   */
  static invalidTransaction(transactionHash: string, reason: string): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.INVALID_TRANSACTION,
      message: `Invalid transaction: ${transactionHash} - ${reason}`,
      userMessage: `⚠️ Geçersiz transaction.\n\n` +
                   `Transaction Hash: ${transactionHash}\n` +
                   `Sebep: ${reason}\n\n` +
                   `Lütfen doğru transaction hash'i girin.`,
      retryAvailable: true,
      fallbackAction: {
        type: 'correct_input',
        description: 'Geçerli bir transaction hash girin'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Unknown Error
   */
  static unknownError(error: Error): ErrorResponse {
    return {
      success: false,
      errorCode: ErrorCode.UNKNOWN_ERROR,
      message: error.message,
      userMessage: `❌ Beklenmeyen bir hata oluştu.\n\n` +
                   `Hata: ${error.message}\n\n` +
                   `💡 Lütfen:\n` +
                   `   • Tekrar deneyin\n` +
                   `   • Sorun devam ederse destek ekibiyle iletişime geçin`,
      retryAvailable: true,
      fallbackAction: {
        type: 'retry',
        description: 'Tekrar deneyin veya destek alın'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format örnekleri döndür
   */
  private static getFormatExamples(inputType: string): string {
    const examples: Record<string, string> = {
      'ethereum_address': '   • Ethereum: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\n   • 0x ile başlamalı ve 42 karakter olmalı',
      'stellar_address': '   • Stellar: GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ\n   • G ile başlamalı ve 56 karakter olmalı',
      'token_symbol': '   • Token: BTC, ETH, USDT\n   • 2-10 büyük harf',
      'url': '   • Website: https://example.com\n   • http:// veya https:// ile başlamalı',
      'transaction_hash': '   • Transaction: 64 karakterli hexadecimal string\n   • Stellar Horizon\'dan alınmalı'
    };

    return examples[inputType] || '   • Lütfen geçerli bir format kullanın';
  }

  /**
   * Başarılı işlem mesajı
   */
  static successMessage(transactionHash: string): string {
    return `✅ Ödeme onaylandı! Risk analizi başladı.\n\n` +
           `📝 Transaction Hash: ${transactionHash}\n` +
           `⏳ Analiz süresi: ~30 saniye\n\n` +
           `Lütfen bekleyin...`;
  }

  /**
   * Hata mesajını formatla (CLI için)
   */
  static formatErrorForCLI(error: ErrorResponse): string {
    let output = `\n${'═'.repeat(60)}\n`;
    output += `❌ HATA\n`;
    output += `${'═'.repeat(60)}\n\n`;
    output += error.userMessage;
    
    if (error.fallbackAction) {
      output += `\n\n${'─'.repeat(60)}\n`;
      output += `💡 Önerilen Aksiyon:\n`;
      output += `   ${error.fallbackAction.description}\n`;
      
      if (error.fallbackAction.link) {
        output += `   🔗 Link: ${error.fallbackAction.link}\n`;
      }
    }
    
    if (error.retryAvailable) {
      output += `\n${'─'.repeat(60)}\n`;
      output += `🔄 Retry mevcut: "retry" yazarak tekrar deneyebilirsiniz\n`;
    }
    
    output += `\n${'═'.repeat(60)}\n`;
    
    return output;
  }

  /**
   * Hata mesajını formatla (JSON için)
   */
  static formatErrorForJSON(error: ErrorResponse): string {
    return JSON.stringify(error, null, 2);
  }
}
