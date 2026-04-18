export enum AssetType {
  WALLET = 'wallet',
  TOKEN = 'token',
  DAPP = 'dapp',
  NFT = 'nft',
  WEBSITE = 'website'
}

export enum RiskLevel {
  LOW = 'Düşük Risk',
  MEDIUM = 'Orta Risk',
  HIGH = 'Yüksek Risk'
}

export interface AnalysisRequest {
  assetType: AssetType;
  identifier: string;
  userWallet: string;
  transactionHash?: string; // Kullanıcı zaten ödeme yaptıysa
}

export interface RiskScore {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
}

export interface RiskFactor {
  category: string;
  score: number;
  description: string;
  weight: number;
  details?: Record<string, any>;
}

export interface AnalysisResult {
  success: boolean;
  queryId?: string; // UUID
  assetType: AssetType;
  identifier: string;
  riskScore: RiskScore;
  technicalAnalysis: TechnicalAnalysis;
  communitySignals: CommunitySignal[];
  recommendations: string[];
  timestamp: string;
  transactionId?: string;
  paymentRequired?: boolean;
  paymentDetails?: {
    destination: string;
    amount: string;
    assetCode: string;
    assetIssuer: string;
    memo: string;
    timeout: number;
  };
  retryAvailable?: boolean;
}

export interface TechnicalAnalysis {
  score: number; // 0-100
  weight: number; // 0.6 (60%)
  data: TechnicalData;
  findings: string[];
}

export interface CommunityAnalysis {
  score: number; // 0-100
  weight: number; // 0.4 (40%)
  signals: CommunitySignal[];
  findings: string[];
}

export interface CommunitySignal {
  source: string;
  type: 'positive' | 'negative' | 'neutral';
  confidence: number;
  description: string;
  
  // Social Media Signals
  mentionFrequency?: number;
  sentiment?: number; // -1 to 1
  communityGrowthRate?: number; // percentage
  reporterCount?: number;
  
  // External Threat Intelligence
  blacklistStatus?: boolean;
  scamReports?: number;
  securityAuditHistory?: {
    audited?: boolean;
    auditDate?: string;
    auditFirm?: string;
    findings?: string[];
  };
}

export interface TechnicalData {
  // Smart Contract Analysis (token/dApp)
  contractDeploymentDate?: string;
  contractAge?: number; // days
  ownerCentralizationRisk?: number; // 0-100
  knownVulnerabilities?: string[];
  contractVerified?: boolean;
  
  // On-chain Behavior (wallet)
  transactionCount?: number;
  transactionHistory?: {
    firstTransaction?: string;
    lastTransaction?: string;
    averageValue?: number;
  };
  tokenHoldingPatterns?: {
    diversification?: number; // 0-100
    suspiciousTokens?: number;
  };
  interactionWithScams?: boolean;
  
  // Blockchain Data (NFT/collection)
  floorPriceStability?: number; // 0-100
  tradingVolumeTrend?: 'increasing' | 'stable' | 'decreasing';
  rarityPatterns?: {
    uniqueTraits?: number;
    rarityScore?: number;
  };
  
  // General
  age?: number;
  volume?: number;
  knownScam?: boolean;
  blacklisted?: boolean;
}

export interface PaymentRequest {
  userWallet: string;
  transactionHash?: string; // Kullanıcı zaten ödeme yaptıysa
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  timestamp: string;
  paymentToken?: string; // HTTP Authorization için
  retryAvailable?: boolean;
  paymentRequired?: boolean;
  paymentDetails?: {
    destination: string;
    amount: string;
    assetCode: string;
    assetIssuer: string;
    memo: string;
    timeout: number;
  };
  errorCode?: string;
  fallbackAction?: {
    type: 'faucet' | 'retry' | 'wait' | 'correct_input';
    description: string;
    link?: string;
  };
}

export interface PaymentVerification {
  verified: boolean;
  transactionHash: string;
  error?: string;
  amount?: number;
  from?: string;
  ledger?: number;
  timestamp?: string;
}
