# Intent Classification Examples

Bu dokümanda ChainTotal Risk Assessment Agent'ın desteklediği intent'ler ve örnek kullanıcı girdileri listelenmiştir.

## 1. QUERY_RISK_SCORE (Risk Skoru Sorgulama)

Kullanıcı bir kripto varlığın risk skorunu öğrenmek istiyor.

### Cüzdan Adresi Sorguları

```
✅ "Bu cüzdan adresi 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb hakkında bilgi ver"
✅ "0x1234567890123456789012345678901234567890 adresini analiz et"
✅ "GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ cüzdanı güvenli mi?"
✅ "Bu wallet adresi riskli mi?"
```

### Token Sorguları

```
✅ "BTC token güvenli mi?"
✅ "ETH hakkında risk raporu yap"
✅ "USDT token analiz et"
✅ "XRP coin riskli mi?"
✅ "DOGE token hakkında bilgi ver"
```

### NFT Sorguları

```
✅ "Bu NFT koleksiyonu hakkında risk raporu yap"
✅ "CryptoPunks NFT güvenli mi?"
✅ "Bu NFT'yi almadan önce analiz et"
✅ "NFT koleksiyonu riskli mi?"
```

### dApp Sorguları

```
✅ "Bu dApp güvenli mi?"
✅ "Uniswap platformu hakkında bilgi ver"
✅ "Bu DeFi uygulaması riskli mi?"
```

### Website Sorguları

```
✅ "https://example.com sitesi güvenli mi?"
✅ "Bu website hakkında risk analizi yap"
✅ "https://crypto-exchange.com güvenilir mi?"
```

### Genel Sorgular

```
✅ "Bu varlığı analiz et"
✅ "Risk skorunu hesapla"
✅ "Güvenli mi?"
✅ "Kontrol et"
✅ "İncele"
```

---

## 2. CHECK_PAYMENT_STATUS (Ödeme Durumu Kontrolü)

Kullanıcı önceki işlemin ödeme durumunu kontrol etmek istiyor.

### Örnekler

```
✅ "Son işlemim niye başarısız oldu?"
✅ "Ödeme durumu nedir?"
✅ "Ödemem kesildi mi?"
✅ "Para gitti mi?"
✅ "Transaction başarılı mı?"
✅ "Bakiyem yetersiz miydi?"
✅ "Ödeme hatası neydi?"
✅ "İşlem neden iptal oldu?"
```

---

## 3. VIEW_HISTORY (Geçmiş Görüntüleme)

Kullanıcı geçmiş sorguları ve sonuçlarını görmek istiyor.

### Örnekler

```
✅ "Daha önce hangi varlıkları sorgulmuşum?"
✅ "Son 5 analiz sonucumu göster"
✅ "Son 10 işlemi listele"
✅ "Geçmiş sorgularımı göster"
✅ "Önceki analizlerimi görmek istiyorum"
✅ "Hangi adresleri kontrol etmiştim?"
✅ "Geçmişimi listele"
✅ "History"
```

---

## 4. GET_HELP (Yardım Talebi)

Kullanıcı platformun nasıl çalıştığını öğrenmek istiyor.

### Örnekler

```
✅ "Nasıl kullanılıyor?"
✅ "Risk skoru nasıl hesaplanıyor?"
✅ "Yardım"
✅ "Help"
✅ "Bu platform nedir?"
✅ "Nasıl çalışır?"
✅ "Başlangıç rehberi"
✅ "Kullanım kılavuzu"
✅ "Risk faktörleri nelerdir?"
✅ "Ödeme sistemi nasıl çalışıyor?"
✅ "x402 token nedir?"
```

---

## Intent Tanıma Özellikleri

### 🎯 Doğal Dil İşleme

Agent, kullanıcıların doğal dilde yazdığı metinleri anlayabilir:

- ✅ Türkçe ve İngilizce desteklenir
- ✅ Büyük/küçük harf duyarsız
- ✅ Farklı ifade şekilleri desteklenir
- ✅ Yazım hataları tolere edilir (sınırlı)

### 📊 Güven Skoru

Her intent tanıma işlemi bir güven skoru (0-1) ile gelir:

- **0.8-1.0**: Yüksek güven - Intent kesin
- **0.5-0.8**: Orta güven - Intent muhtemel
- **0.3-0.5**: Düşük güven - Intent belirsiz
- **0.0-0.3**: Çok düşük güven - UNKNOWN olarak işaretlenir

### 🔍 Parametre Çıkarma

Agent, kullanıcı girdisinden otomatik olarak parametreleri çıkarır:

- **Cüzdan Adresleri**: Ethereum (0x...) ve Stellar (G...) formatları
- **Token Sembolleri**: BTC, ETH, USDT gibi büyük harfli kısaltmalar
- **URL'ler**: http:// veya https:// ile başlayan linkler
- **Sayılar**: "Son 5 analiz" gibi ifadelerden limit değerleri

### 🧪 Test Etme

Intent classifier'ı test etmek için:

```bash
# Otomatik testleri çalıştır
npm run test:intent

# İnteraktif test modu
npm run test:intent:interactive
```

---

## Örnek Kullanım Senaryoları

### Senaryo 1: Cüzdan Analizi

```
Kullanıcı: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb adresini kontrol et"

Intent: QUERY_RISK_SCORE
Güven: 95%
Parametreler:
  - assetType: wallet
  - identifier: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

Aksiyon: Risk analizi başlatılır, 1 x402 token ödeme alınır
```

### Senaryo 2: Token Güvenlik Kontrolü

```
Kullanıcı: "BTC token güvenli mi?"

Intent: QUERY_RISK_SCORE
Güven: 85%
Parametreler:
  - assetType: token
  - identifier: BTC

Aksiyon: BTC token için risk analizi yapılır
```

### Senaryo 3: Geçmiş Sorgulama

```
Kullanıcı: "Son 10 analiz sonucumu göster"

Intent: VIEW_HISTORY
Güven: 90%
Parametreler:
  - limit: 10

Aksiyon: Kullanıcının son 10 analiz sonucu listelenir
```

### Senaryo 4: Yardım İsteği

```
Kullanıcı: "Risk skoru nasıl hesaplanıyor?"

Intent: GET_HELP
Güven: 92%
Parametreler: (yok)

Aksiyon: Risk skorlama sistemi hakkında detaylı bilgi verilir
```

---

## Gelişmiş Özellikler

### Çoklu Varlık Desteği

Gelecek versiyonlarda desteklenecek:

```
"Bu 3 cüzdanı karşılaştır: 0x123..., 0x456..., 0x789..."
"BTC ve ETH'yi karşılaştırmalı analiz et"
```

### Bağlamsal Anlama

```
Kullanıcı: "0x123... adresini analiz et"
Agent: [Analiz yapılır]

Kullanıcı: "Peki bu nasıl?"
Agent: [Önceki bağlamı hatırlar, "bu" kelimesini anlar]
```

### Çok Dilli Destek

Şu anda: Türkçe + İngilizce
Gelecek: Çince, Japonca, İspanyolca, vb.

---

## Hata Durumları

### Belirsiz Girdi

```
Kullanıcı: "Merhaba"

Intent: UNKNOWN
Güven: 0%

Yanıt: Yardım mesajı gösterilir
```

### Eksik Parametre

```
Kullanıcı: "Token analiz et"

Intent: QUERY_RISK_SCORE
Güven: 70%
Parametreler:
  - assetType: token
  - identifier: (eksik)

Yanıt: "Hangi token'ı analiz etmek istersiniz?"
```

---

## Notlar

- Intent classification, pattern matching ve heuristic kurallar kullanır
- Gelecek versiyonlarda makine öğrenmesi modelleri eklenebilir
- Kullanıcı geri bildirimleri ile sürekli iyileştirme yapılabilir
