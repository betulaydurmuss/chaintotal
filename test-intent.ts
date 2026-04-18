/**
 * Intent Classifier Test Script
 * 
 * Bu script, IntentClassifier'ın çeşitli kullanıcı girdileriyle
 * nasıl çalıştığını test eder.
 */

import { IntentClassifier, UserIntent } from './src/nlp/intentClassifier';

const classifier = new IntentClassifier();

// Test senaryoları
const testCases = [
  // QUERY_RISK_SCORE testleri
  {
    input: 'Bu cüzdan adresi 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb hakkında bilgi ver',
    expectedIntent: UserIntent.QUERY_RISK_SCORE
  },
  {
    input: 'BTC token güvenli mi?',
    expectedIntent: UserIntent.QUERY_RISK_SCORE
  },
  {
    input: 'Bu NFT koleksiyonu hakkında risk raporu yap',
    expectedIntent: UserIntent.QUERY_RISK_SCORE
  },
  {
    input: '0x1234567890123456789012345678901234567890 adresini analiz et',
    expectedIntent: UserIntent.QUERY_RISK_SCORE
  },
  {
    input: 'https://example.com sitesi güvenli mi?',
    expectedIntent: UserIntent.QUERY_RISK_SCORE
  },
  {
    input: 'ETH token riskli mi?',
    expectedIntent: UserIntent.QUERY_RISK_SCORE
  },
  
  // CHECK_PAYMENT_STATUS testleri
  {
    input: 'Son işlemim niye başarısız oldu?',
    expectedIntent: UserIntent.CHECK_PAYMENT_STATUS
  },
  {
    input: 'Ödeme durumu nedir?',
    expectedIntent: UserIntent.CHECK_PAYMENT_STATUS
  },
  {
    input: 'Ödemem kesildi mi?',
    expectedIntent: UserIntent.CHECK_PAYMENT_STATUS
  },
  {
    input: 'Bakiyem yetersiz mi?',
    expectedIntent: UserIntent.CHECK_PAYMENT_STATUS
  },
  
  // VIEW_HISTORY testleri
  {
    input: 'Daha önce hangi varlıkları sorgulmuşum?',
    expectedIntent: UserIntent.VIEW_HISTORY
  },
  {
    input: 'Son 5 analiz sonucumu göster',
    expectedIntent: UserIntent.VIEW_HISTORY
  },
  {
    input: 'Geçmiş sorgularımı listele',
    expectedIntent: UserIntent.VIEW_HISTORY
  },
  {
    input: 'Önceki analizlerimi görmek istiyorum',
    expectedIntent: UserIntent.VIEW_HISTORY
  },
  
  // GET_HELP testleri
  {
    input: 'Nasıl kullanılıyor?',
    expectedIntent: UserIntent.GET_HELP
  },
  {
    input: 'Risk skoru nasıl hesaplanıyor?',
    expectedIntent: UserIntent.GET_HELP
  },
  {
    input: 'Yardım',
    expectedIntent: UserIntent.GET_HELP
  },
  {
    input: 'Bu platform nedir?',
    expectedIntent: UserIntent.GET_HELP
  },
  {
    input: 'Başlangıç rehberi',
    expectedIntent: UserIntent.GET_HELP
  }
];

console.log('🧪 Intent Classifier Test Başlatılıyor...\n');
console.log('═══════════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;

testCases.forEach((testCase, index) => {
  const result = classifier.classify(testCase.input);
  const passed = result.intent === testCase.expectedIntent;
  
  if (passed) {
    passCount++;
    console.log(`✅ Test ${index + 1}: BAŞARILI`);
  } else {
    failCount++;
    console.log(`❌ Test ${index + 1}: BAŞARISIZ`);
  }
  
  console.log(`   Girdi: "${testCase.input}"`);
  console.log(`   Beklenen: ${testCase.expectedIntent}`);
  console.log(`   Bulunan: ${result.intent}`);
  console.log(`   Güven: ${(result.confidence * 100).toFixed(1)}%`);
  
  if (Object.keys(result.parameters).length > 0) {
    console.log(`   Parametreler:`, result.parameters);
  }
  
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════');
console.log(`\n📊 Test Sonuçları:`);
console.log(`   ✅ Başarılı: ${passCount}/${testCases.length}`);
console.log(`   ❌ Başarısız: ${failCount}/${testCases.length}`);
console.log(`   📈 Başarı Oranı: ${((passCount / testCases.length) * 100).toFixed(1)}%\n`);

// Interaktif test modu
if (process.argv.includes('--interactive')) {
  console.log('🎮 İnteraktif Test Modu Başlatılıyor...\n');
  console.log('Bir metin girin (çıkmak için "exit" yazın):\n');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const promptUser = () => {
    rl.question('💬 Girdi: ', (input: string) => {
      if (input.toLowerCase() === 'exit') {
        console.log('\n👋 Görüşmek üzere!\n');
        rl.close();
        return;
      }

      const result = classifier.classify(input);
      console.log('\n' + classifier.formatIntentResult(result));
      console.log('═══════════════════════════════════════════════════════════\n');
      
      promptUser();
    });
  };

  promptUser();
}
