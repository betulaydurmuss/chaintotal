import { IntentClassifier, UserIntent, IntentResult } from '../nlp/intentClassifier';
import { ToolExecutor, ToolCall } from './toolExecutor';
import { SessionManager } from '../session/sessionManager';
import { QueryAnalytics } from '../analytics/queryAnalytics';
import { RevenueTracker } from '../analytics/revenueTracker';
import { FraudDetector } from '../analytics/fraudDetector';
import { AssetType } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Agent Loop
 * 
 * KIRO AI Agent Framework main execution loop:
 * 1. User Input → Intent Recognition
 * 2. Intent Match → Payment Authorization
 * 3. Payment Process → Stellar Transaction
 * 4. Transaction Confirmation → Analysis Execute
 * 5. Analysis Result → User Response
 * 6. Session Update → Ledger Record
 */

export interface AgentLoopResult {
  success: boolean;
  response: string;
  toolCalls: ToolCall[];
  executionTime: number;
}

export class AgentLoop {
  private intentClassifier: IntentClassifier;
  private toolExecutor: ToolExecutor;
  private sessionManager: SessionManager;
  private queryAnalytics: QueryAnalytics;
  private revenueTracker: RevenueTracker;
  private fraudDetector: FraudDetector;

  constructor(
    intentClassifier: IntentClassifier,
    toolExecutor: ToolExecutor,
    sessionManager: SessionManager,
    queryAnalytics: QueryAnalytics,
    revenueTracker: RevenueTracker,
    fraudDetector: FraudDetector
  ) {
    this.intentClassifier = intentClassifier;
    this.toolExecutor = toolExecutor;
    this.sessionManager = sessionManager;
    this.queryAnalytics = queryAnalytics;
    this.revenueTracker = revenueTracker;
    this.fraudDetector = fraudDetector;
  }

  /**
   * Ana agent loop
   */
  async execute(userInput: string, userWallet: string): Promise<AgentLoopResult> {
    const startTime = Date.now();
    const toolCalls: ToolCall[] = [];
    const queryId = uuidv4();

    try {
      console.log('\n🤖 Agent Loop Started');
      console.log('═══════════════════════════════════════');

      // Fraud detection check
      const fraudCheck = this.fraudDetector.checkUserAllowed(userWallet);
      if (!fraudCheck.allowed) {
        console.log(`\n🚨 Access Denied: ${fraudCheck.reason}`);
        if (fraudCheck.block_until) {
          console.log(`   Blocked until: ${new Date(fraudCheck.block_until).toLocaleString('tr-TR')}`);
        }

        return {
          success: false,
          response: `🚨 Erişim Engellendi\n\n${fraudCheck.reason}\n\n${
            fraudCheck.block_until 
              ? `Engel kalkış zamanı: ${new Date(fraudCheck.block_until).toLocaleString('tr-TR')}`
              : ''
          }`,
          toolCalls,
          executionTime: Date.now() - startTime
        };
      }

      // 1. User Input → Intent Recognition
      console.log('📝 Step 1: Intent Recognition');
      const intentResult = this.intentClassifier.classify(userInput);
      console.log(`   Intent: ${intentResult.intent}`);
      console.log(`   Confidence: ${(intentResult.confidence * 100).toFixed(1)}%`);

      // 2. Intent Match → Payment Authorization
      console.log('\n💳 Step 2: Payment Authorization');
      
      if (intentResult.intent === UserIntent.QUERY_RISK_SCORE) {
        // Risk analizi için ödeme gerekli
        
        // Cache kontrolü
        const cacheCheckCall: ToolCall = {
          tool: 'session_manager',
          params: {
            action: 'check_cache',
            user_wallet: userWallet,
            asset_type: intentResult.parameters.assetType,
            asset_identifier: intentResult.parameters.identifier
          }
        };
        toolCalls.push(cacheCheckCall);
        
        const cacheResult = await this.toolExecutor.executeTool(cacheCheckCall);
        
        if (cacheResult.success && cacheResult.output.result.cached) {
          console.log('   ✅ Cache hit - Ödeme gerekmiyor');
          
          // Record query (cached)
          this.fraudDetector.recordQuery(userWallet, intentResult.parameters.identifier || '');
          
          // Cache'den analiz sonucunu getir
          const analysisCall: ToolCall = {
            tool: 'risk_analysis_engine',
            params: {
              asset_type: intentResult.parameters.assetType,
              asset_id: intentResult.parameters.identifier,
              user_wallet: userWallet
            }
          };
          toolCalls.push(analysisCall);
          
          const analysisResult = await this.toolExecutor.executeTool(analysisCall);
          
          if (analysisResult.success) {
            const executionTime = Date.now() - startTime;
            const response = this.formatRiskAnalysisResponse(analysisResult.output, true);
            
            // Log analytics
            this.queryAnalytics.logQuery({
              query_id: queryId,
              user_wallet: userWallet,
              query_type: intentResult.parameters.assetType as AssetType,
              payment_status: 'cached',
              risk_score_returned: analysisResult.output.risk_score,
              processing_time_ms: executionTime,
              cache_hit: true,
              timestamp: new Date().toISOString()
            });
            
            return {
              success: true,
              response,
              toolCalls,
              executionTime
            };
          }
        }

        // Cache miss - Ödeme gerekli
        console.log('   ❌ Cache miss - Ödeme gerekli');
        
        // 3. Payment Process → Stellar Transaction
        console.log('\n💰 Step 3: Payment Process');
        
        const paymentCall: ToolCall = {
          tool: 'stellar_payment_initiator',
          params: {
            destination_wallet: 'GSERVICE...', // Service wallet
            amount: '1',
            asset: 'x402',
            user_wallet: userWallet
          },
          expected_output: 'transaction_hash'
        };
        toolCalls.push(paymentCall);
        
        const paymentResult = await this.toolExecutor.executeTool(paymentCall);
        
        if (!paymentResult.success) {
          const executionTime = Date.now() - startTime;
          
          // Log failed payment
          this.revenueTracker.recordTransaction(
            'failed',
            userWallet,
            1,
            'failed',
            new Date().toISOString()
          );
          
          this.queryAnalytics.logQuery({
            query_id: queryId,
            user_wallet: userWallet,
            query_type: intentResult.parameters.assetType as AssetType,
            payment_status: 'failed',
            risk_score_returned: 0,
            processing_time_ms: executionTime,
            cache_hit: false,
            timestamp: new Date().toISOString(),
            error_code: 'PAYMENT_FAILED'
          });
          
          return {
            success: false,
            response: `❌ Ödeme başarısız: ${paymentResult.error}`,
            toolCalls,
            executionTime
          };
        }

        // Record successful payment
        this.fraudDetector.recordQuery(userWallet, intentResult.parameters.identifier || '');
        this.fraudDetector.recordPayment(userWallet, 1, 'success');
        this.revenueTracker.recordTransaction(
          paymentResult.output.tx_hash,
          userWallet,
          1,
          'success',
          new Date().toISOString()
        );

        // 4. Transaction Confirmation → Analysis Execute
        console.log('\n🔍 Step 4: Analysis Execute');
        
        const analysisCall: ToolCall = {
          tool: 'risk_analysis_engine',
          params: {
            asset_type: intentResult.parameters.assetType,
            asset_id: intentResult.parameters.identifier,
            user_wallet: userWallet
          }
        };
        toolCalls.push(analysisCall);
        
        const analysisResult = await this.toolExecutor.executeTool(analysisCall);
        
        if (!analysisResult.success) {
          // Fallback to cached data
          console.log('⚠️  Analysis failed, attempting fallback to cached data...');
          
          const executionTime = Date.now() - startTime;
          
          // Log failed analysis
          this.queryAnalytics.logQuery({
            query_id: queryId,
            user_wallet: userWallet,
            query_type: intentResult.parameters.assetType as AssetType,
            payment_status: 'success',
            tx_hash: paymentResult.output.tx_hash,
            risk_score_returned: 0,
            processing_time_ms: executionTime,
            cache_hit: false,
            timestamp: new Date().toISOString(),
            error_code: 'ANALYSIS_FAILED'
          });
          
          return {
            success: false,
            response: `❌ Analiz başarısız: ${analysisResult.error}`,
            toolCalls,
            executionTime
          };
        }

        // 5. Analysis Result → User Response
        console.log('\n📊 Step 5: User Response');
        const executionTime = Date.now() - startTime;
        const response = this.formatRiskAnalysisResponse(analysisResult.output, false);

        // Log successful query
        this.queryAnalytics.logQuery({
          query_id: queryId,
          user_wallet: userWallet,
          query_type: intentResult.parameters.assetType as AssetType,
          payment_status: 'success',
          tx_hash: paymentResult.output.tx_hash,
          risk_score_returned: analysisResult.output.risk_score,
          processing_time_ms: executionTime,
          cache_hit: false,
          timestamp: new Date().toISOString()
        });

        // 6. Session Update → Ledger Record
        console.log('\n💾 Step 6: Session Update');
        // Session update agent.ts'de yapılıyor

        return {
          success: true,
          response,
          toolCalls,
          executionTime
        };

      } else if (intentResult.intent === UserIntent.CHECK_PAYMENT_STATUS) {
        // Ödeme durumu kontrolü
        const sessionCall: ToolCall = {
          tool: 'session_manager',
          params: {
            action: 'get_payments',
            user_wallet: userWallet
          }
        };
        toolCalls.push(sessionCall);
        
        const sessionResult = await this.toolExecutor.executeTool(sessionCall);
        
        if (sessionResult.success) {
          const payments = sessionResult.output.result;
          const response = this.formatPaymentStatusResponse(payments);
          
          return {
            success: true,
            response,
            toolCalls,
            executionTime: Date.now() - startTime
          };
        }

      } else if (intentResult.intent === UserIntent.VIEW_HISTORY) {
        // Geçmiş görüntüleme
        const sessionCall: ToolCall = {
          tool: 'session_manager',
          params: {
            action: 'get_history',
            user_wallet: userWallet
          }
        };
        toolCalls.push(sessionCall);
        
        const sessionResult = await this.toolExecutor.executeTool(sessionCall);
        
        if (sessionResult.success) {
          const history = sessionResult.output.result;
          const response = this.formatHistoryResponse(history);
          
          return {
            success: true,
            response,
            toolCalls,
            executionTime: Date.now() - startTime
          };
        }

      } else if (intentResult.intent === UserIntent.GET_HELP) {
        // Yardım
        return {
          success: true,
          response: this.getHelpMessage(),
          toolCalls,
          executionTime: Date.now() - startTime
        };
      }

      // Unknown intent
      return {
        success: false,
        response: '❓ Üzgünüm, isteğinizi anlayamadım. "yardım" yazarak komutları görebilirsiniz.',
        toolCalls,
        executionTime: Date.now() - startTime
      };

    } catch (error: any) {
      console.error('❌ Agent loop error:', error.message);
      
      return {
        success: false,
        response: `❌ Hata: ${error.message}`,
        toolCalls,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Risk analizi yanıtını formatla
   */
  private formatRiskAnalysisResponse(output: any, cached: boolean): string {
    let response = '';
    
    if (cached) {
      response += `📊 Cache'den: Risk Score = ${output.risk_score}/100 (${output.cache_age_hours} saat önce güncellenmiş)\n`;
      response += `✅ Ödeme gerekmiyor (cache hit)\n\n`;
    } else {
      response += `✅ Analiz Tamamlandı!\n\n`;
    }

    response += `📊 Risk Skoru: ${output.risk_score}/100\n`;
    response += `🎯 Risk Seviyesi: ${output.risk_level}\n\n`;

    if (output.analysis_data && output.analysis_data.recommendations) {
      response += `💡 Öneriler:\n`;
      output.analysis_data.recommendations.forEach((rec: string) => {
        response += `   ${rec}\n`;
      });
    }

    return response;
  }

  /**
   * Ödeme durumu yanıtını formatla
   */
  private formatPaymentStatusResponse(payments: any[]): string {
    if (!payments || payments.length === 0) {
      return '💳 Henüz ödeme geçmişi yok.';
    }

    let response = '💳 Son Ödemeler:\n\n';
    
    payments.slice(0, 5).forEach((payment, index) => {
      const statusIcon = payment.status === 'confirmed' ? '✅' : '⏳';
      response += `${index + 1}. ${statusIcon} ${payment.amount} ${payment.assetCode} - ${payment.status}\n`;
    });

    return response;
  }

  /**
   * Geçmiş yanıtını formatla
   */
  private formatHistoryResponse(history: any[]): string {
    if (!history || history.length === 0) {
      return '📜 Henüz sorgu geçmişi yok.';
    }

    let response = '📜 Son Sorgular:\n\n';
    
    history.slice(0, 5).forEach((record, index) => {
      const cached = record.cached ? '💾' : '🆕';
      response += `${index + 1}. ${cached} ${record.assetType} - Risk: ${record.riskScore}/100\n`;
    });

    return response;
  }

  /**
   * Yardım mesajı
   */
  private getHelpMessage(): string {
    return `
🤖 ChainTotal Risk Assessment Agent - Yardım

📋 Kullanılabilir Komutlar:

🔍 Risk Analizi:
   • "0x1234... adresini analiz et"
   • "BTC token güvenli mi?"
   • "https://example.com sitesi hakkında bilgi ver"

💳 Ödeme ve Geçmiş:
   • "stats" - Oturum istatistikleri
   • "history" - Sorgu geçmişi
   • "payments" - Ödeme geçmişi

❓ Diğer:
   • "yardım" - Bu mesaj
   • "çıkış" - Oturumu sonlandır

💡 İpucu: Doğal dilde yazabilirsiniz!
    `.trim();
  }
}
