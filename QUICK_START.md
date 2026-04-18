# 🚀 ChainTotal - Hızlı Başlangıç Rehberi

## 📋 Ön Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Stellar testnet hesabı
- x402 token (test için)

## ⚡ 5 Dakikada Başlangıç

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd chaintotal-risk-agent
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Konfigürasyonu Ayarlayın

```bash
# .env dosyasını oluşturun
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Stellar Network
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Agent Wallet (Kendi secret key'inizi girin)
AGENT_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# x402 Token
X402_TOKEN_ISSUER=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
X402_TOKEN_CODE=x402
PAYMENT_AMOUNT=1

# User Wallet (Test için)
USER_WALLET=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Debug Mode
DEBUG=true
```

### 4. Projeyi Derleyin

```bash
npm run build
```

### 5. Çalıştırın!

#### Örnek Analiz:

```bash
npm start
```

#### İnteraktif CLI:

```bash
npm run start:cli
```

## 🎮 İlk Kullanım

### CLI Modunda

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        🔐 ChainTotal Risk Assessment Agent 🔐            ║
║                                                           ║
║     Topluluk Destekli Tehdit İstihbaratı Platformu      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

💬 Siz: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb adresini analiz et

🤖 ChainTotal:
✅ Analiz Tamamlandı!

📊 Risk Skoru: 45/100
🎯 Risk Seviyesi: Orta Risk

📋 Risk Faktörleri:
   • Topluluk Sinyalleri: 35/100
   • Teknik Analiz: 50/100
   • Varlık Tipi: 30/100
```

## 📝 Örnek Komutlar

### Risk Analizi

```
"0x1234... adresini analiz et"
"BTC token güvenli mi?"
"https://example.com sitesi hakkında bilgi ver"
"Bu NFT koleksiyonu riskli mi?"
```

### Yardım

```
"Nasıl kullanılıyor?"
"Risk skoru nasıl hesaplanıyor?"
"Yardım"
```

### Geçmiş

```
"Son 5 analiz sonucumu göster"
"Geçmiş sorgularımı listele"
```

### Ödeme

```
"Ödeme durumu nedir?"
"Son işlemim neden başarısız oldu?"
```

## 🧪 Test Etme

### Intent Classifier Testi

```bash
# Otomatik testler
npm run test:intent

# İnteraktif test
npm run test:intent:interactive
```

### Development Modu

```bash
# TypeScript'i derlemeden çalıştır
npm run dev:cli
```

## 🔧 Sorun Giderme

### Hata: "AGENT_SECRET_KEY eksik!"

**Çözüm:** `.env` dosyasında `AGENT_SECRET_KEY` değişkenini ayarlayın.

```bash
# Stellar testnet hesabı oluşturun
# https://laboratory.stellar.org/#account-creator

# Secret key'i .env dosyasına ekleyin
AGENT_SECRET_KEY=SXXXXXX...
```

### Hata: "Yetersiz bakiye!"

**Çözüm:** Stellar testnet hesabınıza x402 token ekleyin.

```bash
# 1. Testnet'te XLM alın (friendbot)
# 2. x402 token trustline ekleyin
# 3. x402 token alın
```

### Hata: "Module not found"

**Çözüm:** Bağımlılıkları yeniden yükleyin.

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Daha Fazla Bilgi

- [README.md](README.md) - Genel bakış
- [ARCHITECTURE.md](ARCHITECTURE.md) - Mimari detayları
- [INTENT_EXAMPLES.md](INTENT_EXAMPLES.md) - Intent örnekleri

## 🎯 Sonraki Adımlar

1. ✅ Projeyi çalıştırdınız
2. 📖 [INTENT_EXAMPLES.md](INTENT_EXAMPLES.md) dosyasını okuyun
3. 🧪 Farklı komutları deneyin
4. 🔧 Kendi varlıklarınızı analiz edin
5. 🚀 Gerçek API'leri entegre edin

## 💡 İpuçları

### Debug Modu

`.env` dosyasında `DEBUG=true` ayarlayarak detaylı logları görebilirsiniz:

```env
DEBUG=true
```

### Stellar Testnet

Stellar testnet'te test yapmak için:

1. [Stellar Laboratory](https://laboratory.stellar.org/#account-creator) ile hesap oluşturun
2. Friendbot ile XLM alın
3. x402 token için trustline ekleyin

### Özel Token Kullanımı

Kendi token'ınızı kullanmak için `.env` dosyasını düzenleyin:

```env
X402_TOKEN_ISSUER=YOUR_TOKEN_ISSUER_PUBLIC_KEY
X402_TOKEN_CODE=YOUR_TOKEN_CODE
PAYMENT_AMOUNT=1
```

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz:

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📞 Destek

Sorularınız için:

- GitHub Issues
- Documentation
- Community Forum

---

**Başarılar! 🎉**

ChainTotal ile güvenli kripto deneyimi!
