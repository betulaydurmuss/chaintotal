# 💬 Örnek Diyalog Akışları

## Genel Bakış

ChainTotal Risk Assessment Agent'ın gerçek kullanım senaryoları ve step-by-step execution akışları.

## 🔍 Senaryo 1: İlk Kez Cüzdan Analizi

### Kullanıcı Girdisi
```
USER: "Bu cüzdan riski nedir? 0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b"
```

### Agent Execution Flow

#### Step 1: Intent Recognition
```
[INTENT]: QUERY_RISK_SCORE detected
[CONFIDENCE]: 95%
[PARAMETERS]:
  - asset_type: wallet
  - identifier: 0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b
```

#### Step 2: Validation
```
[VALIDATION]: Ethereum address format valid ✓
  - Format: 0x + 40 hex characters ✓
  - Checksum: Valid ✓
  - Length: 42 characters ✓
```

#### Step 3: Cache Check
```
[CACHE_CHECK]: Checking for existing analysis...
[CACHE_RESULT]: MISS - First time query
[ACTION]: Payment required
```

#### Step 4: Payment Initialization
```
[PAYMENT_INIT]: 1 x402 token talep ediliyor...

📋 Payment Details:
  - Destination: GSERVICE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ
  - Asset: x402
  - Amount: 1
  - Memo: ChainTotal-1705320000000
  - Timeout: 30s

💡 Lütfen Stellar wallet'ınızdan transaction'ı onaylayın
```

#### Step 5: Awaiting Signature
```
[AWAITING_SIGNATURE]: User cüzdanından imza bekle (XDR)
[STATUS]: Waiting for transaction submission...
⏳ Timeout: 30 seconds remaining
```

#### Step 6: Payment Success
```
[PAYMENT_SUCCESS]: ✅ Ödeme onaylandı!
[TX_HASH]: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z
[LEDGER]: 12345678
[AMOUNT]: 1 x402
[FROM]: GUSER...
[TO]: GSERVICE...
[TIMESTAMP]: 2024-01-15T10:30:00.000Z

💾 Transaction logged
💳 Payment ledger updated
```

#### Step 7: Analysis Start
```
[ANALYSIS_START]: Cüzdan analizi başladı
[QUERY_ID]: 550e8400-e29b-41d4-a716-446655440000

📊 Data Collection:
  ✓ On-chain behavior scanning...
    - Transaction history: 1,250 transactions
    - First transaction: 2023-01-15
    - Last transaction: 2024-01-14
    - Average value: 0.5 ETH
    
  ✓ Community signals aggregating...
    - Social media mentions: 45
    - Sentiment score: 0.3 (neutral-positive)
    - Reporter count: 0
    - Community growth: +5%
    
  ✓ Technical analysis...
    - Token holding diversity: 65%
    - Suspicious tokens: 0
    - Interaction with scams: No
    - Account age: 12 months
```

#### Step 8: Risk Calculation
```
[RISK_CALCULATION]: Computing risk score...

📊 Risk Factors:
  • Technical Analysis (60%): 45/100
    - High transaction frequency (potential bot) ⚠️
    - 12 months old account (low age risk) ✅
    - Good token diversity ✅
    
  • Community Signals (40%): 35/100
    - Connected to known airdrop farmers (yellow flag) ⚠️
    - Neutral sentiment ➡️
    - No scam reports ✅

Final Score: (45 × 0.6) + (35 × 0.4) = 41/100
Risk Level: MEDIUM
```

#### Step 9: Results
```
[RESULTS]: Analysis completed

═══════════════════════════════════════════════════════════
✅ Analiz Tamamlandı!

📊 Risk Skoru: 42/100
🎯 Risk Seviyesi: ORTA RİSK (MEDIUM)

📋 Detaylı Bulgular:
  ⚠️ High transaction frequency (potential bot)
  ⚠️ Connected to known airdrop farmers (yellow flag)
  ✅ 12 months old account (low age risk)
  ✅ Good token diversity
  ✅ No interaction with known scams

💡 Öneriler:
  • Monitor account for suspicious patterns
  • Dikkatli olun ve küçük miktarlarla başlayın
  • Kendi araştırmanızı yapın (DYOR)

📝 Query ID: 550e8400-e29b-41d4-a716-446655440000
💳 Transaction: 1a2b3c4d5e...
⏰ Timestamp: 15.01.2024 10:30:00
═══════════════════════════════════════════════════════════

💾 Sonuç cache'e kaydedildi (24 saat geçerli)
```

#### Step 10: Session Update
```
[SESSION_UPDATE]: Updating user session...
  ✓ Query history updated (1 total query)
  ✓ Payment ledger updated (1 successful payment)
  ✓ Stats updated:
    - Total queries: 1
    - Successful: 1
    - Cache hits: 0
    - Total spent: 1 x402
```

---

## 💾 Senaryo 2: Cache Hit (Aynı Varlık Tekrar Sorgulanıyor)

### Kullanıcı Girdisi
```
USER: "Bu cüzdan hakkında tekrar bilgi ver: 0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b"
```

### Agent Execution Flow

#### Step 1: Intent Recognition
```
[INTENT]: QUERY_RISK_SCORE detected
[CONFIDENCE]: 92%
[PARAMETERS]:
  - asset_type: wallet
  - identifier: 0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b
```

#### Step 2: Cache Check
```
[CACHE_CHECK]: Checking for existing analysis...
[CACHE_RESULT]: HIT ✅
[CACHE_AGE]: 4 hours ago
[CACHE_EXPIRES]: 20 hours remaining
[ACTION]: Return from cache (no payment required)
```

#### Step 3: Cache Hit Response
```
[CACHE_HIT]: Bu varlık 4 saat önce sorgulanmış

═══════════════════════════════════════════════════════════
📊 Cache'den: Risk Score = 42/100 (4 saat önce güncellenmiş)
✅ Ödeme gerekmiyor (cache hit)

🎯 Risk Seviyesi: ORTA RİSK (MEDIUM)

📋 Önceki Analiz Sonuçları:
  ⚠️ High transaction frequency (potential bot)
  ⚠️ Connected to known airdrop farmers (yellow flag)
  ✅ 12 months old account (low age risk)

💡 Öneriler:
  • Monitor account for suspicious patterns
  • Dikkatli olun ve küçük miktarlarla başlayın

📝 Original Query ID: 550e8400-e29b-41d4-a716-446655440000
⏰ Original Timestamp: 15.01.2024 10:30:00
💾 Cache expires in: 20 hours
═══════════════════════════════════════════════════════════
```

#### Step 4: Session Update
```
[SESSION_UPDATE]: Updating user session...
  ✓ Query history updated (2 total queries)
  ✓ Stats updated:
    - Total queries: 2
    - Successful: 2
    - Cache hits: 1 ⬆️
    - Total spent: 1 x402 (no new payment)
```

---

## 🪙 Senaryo 3: Token Analizi

### Kullanıcı Girdisi
```
USER: "BTC token güvenli mi?"
```

### Agent Execution Flow

#### Step 1: Intent Recognition
```
[INTENT]: QUERY_RISK_SCORE detected
[CONFIDENCE]: 88%
[PARAMETERS]:
  - asset_type: token
  - identifier: BTC
```

#### Step 2: Validation
```
[VALIDATION]: Token symbol format valid ✓
  - Format: 2-10 uppercase letters ✓
  - Symbol: BTC ✓
```

#### Step 3: Cache Check
```
[CACHE_CHECK]: Checking for existing analysis...
[CACHE_RESULT]: MISS - First time query for BTC
[ACTION]: Payment required
```

#### Step 4-6: Payment Process
```
[PAYMENT_INIT]: 1 x402 token talep ediliyor...
[AWAITING_SIGNATURE]: User cüzdanından imza bekle...
[PAYMENT_SUCCESS]: ✅ Ödeme onaylandı!
```

#### Step 7: Analysis Start
```
[ANALYSIS_START]: Token analizi başladı

📊 Data Collection:
  ✓ Smart contract analysis...
    - Contract age: 2,500+ days
    - Owner centralization: 15% (low risk)
    - Known vulnerabilities: None
    - Contract verified: Yes ✅
    
  ✓ Community signals...
    - Mention frequency: 10,000+
    - Sentiment: 0.8 (very positive)
    - Security audits: Multiple (CertiK, Quantstamp)
    
  ✓ Market data...
    - Market cap: $800B+
    - Trading volume: High
    - Liquidity: Excellent
```

#### Step 8: Results
```
[RESULTS]: Analysis completed

═══════════════════════════════════════════════════════════
✅ Analiz Tamamlandı!

📊 Risk Skoru: 15/100
🎯 Risk Seviyesi: DÜŞÜK RİSK (LOW)

📋 Detaylı Bulgular:
  ✅ Established token (2500+ days old)
  ✅ Low owner centralization (15%)
  ✅ Contract verified and audited
  ✅ No known vulnerabilities
  ✅ Very positive community sentiment
  ✅ High liquidity and trading volume

💡 Öneriler:
  • Genel olarak güvenli görünüyor
  • Yine de kendi araştırmanızı yapın (DYOR)
  • Piyasa volatilitesine dikkat edin

📝 Query ID: 660e8400-e29b-41d4-a716-446655440001
═══════════════════════════════════════════════════════════
```

---

## ❌ Senaryo 4: Yetersiz Bakiye

### Kullanıcı Girdisi
```
USER: "0xSCAM123... adresini analiz et"
```

### Agent Execution Flow

#### Step 1-3: Intent & Validation
```
[INTENT]: QUERY_RISK_SCORE detected
[VALIDATION]: Address format valid ✓
[CACHE_CHECK]: MISS
```

#### Step 4: Payment Failure
```
[PAYMENT_INIT]: 1 x402 token talep ediliyor...
[BALANCE_CHECK]: Checking user balance...
[BALANCE]: 0 x402
[REQUIRED]: 1 x402

[PAYMENT_FAILED]: ❌ Yetersiz bakiye

═══════════════════════════════════════════════════════════
❌ Yetersiz bakiye. Hesabınıza 1 x402 token yükleyin ve tekrar deneyin.

💰 Mevcut Bakiye: 0 x402
📊 Gerekli Miktar: 1 x402
📉 Eksik: 1 x402

💡 x402 Token Nasıl Alınır?
  1. Stellar testnet faucet kullanın
  2. x402 trustline ekleyin
  3. x402 token alın

🔗 Faucet: https://faucet.chaintotal.io
═══════════════════════════════════════════════════════════

[ACTION]: Analysis aborted
[RETRY]: Available
```

---

## 📊 Senaryo 5: Session Stats

### Kullanıcı Girdisi
```
USER: "stats"
```

### Agent Response
```
[INTENT]: SESSION_COMMAND detected
[COMMAND]: stats

═══════════════════════════════════════════════════════════
📊 Oturum İstatistikleri

Session ID: session_1705320000_abc123
Subscription: free
Süre: 15 dakika

📈 Sorgu İstatistikleri:
   • Toplam Sorgu: 5
   • Başarılı: 4
   • Başarısız: 1
   • Cache Hit: 2 (40% hit rate)

💳 Ödeme İstatistikleri:
   • Toplam Ödeme: 3
   • Toplam Harcama: 3 x402
   • Ortalama: 0.6 x402/sorgu (cache sayesinde)

📝 Son Aktivite: 15.01.2024 10:45:00
═══════════════════════════════════════════════════════════
```

---

## 🔄 Senaryo 6: Retry After Timeout

### Kullanıcı Girdisi
```
USER: "0x123... adresini analiz et"
```

### Agent Execution Flow

#### Attempt 1: Timeout
```
[PAYMENT_INIT]: 1 x402 token talep ediliyor...
[AWAITING_SIGNATURE]: User cüzdanından imza bekle...
[TIMEOUT]: ⏱️ 30 seconds elapsed
[STATUS]: Payment timeout

[RETRY_LOGIC]: Attempting retry (1/3)...
[BACKOFF]: Waiting 2 seconds...
```

#### Attempt 2: Network Error
```
[PAYMENT_INIT]: Retrying payment...
[ERROR]: Network connection failed
[STATUS]: Payment failed

[RETRY_LOGIC]: Attempting retry (2/3)...
[BACKOFF]: Waiting 4 seconds...
```

#### Attempt 3: Success
```
[PAYMENT_INIT]: Retrying payment...
[PAYMENT_SUCCESS]: ✅ Ödeme onaylandı!
[ATTEMPTS]: 3
[TOTAL_TIME]: 38 seconds

[ANALYSIS_START]: Continuing with analysis...
```

---

## 🚨 Senaryo 7: Circuit Breaker Activated

### Background
```
[CIRCUIT_BREAKER]: Monitoring service health...
[STELLAR_NETWORK]: 5 consecutive failures detected
[ACTION]: Opening circuit breaker
[STATUS]: Service temporarily unavailable
```

### Kullanıcı Girdisi
```
USER: "0x456... adresini analiz et"
```

### Agent Response
```
[PAYMENT_INIT]: Attempting payment...
[CIRCUIT_BREAKER]: OPEN ⚠️
[STATUS]: Service temporarily unavailable

═══════════════════════════════════════════════════════════
⚠️ Servis Geçici Olarak Kullanılamıyor

Stellar ağı ile bağlantı sorunları yaşanıyor.

💡 Ne Yapmalısınız?
  • Birkaç dakika bekleyin
  • Stellar ağı durumunu kontrol edin
  • Tekrar deneyin

🔄 Circuit breaker otomatik olarak 1 dakika içinde sıfırlanacak

📊 Servis Durumu:
  - Stellar Network: ⚠️ Degraded
  - Analysis Engine: ✅ Operational
  - Cache Service: ✅ Operational
═══════════════════════════════════════════════════════════

[FALLBACK]: Attempting to serve from cache...
[CACHE_CHECK]: No cached data available
[ACTION]: Request aborted
```

---

## 💡 Senaryo 8: Fallback to Cached Data

### Kullanıcı Girdisi
```
USER: "0x789... adresini analiz et"
```

### Agent Execution Flow

#### Payment Success, Analysis Failure
```
[PAYMENT_SUCCESS]: ✅ Ödeme onaylandı!
[ANALYSIS_START]: Cüzdan analizi başladı...
[ERROR]: Analysis engine timeout
[STATUS]: Analysis failed

[FALLBACK]: Attempting fallback to cached data...
[CACHE_CHECK]: Checking for similar analysis...
[CACHE_RESULT]: Found similar wallet analysis (80% match)
[ACTION]: Returning approximate results with disclaimer
```

#### Fallback Response
```
═══════════════════════════════════════════════════════════
⚠️ Analiz Kısmen Tamamlandı (Fallback Mode)

Analiz servisi geçici olarak yanıt vermedi.
Benzer cüzdan analizine dayalı tahmini sonuçlar:

📊 Tahmini Risk Skoru: ~45/100
🎯 Risk Seviyesi: ORTA RİSK (MEDIUM)

⚠️ DİKKAT: Bu sonuçlar benzer cüzdan analizine dayanmaktadır.
Kesin sonuçlar için lütfen birkaç dakika sonra tekrar deneyin.

💡 Öneriler:
  • Bu sonuçları referans olarak kullanın
  • Kesin analiz için tekrar sorgulayın (ödeme gerekmez - cache)
  • Dikkatli olun

🔄 Retry: "retry" yazarak tekrar deneyebilirsiniz
═══════════════════════════════════════════════════════════
```

---

## 📝 Execution Time Breakdown

### Typical Successful Query
```
Total Execution Time: 3,450ms

Breakdown:
├─ Intent Recognition: 50ms
├─ Cache Check: 100ms
├─ Payment Process: 2,000ms
│  ├─ Balance check: 200ms
│  ├─ Transaction submission: 1,500ms
│  └─ Confirmation: 300ms
├─ Data Collection: 800ms
│  ├─ On-chain data: 400ms
│  ├─ Community signals: 300ms
│  └─ Technical analysis: 100ms
├─ Risk Calculation: 200ms
├─ Response Formatting: 100ms
└─ Session Update: 200ms
```

### Cache Hit Query
```
Total Execution Time: 250ms

Breakdown:
├─ Intent Recognition: 50ms
├─ Cache Check: 100ms (HIT)
├─ Response Formatting: 50ms
└─ Session Update: 50ms

Speedup: 13.8x faster 🚀
Cost Savings: 1 x402 token 💰
```

---

## 🔗 İlgili Kaynaklar

- [SESSION_MANAGEMENT.md](SESSION_MANAGEMENT.md) - Cache mekanizması
- [ERROR_SCENARIOS.md](ERROR_SCENARIOS.md) - Hata yönetimi
- [PAYMENT_GUIDE.md](PAYMENT_GUIDE.md) - Ödeme sistemi

---

**Not:** Tüm execution flow'lar production-ready ve gerçek zamanlı olarak çalışır.
