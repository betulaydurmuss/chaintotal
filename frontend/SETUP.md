# 🚀 ChainTotal Frontend - Setup Guide

## ✅ Proje Başlatıldı!

React tabanlı, modern bir cryptocurrency risk assessment dashboard'u oluşturuldu.

## 📦 Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd frontend
npm install
```

### 2. Backend'i Başlat

Önce backend API'nin çalıştığından emin olun:

```bash
# Ana dizinde (chaintotal/)
npm run dev:server
```

Backend: `http://localhost:3000`

### 3. Frontend'i Başlat

```bash
# frontend/ dizininde
npm run dev
```

Frontend: `http://localhost:5173`

## 🎯 Oluşturulan Dosyalar

### Konfigürasyon (7 dosya)
- ✅ `package.json` - Dependencies ve scripts
- ✅ `vite.config.ts` - Vite configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `tsconfig.node.json` - Node TypeScript config
- ✅ `tailwind.config.js` - Tailwind CSS config
- ✅ `postcss.config.js` - PostCSS config
- ✅ `index.html` - HTML entry point

### Core Files (4 dosya)
- ✅ `src/main.tsx` - React entry point
- ✅ `src/App.tsx` - Main app component
- ✅ `src/index.css` - Global styles
- ✅ `src/types/index.ts` - TypeScript types

### API & State (3 dosya)
- ✅ `src/api/client.ts` - API client with axios
- ✅ `src/stores/userStore.ts` - User state management
- ✅ `src/stores/analysisStore.ts` - Analysis state

### Components (2 dosya - başlangıç)
- ✅ `src/components/atoms/Button.tsx` - Button component
- ✅ `src/components/atoms/Badge.tsx` - Badge component

### Documentation (2 dosya)
- ✅ `README.md` - Comprehensive project documentation
- ✅ `SETUP.md` - This file

**Toplam**: 18 dosya oluşturuldu

## 🎨 Özellikler

### ✅ Hazır Olanlar
- React 18 + TypeScript setup
- Vite build tool
- Tailwind CSS styling
- Framer Motion animations
- Zustand state management
- TanStack Query (React Query)
- React Router v6
- API client with axios
- Type definitions
- Global styles
- Button & Badge components

### 🚧 Yapılacaklar (Sonraki Adımlar)

#### 1. Kalan Atom Components (6 adet)
- [ ] Input.tsx
- [ ] Spinner.tsx
- [ ] Icon.tsx
- [ ] Tag.tsx
- [ ] Chip.tsx
- [ ] Divider.tsx

#### 2. Molecule Components (7 adet)
- [ ] SearchBar.tsx
- [ ] InputField.tsx
- [ ] Tabs.tsx
- [ ] Toggle.tsx
- [ ] RiskScoreCircle.tsx
- [ ] MetricCard.tsx
- [ ] StatusIndicator.tsx

#### 3. Organism Components (7 adet)
- [ ] Header.tsx
- [ ] Sidebar.tsx
- [ ] Card.tsx
- [ ] Modal.tsx
- [ ] DataTable.tsx
- [ ] Feed.tsx
- [ ] DashboardGrid.tsx

#### 4. Layout Components (1 adet)
- [ ] Layout.tsx

#### 5. Pages (5 adet)
- [ ] Dashboard.tsx
- [ ] Results.tsx
- [ ] History.tsx
- [ ] Community.tsx
- [ ] NotFound.tsx

#### 6. Custom Hooks (4 adet)
- [ ] useAnalyze.ts
- [ ] useAnalytics.ts
- [ ] useDebounce.ts
- [ ] useMediaQuery.ts

#### 7. Utilities (3 adet)
- [ ] format.ts
- [ ] validation.ts
- [ ] constants.ts

#### 8. Storybook (50+ stories)
- [ ] Setup Storybook
- [ ] Create stories for all components
- [ ] Add documentation

## 📊 İlerleme

- **Konfigürasyon**: ✅ 100% (7/7)
- **Core Setup**: ✅ 100% (4/4)
- **API & State**: ✅ 100% (3/3)
- **Atoms**: 🟡 25% (2/8)
- **Molecules**: ⚪ 0% (0/7)
- **Organisms**: ⚪ 0% (0/7)
- **Layout**: ⚪ 0% (0/1)
- **Pages**: ⚪ 0% (0/5)
- **Hooks**: ⚪ 0% (0/4)
- **Utils**: ⚪ 0% (0/3)
- **Storybook**: ⚪ 0% (0/50+)

**Toplam İlerleme**: ~20%

## 🎯 Sonraki Adımlar

### Hemen Yapılabilecekler

1. **Kalan Atom Components'leri Oluştur**
   ```bash
   # Input, Spinner, Icon, Tag, Chip, Divider
   ```

2. **Layout Component'i Oluştur**
   ```bash
   # Header + Sidebar + Main content area
   ```

3. **Dashboard Page'i Oluştur**
   ```bash
   # Hero search + Stats + Recent queries
   ```

4. **API Integration Test**
   ```bash
   # Backend ile bağlantıyı test et
   ```

### Orta Vadeli

5. **Molecule Components**
6. **Organism Components**
7. **Kalan Pages**
8. **Custom Hooks**

### Uzun Vadeli

9. **Storybook Setup**
10. **Testing**
11. **Performance Optimization**
12. **Deployment**

## 🔧 Geliştirme Komutları

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run Storybook (henüz kurulmadı)
npm run storybook
```

## 🌐 URL'ler

- **Frontend Dev**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Storybook**: http://localhost:6006 (kurulunca)

## 📚 Kaynaklar

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Vite Documentation](https://vitejs.dev)

## 🤔 Sıkça Sorulan Sorular

### Q: Neden ayrı bir frontend klasörü?
A: Backend (Node.js/Express) ve frontend (React) ayrı projeler olarak yönetilmesi daha temiz ve ölçeklenebilir bir yapı sağlar.

### Q: Backend'i değiştirmem gerekiyor mu?
A: Hayır! Mevcut backend API'si aynen kullanılacak. Frontend sadece API'yi consume ediyor.

### Q: Tüm component'leri manuel mi oluşturacağız?
A: Evet, ama ben size yardımcı olacağım. Her component'i tek tek oluşturabiliriz.

### Q: Storybook nedir?
A: Component'leri izole bir şekilde görüntülemek ve dokümante etmek için kullanılan bir tool.

### Q: Production'a nasıl deploy edilir?
A: `npm run build` ile build alınır, `dist/` klasörü Vercel, Netlify veya herhangi bir static hosting'e deploy edilir.

## 🎉 Sonuç

Proje başarıyla başlatıldı! Temel yapı hazır, şimdi component'leri oluşturmaya başlayabiliriz.

**Devam etmek için ne yapmak istersiniz?**

1. Kalan atom component'leri oluştur
2. Layout ve Dashboard page'i oluştur
3. Tüm component'leri otomatik oluştur (hızlı)
4. Adım adım ilerle

---

**Proje**: ChainTotal Frontend
**Durum**: ✅ Başlatıldı
**İlerleme**: ~20%
**Tarih**: 2026-04-18
