# ❌ Hata Senaryoları ve Yanıtlar

## Genel Bakış

ChainTotal Risk Assessment Agent, tüm hata durumlarını kullanıcı dostu mesajlarla yönetir ve uygun fallback aksiyonları sunar.

## 🎯 Hata Kodları

| Kod | Açıklama | Retry Mevcut |
|-----|----------|--------------|
| `INSUFFICIENT_BALANCE` | Yetersiz x402 token bakiyesi | ❌ Hayır |
| `PAYMENT_TIMEOUT` | Ödeme işlemi zaman aşımı | ✅ Evet |
| `ASSET_NOT_FOUND` | Varlık ilk kez sorgulanıyor | ❌ Hayır |
| `INVALID_INPUT` | Geçersiz girdi formatı | ❌ Hayır |
| `NETWORK_ERROR` | Ağ bağlantı hatası | ✅ Evet |
| `DOUBLE_SPEND` | Transaction tekrar kullanılmış | ❌ Hayır |
| `TRANSACTION_FAILED` | Transaction başarısız | ✅ Evet |
| `INVALID_TRANSACTION` | Geçersiz transaction hash | ✅ Evet |
| `UNKNOWN_ERROR` | Beklenmeyen hata | ✅ Evet |

## 📋 Senaryo 1: Yetersiz Bakiye

### Durum
User wallet'inde 1 x402 token yok

### Action
Ödemeyi başlatma

### Mesaj
```
❌ Yetersiz bakiye. Hesabınıza 1 x402 token yükleyin ve tekrar deneyin.

💰 Mevcut Bakiye: 0 x402
📊 Gerekli Miktar: 1 x402
📉 Eksik: 1 x402
```

### Fallback
```json
{
  "type": "faucet",
  "description": "x402 token almak için faucet kullanın",
  "link": "https://faucet.chaintotal.io"
}
```

### Örnek Response
```json
{
  "success": false,
  "errorCode": "INSUFFICIENT_BALANCE",
  "message": "Insufficient balance: 0 x402, required: 1 x402",
  "userMessage": "❌ Yetersiz bakiye. Hesabınıza 1 x402 token yükleyin ve tekrar deneyin.\n\n💰 Mevcut Bakiye: 0 x402\n📊 Gerekli Miktar: 1 x402\n📉 Eksik: 1 x402",
  "retryAvailable": false,
  "fallbackAction": {
    "type": "faucet",
    "description": "x402 token almak için faucet kullanın",
    "link": "https://faucet.chaintotal.io"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### CLI Çıktısı
```
════════════════════════════════════════════════════════════
❌ HATA
════════════════════════════════════════════════════════════

❌ Yetersiz bakiye. Hesabınıza 1 x402 token yükleyin ve tekrar deneyin.

💰 Mevcut Bakiye: 0 x402
📊 Gerekli Miktar: 1 x402
📉 Eksik: 1 x402

────────────────────────────────────────────────────────────
💡 Önerilen Aksiyon:
   x402 token almak için faucet kullanın
   🔗 Link: https://faucet.chaintotal.io

════════════════════════════════════════════════════════════
```

---

## ⏱️ Senaryo 2: Ödeme Timeout

### Durum
30 saniye içinde Stellar network yanıt vermedi

### Action
Retry mekanizması aktif et

### Mesaj
```
⏱️ Ödeme işlemi timeout (30s).

Lütfen bağlantınızı kontrol edin ve tekrar deneyin.

💡 İpuçları:
   • İnternet bağlantınızı kontrol edin
   • Stellar ağı durumunu kontrol edin
   • Birkaç saniye bekleyip tekrar deneyin
```

### Fallback
```json
{
  "type": "retry",
  "description": "Retry butonuna tıklayarak tekrar deneyin"
}
```

### Örnek Response
```json
{
  "success": false,
  "errorCode": "PAYMENT_TIMEOUT",
  "message": "Payment timeout after 30000ms",
  "userMessage": "⏱️ Ödeme işlemi timeout (30s).\n\nLütfen bağlantınızı kontrol edin ve tekrar deneyin.\n\n💡 İpuçları:\n   • İnternet bağlantınızı kontrol edin\n   • Stellar ağı durumunu kontrol edin\n   • Birkaç saniye bekleyip tekrar deneyin",
  "retryAvailable": true,
  "fallbackAction": {
    "type": "retry",
    "description": "Retry butonuna tıklayarak tekrar deneyin"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### CLI Çıktısı
```
════════════════════════════════════════════════════════════
❌ HATA
════════════════════════════════════════════════════════════

⏱️ Ödeme işlemi timeout (30s).

Lütfen bağlantınızı kontrol edin ve tekrar deneyin.

💡 İpuçları:
   • İnternet bağlantınızı kontrol edin
   • Stellar ağı durumunu kontrol edin
   • Birkaç saniye bekleyip tekrar deneyin

────────────────────────────────────────────────────────────
💡 Önerilen Aksiyon:
   Retry butonuna tıklayarak tekrar deneyin

────────────────────────────────────────────────────────────
🔄 Retry mevcut: "retry" yazarak tekrar deneyebilirsiniz

════════════════════════════════════════════════════════════
```

---

## 🔄 Senaryo 3: Varlık Bulunamadı

### Durum
Sorgu edilen cüzdan/token/dApp sistem veritabanında yok

### Action
Veri toplamaya başla (ilk kez sorgulanan varlık)

### Mesaj
```
🔄 Bu varlık ilk kez sorgulanıyor. Veri toplanıyor...

⏳ Tahmini Süre: 2-5 dakika

📊 İşlemler:
   ✓ Blockchain verisi toplanıyor
   ✓ Topluluk sinyalleri analiz ediliyor
   ✓ Risk skoru hesaplanıyor

💡 Lütfen bekleyin, sonuç hazır olduğunda bildirim alacaksınız.
```

### Fallback
```json
{
  "type": "wait",
  "description": "Veri toplama işlemi devam ediyor, lütfen bekleyin"
}
```

### Örnek Response
```json
{
  "success": false,
  "errorCode": "ASSET_NOT_FOUND",
  "message": "Asset not found: wallet - 0x1234...",
  "userMessage": "🔄 Bu varlık ilk kez sorgulanıyor. Veri toplanıyor...\n\n⏳ Tahmini Süre: 2-5 dakika\n\n📊 İşlemler:\n   ✓ Blockchain verisi toplanıyor\n   ✓ Topluluk sinyalleri analiz ediliyor\n   ✓ Risk skoru hesaplanıyor\n\n💡 Lütfen bekleyin, sonuç hazır olduğunda bildirim alacaksınız.",
  "retryAvailable": false,
  "fallbackAction": {
    "type": "wait",
    "description": "Veri toplama işlemi devam ediyor, lütfen bekleyin"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## ⚠️ Senaryo 4: Geçersiz Giriş

### Durum
Kullanıcı yanlış format giriş yaptı (geçersiz address, token symbol vb.)

### Action
Hiçbir ödeme yapma

### Mesaj
```
⚠️ Geçersiz giriş formatı.

❌ Girilen: 0x123
✅ Beklenen: 0x ile başlayan 42 karakterli Ethereum adresi

📝 Geçerli Format Örnekleri:
   • Ethereum: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   • 0x ile başlamalı ve 42 karakter olmalı
```

### Fallback
```json
{
  "type": "correct_input",
  "description": "Lütfen geçerli bir format girin"
}
```

### Örnek Response
```json
{
  "success": false,
  "errorCode": "INVALID_INPUT",
  "message": "Invalid input: ethereum_address - 0x123",
  "userMessage": "⚠️ Geçersiz giriş formatı.\n\n❌ Girilen: 0x123\n✅ Beklenen: 0x ile başlayan 42 karakterli Ethereum adresi\n\n📝 Geçerli Format Örnekleri:\n   • Ethereum: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\n   • 0x ile başlamalı ve 42 karakter olmalı",
  "retryAvailable": false,
  "fallbackAction": {
    "type": "correct_input",
    "description": "Lütfen geçerli bir format girin"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Desteklenen Format Tipleri

#### Ethereum Address
```
Format: 0x + 40 hexadecimal karakter
Örnek: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

#### Stellar Address
```
Format: G + 55 alphanumeric karakter
Örnek: GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ
```

#### Token Symbol
```
Format: 2-10 büyük harf
Örnek: BTC, ETH, USDT
```

#### URL
```
Format: http:// veya https:// ile başlayan
Örnek: https://example.com
```

#### Transaction Hash
```
Format: 64 karakterli hexadecimal string
Örnek: abc123def456...
```

---

## 🚫 Senaryo 5: Double-Spend

### Durum
Transaction daha önce kullanılmış

### Mesaj
```
🚫 Bu transaction daha önce kullanılmış.

Transaction Hash: abc123def456...

⚠️ Güvenlik nedeniyle aynı transaction tekrar kullanamaz.
Lütfen yeni bir ödeme yapın.
```

### Örnek Response
```json
{
  "success": false,
  "errorCode": "DOUBLE_SPEND",
  "message": "Double spend detected: abc123def456...",
  "userMessage": "🚫 Bu transaction daha önce kullanılmış.\n\nTransaction Hash: abc123def456...\n\n⚠️ Güvenlik nedeniyle aynı transaction tekrar kullanamaz.\nLütfen yeni bir ödeme yapın.",
  "retryAvailable": false,
  "fallbackAction": {
    "type": "retry",
    "description": "Yeni bir ödeme yapın"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## ✅ Başarılı İşlem Mesajı

### Mesaj
```
✅ Ödeme onaylandı! Risk analizi başladı.

📝 Transaction Hash: abc123def456...
⏳ Analiz süresi: ~30 saniye

Lütfen bekleyin...
```

### Örnek Response
```json
{
  "success": true,
  "transactionId": "abc123def456...",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "paymentToken": "base64_encoded_token"
}
```

---

## 🔧 Hata Yönetimi Best Practices

### 1. Kullanıcı Dostu Mesajlar
- ✅ Emoji kullanın (görsel ipuçları)
- ✅ Açık ve anlaşılır dil
- ✅ Teknik jargondan kaçının
- ✅ Çözüm önerileri sunun

### 2. Fallback Aksiyonları
- ✅ Her hata için uygun aksiyon
- ✅ Link'ler (faucet, dokümantasyon)
- ✅ Retry mekanizması
- ✅ Alternatif yollar

### 3. Retry Stratejisi
```typescript
async function retryWithBackoff(fn: Function, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
}
```

### 4. Error Logging
```typescript
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "errorCode": "PAYMENT_TIMEOUT",
  "userId": "user123",
  "context": {
    "userWallet": "GCZAMPLE...",
    "amount": 1,
    "elapsed": 30000
  }
}
```

---

## 📊 Hata İstatistikleri (Örnek)

```
Hata Dağılımı:
├─ INSUFFICIENT_BALANCE: 35%
├─ PAYMENT_TIMEOUT: 25%
├─ INVALID_INPUT: 20%
├─ NETWORK_ERROR: 10%
├─ DOUBLE_SPEND: 5%
└─ UNKNOWN_ERROR: 5%

Retry Başarı Oranı: 75%
Ortalama Çözüm Süresi: 2 dakika
```

---

## 🔗 İlgili Kaynaklar

- [PAYMENT_GUIDE.md](PAYMENT_GUIDE.md) - Ödeme sistemi rehberi
- [QUICK_START.md](QUICK_START.md) - Hızlı başlangıç
- [ARCHITECTURE.md](ARCHITECTURE.md) - Sistem mimarisi

---

**Not:** Tüm hata mesajları kullanıcı dilinde (Türkçe/İngilizce) döndürülür ve kullanıcı deneyimini optimize etmek için sürekli iyileştirilir.
