import { PaymentService } from '../stellar/paymentService';
import { DataCollector } from '../analysis/dataCollector';
import { RiskCalculator } from '../analysis/riskCalculator';
import { SessionManager } from '../session/sessionManager';
import { CacheService } from '../session/cacheService';
import { AssetType } from '../types';
import { validateToolParams } from './toolRegistry';

/**
 * Tool Executor
 * 
 * KIRO AI Agent Framework tool execution engine
 */

export interface ToolCall {
  tool: string;
  params: Record<string, any>;
  expected_output?: string;
}

export interface ToolResult {
  success: boolean;
  output: any;
  error?: string;
  execution_time: number;
}

export class ToolExecutor {
  private paymentService: PaymentService;
  private dataCollector: DataCollector;
  private riskCalculator: RiskCalculator;
  private sessionManager: SessionManager;
  private cacheService: CacheService;
  
  // Error recovery
  private readonly MAX_RETRIES = 3;
  private circuitBreaker: Map<string, { failures: number; lastFailure: number }>;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 dakika

  constructor(
    paymentService: PaymentService,
    dataCollector: DataCollector,
    riskCalculator: RiskCalculator,
    sessionManager: SessionManager,
    cacheService: CacheService
  ) {
    this.paymentService = paymentService;
    this.dataCollector = dataCollector;
    this.riskCalculator = riskCalculator;
    this.sessionManager = sessionManager;
    this.cacheService = cacheService;
    this.circuitBreaker = new Map();
  }

  /**
   * Tool çağrısını execute et
   */
  async executeTool(toolCall: ToolCall): Promise<ToolResult> {
    const startTime = Date.now();

    try {
      console.log(`\n🔧 Tool Execution: ${toolCall.tool}`);
      console.log(`📋 Parameters:`, JSON.stringify(toolCall.params, null, 2));

      // Parametre validasyonu
      const validation = validateToolParams(toolCall.tool, toolCall.params);
      if (!validation.valid) {
        return {
          success: false,
          output: null,
          error: `Parameter validation failed: ${validation.errors.join(', ')}`,
          execution_time: Date.now() - startTime
        };
      }

      // Circuit breaker kontrolü
      if (this.isCircuitOpen(toolCall.tool)) {
        return {
          success: false,
          output: null,
          error: 'Circuit breaker is open. Service temporarily unavailable.',
          execution_time: Date.now() - startTime
        };
      }

      // Retry logic ile tool execute et
      const result = await this.executeWithRetry(toolCall);

      // Circuit breaker güncelle
      if (result.success) {
        this.recordSuccess(toolCall.tool);
      } else {
        this.recordFailure(toolCall.tool);
      }

      result.execution_time = Date.now() - startTime;
      console.log(`✅ Tool execution completed in ${result.execution_time}ms\n`);

      return result;

    } catch (error: any) {
      this.recordFailure(toolCall.tool);
      
      return {
        success: false,
        output: null,
        error: error.message,
        execution_time: Date.now() - startTime
      };
    }
  }

  /**
   * Retry logic ile tool execute et
   */
  private async executeWithRetry(toolCall: ToolCall, attempt: number = 1): Promise<ToolResult> {
    try {
      const result = await this.executeToolInternal(toolCall);
      return result;
    } catch (error: any) {
      console.log(`⚠️  Attempt ${attempt} failed: ${error.message}`);

      if (attempt < this.MAX_RETRIES) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`🔄 Retrying in ${delay}ms...`);
        await this.sleep(delay);
        
        return this.executeWithRetry(toolCall, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Tool'u internal olarak execute et
   */
  private async executeToolInternal(toolCall: ToolCall): Promise<ToolResult> {
    switch (toolCall.tool) {
      case 'stellar_payment_initiator':
        return await this.executeStellarPayment(toolCall.params);
      
      case 'risk_analysis_engine':
        return await this.executeRiskAnalysis(toolCall.params);
      
      case 'community_intelligence_fetcher':
        return await this.executeCommunityIntelligence(toolCall.params);
      
      case 'blockchain_data_aggregator':
        return await this.executeBlockchainData(toolCall.params);
      
      case 'session_manager':
        return await this.executeSessionManager(toolCall.params);
      
      default:
        throw new Error(`Unknown tool: ${toolCall.tool}`);
    }
  }

  /**
   * stellar_payment_initiator tool
   */
  private async executeStellarPayment(params: any): Promise<ToolResult> {
    const paymentRequest = {
      userWallet: params.user_wallet,
      transactionHash: params.transaction_hash
    };

    const result = await this.paymentService.requestPayment(paymentRequest);

    return {
      success: result.success,
      output: {
        tx_hash: result.transactionId,
        status: result.success ? 'success' : 'failed',
        error: result.error
      },
      execution_time: 0
    };
  }

  /**
   * risk_analysis_engine tool
   */
  private async executeRiskAnalysis(params: any): Promise<ToolResult> {
    // Cache kontrolü
    const assetType = params.asset_type as AssetType;
    const cachedResult = await this.cacheService.getCachedResult(assetType, params.asset_id);

    if (cachedResult) {
      console.log(`💾 Cache hit: ${params.asset_id}`);
      return {
        success: true,
        output: {
          risk_score: cachedResult.result.riskScore.score,
          risk_level: cachedResult.result.riskScore.level,
          analysis_data: {
            technical_analysis: cachedResult.result.technicalAnalysis,
            community_signals: cachedResult.result.communitySignals,
            recommendations: cachedResult.result.recommendations
          },
          cached: true,
          cache_age_hours: cachedResult.ageInHours
        },
        execution_time: 0
      };
    }

    // Yeni analiz
    const [communitySignals, technicalData] = await Promise.all([
      this.dataCollector.collectCommunitySignals(assetType, params.asset_id),
      this.dataCollector.collectTechnicalData(assetType, params.asset_id)
    ]);

    const riskScore = this.riskCalculator.calculateRiskScore(
      assetType,
      communitySignals,
      technicalData
    );

    return {
      success: true,
      output: {
        risk_score: riskScore.score,
        risk_level: riskScore.level,
        analysis_data: {
          technical_analysis: {
            score: riskScore.factors.find(f => f.category === 'Teknik Analiz')?.score || 0,
            findings: riskScore.factors.find(f => f.category === 'Teknik Analiz')?.details?.findings || []
          },
          community_signals: communitySignals,
          recommendations: this.generateRecommendations(riskScore.score)
        },
        cached: false
      },
      execution_time: 0
    };
  }

  /**
   * community_intelligence_fetcher tool
   */
  private async executeCommunityIntelligence(params: any): Promise<ToolResult> {
    const assetType = params.asset_type as AssetType;
    const signals = await this.dataCollector.collectCommunitySignals(assetType, params.asset_identifier);

    // Aggregate data
    const sentiment = signals.reduce((sum, s) => sum + (s.sentiment || 0), 0) / signals.length || 0;
    const reports = signals.filter(s => s.reporterCount && s.reporterCount > 0);
    const mentionFrequency = signals.reduce((sum, s) => sum + (s.mentionFrequency || 0), 0);
    const growthRate = signals.reduce((sum, s) => sum + (s.communityGrowthRate || 0), 0) / signals.length || 0;

    return {
      success: true,
      output: {
        sentiment,
        reports: reports.map(r => ({
          source: r.source,
          count: r.reporterCount,
          description: r.description
        })),
        community_size: Math.floor(Math.random() * 10000), // Mock
        mention_frequency: mentionFrequency,
        growth_rate: growthRate
      },
      execution_time: 0
    };
  }

  /**
   * blockchain_data_aggregator tool
   */
  private async executeBlockchainData(params: any): Promise<ToolResult> {
    // Mock implementation
    // Gerçek uygulamada blockchain explorer API'leri kullanılır
    
    return {
      success: true,
      output: {
        tx_history: [
          { hash: 'tx1', timestamp: new Date().toISOString(), value: 100 },
          { hash: 'tx2', timestamp: new Date().toISOString(), value: 200 }
        ],
        holder_data: {
          total_holders: 1000,
          top_holders: [
            { address: '0x123...', balance: 10000 },
            { address: '0x456...', balance: 5000 }
          ]
        },
        contract_code: '// Smart contract code...',
        verified: true
      },
      execution_time: 0
    };
  }

  /**
   * session_manager tool
   */
  private async executeSessionManager(params: any): Promise<ToolResult> {
    let result: any;

    switch (params.action) {
      case 'get_stats':
        result = this.sessionManager.getSessionStats(params.user_wallet);
        break;
      
      case 'get_history':
        result = this.sessionManager.getQueryHistory(params.user_wallet, 10);
        break;
      
      case 'get_payments':
        result = this.sessionManager.getPaymentLedger(params.user_wallet, 10);
        break;
      
      case 'check_cache':
        if (params.asset_type && params.asset_identifier) {
          const cached = await this.cacheService.getCachedResult(
            params.asset_type as AssetType,
            params.asset_identifier
          );
          result = cached ? { cached: true, age_hours: cached.ageInHours } : { cached: false };
        } else {
          result = { error: 'asset_type and asset_identifier required for cache check' };
        }
        break;
      
      case 'end_session':
        this.sessionManager.endSession(params.user_wallet);
        result = { ended: true };
        break;
      
      default:
        throw new Error(`Unknown session action: ${params.action}`);
    }

    return {
      success: true,
      output: { result },
      execution_time: 0
    };
  }

  /**
   * Circuit breaker kontrolü
   */
  private isCircuitOpen(toolName: string): boolean {
    const state = this.circuitBreaker.get(toolName);
    
    if (!state) {
      return false;
    }

    // Threshold'u aştıysa ve timeout geçmediyse circuit open
    if (state.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      const timeSinceLastFailure = Date.now() - state.lastFailure;
      if (timeSinceLastFailure < this.CIRCUIT_BREAKER_TIMEOUT) {
        console.log(`⚠️  Circuit breaker is OPEN for ${toolName}`);
        return true;
      } else {
        // Timeout geçti, reset et
        this.circuitBreaker.delete(toolName);
      }
    }

    return false;
  }

  /**
   * Başarılı execution kaydı
   */
  private recordSuccess(toolName: string): void {
    this.circuitBreaker.delete(toolName);
  }

  /**
   * Başarısız execution kaydı
   */
  private recordFailure(toolName: string): void {
    const state = this.circuitBreaker.get(toolName) || { failures: 0, lastFailure: 0 };
    state.failures++;
    state.lastFailure = Date.now();
    this.circuitBreaker.set(toolName, state);

    if (state.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      console.log(`🚨 Circuit breaker OPENED for ${toolName} (${state.failures} failures)`);
    }
  }

  /**
   * Öneriler oluştur
   */
  private generateRecommendations(riskScore: number): string[] {
    if (riskScore >= 70) {
      return [
        '⚠️ YÜKSEK RİSK: Bu varlıkla etkileşime girmekten kaçının',
        '🔍 Detaylı araştırma yapın'
      ];
    } else if (riskScore >= 40) {
      return [
        '⚠️ ORTA RİSK: Dikkatli olun',
        '💡 Kendi araştırmanızı yapın (DYOR)'
      ];
    } else {
      return [
        '✅ DÜŞÜK RİSK: Genel olarak güvenli',
        '💡 Yine de dikkatli olun'
      ];
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Circuit breaker durumunu getir
   */
  getCircuitBreakerStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    this.circuitBreaker.forEach((state, toolName) => {
      status[toolName] = {
        failures: state.failures,
        isOpen: state.failures >= this.CIRCUIT_BREAKER_THRESHOLD,
        lastFailure: new Date(state.lastFailure).toISOString()
      };
    });

    return status;
  }
}
