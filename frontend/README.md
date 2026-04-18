# ChainTotal Frontend - React Dashboard

Modern, cyberpunk-themed cryptocurrency risk assessment dashboard built with React 18, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Storybook
npm run storybook
```

## 📦 Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Component Documentation**: Storybook

## 🎨 Design System

### Color Palette
- **Background**: `#0A0E27` (deep navy)
- **Surface**: `#12151F` (dark surface)
- **Primary**: `#00D9FF` (neon cyan)
- **Accent**: `#B100FF` (electric purple)
- **Success**: `#00FF00` (green)
- **Warning**: `#FFB800` (amber)
- **Danger**: `#FF0055` (hot pink)

### Typography
- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── atoms/           # Basic building blocks
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Tag.tsx
│   │   │   ├── Chip.tsx
│   │   │   └── Divider.tsx
│   │   ├── molecules/       # Composite components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── InputField.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── RiskScoreCircle.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   └── StatusIndicator.tsx
│   │   ├── organisms/       # Complex components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Feed.tsx
│   │   │   └── DashboardGrid.tsx
│   │   └── layout/          # Layout components
│   │       └── Layout.tsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Results.tsx
│   │   ├── History.tsx
│   │   ├── Community.tsx
│   │   └── NotFound.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useAnalyze.ts
│   │   ├── useAnalytics.ts
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   ├── stores/              # Zustand stores
│   │   ├── userStore.ts
│   │   └── analysisStore.ts
│   ├── api/                 # API client
│   │   └── client.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .storybook/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🧩 Component Library

### Atoms (8 components)
- `Button` - Primary, secondary, danger, ghost variants
- `Badge` - Status badges with color variants
- `Input` - Text input with validation states
- `Spinner` - Loading spinner
- `Icon` - Icon wrapper component
- `Tag` - Small label tags
- `Chip` - Removable chips
- `Divider` - Horizontal/vertical dividers

### Molecules (7 components)
- `SearchBar` - Search input with autocomplete
- `InputField` - Input with label and error message
- `Tabs` - Tab navigation component
- `Toggle` - Switch toggle component
- `RiskScoreCircle` - Animated circular progress
- `MetricCard` - Stat display card
- `StatusIndicator` - Status dot with label

### Organisms (7 components)
- `Header` - Top navigation bar
- `Sidebar` - Side navigation menu
- `Card` - Content card container
- `Modal` - Modal dialog
- `DataTable` - Sortable data table
- `Feed` - Activity feed
- `DashboardGrid` - Dashboard layout grid

## 📄 Pages

### 1. Dashboard (Home)
- Hero search card with gradient
- Asset type tabs
- Stats bar (Balance, Queries, Success Rate, Network)
- Recent queries grid

### 2. Results
- 3-column layout
- Animated risk score circle
- Tabbed analysis sections
- Quick actions sidebar

### 3. History
- Filter bar
- Sortable data table
- Pagination
- Export functionality

### 4. Community
- Threat alert feed
- Sentiment gauges
- Report statistics

## 🎭 Animations

- **Page Load**: Fade-in-up (600ms)
- **Risk Score**: Odometer counter (2s)
- **Loading**: Shimmer skeleton
- **Hover**: Scale + glow effect
- **Modal**: Scale-fade (300ms)

## 🔌 API Integration

The frontend connects to the ChainTotal backend API:

```typescript
// Base URL
const API_BASE_URL = 'http://localhost:3000'

// Endpoints
POST   /api/analyze
GET    /api/analytics
GET    /api/revenue
GET    /api/fraud
GET    /api/session/:wallet/stats
GET    /api/session/:wallet/history
GET    /api/health
```

## 🎨 Storybook

View all components in isolation:

```bash
npm run storybook
```

Access at: `http://localhost:6006`

## 📱 Responsive Design

- **Desktop** (>1920px): 3-column layout
- **Laptop** (1440-1920px): 2-3 columns
- **Tablet** (768-1440px): 2 columns + collapsible sidebar
- **Mobile** (<768px): 1 column + drawer menu

## ♿ Accessibility

- WCAG AA compliant
- Keyboard navigation support
- ARIA labels on interactive elements
- Semantic HTML
- Reduced motion support
- 7:1 color contrast ratio

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Environment Variables
```env
VITE_API_URL=http://localhost:3000
```

## 📝 Development Guidelines

### Component Structure
```tsx
import { ComponentProps } from './types'

export const Component = ({ prop1, prop2 }: ComponentProps) => {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  )
}
```

### Naming Conventions
- Components: PascalCase (`Button.tsx`)
- Hooks: camelCase with 'use' prefix (`useAnalyze.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: PascalCase (`AnalysisResult`)

### Code Style
- Use TypeScript for type safety
- Use Tailwind CSS for styling
- Use Framer Motion for animations
- Follow React best practices
- Write accessible code

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📚 Documentation

- [Component Documentation](./docs/components.md)
- [API Documentation](./docs/api.md)
- [Design System](./docs/design-system.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

MIT License

---

**Built with ❤️ by ChainTotal Team**

🔐 Topluluk Destekli Tehdit İstihbaratı Platformu
