import { ChainTotalAgent } from './agent';
import { AssetType, AnalysisRequest } from './types';
import { validateConfig } from './config';
import { startCLI } from './cli';

async function runExample() {
  console.log('🚀 ChainTotal Risk Assessment Agent - Örnek Çalıştırma\n');

  // Konfigürasyon kontrolü
  if (!validateConfig()) {
    console.error('❌ Konfigürasyon hatası! Lütfen .env dosyasını kontrol edin.');
    process.exit(1);
  }

  // Agent oluştur
  const agent = new ChainTotalAgent();

  // Örnek analiz talebi
  const exampleRequest: AnalysisRequest = {
    assetType: AssetType.WALLET,
    identifier: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    userWallet: 'GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ'
  };

  console.log('📝 Örnek Analiz Başlatılıyor...\n');
  
  try {
    const result = await agent.analyzeAsset(exampleRequest);
    
    if (result.success) {
      console.log('✅ Analiz başarıyla tamamlandı!');
    } else {
      console.log('⚠️ Analiz tamamlanamadı.');
    }
  } catch (error: any) {
    console.error('❌ Hata:', error.message);
  }
}

async function main() {
  // Komut satırı argümanlarını kontrol et
  const args = process.argv.slice(2);
  
  if (args.includes('--cli') || args.includes('-c')) {
    // CLI modunda çalıştır
    await startCLI();
  } else if (args.includes('--help') || args.includes('-h')) {
    // Yardım mesajı
    console.log('ChainTotal Risk Assessment Agent\n');
    console.log('Kullanım:');
    console.log('  npm start              - Örnek analiz çalıştır');
    console.log('  npm start -- --cli     - İnteraktif CLI modu');
    console.log('  npm start -- --help    - Bu yardım mesajını göster\n');
    console.log('Çevre Değişkenleri:');
    console.log('  DEBUG=true             - Debug bilgilerini göster\n');
  } else {
    // Varsayılan: Örnek çalıştır
    await runExample();
  }
}

// CLI argümanları ile çalıştırma
if (require.main === module) {
  main().catch(console.error);
}

export { ChainTotalAgent };
export { IntentClassifier, UserIntent } from './nlp/intentClassifier';
export { IntentHandler } from './nlp/intentHandler';
