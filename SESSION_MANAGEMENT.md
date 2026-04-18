# 🔐 Oturum Yönetimi (Session Management)

## Genel Bakış

ChainTotal Risk Assessment Agent, kullanıcı oturumlarını yönetir, sorgu geçmişini saklar ve 24 saatlik cache mekanizması ile maliyetleri optimize eder.

## 📊 User Session State

### Session Yapısı

```typescript
interface UserSession {
  userWalletAddress: string;      // Şifrelenmiş Stellar public key
  sessionId: string;               // Benzersiz session ID
  queryHistory: QueryRecord[];     // Sorgu geçmişi
  paymentLedger: PaymentRecord[];  // Ödeme geçmişi
  subscriptionLevel: 'free' | 'pro'; // Abonelik seviyesi
  createdAt: string;               // Oturum başlangıcı
  lastActivity: string;            // Son aktivite
  stats: SessionStats;             // İstatistikler
}
```

### Query Record

```typescript
interface QueryRecord {
  queryId: string;
  assetType: AssetType;
  assetIdentifier: string;  // Şifrelenmiş
  riskScore: number;
  riskLevel: string;
  timestamp: string;
  cached: boolean;          // Cache'den mi döndürüldü?
}
```

### Payment Record

```typescript
interface PaymentRecord {
  txHash: string;           // Şifrelenmiş transaction hash
  amount: number;
  assetCode: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}
```

### Session Stats

```typescript
interface SessionStats {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  cacheHits: number;
  totalPayments: number;
  totalSpent: number;
}
```

## 💾 Cache Mekanizması

### Hafıza Koşulları

#### 1. Aynı Varlık 24 Saat İçinde Tekrar Sorgulanırsa

**Action:**
- Cache'den sonucu döndür
- Yeni ödeme isteme (cache hit)
- Stats'ta cache hit sayısını artır

**Mesaj:**
```
📊 Cache'den: Risk Score = 45/100 (2 saat önce güncellenmiş)
✅ Ödeme gerekmiyor (cache hit)
```

**Örnek:**
```typescript
// İlk sorgu (10:00)
const result1 = await agent.analyzeAsset({
  assetType: AssetType.WALLET,
  identifier: '0x742d35Cc...',
  userWallet: 'GCZAMPLE...'
});
// Ödeme: 1 x402 ✅
// Cache'e kaydedildi ✅

// Aynı varlık tekrar sorgulanıyor (12:00)
const result2 = await agent.analyzeAsset({
  assetType: AssetType.WALLET,
  identifier: '0x742d35Cc...',  // Aynı adres
  userWallet: 'GCZAMPLE...'
});
// Ödeme: YOK ❌ (cache hit)
// Cache'den döndürüldü: "2 saat önce güncellenmiş" ✅
```

#### 2. Yeni Varlık Sorgulanırsa

**Action:**
- Ödeme iste
- Analiz başlat
- Sonucu cache'e kaydet (24 saat geçerli)

**Mesaj:**
```
❌ Cache miss - Yeni analiz gerekli

💳 Ödeme İnisiyasyonu Başlatıldı
...
```

#### 3. Cache Expired (24 Saat Geçti)

**Action:**
- Cache'den sil
- Yeni ödeme iste
- Yeni analiz yap
- Yeni sonucu cache'e kaydet

**Mesaj:**
```
🗑️  Cache expired: wallet:0x742d35cc...
❌ Cache miss - Yeni analiz gerekli
```

### Cache Entry Yapısı

```typescript
interface CacheEntry {
  queryId: string;
  result: AnalysisResult;
  timestamp: string;
  expiresAt: string;  // timestamp + 24 saat
}
```

### Cache Key Format

```
{assetType}:{assetIdentifier}

Örnekler:
- wallet:0x742d35cc6634c0532925a3b844bc9e7595f0beb
- token:btc
- nft:cryptopunks
```

## 🔄 Oturum Yaşam Döngüsü

### 1. Oturum Başlangıcı

```typescript
// Yeni oturum oluştur veya mevcut oturumu getir
const session = sessionManager.getOrCreateSession(userWallet);

console.log(`✅ Yeni oturum oluşturuldu: ${session.sessionId}`);
```

### 2. Sorgu İşleme

```typescript
// Cache kontrolü
const cached = await cacheService.getCachedResult(assetType, identifier);

if (cached) {
  // Cache hit
  sessionManager.addQueryToHistory(userWallet, cached.result, true);
  return cached.result;
}

// Cache miss - Yeni analiz
const result = await performAnalysis();

// Cache'e kaydet
sessionManager.cacheResult(result);

// History'ye ekle
sessionManager.addQueryToHistory(userWallet, result, false);

// Payment ledger'a ekle
sessionManager.addPaymentToLedger(userWallet, txHash, amount, 'x402', 'confirmed');
```

### 3. Oturum Bitişi

```typescript
// Analytics log
sessionManager.endSession(userWallet);

// Çıktı:
// 📊 Analytics Log:
// {
//   "sessionId": "session_1234567890_abc123",
//   "subscriptionLevel": "free",
//   "duration": 15,  // dakika
//   "stats": {
//     "totalQueries": 5,
//     "successfulQueries": 4,
//     "failedQueries": 1,
//     "cacheHits": 2,
//     "totalPayments": 3,
//     "totalSpent": 3
//   }
// }
```

## 🔐 Veri Güvenliği

### GDPR Compliance

#### 1. Hiçbir Private Key Saklamayın

```typescript
// ❌ YANLIŞ
const session = {
  secretKey: 'SXXXXXX...'  // ASLA!
};

// ✅ DOĞRU
const session = {
  userWalletAddress: encryptData('GXXXXXX...')  // Sadece public key (şifrelenmiş)
};
```

#### 2. Public Addresses ve Sonuçları Şifrele

```typescript
// AES-256 şifreleme
private encryptData(data: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Kullanım
const encryptedWallet = encryptData(userWallet);
const encryptedIdentifier = encryptData(assetIdentifier);
const encryptedTxHash = encryptData(transactionHash);
```

#### 3. Veri Minimizasyonu

```typescript
// Sadece gerekli verileri sakla
interface QueryRecord {
  queryId: string;           // ✅ Gerekli
  assetType: AssetType;      // ✅ Gerekli
  assetIdentifier: string;   // ✅ Şifrelenmiş
  riskScore: number;         // ✅ Gerekli
  riskLevel: string;         // ✅ Gerekli
  timestamp: string;         // ✅ Gerekli
  cached: boolean;           // ✅ Gerekli
  
  // ❌ Gereksiz veriler saklanmaz:
  // - Kullanıcı IP adresi
  // - Browser bilgisi
  // - Konum bilgisi
}
```

#### 4. Veri Saklama Süresi

```
Cache: 24 saat
Session: Aktif oturum boyunca (in-memory)
Analytics: Anonim, toplu istatistikler
```

#### 5. Kullanıcı Hakları

```typescript
// Veri silme hakkı
sessionManager.endSession(userWallet);  // Oturumu sil
sessionManager.clearCache();            // Cache'i temizle

// Veri erişim hakkı
const history = sessionManager.getQueryHistory(userWallet);
const payments = sessionManager.getPaymentLedger(userWallet);
const stats = sessionManager.getSessionStats(userWallet);
```

## 📝 CLI Komutları

### Session Komutları

```bash
# Oturum istatistikleri
stats

# Sorgu geçmişi (son 10)
history

# Ödeme geçmişi (son 10)
payments

# Oturum özeti
summary

# Cache bilgisi
cache

# Çıkış (oturumu sonlandır)
çıkış
```

### Örnek Kullanım

```
💬 Siz: stats

📊 Oturum İstatistikleri
═══════════════════════════════════════
📈 Toplam Sorgu: 5
✅ Başarılı: 4
❌ Başarısız: 1
💾 Cache Hit: 2
💳 Toplam Ödeme: 3
💰 Toplam Harcama: 3 x402
═══════════════════════════════════════
```

```
💬 Siz: history

📜 Son 10 Sorgu
═══════════════════════════════════════
1. 💾 wallet - Risk: 45/100 (Orta Risk)
   15.01.2024 10:30:00
2. 🆕 token - Risk: 25/100 (Düşük Risk)
   15.01.2024 10:15:00
3. 🆕 wallet - Risk: 75/100 (Yüksek Risk)
   15.01.2024 10:00:00
═══════════════════════════════════════
```

```
💬 Siz: summary

📊 Oturum Özeti
═══════════════════════════════════════
Session ID: session_1234567890_abc123
Subscription: free
Süre: 15 dakika

📈 İstatistikler:
   • Toplam Sorgu: 5
   • Başarılı: 4
   • Başarısız: 1
   • Cache Hit: 2
   • Toplam Ödeme: 3
   • Toplam Harcama: 3 x402

📝 Son Aktivite: 15.01.2024 10:30:00
═══════════════════════════════════════
```

## 🎯 Subscription Levels

### Free Tier

```typescript
{
  subscriptionLevel: 'free',
  limits: {
    queriesPerDay: 10,
    cacheEnabled: true,
    cacheTTL: 24 * 60 * 60 * 1000  // 24 saat
  }
}
```

### Pro Tier (Gelecek)

```typescript
{
  subscriptionLevel: 'pro',
  limits: {
    queriesPerDay: 100,
    cacheEnabled: true,
    cacheTTL: 7 * 24 * 60 * 60 * 1000,  // 7 gün
    prioritySupport: true,
    advancedAnalytics: true
  }
}
```

## 📊 Analytics Logging

### Log Format

```json
{
  "sessionId": "session_1234567890_abc123",
  "subscriptionLevel": "free",
  "duration": 15,
  "stats": {
    "totalQueries": 5,
    "successfulQueries": 4,
    "failedQueries": 1,
    "cacheHits": 2,
    "totalPayments": 3,
    "totalSpent": 3
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Anonim İstatistikler

```
Günlük Toplam:
├─ Toplam Sorgu: 1,250
├─ Cache Hit Rate: 35%
├─ Ortalama Session Süresi: 12 dakika
├─ Toplam Ödeme: 812 x402
└─ Başarı Oranı: 94%
```

## 🔧 Best Practices

### 1. Cache Stratejisi

```typescript
// Cache'i düzenli temizle
setInterval(() => {
  sessionManager.cleanupExpiredCache();
}, 60 * 60 * 1000); // Her saat
```

### 2. Session Timeout

```typescript
// Inactive session'ları temizle
const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 dakika

if (now - lastActivity > INACTIVE_TIMEOUT) {
  sessionManager.endSession(userWallet);
}
```

### 3. Memory Management

```typescript
// Memory limit kontrolü
const MAX_CACHE_SIZE = 1000;

if (cacheSize > MAX_CACHE_SIZE) {
  // LRU (Least Recently Used) stratejisi
  removeOldestCacheEntries();
}
```

## 🔗 İlgili Kaynaklar

- [PAYMENT_GUIDE.md](PAYMENT_GUIDE.md) - Ödeme sistemi
- [ERROR_SCENARIOS.md](ERROR_SCENARIOS.md) - Hata yönetimi
- [ARCHITECTURE.md](ARCHITECTURE.md) - Sistem mimarisi

---

**Not:** Tüm kullanıcı verileri GDPR uyumlu şekilde işlenir ve saklanır. Private key'ler asla saklanmaz.
