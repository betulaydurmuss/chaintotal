/**
 * Payment Service Test Script
 * 
 * Stellar x402 micropayment sistemini test eder
 */

import { PaymentService } from './src/stellar/paymentService';
import { checkX402Balance, generatePaymentExample } from './src/stellar/paymentUtils';
import { config, validateConfig } from './src/config';

async function testPaymentService() {
  console.log('🧪 Payment Service Test Başlatılıyor...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Konfigürasyon kontrolü
  if (!validateConfig()) {
    console.error('❌ Konfigürasyon hatası! Lütfen .env dosyasını kontrol edin.\n');
    process.exit(1);
  }

  const paymentService = new PaymentService();
  const serviceInfo = paymentService.getServiceWalletInfo();

  console.log('🔐 ChainTotal Service Wallet Bilgileri:');
  console.log(`   Public Key: ${serviceInfo.publicKey}`);
  console.log(`   Network: Stellar ${serviceInfo.network}`);
  console.log('');

  // Test senaryoları
  const testCases = [
    {
      name: 'Test 1: Geçersiz Public Key',
      userWallet: 'INVALID_KEY',
      expectedSuccess: false
    },
    {
      name: 'Test 2: Geçerli Public Key (Bakiye Kontrolü)',
      userWallet: 'GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ',
      expectedSuccess: false // Hesap bulunamayacak
    },
    {
      name: 'Test 3: Transaction Hash Doğrulama',
      userWallet: 'GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ',
      transactionHash: 'invalid_hash_12345',
      expectedSuccess: false
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 ${testCase.name}`);
    console.log('─────────────────────────────────────────────────────────');

    try {
      const paymentRequest = {
        userWallet: testCase.userWallet,
        transactionHash: (testCase as any).transactionHash
      };

      const result = await paymentService.requestPayment(paymentRequest);

      if (result.success === testCase.expectedSuccess) {
        console.log('✅ Test BAŞARILI');
      } else {
        console.log('❌ Test BAŞARISIZ');
      }

      console.log(`   Sonuç: ${result.success ? 'Başarılı' : 'Başarısız'}`);
      if (result.error) {
        console.log(`   Hata: ${result.error}`);
      }
      if (result.paymentRequired) {
        console.log('   Ödeme Gerekli: Evet');
      }
      if (result.retryAvailable) {
        console.log('   Retry Mevcut: Evet');
      }

    } catch (error: any) {
      console.log('❌ Test HATA');
      console.log(`   Hata: ${error.message}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('\n📊 Test İstatistikleri:');
  console.log(`   İşlenmiş Transaction Sayısı: ${paymentService.getProcessedTransactionCount()}`);
  console.log('');

  // Örnek kod göster
  console.log('💡 Ödeme Yapma Örneği:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(generatePaymentExample());
  console.log('═══════════════════════════════════════════════════════════\n');

  // Kullanıcı bakiye kontrolü örneği
  if (process.argv.includes('--check-balance')) {
    const publicKey = process.argv[process.argv.indexOf('--check-balance') + 1];
    
    if (publicKey) {
      console.log(`\n💰 Bakiye Kontrolü: ${publicKey}`);
      console.log('─────────────────────────────────────────────────────────');
      
      const balanceInfo = await checkX402Balance(publicKey);
      
      console.log(`   x402 Bakiye: ${balanceInfo.balance}`);
      console.log(`   Trustline: ${balanceInfo.hasTrustline ? 'Var' : 'Yok'}`);
      console.log('');
    }
  }
}

// Test çalıştır
if (require.main === module) {
  testPaymentService().catch(console.error);
}

export { testPaymentService };
