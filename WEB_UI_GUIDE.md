# 🎨 ChainTotal Web UI Guide

## Overview

ChainTotal artık modern, kullanıcı dostu bir web arayüzüne sahip! Cyberpunk temalı, responsive tasarımıyla tüm CLI özelliklerine tarayıcınızdan erişebilirsiniz.

## 🚀 Quick Start

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Projeyi Build Edin

```bash
npm run build
```

### 3. Web Sunucusunu Başlatın

```bash
# Development mode (TypeScript)
npm run dev:server

# Production mode (JavaScript)
npm run start:server
```

### 4. Tarayıcıda Açın

```
http://localhost:3000
```

## 🎯 Features

### 🔍 Asset Analysis
- **Instant Search**: Wallet, token, dApp, NFT veya website analizi
- **Real-time Results**: Canlı risk skorlama ve detaylı analiz
- **Cache Support**: 24 saat cache ile hızlı sonuçlar
- **Payment Integration**: Stellar x402 micropayment entegrasyonu

### 📊 Live Dashboard
- **Query Analytics**: Toplam sorgu, başarı oranı, cache hit rate
- **Revenue Tracking**: Gelir istatistikleri ve top spenders
- **Network Status**: Real-time bağlantı durumu
- **Auto-refresh**: Her 30 saniyede otomatik güncelleme

### 🎨 Modern UI/UX
- **Cyberpunk Theme**: Cyan-purple gradient, dark mode
- **Responsive Design**: Mobile, tablet, desktop uyumlu
- **Smooth Animations**: Fade-in, pulse, loading states
- **Interactive Elements**: Hover effects, glow effects

## 🏗️ Architecture

### Frontend (public/)
```
public/
├── index.html          # Main HTML page
└── app.js             # Frontend JavaScript
```

### Backend (src/)
```
src/
├── server.ts          # Express.js REST API
├── agent.ts           # ChainTotal Agent
├── tools/             # KIRO AI Agent Framework
├── analytics/         # Analytics & monitoring
└── stellar/           # Payment service
```

## 📡 API Endpoints

### Analysis
```http
POST /api/analyze
Content-Type: application/json

{
  "query": "0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b",
  "userWallet": "GCZAMPLE..."
}
```

### Analytics
```http
GET /api/analytics
```

Response:
```json
{
  "totalQueries": 150,
  "paymentSuccessRate": 95.5,
  "cacheHitRate": 42.3,
  "averageProcessingTime": 1234,
  "topAssets": [...]
}
```

### Revenue
```http
GET /api/revenue
```

Response:
```json
{
  "totalRevenue": 150,
  "averageQueriesPerUser": 3.5,
  "paymentSuccessRate": 95.5,
  "topSpenders": [...]
}
```

### Fraud Detection
```http
GET /api/fraud
```

Response:
```json
{
  "recentAlerts": [...],
  "blockedUsersCount": 5,
  "blockedUsers": [...]
}
```

### Health Check
```http
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-04-18T14:30:00Z",
  "version": "1.2.0"
}
```

## 🎨 UI Components

### Hero Search Card
- Gradient background (cyan-purple)
- Large search input
- Asset type badges (Wallet, Token, dApp, NFT, Website)
- Analyze button with loading state

### Stats Bar
- 4 real-time metrics cards
- Auto-updating every 30 seconds
- Animated counters
- Status indicators

### Results Section
- JSON formatted results
- Syntax highlighting
- Scrollable content
- Fade-in animation

### Analytics Cards
- Query analytics (left)
- Revenue stats (right)
- Color-coded metrics
- Icon indicators

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Stellar Network
STELLAR_NETWORK=testnet
SERVICE_WALLET_SECRET=SXXX...
SERVICE_WALLET_PUBLIC=GXXX...

# User (Demo)
USER_WALLET=GCZAMPLE...
```

### CORS Configuration

Default: All origins allowed in development

Production: Configure in `src/server.ts`:
```typescript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

## 🎯 Usage Examples

### Example 1: Analyze Wallet
```javascript
// Input
0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b

// Output
{
  "success": true,
  "response": "✅ Analiz Tamamlandı!\n\n📊 Risk Skoru: 35/100 (DÜŞÜK)\n...",
  "executionTime": "1234ms",
  "toolCalls": 4
}
```

### Example 2: Check Token
```javascript
// Input
USDC token analiz et

// Output
{
  "success": true,
  "response": "✅ Token Analizi\n\n🪙 Token: USDC\n📊 Risk: 15/100 (ÇOK DÜŞÜK)\n...",
  "executionTime": "890ms",
  "toolCalls": 3
}
```

## 🚀 Deployment

### Development
```bash
npm run dev:server
```

### Production
```bash
# Build
npm run build

# Start with PM2
npm run pm2:start

# Or direct
npm run start:server
```

### Docker (Optional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
COPY public ./public
EXPOSE 3000
CMD ["npm", "run", "start:server"]
```

## 🔒 Security

### CORS
- Configure allowed origins
- Enable credentials if needed
- Restrict in production

### Rate Limiting
- Fraud detector: 5/min, 50/hour, 200/day
- Automatic blocking for abuse
- IP-based tracking

### Input Validation
- Sanitize user inputs
- Validate wallet addresses
- Prevent injection attacks

### HTTPS
- Use HTTPS in production
- Configure SSL certificates
- Redirect HTTP to HTTPS

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:3000/api/health
```

### Logs
```bash
# PM2 logs
npm run pm2:logs

# Or direct
tail -f logs/chaintotal.log
```

### Metrics
- Query count
- Success rate
- Response time
- Error rate
- Cache hit rate

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check port availability
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

### API Not Responding
```bash
# Check server status
npm run health

# Check logs
npm run pm2:logs
```

### CORS Errors
```javascript
// Update server.ts
app.use(cors({
  origin: '*', // Or specific domain
  credentials: true
}));
```

### Build Errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## 🎨 Customization

### Theme Colors
Edit `public/index.html`:
```css
.gradient-cyan-purple {
  background: linear-gradient(135deg, #00D9FF 0%, #B100FF 100%);
}
```

### API Base URL
Edit `public/app.js`:
```javascript
const API_BASE_URL = 'https://api.yourdomain.com';
```

### Refresh Interval
Edit `public/app.js`:
```javascript
// Change from 30s to 60s
setInterval(refreshStats, 60000);
```

## 📚 Additional Resources

- [KIRO Agent Integration](./KIRO_AGENT_INTEGRATION.md)
- [Analytics Guide](./ANALYTICS_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [API Documentation](./API_DOCUMENTATION.md)

## 🤝 Support

For issues or questions:
1. Check logs: `npm run pm2:logs`
2. Review documentation
3. Check GitHub issues
4. Contact support team

## 📝 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by ChainTotal Team**

🔐 Topluluk Destekli Tehdit İstihbaratı Platformu
