# 💳 Stellar x402 Micropayment Rehberi

## Genel Bakış

ChainTotal Risk Assessment Agent, her analiz sorgusu için **1 x402 token** ödeme gerektirir. Ödemeler Stellar blockchain üzerinden gerçekleştirilir.

## 🔄 Ödeme Akışı

```
1. Kullanıcı → Risk Score Talebi
         ↓
2. Agent → Ödeme İnisiyasyonu
         ↓
3. Kullanıcı → x402 Token Gönderimi
         ↓
4. Agent → Transaction Doğrulama
         ↓
5. Agent → Risk Analizi Başlatma
```

## 📋 Ödeme Detayları

| Parametre | Değer |
|-----------|-------|
| **Destination** | ChainTotal Service Wallet |
| **Amount** | 1 x402 |
| **Asset Code** | x402 |
| **Network** | Stellar Public Network (veya Testnet) |
| **Timeout** | 30 saniye |

## 🔐 Güvenlik Özellikleri

### 1. User Wallet Doğrulama
- Public key format kontrolü
- Stellar keypair validasyonu

### 2. Double-Spend Koruması
- Her transaction hash sadece bir kez işlenir
- Tekrar eden transaction'lar reddedilir
- In-memory transaction log

### 3. Transaction Logging
- Tüm ödemeler loglanır
- Timestamp, hash, amount kaydedilir
- Audit trail oluşturulur

### 4. Bakiye Kontrolü
- Ödeme öncesi bakiye doğrulaması
- Yetersiz bakiye durumunda işlem iptal

## 🚀 Kullanım Örnekleri

### Örnek 1: Yeni Ödeme Talebi

```typescript
import { ChainTotalAgent } from './src/agent';
import { AssetType } from './src/types';

const agent = new ChainTotalAgent();

const request = {
  assetType: AssetType.WALLET,
  identifier: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  userWallet: 'GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ'
};

const result = await agent.analyzeAsset(request);

if (result.paymentRequired) {
  console.log('Ödeme Detayları:', result.paymentDetails);
  // Kullanıcı ödeme yapmalı
}
```

### Örnek 2: Ödeme Yapıldıktan Sonra

```typescript
const request = {
  assetType: AssetType.WALLET,
  identifier: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  userWallet: 'GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ',
  transactionHash: 'abc123def456...' // Stellar transaction hash
};

const result = await agent.analyzeAsset(request);

if (result.success) {
  console.log('Risk Skoru:', result.riskScore);
}
```

### Örnek 3: Manuel Ödeme Yapma

```typescript
import { createPaymentTransaction, submitPaymentTransaction } from './src/stellar/paymentUtils';

// 1. Transaction oluştur
const { transaction, hash } = await createPaymentTransaction(
  'YOUR_SECRET_KEY',
  'CHAINTOTAL_SERVICE_WALLET',
  '1',
  'x402',
  'X402_ISSUER_PUBLIC_KEY',
  'ChainTotal-' + Date.now()
);

console.log('Transaction Hash:', hash);

// 2. Transaction'ı gönder
const result = await submitPaymentTransaction(transaction);

if (result.success) {
  console.log('Ödeme başarılı!');
  
  // 3. Analiz talebi gönder
  const analysisRequest = {
    assetType: AssetType.WALLET,
    identifier: '0x742d35Cc...',
    userWallet: 'YOUR_PUBLIC_KEY',
    transactionHash: hash
  };
  
  const analysisResult = await agent.analyzeAsset(analysisRequest);
}
```

## 🔧 Trustline Oluşturma

x402 token almadan önce trustline oluşturmanız gerekir:

```typescript
import { createTrustline } from './src/stellar/paymentUtils';

const result = await createTrustline(
  'YOUR_SECRET_KEY',
  'x402',
  'X402_ISSUER_PUBLIC_KEY'
);

if (result.success) {
  console.log('Trustline oluşturuldu!');
  console.log('Transaction Hash:', result.hash);
}
```

## 💰 Bakiye Kontrolü

```typescript
import { checkX402Balance } from './src/stellar/paymentUtils';

const balanceInfo = await checkX402Balance('YOUR_PUBLIC_KEY');

console.log('x402 Bakiye:', balanceInfo.balance);
console.log('Trustline:', balanceInfo.hasTrustline ? 'Var' : 'Yok');
```

## 🧪 Test Etme

### Payment Service Testi

```bash
# Temel testler
npm run test:payment

# Bakiye kontrolü ile
npm run test:payment -- --check-balance YOUR_PUBLIC_KEY
```

### Manuel Test

```bash
# Development modunda CLI başlat
npm run dev:cli

# Ödeme akışını test et
💬 Siz: 0x1234... adresini analiz et
```

## 📊 HTTP Headers

Ödeme doğrulandıktan sonra, API çağrıları için şu header'lar kullanılır:

```http
Authorization: Bearer [x402_payment_token]
X-Payment-Asset: x402
X-Payment-Amount: 1
X-Payment-Network: public
```

### Örnek Kullanım

```typescript
const paymentService = new PaymentService();

// Ödeme doğrulandıktan sonra
const headers = paymentService.getPaymentHeaders(paymentToken);

// API çağrısı
fetch('https://api.chaintotal.com/analyze', {
  method: 'POST',
  headers: {
    ...headers,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ ... })
});
```

## ⚠️ Hata Durumları

### 1. Yetersiz Bakiye

```json
{
  "success": false,
  "error": "Yetersiz bakiye! Gerekli: 1 x402, Mevcut: 0",
  "retryAvailable": false
}
```

**Çözüm:** x402 token satın alın veya edinin.

### 2. Geçersiz Transaction Hash

```json
{
  "success": false,
  "error": "Transaction bulunamadı. Henüz ledger'a yazılmamış olabilir.",
  "retryAvailable": true
}
```

**Çözüm:** Birkaç saniye bekleyin ve tekrar deneyin.

### 3. Double-Spend Tespit Edildi

```json
{
  "success": false,
  "error": "Bu transaction daha önce işlenmiş (Double-spend koruması)",
  "retryAvailable": false
}
```

**Çözüm:** Yeni bir ödeme yapın.

### 4. Timeout

```json
{
  "success": false,
  "error": "Ödeme zaman aşımına uğradı (30s)",
  "retryAvailable": true
}
```

**Çözüm:** Tekrar deneyin.

## 🔍 Transaction Doğrulama

Agent, her transaction'ı şu kriterlere göre doğrular:

1. ✅ Transaction Stellar ledger'da mevcut
2. ✅ Payment operation içeriyor
3. ✅ Destination doğru (ChainTotal service wallet)
4. ✅ Asset doğru (x402)
5. ✅ Amount yeterli (≥ 1 x402)
6. ✅ Transaction başarılı
7. ✅ Daha önce işlenmemiş (double-spend kontrolü)

## 📝 Transaction Log Formatı

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "transactionHash": "abc123def456...",
  "from": "GCZAMPLE...",
  "to": "GSERVICE...",
  "amount": "1",
  "asset": "x402:GISSUER...",
  "ledger": 12345678
}
```

## 🌐 Network Seçimi

### Testnet (Development)

```env
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

- Test için ücretsiz XLM alın: [Friendbot](https://friendbot.stellar.org/)
- Test x402 token'ları kullanın

### Public Network (Production)

```env
STELLAR_NETWORK=public
STELLAR_HORIZON_URL=https://horizon.stellar.org
```

- Gerçek XLM ve x402 token gereklidir
- Transaction fee'leri ödenir

## 💡 Best Practices

### 1. Timeout Yönetimi

```typescript
// Timeout ile ödeme bekle
const timeout = 30000; // 30 saniye
const startTime = Date.now();

while (Date.now() - startTime < timeout) {
  const result = await checkPaymentStatus(transactionHash);
  if (result.verified) break;
  await sleep(2000); // 2 saniye bekle
}
```

### 2. Retry Stratejisi

```typescript
async function payWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await makePayment();
      if (result.success) return result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * (i + 1)); // Exponential backoff
    }
  }
}
```

### 3. Error Handling

```typescript
try {
  const result = await agent.analyzeAsset(request);
  
  if (result.paymentRequired) {
    // Ödeme gerekli
    await handlePayment(result.paymentDetails);
  } else if (result.success) {
    // Analiz başarılı
    displayResults(result);
  }
} catch (error) {
  console.error('Hata:', error.message);
  // Kullanıcıya bildir
}
```

## 🔗 İlgili Kaynaklar

- [Stellar Documentation](https://developers.stellar.org/)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Expert](https://stellar.expert/)

## 📞 Destek

Ödeme ile ilgili sorunlar için:

1. Transaction hash'i kontrol edin
2. Bakiyenizi doğrulayın
3. Network durumunu kontrol edin
4. Debug modunu aktif edin (`DEBUG=true`)
5. Logları inceleyin

---

**Güvenli ödemeler! 🔐**
