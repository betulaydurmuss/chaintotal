// Asset Types
export type AssetType = 'wallet' | 'token' | 'dapp' | 'nft' | 'website'

// Risk Levels
export type RiskLevel = 'low' | 'medium' | 'high'

// Analysis Result
export interface AnalysisResult {
  queryId: string
  assetType: AssetType
  assetIdentifier: string
  riskScore: number
  riskLevel: RiskLevel
  technicalScore: number
  communityScore: number
  timestamp: string
  cached: boolean
  analysis: {
    technical: TechnicalAnalysis
    community: CommunityAnalysis
    security: SecurityAnalysis
  }
}

export interface TechnicalAnalysis {
  score: number
  factors: Array<{
    name: string
    value: number
    description: string
  }>
  onChainData?: {
    transactionCount: number
    balance: string
    firstSeen: string
    lastActive: string
  }
}

export interface CommunityAnalysis {
  score: number
  sentiment: 'positive' | 'neutral' | 'negative'
  reports: number
  signals: Array<{
    source: string
    type: 'positive' | 'negative'
    description: string
    timestamp: string
  }>
}

export interface SecurityAnalysis {
  vulnerabilities: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical'
    title: string
    description: string
  }>
  recommendations: string[]
}

// Query History
export interface QueryRecord {
  queryId: string
  assetType: AssetType
  assetIdentifier: string
  riskScore: number
  riskLevel: RiskLevel
  timestamp: string
  cached: boolean
  status: 'success' | 'failed' | 'pending'
}

// Payment
export interface PaymentRecord {
  txHash: string
  amount: number
  assetCode: string
  status: 'confirmed' | 'pending' | 'failed'
  timestamp: string
}

// Analytics
export interface PlatformAnalytics {
  totalQueries: number
  paymentSuccessRate: number
  cacheHitRate: number
  averageProcessingTime: number
  topAssets: Array<{
    assetType: AssetType
    count: number
  }>
}

// Revenue
export interface RevenueStats {
  totalRevenue: number
  averageQueriesPerUser: number
  paymentSuccessRate: number
  topSpenders: Array<{
    userWallet: string
    totalSpent: number
    queryCount: number
  }>
}

// Session
export interface SessionStats {
  totalQueries: number
  successfulQueries: number
  failedQueries: number
  cacheHits: number
  totalPayments: number
  totalSpent: number
}

// User
export interface User {
  wallet: string
  balance: number
  queryCount: number
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Analyze Request
export interface AnalyzeRequest {
  query: string
  userWallet: string
}

// Analyze Response
export interface AnalyzeResponse {
  success: boolean
  response: string
  executionTime: number
  toolCalls: number
}
