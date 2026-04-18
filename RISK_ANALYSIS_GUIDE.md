# 📊 Risk Analizi Rehberi

## Genel Bakış

ChainTotal Risk Assessment Agent, kripto varlıkları için kapsamlı risk analizi yapar. Risk skoru **0-100** arasında hesaplanır ve **teknik analiz** ile **topluluk sinyalleri** birleştirilerek oluşturulur.

## 🎯 Risk Skorlama Formülü

```
Final Score = (Teknik Analiz × 0.6) + (Topluluk Sinyalleri × 0.4)
```

### Ağırlıklar

| Kategori | Ağırlık | Açıklama |
|----------|---------|----------|
| **Teknik Analiz** | %60 | Blockchain verileri, kontrat analizi, on-chain davranış |
| **Topluluk Sinyalleri** | %40 | Sosyal medya, topluluk raporları, tehdit istihbaratı |

### Risk Seviyeleri

| Skor | Seviye | Renk | Açıklama |
|------|--------|------|----------|
| 0-30 | **DÜŞÜK RİSK** | 🟢 Yeşil | Genel olarak güvenli |
| 31-60 | **ORTA RİSK** | 🟡 Sarı | Dikkatli olun |
| 61-100 | **YÜKSEK RİSK** | 🔴 Kırmızı | Uzak durun |

## 📋 Teknik Veri Kaynakları (60% Ağırlık)

### 1. Smart Contract Analysis (Token/dApp için)

#### Contract Deployment Tarihi
- **Çok yeni** (< 7 gün): +20 risk
- **Yeni** (< 30 gün): +10 risk
- **Olgun** (> 365 gün): -5 risk

```json
{
  "contractDeploymentDate": "2023-01-15T10:30:00.000Z",
  "contractAge": 365
}
```

#### Owner Centralization Risk
- **Yüksek merkezileşme** (> 70%): +15 risk
- **Düşük merkezileşme** (< 30%): -5 risk

```json
{
  "ownerCentralizationRisk": 75
}
```

#### Known Vulnerability Patterns
- Her güvenlik açığı: +5 risk
- Temel risk: +20

```json
{
  "knownVulnerabilities": [
    "Reentrancy risk detected",
    "Unchecked return value"
  ]
}
```

#### Contract Verification
- **Doğrulanmamış**: +15 risk
- **Doğrulanmış**: -5 risk

```json
{
  "contractVerified": true
}
```

### 2. On-chain Behavior (Cüzdan için)

#### Transaction History
- **Çok az işlem** (< 5): +15 risk
- **Aktif cüzdan** (> 1000): -5 risk

```json
{
  "transactionCount": 1250,
  "transactionHistory": {
    "firstTransaction": "2022-06-15T08:20:00.000Z",
    "lastTransaction": "2024-01-10T14:30:00.000Z",
    "averageValue": 500.50
  }
}
```

#### Token Holding Patterns
- **Düşük çeşitlilik** (< 20%): +10 risk
- **Şüpheli tokenlar**: Her token için +5 risk (temel +15)

```json
{
  "tokenHoldingPatterns": {
    "diversification": 15,
    "suspiciousTokens": 2
  }
}
```

#### Interaction with Known Scams
- **Dolandırıcılıklarla etkileşim**: +25 risk

```json
{
  "interactionWithScams": true
}
```

### 3. Blockchain Data (NFT/Koleksiyon için)

#### Floor Price Stability
- **Düşük istikrar** (< 30%): +15 risk
- **Yüksek istikrar** (> 70%): -5 risk

```json
{
  "floorPriceStability": 45
}
```

#### Trading Volume Trends
- **Azalan**: +10 risk
- **Artan**: -5 risk
- **Stabil**: 0 risk

```json
{
  "tradingVolumeTrend": "decreasing"
}
```

#### Rarity Patterns
- **Düşük özellik çeşitliliği** (< 5): +10 risk

```json
{
  "rarityPatterns": {
    "uniqueTraits": 3,
    "rarityScore": 75.5
  }
}
```

### 4. Kritik Riskler (Yüksek Ağırlık)

| Risk | Puan | Açıklama |
|------|------|----------|
| **Known Scam** | +40 | Bilinen dolandırıcılık |
| **Blacklisted** | +30 | Kara listede |
| **Interaction with Scams** | +25 | Dolandırıcılıklarla etkileşim |

## 🌐 Topluluk Sinyalleri (40% Ağırlık)

### 1. Social Media Signals

#### Mention Frequency
- Sosyal medyada bahsedilme sıklığı
- Yüksek frekans (> 100): Dikkat çekici

```json
{
  "mentionFrequency": 150
}
```

#### Sentiment Analysis
- **Negatif** (< -0.5): +10 risk
- **Pozitif** (> 0.5): -5 risk
- Değer aralığı: -1 (çok negatif) to 1 (çok pozitif)

```json
{
  "sentiment": -0.7
}
```

#### Community Growth Rate
- **Küçülüyor** (< -10%): +10 risk
- **Büyüyor** (> 20%): -5 risk

```json
{
  "communityGrowthRate": -15
}
```

#### Reporter Count
- Her rapor eden kullanıcı: +3 risk
- Temel risk: +15

```json
{
  "reporterCount": 5
}
```

### 2. External Threat Intelligence

#### Blacklist Status
- **Kara listede**: +25 risk

```json
{
  "blacklistStatus": true
}
```

#### Scam Reports
- Her rapor: +5 risk
- Temel risk: +20

```json
{
  "scamReports": 3
}
```

#### Security Audit History
- **Denetim yapılmış**: -10 risk
- **Denetim yapılmamış**: +5 risk
- Her bulgu: +3 risk

```json
{
  "securityAuditHistory": {
    "audited": true,
    "auditDate": "2023-06-15T00:00:00.000Z",
    "auditFirm": "CertiK",
    "findings": [
      "Reentrancy vulnerability",
      "Unchecked external call"
    ]
  }
}
```

## 📤 Output Format (JSON)

```json
{
  "query_id": "550e8400-e29b-41d4-a716-446655440000",
  "asset_type": "wallet",
  "asset_identifier": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "risk_score": 45,
  "risk_level": "MEDIUM",
  "technical_analysis": {
    "score": 50,
    "weight": 0.6,
    "findings": [
      "✅ Aktif cüzdan (1250 işlem)",
      "⚠️ Düşük token çeşitliliği",
      "🔴 2 şüpheli token tespit edildi"
    ],
    "data": {
      "transactionCount": 1250,
      "transactionHistory": {
        "firstTransaction": "2022-06-15T08:20:00.000Z",
        "lastTransaction": "2024-01-10T14:30:00.000Z",
        "averageValue": 500.50
      },
      "tokenHoldingPatterns": {
        "diversification": 15,
        "suspiciousTokens": 2
      },
      "interactionWithScams": false
    }
  },
  "community_signals": [
    {
      "source": "Social Media Analysis",
      "type": "neutral",
      "confidence": 0.7,
      "description": "Sosyal medya analizi tamamlandı",
      "mention_frequency": 85,
      "sentiment": 0.2,
      "community_growth_rate": 5.5
    },
    {
      "source": "Threat Intelligence",
      "type": "neutral",
      "confidence": 0.9,
      "description": "Tehdit istihbaratında temiz",
      "blacklist_status": false,
      "scam_reports": 0
    },
    {
      "source": "Community Reports",
      "type": "neutral",
      "confidence": 0.6,
      "description": "Topluluk raporları temiz",
      "reporter_count": 0
    },
    {
      "source": "Security Audit",
      "type": "positive",
      "confidence": 0.8,
      "description": "Güvenlik denetimi yapılmış (0 bulgu)",
      "security_audit_history": {
        "audited": true,
        "audit_date": "2023-06-15T00:00:00.000Z",
        "audit_firm": "CertiK",
        "findings": []
      }
    }
  ],
  "recommendations": [
    "⚠️ ORTA RİSK: Dikkatli olun ve küçük miktarlarla başlayın",
    "📊 Topluluk geri bildirimlerini takip edin",
    "💡 Yine de kendi araştırmanızı yapın (DYOR)"
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "transaction_id": "abc123def456..."
}
```

## 🎯 Varlık Tipine Göre Analiz

### Token/dApp

**Odak Noktaları:**
- Smart contract güvenliği
- Owner centralization
- Güvenlik denetimleri
- Bilinen güvenlik açıkları

**Örnek:**
```json
{
  "asset_type": "token",
  "technical_analysis": {
    "data": {
      "contractAge": 180,
      "ownerCentralizationRisk": 45,
      "knownVulnerabilities": [],
      "contractVerified": true
    }
  }
}
```

### Wallet (Cüzdan)

**Odak Noktaları:**
- Transaction history
- Token holding patterns
- Dolandırıcılıklarla etkileşim
- Cüzdan yaşı

**Örnek:**
```json
{
  "asset_type": "wallet",
  "technical_analysis": {
    "data": {
      "transactionCount": 500,
      "tokenHoldingPatterns": {
        "diversification": 60,
        "suspiciousTokens": 0
      },
      "interactionWithScams": false
    }
  }
}
```

### NFT/Collection

**Odak Noktaları:**
- Floor price stability
- Trading volume trends
- Rarity patterns
- Koleksiyon yaşı

**Örnek:**
```json
{
  "asset_type": "nft",
  "technical_analysis": {
    "data": {
      "floorPriceStability": 75,
      "tradingVolumeTrend": "stable",
      "rarityPatterns": {
        "uniqueTraits": 12,
        "rarityScore": 85.5
      }
    }
  }
}
```

### Website

**Odak Noktaları:**
- Domain yaşı
- Blacklist durumu
- Topluluk raporları

**Örnek:**
```json
{
  "asset_type": "website",
  "technical_analysis": {
    "data": {
      "age": 730,
      "blacklisted": false
    }
  }
}
```

## 💡 Öneriler (Recommendations)

Risk skoruna göre otomatik öneriler oluşturulur:

### Yüksek Risk (≥ 70)
```
⚠️ YÜKSEK RİSK: Bu varlıkla etkileşime girmekten kaçının
🔍 Detaylı araştırma yapın ve alternatif varlıkları değerlendirin
```

### Orta Risk (40-69)
```
⚠️ ORTA RİSK: Dikkatli olun ve küçük miktarlarla başlayın
📊 Topluluk geri bildirimlerini takip edin
```

### Düşük Risk (< 40)
```
✅ DÜŞÜK RİSK: Genel olarak güvenli görünüyor
💡 Yine de kendi araştırmanızı yapın (DYOR)
```

### Özel Durumlar

- **Bilinen dolandırıcılık**: `🚨 Bilinen dolandırıcılık - Kesinlikle uzak durun!`
- **Doğrulanmamış kontrat**: `⚠️ Kontrat doğrulanmamış - Ekstra dikkatli olun`
- **Güvenlik açıkları**: `🔴 Güvenlik açıkları tespit edildi - Uzman görüşü alın`
- **Dolandırıcılıklarla etkileşim**: `⚠️ Dolandırıcılıklarla etkileşim tespit edildi`

## 🧪 Test Senaryoları

### Senaryo 1: Güvenli Token

```json
{
  "risk_score": 25,
  "risk_level": "LOW",
  "technical_analysis": {
    "score": 30,
    "findings": [
      "✅ Olgun kontrat (400 gün)",
      "✅ Kontrat doğrulanmış",
      "✅ Düşük merkezileşme riski (25%)"
    ]
  },
  "community_signals": [
    {
      "type": "positive",
      "sentiment": 0.7,
      "security_audit_history": {
        "audited": true,
        "findings": []
      }
    }
  ]
}
```

### Senaryo 2: Şüpheli Cüzdan

```json
{
  "risk_score": 75,
  "risk_level": "HIGH",
  "technical_analysis": {
    "score": 80,
    "findings": [
      "🆕 Çok yeni cüzdan",
      "⚠️ Çok az işlem (3)",
      "🔴 2 şüpheli token tespit edildi",
      "⚠️ Dolandırıcılıklarla etkileşim tespit edildi"
    ]
  },
  "community_signals": [
    {
      "type": "negative",
      "reporter_count": 5,
      "scam_reports": 3
    }
  ]
}
```

### Senaryo 3: Riskli NFT Koleksiyonu

```json
{
  "risk_score": 65,
  "risk_level": "HIGH",
  "technical_analysis": {
    "score": 70,
    "findings": [
      "⚠️ Düşük fiyat istikrarı (25%)",
      "📉 Azalan işlem hacmi",
      "⚠️ Düşük özellik çeşitliliği"
    ]
  },
  "community_signals": [
    {
      "type": "negative",
      "sentiment": -0.6,
      "community_growth_rate": -20
    }
  ]
}
```

## 📊 İstatistikler

### Ağırlık Dağılımı

```
Teknik Analiz (60%)
├─ Smart Contract (Token/dApp)
├─ On-chain Behavior (Wallet)
├─ Blockchain Data (NFT)
└─ Kritik Riskler

Topluluk Sinyalleri (40%)
├─ Social Media (50%)
└─ Threat Intelligence (50%)
```

### Skor Dağılımı (Örnek)

```
0-30 (Düşük):    ████████████████░░░░░░░░ 40%
31-60 (Orta):    ████████████░░░░░░░░░░░░ 35%
61-100 (Yüksek): ██████░░░░░░░░░░░░░░░░░░ 25%
```

## 🔗 İlgili Kaynaklar

- [ARCHITECTURE.md](ARCHITECTURE.md) - Sistem mimarisi
- [PAYMENT_GUIDE.md](PAYMENT_GUIDE.md) - Ödeme sistemi
- [INTENT_EXAMPLES.md](INTENT_EXAMPLES.md) - Kullanım örnekleri

---

**Not:** Bu risk analizi bilgilendirme amaçlıdır. Yatırım kararları vermeden önce kendi araştırmanızı yapın (DYOR - Do Your Own Research).
