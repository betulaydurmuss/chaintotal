# 📁 ChainTotal - Proje Yapısı

## Dizin Ağacı

```
chaintotal-risk-agent/
│
├── src/                          # Kaynak kodlar
│   ├── analysis/                 # Analiz modülleri
│   │   ├── dataCollector.ts      # Veri toplama servisi
│   │   └── riskCalculator.ts     # Risk skorlama motoru
│   │
│   ├── nlp/                      # Doğal Dil İşleme
│   │   ├── intentClassifier.ts   # Intent tanıma
│   │   └── intentHandler.ts      # Intent işleme
│   │
│   ├── stellar/                  # Stellar blockchain
│   │   └── paymentService.ts     # x402 ödeme yönetimi
│   │
│   ├── agent.ts                  # Ana agent sınıfı
│   ├── cli.ts                    # CLI arayüzü
│   ├── config.ts                 # Konfigürasyon
│   ├── index.ts                  # Giriş noktası
│   └── types.ts                  # TypeScript tipleri
│
├── .env.example                  # Örnek çevre değişkenleri
├── .gitignore                    # Git ignore kuralları
├── package.json                  # NPM bağımlılıkları
├── tsconfig.json                 # TypeScript konfigürasyonu
├── test-intent.ts                # Intent test script
│
├── README.md                     # Genel bakış
├── QUICK_START.md                # Hızlı başlangıç rehberi
├── ARCHITECTURE.md               # Mimari dokümantasyon
├── INTENT_EXAMPLES.md            # Intent örnekleri
└── PROJECT_STRUCTURE.md          # Bu dosya
```

## 📂 Dosya Açıklamaları

### Kök Dizin

| Dosya | Açıklama |
|-------|----------|
| `.env.example` | Örnek çevre değişkenleri şablonu |
| `.gitignore` | Git tarafından ignore edilecek dosyalar |
| `package.json` | NPM proje tanımı ve bağımlılıklar |
| `tsconfig.json` | TypeScript derleyici ayarları |
| `test-intent.ts` | Intent classifier test script'i |

### Dokümantasyon

| Dosya | İçerik |
|-------|--------|
| `README.md` | Proje genel bakış ve kullanım |
| `QUICK_START.md` | 5 dakikada başlangıç rehberi |
| `ARCHITECTURE.md` | Detaylı mimari ve tasarım |
| `INTENT_EXAMPLES.md` | Intent örnekleri ve senaryolar |
| `PROJECT_STRUCTURE.md` | Proje yapısı (bu dosya) |

### src/ - Kaynak Kodlar

#### src/analysis/ - Analiz Modülleri

**`dataCollector.ts`**
- Topluluk sinyalleri toplama
- Teknik veri toplama
- Varlık doğrulama
- Dış API entegrasyonları

```typescript
class DataCollector {
  async collectCommunitySignals(...)
  async collectTechnicalData(...)
  async verifyAsset(...)
}
```

**`riskCalculator.ts`**
- Risk skoru hesaplama
- Risk faktörlerini analiz
- Risk seviyesi belirleme

```typescript
class RiskCalculator {
  calculateRiskScore(...)
  private analyzeCommunitySignals(...)
  private analyzeTechnicalData(...)
  private analyzeAssetType(...)
}
```

#### src/nlp/ - Doğal Dil İşleme

**`intentClassifier.ts`**
- Kullanıcı girdisini analiz
- Intent tanıma (pattern matching)
- Parametre çıkarma
- Güven skoru hesaplama

```typescript
enum UserIntent {
  QUERY_RISK_SCORE,
  CHECK_PAYMENT_STATUS,
  VIEW_HISTORY,
  GET_HELP,
  UNKNOWN
}

class IntentClassifier {
  classify(userInput: string): IntentResult
}
```

**`intentHandler.ts`**
- Intent'e göre aksiyon
- Agent ile koordinasyon
- Yanıt formatlaması

```typescript
class IntentHandler {
  async handleIntent(intentResult, userWallet)
  private async handleQueryRiskScore(...)
  private handleCheckPaymentStatus(...)
  private handleViewHistory(...)
  private handleGetHelp(...)
}
```

#### src/stellar/ - Stellar Blockchain

**`paymentService.ts`**
- Stellar ağı ile iletişim
- x402 token ödeme yönetimi
- Bakiye kontrolü
- Transaction doğrulama

```typescript
class PaymentService {
  async requestPayment(userWallet)
  async verifyPayment(transactionId)
  private getAssetBalance(...)
}
```

#### src/ - Ana Modüller

**`agent.ts`**
- Ana agent sınıfı
- İş akışı orkestrasyon
- Servisler arası koordinasyon

```typescript
class ChainTotalAgent {
  async analyzeAsset(request: AnalysisRequest)
}
```

**`cli.ts`**
- İnteraktif CLI arayüzü
- Kullanıcı etkileşimi
- Komut döngüsü

```typescript
class ChainTotalCLI {
  async start()
  private promptUser()
}
```

**`config.ts`**
- Çevre değişkenleri yönetimi
- Konfigürasyon validasyonu

```typescript
export const config = {
  stellar: {...},
  x402: {...},
  api: {...}
}
```

**`index.ts`**
- Uygulama giriş noktası
- CLI başlatma
- Örnek çalıştırma

```typescript
async function main() {
  // CLI veya örnek çalıştır
}
```

**`types.ts`**
- TypeScript tip tanımlamaları
- Interface'ler
- Enum'lar

```typescript
export enum AssetType {...}
export interface AnalysisRequest {...}
export interface AnalysisResult {...}
```

## 🔄 Modül Bağımlılıkları

```
index.ts
  └─> ChainTotalAgent (agent.ts)
  └─> ChainTotalCLI (cli.ts)
       └─> IntentClassifier (nlp/intentClassifier.ts)
       └─> IntentHandler (nlp/intentHandler.ts)
            └─> ChainTotalAgent (agent.ts)
                 ├─> PaymentService (stellar/paymentService.ts)
                 ├─> DataCollector (analysis/dataCollector.ts)
                 └─> RiskCalculator (analysis/riskCalculator.ts)
```

## 📦 NPM Scripts

| Script | Komut | Açıklama |
|--------|-------|----------|
| `start` | `node dist/index.js` | Derlenmiş uygulamayı çalıştır |
| `start:cli` | `node dist/index.js --cli` | CLI modunda çalıştır |
| `dev` | `ts-node src/index.ts` | Development modunda çalıştır |
| `dev:cli` | `ts-node src/index.ts --cli` | Dev CLI modu |
| `build` | `tsc` | TypeScript'i derle |
| `test:intent` | `ts-node test-intent.ts` | Intent testlerini çalıştır |
| `test:intent:interactive` | `ts-node test-intent.ts --interactive` | İnteraktif intent testi |

## 🔧 Konfigürasyon Dosyaları

### `.env` (Oluşturulmalı)

```env
# Stellar Network
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
AGENT_SECRET_KEY=SXXXXX...

# x402 Token
X402_TOKEN_ISSUER=GXXXXX...
X402_TOKEN_CODE=x402
PAYMENT_AMOUNT=1

# User
USER_WALLET=GXXXXX...

# Debug
DEBUG=false
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    ...
  }
}
```

## 📊 Kod İstatistikleri

| Kategori | Dosya Sayısı | Satır Sayısı (yaklaşık) |
|----------|--------------|-------------------------|
| Analiz Modülleri | 2 | ~400 |
| NLP Modülleri | 2 | ~600 |
| Stellar Modülleri | 1 | ~150 |
| Ana Modüller | 4 | ~500 |
| Test Scripts | 1 | ~200 |
| Dokümantasyon | 5 | ~2000 |
| **TOPLAM** | **15** | **~3850** |

## 🎯 Kod Organizasyon Prensipleri

### 1. Modülerlik

Her modül tek bir sorumluluğa sahiptir:
- `analysis/` → Veri toplama ve risk hesaplama
- `nlp/` → Doğal dil işleme
- `stellar/` → Blockchain işlemleri

### 2. Katmanlı Mimari

```
Presentation Layer (CLI)
         ↓
NLP Layer (Intent Processing)
         ↓
Business Logic Layer (Agent)
         ↓
Service Layer (Payment, Data, Risk)
         ↓
External Layer (APIs, Blockchain)
```

### 3. Tip Güvenliği

Tüm tipler `types.ts` dosyasında merkezi olarak tanımlanır:
- Enum'lar
- Interface'ler
- Type alias'lar

### 4. Konfigürasyon Yönetimi

Tüm konfigürasyon `config.ts` dosyasında:
- Çevre değişkenleri
- Varsayılan değerler
- Validasyon

## 🚀 Yeni Özellik Ekleme

### Yeni Intent Eklemek

1. `src/nlp/intentClassifier.ts` → Yeni intent enum ekle
2. `src/nlp/intentClassifier.ts` → Pattern matching ekle
3. `src/nlp/intentHandler.ts` → Handler metodu ekle

### Yeni Varlık Tipi Eklemek

1. `src/types.ts` → AssetType enum'a ekle
2. `src/analysis/riskCalculator.ts` → Analiz mantığı ekle
3. `src/analysis/dataCollector.ts` → Veri toplama ekle

### Yeni Veri Kaynağı Eklemek

1. `src/analysis/dataCollector.ts` → Yeni metod ekle
2. API key'i `.env.example` dosyasına ekle
3. `src/config.ts` → Konfigürasyon ekle

## 📝 Kod Standartları

- **TypeScript**: Strict mode aktif
- **Naming**: camelCase (değişkenler), PascalCase (sınıflar)
- **Async/Await**: Promise'ler için async/await kullan
- **Error Handling**: Try-catch blokları
- **Comments**: Karmaşık mantık için açıklayıcı yorumlar
- **Formatting**: Tutarlı indentation (2 spaces)

## 🔍 Önemli Notlar

1. **Güvenlik**: Secret key'ler asla commit edilmemeli
2. **Testing**: Her yeni özellik için test yazılmalı
3. **Documentation**: Kod değişiklikleri dokümante edilmeli
4. **Versioning**: Semantic versioning kullanılmalı

## 📚 İlgili Dokümantasyon

- Mimari detayları için: [ARCHITECTURE.md](ARCHITECTURE.md)
- Kullanım örnekleri için: [INTENT_EXAMPLES.md](INTENT_EXAMPLES.md)
- Hızlı başlangıç için: [QUICK_START.md](QUICK_START.md)
