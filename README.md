# ChainTotal Risk Assessment Agent

Topluluk Destekli Tehdit İstihbaratı ve Risk Skorlama Platformu

## Genel Bakış

ChainTotal, kripto varlıkları (cüzdan adresi, token, dApp, NFT, website) analiz eden ve topluluk sinyalleri ile teknik verileri birleştirerek risk skorlaması yapan bir platformdur. Stellar blockchain üzerinden x402 micropayment protokolü ile çalışır.

## Özellikler

- 🔍 Kripto varlık analizi (cüzdan, token, dApp, NFT, website)
- 📊 Risk Score hesaplama (0-100)
- 💳 Stellar x402 micropayment entegrasyonu
- 🌐 Topluluk destekli tehdit istihbaratı
- 📈 Gerçek zamanlı risk değerlendirmesi

## Risk Skorlama

- **0-30**: Düşük Risk (Yeşil)
- **31-60**: Orta Risk (Sarı)
- **61-100**: Yüksek Risk (Kırmızı)

## Ödeme Sistemi

Her analiz sorgusu için 1 x402 token (Stellar ağında) ödeme gereklidir.

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# .env dosyasını düzenle ve gerekli bilgileri ekle
```

## Kullanım

### 1. 🎨 Web UI (Önerilen)

Modern, kullanıcı dostu web arayüzü ile tüm özelliklere erişin:

```bash
# Quick start script ile başlat
bash start-web-ui.sh

# Veya manuel olarak
npm install
npm run build
npm run dev:server
```

Tarayıcınızda açın: **http://localhost:3000**

**Web UI Özellikleri:**
- 🔍 Instant asset search & analysis
- 📊 Real-time analytics dashboard
- 💰 Revenue tracking
- 🎨 Cyberpunk themed UI (dark mode)
- 📱 Responsive design (mobile, tablet, desktop)
- ⚡ Auto-refresh stats (30s interval)

Detaylı bilgi için [WEB_UI_GUIDE.md](WEB_UI_GUIDE.md) dosyasına bakın.

### 2. 💻 CLI Modu

Terminal üzerinden interaktif kullanım:

```bash
# Development modunda CLI başlat
npm run dev:cli

# Veya derlenmiş versiyonu çalıştır
npm run build
npm run start:cli
```

### 3. 🧪 Test Modları

```bash
# Intent classifier testleri
npm run test:intent

# İnteraktif test modu
npm run test:intent:interactive

# Payment service testi
npm run test:payment

# Agent loop testi
npm run test:agent-loop
```

## CLI Kullanımı

İnteraktif CLI modunda doğal dilde komutlar verebilirsiniz:

```
💬 Siz: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb adresini analiz et

🤖 ChainTotal:
✅ Analiz Tamamlandı!

📊 Risk Skoru: 45/100
🎯 Risk Seviyesi: Orta Risk

📋 Risk Faktörleri:
   • Topluluk Sinyalleri: 35/100
     1 sinyal analiz edildi (0 pozitif, 0 negatif)
   • Teknik Analiz: 50/100
     normal teknik göstergeler
   • Varlık Tipi: 30/100
     Cüzdan adresi analizi
```

### Desteklenen Komutlar

**Risk Analizi:**
- "0x1234... adresini analiz et"
- "BTC token güvenli mi?"
- "https://example.com sitesi hakkında bilgi ver"

**Ödeme Kontrolü:**
- "Ödeme durumu nedir?"
- "Son işlemim neden başarısız oldu?"

**Geçmiş:**
- "Son 5 analiz sonucumu göster"
- "Geçmiş sorgularımı listele"

**Oturum Komutları:**
- `stats` - Oturum istatistikleri
- `history` - Sorgu geçmişi
- `payments` - Ödeme geçmişi
- `summary` - Oturum özeti
- `cache` - Cache bilgisi
- `circuit` - Circuit breaker durumu
- `analytics` - Platform analytics
- `revenue` - Gelir istatistikleri
- `fraud` - Fraud detection durumu

**Yardım:**
- "Nasıl kullanılıyor?"
- "Risk skoru nasıl hesaplanıyor?"

**Debug Modu:**
```bash
# Tool execution detaylarını görmek için
DEBUG=true npm start
```

Daha fazla örnek için [INTENT_EXAMPLES.md](INTENT_EXAMPLES.md) ve [DIALOG_FLOW_EXAMPLES.md](DIALOG_FLOW_EXAMPLES.md) dosyalarına bakın.

## Teknolojiler

- Node.js + TypeScript
- Stellar SDK (x402 micropayment)
- Natural Language Processing (Intent Classification)
- Pattern Matching & Heuristics

## 📚 Dokümantasyon

- **[WEB_UI_GUIDE.md](WEB_UI_GUIDE.md)** - 🎨 Web arayüzü kullanım rehberi
- **[QUICK_START.md](QUICK_START.md)** - 5 dakikada başlangıç rehberi
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detaylı mimari dokümantasyon
- **[KIRO_AGENT_INTEGRATION.md](KIRO_AGENT_INTEGRATION.md)** - KIRO AI Agent Framework entegrasyonu
- **[ANALYTICS_GUIDE.md](ANALYTICS_GUIDE.md)** - Platform analytics ve monitoring rehberi
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment checklist
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Deployment readiness summary
- **[DIALOG_FLOW_EXAMPLES.md](DIALOG_FLOW_EXAMPLES.md)** - Detaylı diyalog akışı örnekleri
- **[INTENT_EXAMPLES.md](INTENT_EXAMPLES.md)** - Intent örnekleri ve kullanım senaryoları
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Proje yapısı ve dosya organizasyonu
- **[PAYMENT_GUIDE.md](PAYMENT_GUIDE.md)** - Stellar x402 micropayment rehberi
- **[RISK_ANALYSIS_GUIDE.md](RISK_ANALYSIS_GUIDE.md)** - Risk analizi metodolojisi ve parametreler
- **[ERROR_SCENARIOS.md](ERROR_SCENARIOS.md)** - Hata senaryoları ve çözümleri
- **[SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md)** - Oturum yönetimi ve cache sistemi

## 🚀 Deployment

### Development

**Web UI:**
```bash
npm run dev:server
# Open http://localhost:3000
```

**CLI:**
```bash
npm run dev:cli
```

### Production

**Web UI + API Server:**
```bash
# Build
npm run build:production

# Deploy with PM2
npm run pm2:start

# Or direct
npm run start:server
```

**CLI Only:**
```bash
npm run build
npm run start:cli
```

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete deployment guide.

## 🎯 Özellikler

### ✅ Doğal Dil İşleme (NLP)

Agent, kullanıcıların doğal dilde yazdığı komutları anlayabilir:

```
✅ "0x1234... adresini analiz et"
✅ "BTC token güvenli mi?"
✅ "Son 5 analiz sonucumu göster"
✅ "Nasıl kullanılıyor?"
```

### ✅ 4 Ana Intent Desteği

1. **QUERY_RISK_SCORE**: Risk skoru sorgulama
2. **CHECK_PAYMENT_STATUS**: Ödeme durumu kontrolü
3. **VIEW_HISTORY**: Geçmiş görüntüleme
4. **GET_HELP**: Yardım talebi

### ✅ Çoklu Varlık Desteği

- 🔐 Cüzdan Adresleri (Ethereum, Stellar)
- 🪙 Token'lar (ERC-20, vb.)
- 📱 dApp'ler
- 🖼️ NFT Koleksiyonları
- 🌐 Website'ler

### ✅ Akıllı Risk Skorlama

Risk skoru 3 faktörün ağırlıklı ortalaması:
- **Teknik Analiz** (60%)
  - Smart Contract Analysis (token/dApp)
  - On-chain Behavior (wallet)
  - Blockchain Data (NFT/collection)
- **Topluluk Sinyalleri** (40%)
  - Social Media Signals
  - External Threat Intelligence

**Formül:** `Final Score = (Teknik × 0.6) + (Topluluk × 0.4)`

### ✅ Stellar x402 Micropayment

- Her analiz için 1 x402 token
- Otomatik bakiye kontrolü
- Transaction doğrulama
- Double-spend koruması
- 30 saniye timeout
- Transaction logging
- HTTP Authorization headers

### ✅ KIRO AI Agent Framework

ChainTotal, **KIRO AI Agent Framework** ile güçlendirilmiştir:

- **Tool-Based Architecture**: 5 özelleştirilmiş tool
  - `stellar_payment_initiator` - Ödeme işlemleri
  - `risk_analysis_engine` - Risk analizi
  - `community_intelligence_fetcher` - Topluluk verileri
  - `blockchain_data_aggregator` - Blockchain verileri
  - `session_manager` - Oturum yönetimi

- **Error Recovery**:
  - Retry Logic: Max 3 deneme, exponential backoff
  - Circuit Breaker: 5 hata sonrası 60s devre dışı
  - Fallback: Cache'den eski veri döndürme

- **6-Step Agent Loop**:
  1. User Input → Intent Recognition
  2. Intent Match → Payment Authorization
  3. Payment Process → Stellar Transaction
  4. Transaction Confirmation → Analysis Execute
  5. Analysis Result → User Response
  6. Session Update → Ledger Record

- **24-Hour Cache**: Aynı varlık 24 saat içinde tekrar sorgulanırsa cache'den döner (ödeme yok)

Detaylı bilgi için [KIRO_AGENT_INTEGRATION.md](KIRO_AGENT_INTEGRATION.md) dosyasına bakın.

### ✅ Platform Analytics & Monitoring

ChainTotal, kapsamlı **analytics ve monitoring** yetenekleri ile donatılmıştır:

- **Query Analytics**:
  - Query execution logging
  - Daily metrics tracking
  - Payment success rate monitoring
  - Cache hit rate tracking
  - Top queried assets analysis

- **Revenue Tracking**:
  - Daily transaction volume
  - Total revenue (x402)
  - Average queries per user
  - Top spenders analysis
  - User revenue statistics

- **Fraud Detection**:
  - **Rate Limiting**: 5/min, 50/hour, 200/day
  - **Bulk Query Detection**: 10 queries in 30s
  - **Bot Behavior Detection**: Consistent intervals
  - **Automatic Blocking**: 1-24 hours
  - **Fraud Alerts**: Severity-based system

Detaylı bilgi için [ANALYTICS_GUIDE.md](ANALYTICS_GUIDE.md) dosyasına bakın.
