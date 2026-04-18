import * as StellarSdk from 'stellar-sdk';
import { config } from '../config';
import { PaymentResult, PaymentRequest, PaymentVerification } from '../types';
import { ErrorHandler } from '../errors/errorHandler';

/**
 * Stellar x402 Micropayment Service
 * 
 * Ödeme Akışı:
 * 1. Kullanıcı sorgu başlat → Risk Score talebini al
 * 2. Ödeme İnisiyasyonu (requestPayment)
 * 3. Ödeme Doğrulama (verifyPayment)
 * 4. Transaction Log (logTransaction)
 */
export class PaymentService {
  private server: StellarSdk.Horizon.Server;
  private agentKeypair: StellarSdk.Keypair;
  private processedTransactions: Set<string>; // Double-spend kontrolü için
  private readonly PAYMENT_TIMEOUT = 30000; // 30 saniye

  constructor() {
    // Network seçimi (testnet veya public)
    if (config.stellar.network === 'public') {
      this.server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
      StellarSdk.Networks.PUBLIC;
    } else {
      this.server = new StellarSdk.Horizon.Server(config.stellar.horizonUrl);
      StellarSdk.Networks.TESTNET;
    }

    // Demo mode - create a random keypair if no valid secret key provided
    try {
      this.agentKeypair = StellarSdk.Keypair.fromSecret(config.stellar.agentSecretKey);
      console.log(`🔐 ChainTotal Service Wallet: ${this.agentKeypair.publicKey()}`);
    } catch (error) {
      console.warn('⚠️  Invalid AGENT_SECRET_KEY in .env, using demo mode with random keypair');
      this.agentKeypair = StellarSdk.Keypair.random();
      console.log(`🔐 ChainTotal Demo Wallet: ${this.agentKeypair.publicKey()}`);
      console.log(`🔑 Demo Secret: ${this.agentKeypair.secret()}`);
    }
    
    this.processedTransactions = new Set<string>();
  }

  /**
   * Ödeme İnisiyasyonu
   * 
   * Kullanıcıdan 1 x402 token ödeme talep eder
   */
  async requestPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    const startTime = Date.now();
    
    try {
      console.log('\n💳 Ödeme İnisiyasyonu Başlatıldı');
      console.log('═══════════════════════════════════════');
      console.log(`📤 From: ${paymentRequest.userWallet}`);
      console.log(`📥 To: ${this.agentKeypair.publicKey()}`);
      console.log(`💰 Amount: ${config.x402.paymentAmount} ${config.x402.tokenCode}`);
      console.log(`🌐 Network: Stellar ${config.stellar.network}`);
      console.log(`⏱️  Timeout: ${this.PAYMENT_TIMEOUT / 1000}s`);
      console.log('═══════════════════════════════════════\n');

      // 1. User wallet public key doğrulama
      if (!this.validatePublicKey(paymentRequest.userWallet)) {
        const error = ErrorHandler.invalidInput(
          'stellar_address',
          paymentRequest.userWallet,
          'G ile başlayan 56 karakterli Stellar adresi'
        );
        return this.convertErrorToPaymentResult(error);
      }

      // 2. Kullanıcı hesabını yükle
      console.log('🔍 Kullanıcı hesabı kontrol ediliyor...');
      const userAccount = await this.loadAccountWithTimeout(paymentRequest.userWallet);
      
      if (!userAccount) {
        const elapsed = Date.now() - startTime;
        if (elapsed >= this.PAYMENT_TIMEOUT) {
          const error = ErrorHandler.paymentTimeout(elapsed);
          return this.convertErrorToPaymentResult(error);
        }
        
        const error = ErrorHandler.networkError('Kullanıcı hesabı bulunamadı veya aktif değil');
        return this.convertErrorToPaymentResult(error);
      }

      // 3. x402 token asset tanımla
      const x402Asset = new StellarSdk.Asset(
        config.x402.tokenCode,
        config.x402.tokenIssuer
      );

      // 4. Kullanıcının x402 bakiyesini kontrol et
      console.log('💵 Bakiye kontrol ediliyor...');
      const balance = this.getAssetBalance(userAccount, x402Asset);
      
      if (balance < config.x402.paymentAmount) {
        console.log(`❌ Yetersiz bakiye: ${balance} ${config.x402.tokenCode}`);
        const error = ErrorHandler.insufficientBalance(balance, config.x402.paymentAmount);
        return this.convertErrorToPaymentResult(error);
      }

      console.log(`✅ Bakiye yeterli: ${balance} ${config.x402.tokenCode}\n`);

      // 5. Ödeme transaction'ı oluştur
      // Not: Gerçek uygulamada, kullanıcı kendi wallet'ından bu transaction'ı imzalar
      // Bu implementasyonda, transaction hash simüle edilir veya kullanıcıdan alınır
      
      if (paymentRequest.transactionHash) {
        // Kullanıcı zaten ödeme yapmış, transaction hash'i doğrula
        console.log('🔍 Mevcut transaction doğrulanıyor...');
        const verification = await this.verifyPayment(paymentRequest.transactionHash);
        
        if (verification.verified) {
          console.log(ErrorHandler.successMessage(paymentRequest.transactionHash));
          return {
            success: true,
            transactionId: paymentRequest.transactionHash,
            timestamp: new Date().toISOString(),
            paymentToken: this.generatePaymentToken(paymentRequest.transactionHash)
          };
        } else {
          console.log('❌ Payment Failed\n');
          
          // Hata tipine göre uygun mesaj
          if (verification.error?.includes('Double-spend')) {
            const error = ErrorHandler.doubleSpend(paymentRequest.transactionHash);
            return this.convertErrorToPaymentResult(error);
          } else if (verification.error?.includes('bulunamadı')) {
            const error = ErrorHandler.invalidTransaction(
              paymentRequest.transactionHash,
              verification.error
            );
            return this.convertErrorToPaymentResult(error);
          } else {
            const error = ErrorHandler.transactionFailed(verification.error || 'Bilinmeyen hata');
            return this.convertErrorToPaymentResult(error);
          }
        }
      } else {
        // Yeni ödeme talebi - kullanıcıya payment request bilgisi döndür
        console.log('📋 Ödeme talebi oluşturuldu');
        console.log('⏳ Kullanıcının ödeme yapması bekleniyor...\n');
        
        return {
          success: false,
          error: 'Ödeme bekleniyor',
          timestamp: new Date().toISOString(),
          paymentRequired: true,
          paymentDetails: {
            destination: this.agentKeypair.publicKey(),
            amount: config.x402.paymentAmount.toString(),
            assetCode: config.x402.tokenCode,
            assetIssuer: config.x402.tokenIssuer,
            memo: `ChainTotal-${Date.now()}`,
            timeout: this.PAYMENT_TIMEOUT
          }
        };
      }

    } catch (error: any) {
      const elapsed = Date.now() - startTime;
      console.error('❌ Ödeme hatası:', error.message);
      
      if (elapsed >= this.PAYMENT_TIMEOUT) {
        const errorResponse = ErrorHandler.paymentTimeout(elapsed);
        return this.convertErrorToPaymentResult(errorResponse);
      }
      
      const errorResponse = ErrorHandler.unknownError(error);
      return this.convertErrorToPaymentResult(errorResponse);
    }
  }

  /**
   * ErrorResponse'u PaymentResult'a dönüştür
   */
  private convertErrorToPaymentResult(error: any): PaymentResult {
    return {
      success: false,
      error: error.userMessage,
      timestamp: error.timestamp,
      retryAvailable: error.retryAvailable,
      errorCode: error.errorCode,
      fallbackAction: error.fallbackAction
    };
  }

  /**
   * Ödeme Doğrulama
   * 
   * Transaction Hash ile ledger'da kayıt olup olmadığını kontrol eder
   */
  async verifyPayment(transactionHash: string): Promise<PaymentVerification> {
    try {
      console.log(`🔍 Transaction doğrulanıyor: ${transactionHash}`);

      // 1. Double-spend kontrolü
      if (this.processedTransactions.has(transactionHash)) {
        console.log('⚠️  Double-spend tespit edildi!');
        return {
          verified: false,
          error: 'Bu transaction daha önce işlenmiş (Double-spend koruması)',
          transactionHash
        };
      }

      // 2. Transaction'ı Stellar ledger'dan çek
      const transaction = await this.server.transactions()
        .transaction(transactionHash)
        .call();

      // 3. Transaction detaylarını kontrol et
      const operations = await this.server.operations()
        .forTransaction(transactionHash)
        .call();

      // 4. Payment operation'ı bul
      const paymentOp = operations.records.find((op: any) => 
        op.type === 'payment' &&
        op.to === this.agentKeypair.publicKey() &&
        op.asset_code === config.x402.tokenCode &&
        op.asset_issuer === config.x402.tokenIssuer &&
        parseFloat(op.amount) >= config.x402.paymentAmount
      );

      if (!paymentOp) {
        console.log('❌ Geçerli payment operation bulunamadı');
        return {
          verified: false,
          error: 'Transaction geçerli bir x402 ödemesi içermiyor',
          transactionHash
        };
      }

      // 5. Transaction başarılı mı kontrol et
      if (!transaction.successful) {
        console.log('❌ Transaction başarısız');
        return {
          verified: false,
          error: 'Transaction başarısız olarak işaretlenmiş',
          transactionHash
        };
      }

      // 6. Transaction'ı işlenmiş olarak işaretle
      this.processedTransactions.add(transactionHash);
      this.logTransaction(transactionHash, paymentOp);

      console.log('✅ Payment Confirmed');
      console.log(`   From: ${(paymentOp as any).from}`);
      console.log(`   Amount: ${(paymentOp as any).amount} ${config.x402.tokenCode}`);
      console.log(`   Ledger: ${transaction.ledger}`);

      return {
        verified: true,
        transactionHash,
        amount: parseFloat((paymentOp as any).amount),
        from: (paymentOp as any).from,
        ledger: typeof transaction.ledger === 'function' ? 0 : transaction.ledger,
        timestamp: transaction.created_at
      };

    } catch (error: any) {
      console.error('❌ Doğrulama hatası:', error.message);
      
      // Transaction bulunamadı hatası
      if (error.response && error.response.status === 404) {
        return {
          verified: false,
          error: 'Transaction bulunamadı. Henüz ledger\'a yazılmamış olabilir.',
          transactionHash
        };
      }

      return {
        verified: false,
        error: error.message,
        transactionHash
      };
    }
  }

  /**
   * User wallet public key doğrulama
   */
  private validatePublicKey(publicKey: string): boolean {
    try {
      StellarSdk.Keypair.fromPublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Timeout ile hesap yükleme
   */
  private async loadAccountWithTimeout(publicKey: string): Promise<any | null> {
    try {
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), this.PAYMENT_TIMEOUT)
      );

      const accountPromise = this.server.loadAccount(publicKey);

      const account = await Promise.race([accountPromise, timeoutPromise]);
      return account as any;
    } catch (error: any) {
      if (error.message === 'Timeout') {
        console.log('⏱️  Hesap yükleme zaman aşımına uğradı');
      }
      return null;
    }
  }

  /**
   * Asset bakiyesi sorgulama
   */
  private getAssetBalance(account: any, asset: StellarSdk.Asset): number {
    const balance = account.balances.find((b: any) => {
      if (b.asset_type === 'native') return false;
      return (b as any).asset_code === asset.code && (b as any).asset_issuer === asset.issuer;
    });

    return balance ? parseFloat(balance.balance) : 0;
  }

  /**
   * Transaction log'lama
   */
  private logTransaction(transactionHash: string, operation: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      transactionHash,
      from: operation.from,
      to: operation.to,
      amount: operation.amount,
      asset: `${operation.asset_code}:${operation.asset_issuer}`,
      ledger: operation.transaction_attr?.ledger
    };

    console.log('\n📝 Transaction Log:');
    console.log(JSON.stringify(logEntry, null, 2));
    
    // Gerçek uygulamada veritabanına kaydedilir
    // await db.transactions.insert(logEntry);
  }

  /**
   * Payment token oluşturma (HTTP Authorization için)
   */
  private generatePaymentToken(transactionHash: string): string {
    // Gerçek uygulamada JWT veya benzeri bir token oluşturulur
    const token = Buffer.from(`${transactionHash}:${Date.now()}`).toString('base64');
    return token;
  }

  /**
   * HTTP Headers oluşturma
   */
  getPaymentHeaders(paymentToken: string): Record<string, string> {
    return {
      'Authorization': `Bearer ${paymentToken}`,
      'X-Payment-Asset': config.x402.tokenCode,
      'X-Payment-Amount': config.x402.paymentAmount.toString(),
      'X-Payment-Network': config.stellar.network
    };
  }

  /**
   * İşlenmiş transaction sayısı
   */
  getProcessedTransactionCount(): number {
    return this.processedTransactions.size;
  }

  /**
   * Transaction işlenmiş mi kontrol et
   */
  isTransactionProcessed(transactionHash: string): boolean {
    return this.processedTransactions.has(transactionHash);
  }

  /**
   * Service wallet bilgisi
   */
  getServiceWalletInfo(): { publicKey: string; network: string } {
    return {
      publicKey: this.agentKeypair.publicKey(),
      network: config.stellar.network
    };
  }
}
