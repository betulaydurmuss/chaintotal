/**
 * Application constants
 */

export const APP_NAME = 'ChainTotal'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Topluluk Destekli Tehdit İstihbaratı ve Risk Skorlama Platformu'

/**
 * API Configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const API_TIMEOUT = 30000 // 30 seconds

/**
 * Cache Configuration
 */
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
}

/**
 * Risk Levels
 */
export const RISK_LEVELS = {
  LOW: { min: 0, max: 30, label: 'Düşük Risk', color: '#00FF00' },
  MEDIUM: { min: 31, max: 60, label: 'Orta Risk', color: '#FFB800' },
  HIGH: { min: 61, max: 100, label: 'Yüksek Risk', color: '#FF0055' },
} as const

/**
 * Asset Types
 */
export const ASSET_TYPES = {
  WALLET: { id: 'wallet', label: 'Wallet', icon: '🔐' },
  TOKEN: { id: 'token', label: 'Token', icon: '🪙' },
  DAPP: { id: 'dapp', label: 'dApp', icon: '📱' },
  NFT: { id: 'nft', label: 'NFT', icon: '🖼️' },
  WEBSITE: { id: 'website', label: 'Website', icon: '🌐' },
} as const

/**
 * Query Status
 */
export const QUERY_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const

/**
 * Payment Configuration
 */
export const PAYMENT = {
  AMOUNT_PER_QUERY: 1,
  CURRENCY: 'x402',
  TIMEOUT: 30000, // 30 seconds
} as const

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const

/**
 * Animation Durations (ms)
 */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 600,
} as const

/**
 * Breakpoints (px)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const
