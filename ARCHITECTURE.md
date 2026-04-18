# ChainTotal Risk Assessment Agent - Mimari Dokümantasyon

## 📐 Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    Kullanıcı Arayüzü                        │
│                         (CLI)                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  NLP Intent Layer                            │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ IntentClassifier │ ───▶ │  IntentHandler   │            │
│  └──────────────────┘      └──────────────────┘            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  ChainTotal Agent                            │
│                   (Orchestrator)                             │
└───┬─────────────────┬─────────────────┬──────────────────┬──┘
    │                 │                 │                  │
    ▼                 ▼                 ▼                  ▼
┌─────────┐    ┌─────────────┐   ┌──────────┐    ┌──────────┐
│ Payment │    │    Data     │   │   Risk   │    │  Result  │
│ Service │    │  Collector  │   │Calculator│    │ Formatter│
└─────────┘    └─────────────┘   └──────────┘    └──────────┘
    │                 │                 │
    ▼                 ▼                 ▼
┌─────────┐    ┌─────────────┐   ┌──────────┐
│ Stellar │    │  External   │   │  Scoring │
│ Network │    │    APIs     │   │  Engine  │
└─────────┘    └─────────────┘   └──────────┘
```

## 🏗️ Katman Yapısı

### 1. Presentation Layer (Sunum Katmanı)

**Dosyalar:** `src/cli.ts`, `src/index.ts`

**Sorumluluklar:**
- Kullanıcı etkileşimi
- Komut satırı arayüzü
- Girdi/çıktı formatlaması

**Bileşenler:**
- `ChainTotalCLI`: İnteraktif CLI arayüzü
- `startCLI()`: CLI başlatma fonksiyonu

### 2. NLP Layer (Doğal Dil İşleme Katmanı)

**Dosyalar:** `src/nlp/intentClassifier.ts`, `src/nlp/intentHandler.ts`

**Sorumluluklar:**
- Kullanıcı girdisini anlama
- Intent tanıma
- Parametre çıkarma
- Intent'e göre aksiyon yönlendirme

**Bileşenler:**
- `IntentClassifier`: Kullanıcı girdisini analiz eder
- `IntentHandler`: Tanınan intent'i işler

**Desteklenen Intent'ler:**
1. `QUERY_RISK_SCORE`: Risk skoru sorgulama
2. `CHECK_PAYMENT_STATUS`: Ödeme durumu kontrolü
3. `VIEW_HISTORY`: Geçmiş görüntüleme
4. `GET_HELP`: Yardım talebi

### 3. Business Logic Layer (İş Mantığı Katmanı)

**Dosyalar:** `src/agent.ts`

**Sorumluluklar:**
- İş akışı orkestrasyon
- Servisler arası koordinasyon
- Hata yönetimi
- Sonuç formatlaması

**Bileşenler:**
- `ChainTotalAgent`: Ana agent sınıfı

**İş Akışı:**
```
1. Ödeme kontrolü (PaymentService)
   ↓
2. Varlık doğrulama (DataCollector)
   ↓
3. Veri toplama (DataCollector)
   ├─ Topluluk sinyalleri
   └─ Teknik veriler
   ↓
4. Risk hesaplama (RiskCalculator)
   ↓
5. Sonuç formatlaması
```

### 4. Service Layer (Servis Katmanı)

#### 4.1 Payment Service

**Dosya:** `src/stellar/paymentService.ts`

**Sorumluluklar:**
- Stellar ağı ile iletişim
- x402 token ödeme yönetimi
- Bakiye kontrolü
- Transaction doğrulama

**Metodlar:**
- `requestPayment()`: Ödeme talebi
- `verifyPayment()`: Ödeme doğrulama
- `getAssetBalance()`: Bakiye sorgulama

#### 4.2 Data Collector

**Dosya:** `src/analysis/dataCollector.ts`

**Sorumluluklar:**
- Topluluk sinyalleri toplama
- Teknik veri toplama
- Varlık doğrulama
- Dış API entegrasyonları

**Metodlar:**
- `collectCommunitySignals()`: Topluluk verisi toplama
- `collectTechnicalData()`: Teknik veri toplama
- `verifyAsset()`: Varlık doğrulama

**Veri Kaynakları:**
- Twitter/X API
- Reddit API
- Blockchain explorers
- Token sniffer
- Contract verification services

#### 4.3 Risk Calculator

**Dosya:** `src/analysis/riskCalculator.ts`

**Sorumluluklar:**
- Risk skoru hesaplama
- Risk faktörlerini analiz etme
- Risk seviyesi belirleme

**Metodlar:**
- `calculateRiskScore()`: Ana hesaplama
- `analyzeCommunitySignals()`: Topluluk analizi
- `analyzeTechnicalData()`: Teknik analiz
- `analyzeAssetType()`: Varlık tipi analizi

**Risk Faktörleri:**
1. Topluluk Sinyalleri (30% ağırlık)
2. Teknik Analiz (40% ağırlık)
3. Varlık Tipi (30% ağırlık)

### 5. Data Layer (Veri Katmanı)

**Dosyalar:** `src/types.ts`, `src/config.ts`

**Sorumluluklar:**
- Tip tanımlamaları
- Konfigürasyon yönetimi
- Veri modelleri

## 🔄 Veri Akışı

### Örnek: Cüzdan Adresi Analizi

```
1. Kullanıcı Girdisi
   "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb adresini analiz et"
   │
   ▼
2. Intent Classification
   Intent: QUERY_RISK_SCORE
   Confidence: 0.95
   Parameters: {
     assetType: "wallet",
     identifier: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
   }
   │
   ▼
3. Intent Handling
   IntentHandler.handleQueryRiskScore()
   │
   ▼
4. Payment Request
   PaymentService.requestPayment()
   - Kullanıcı bakiyesi: 10 x402
   - Gerekli miktar: 1 x402
   - Sonuç: ✅ Başarılı
   │
   ▼
5. Asset Verification
   DataCollector.verifyAsset()
   - Format kontrolü: ✅
   - Uzunluk kontrolü: ✅
   │
   ▼
6. Data Collection (Paralel)
   ├─ DataCollector.collectCommunitySignals()
   │  └─ 3 sinyal toplandı
   │
   └─ DataCollector.collectTechnicalData()
      └─ Teknik veriler toplandı
   │
   ▼
7. Risk Calculation
   RiskCalculator.calculateRiskScore()
   ├─ Topluluk: 35/100 (30% ağırlık)
   ├─ Teknik: 50/100 (40% ağırlık)
   └─ Varlık Tipi: 30/100 (30% ağırlık)
   │
   ▼ Ağırlıklı Ortalama
   │
   Final Score: 42/100 (Orta Risk)
   │
   ▼
8. Result Formatting
   {
     success: true,
     riskScore: {
       score: 42,
       level: "Orta Risk",
       factors: [...]
     },
     transactionId: "...",
     timestamp: "..."
   }
   │
   ▼
9. User Output
   "✅ Analiz Tamamlandı!
    📊 Risk Skoru: 42/100
    🎯 Risk Seviyesi: Orta Risk"
```

## 🎯 Tasarım Prensipleri

### 1. Separation of Concerns (Sorumluluk Ayrımı)

Her katman ve bileşen tek bir sorumluluğa sahiptir:
- CLI sadece kullanıcı etkileşimi
- NLP sadece intent tanıma
- Agent sadece orkestrasyon
- Servisler sadece kendi domain'leri

### 2. Dependency Injection

Bileşenler arası bağımlılıklar constructor injection ile yönetilir:

```typescript
class IntentHandler {
  constructor(private agent: ChainTotalAgent) {}
}
```

### 3. Single Source of Truth

Tüm tipler ve konfigürasyon tek bir yerde tanımlanır:
- `src/types.ts`: Tüm TypeScript tipleri
- `src/config.ts`: Tüm konfigürasyon

### 4. Error Handling

Her katmanda uygun hata yönetimi:
- Try-catch blokları
- Anlamlı hata mesajları
- Kullanıcı dostu geri bildirim

### 5. Extensibility (Genişletilebilirlik)

Yeni özellikler kolayca eklenebilir:
- Yeni intent tipi eklemek
- Yeni varlık tipi desteklemek
- Yeni veri kaynağı entegre etmek

## 🔐 Güvenlik Katmanları

### 1. Payment Layer

- Stellar ağı üzerinden güvenli ödeme
- Bakiye kontrolü
- Transaction doğrulama

### 2. Data Validation

- Girdi validasyonu
- Format kontrolü
- Sanitization

### 3. Rate Limiting

(Gelecek versiyonda)
- İstek limitleri
- Kullanıcı başına kota

## 📊 Performans Optimizasyonları

### 1. Paralel Veri Toplama

```typescript
const [communitySignals, technicalData] = await Promise.all([
  this.dataCollector.collectCommunitySignals(...),
  this.dataCollector.collectTechnicalData(...)
]);
```

### 2. Caching

(Gelecek versiyonda)
- Analiz sonuçları cache'leme
- API yanıtları cache'leme

### 3. Lazy Loading

- Sadece gerekli modüller yüklenir
- On-demand veri toplama

## 🧪 Test Stratejisi

### 1. Unit Tests

Her bileşen için birim testleri:
- IntentClassifier testleri
- RiskCalculator testleri
- PaymentService testleri

### 2. Integration Tests

Katmanlar arası entegrasyon testleri:
- Agent workflow testleri
- End-to-end testleri

### 3. Manual Testing

- `test-intent.ts`: Intent classifier manuel test
- CLI interaktif test

## 🚀 Gelecek Geliştirmeler

### 1. Veritabanı Entegrasyonu

```
┌─────────────┐
│  PostgreSQL │
│   Database  │
└─────────────┘
      │
      ├─ users
      ├─ analyses
      ├─ transactions
      └─ community_signals
```

### 2. Web API

```
REST API
├─ POST /api/analyze
├─ GET /api/history
├─ GET /api/payment-status
└─ GET /api/help
```

### 3. Machine Learning

- Intent classification için ML modeli
- Risk skorlama için ML modeli
- Anomali tespiti

### 4. Real-time Updates

- WebSocket entegrasyonu
- Gerçek zamanlı risk güncellemeleri
- Push notifications

### 5. Multi-chain Support

- Ethereum
- Binance Smart Chain
- Polygon
- Solana
- ve daha fazlası...

## 📚 Referanslar

- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
