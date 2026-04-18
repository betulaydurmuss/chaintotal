import * as readline from 'readline';
import { ChainTotalAgent } from './agent';
import { IntentClassifier } from './nlp/intentClassifier';
import { AgentLoop } from './tools/agentLoop';
import { ToolExecutor } from './tools/toolExecutor';
import { PaymentService } from './stellar/paymentService';
import { DataCollector } from './analysis/dataCollector';
import { RiskCalculator } from './analysis/riskCalculator';
import { SessionManager } from './session/sessionManager';
import { CacheService } from './session/cacheService';
import { QueryAnalytics } from './analytics/queryAnalytics';
import { RevenueTracker } from './analytics/revenueTracker';
import { FraudDetector } from './analytics/fraudDetector';
import { validateConfig } from './config';

export class ChainTotalCLI {
  private agent: ChainTotalAgent;
  private agentLoop: AgentLoop;
  private toolExecutor: ToolExecutor;
  private queryAnalytics: QueryAnalytics;
  private revenueTracker: RevenueTracker;
  private fraudDetector: FraudDetector;
  private rl: readline.Interface;
  private userWallet: string;

  constructor(userWallet: string) {
    this.agent = new ChainTotalAgent();
    this.userWallet = userWallet;
    
    // Initialize KIRO AI Agent Framework components
    const paymentService = new PaymentService();
    const dataCollector = new DataCollector();
    const riskCalculator = new RiskCalculator();
    const sessionManager = new SessionManager();
    const cacheService = new CacheService(sessionManager);
    
    // Initialize analytics components
    this.queryAnalytics = new QueryAnalytics();
    this.revenueTracker = new RevenueTracker();
    this.fraudDetector = new FraudDetector();
    
    // Create tool executor with retry and circuit breaker
    this.toolExecutor = new ToolExecutor(
      paymentService,
      dataCollector,
      riskCalculator,
      sessionManager,
      cacheService
    );
    
    // Create agent loop
    const intentClassifier = new IntentClassifier();
    this.agentLoop = new AgentLoop(
      intentClassifier,
      this.toolExecutor,
      sessionManager,
      this.queryAnalytics,
      this.revenueTracker,
      this.fraudDetector
    );
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start(): Promise<void> {
    this.printWelcome();

    // Ana döngü
    this.promptUser();
  }

  private printWelcome(): void {
    console.clear();
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                                                           ║');
    console.log('║        🔐 ChainTotal Risk Assessment Agent 🔐            ║');
    console.log('║                                                           ║');
    console.log('║     Topluluk Destekli Tehdit İstihbaratı Platformu      ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('💡 İpucu: Doğal dilde yazabilirsiniz!');
    console.log('   Örnek: "0x1234... adresini analiz et"');
    console.log('');
    console.log('📝 Komutlar:');
    console.log('   • "yardım" - Yardım menüsü');
    console.log('   • "stats" - Oturum istatistikleri');
    console.log('   • "history" - Sorgu geçmişi');
    console.log('   • "payments" - Ödeme geçmişi');
    console.log('   • "summary" - Oturum özeti');
    console.log('   • "circuit" - Circuit breaker durumu');
    console.log('   • "analytics" - Platform analytics');
    console.log('   • "revenue" - Gelir istatistikleri');
    console.log('   • "fraud" - Fraud detection durumu');
    console.log('   • "çıkış" - Programdan çık');
    console.log('');
    console.log(`👤 Kullanıcı Cüzdanı: ${this.userWallet.substring(0, 10)}...`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
  }

  private promptUser(): void {
    this.rl.question('💬 Siz: ', async (input) => {
      const trimmedInput = input.trim();

      // Çıkış kontrolü
      if (this.isExitCommand(trimmedInput)) {
        console.log('\n👋 Oturum sonlandırılıyor...\n');
        
        // Session özeti göster
        console.log(this.agent.getSessionSummary(this.userWallet));
        
        // Oturumu sonlandır
        this.agent.endSession(this.userWallet);
        
        console.log('\n👋 Görüşmek üzere!\n');
        this.rl.close();
        return;
      }

      // Session komutları
      if (this.isSessionCommand(trimmedInput)) {
        this.handleSessionCommand(trimmedInput);
        this.promptUser();
        return;
      }

      // Boş girdi kontrolü
      if (!trimmedInput) {
        this.promptUser();
        return;
      }

      try {
        // KIRO AI Agent Framework ile işle
        const result = await this.agentLoop.execute(trimmedInput, this.userWallet);
        
        // Sonucu göster
        console.log('\n🤖 ChainTotal:\n');
        console.log(result.response);
        
        // Tool execution bilgisi (opsiyonel)
        if (process.env.DEBUG === 'true') {
          console.log('\n📊 Execution Details:');
          console.log(`   Success: ${result.success}`);
          console.log(`   Execution Time: ${result.executionTime}ms`);
          console.log(`   Tool Calls: ${result.toolCalls.length}`);
          
          result.toolCalls.forEach((call, index) => {
            console.log(`   ${index + 1}. ${call.tool}`);
          });
          
          // Circuit breaker durumu
          const circuitStatus = this.toolExecutor.getCircuitBreakerStatus();
          if (Object.keys(circuitStatus).length > 0) {
            console.log('\n⚠️  Circuit Breaker Status:');
            Object.entries(circuitStatus).forEach(([tool, status]) => {
              console.log(`   ${tool}: ${status.isOpen ? 'OPEN' : 'CLOSED'} (${status.failures} failures)`);
            });
          }
        }
        
        console.log('\n═══════════════════════════════════════════════════════════\n');

      } catch (error: any) {
        console.error('\n❌ Hata:', error.message);
        console.log('\n═══════════════════════════════════════════════════════════\n');
      }

      // Bir sonraki girdi için bekle
      this.promptUser();
    });
  }

  private isExitCommand(input: string): boolean {
    const exitCommands = ['exit', 'quit', 'çıkış', 'çık', 'bye', 'q'];
    return exitCommands.includes(input.toLowerCase());
  }

  private isSessionCommand(input: string): boolean {
    const sessionCommands = ['stats', 'history', 'payments', 'summary', 'cache', 'circuit', 'analytics', 'revenue', 'fraud'];
    return sessionCommands.some(cmd => input.toLowerCase().startsWith(cmd));
  }

  private handleSessionCommand(input: string): void {
    const command = input.toLowerCase().split(' ')[0];

    switch (command) {
      case 'stats':
        this.showStats();
        break;
      
      case 'history':
        this.showHistory();
        break;
      
      case 'payments':
        this.showPayments();
        break;
      
      case 'summary':
        this.showSummary();
        break;
      
      case 'cache':
        this.showCacheInfo();
        break;
      
      case 'circuit':
        this.showCircuitBreakerStatus();
        break;
      
      case 'analytics':
        this.showAnalytics();
        break;
      
      case 'revenue':
        this.showRevenue();
        break;
      
      case 'fraud':
        this.showFraudDetection();
        break;
      
      default:
        console.log('❓ Bilinmeyen komut');
    }
  }

  private showStats(): void {
    const stats = this.agent.getSessionStats(this.userWallet);
    
    if (!stats) {
      console.log('\n⚠️  Oturum istatistikleri bulunamadı\n');
      return;
    }

    console.log('\n📊 Oturum İstatistikleri');
    console.log('═══════════════════════════════════════');
    console.log(`📈 Toplam Sorgu: ${stats.totalQueries}`);
    console.log(`✅ Başarılı: ${stats.successfulQueries}`);
    console.log(`❌ Başarısız: ${stats.failedQueries}`);
    console.log(`💾 Cache Hit: ${stats.cacheHits}`);
    console.log(`💳 Toplam Ödeme: ${stats.totalPayments}`);
    console.log(`💰 Toplam Harcama: ${stats.totalSpent} x402`);
    console.log('═══════════════════════════════════════\n');
  }

  private showHistory(): void {
    const history = this.agent.getQueryHistory(this.userWallet, 10);
    
    if (history.length === 0) {
      console.log('\n📜 Henüz sorgu geçmişi yok\n');
      return;
    }

    console.log('\n📜 Son 10 Sorgu');
    console.log('═══════════════════════════════════════');
    
    history.forEach((record, index) => {
      const cached = record.cached ? '💾' : '🆕';
      const time = new Date(record.timestamp).toLocaleString('tr-TR');
      console.log(`${index + 1}. ${cached} ${record.assetType} - Risk: ${record.riskScore}/100 (${record.riskLevel})`);
      console.log(`   ${time}`);
    });
    
    console.log('═══════════════════════════════════════\n');
  }

  private showPayments(): void {
    const payments = this.agent.getPaymentLedger(this.userWallet, 10);
    
    if (payments.length === 0) {
      console.log('\n💳 Henüz ödeme geçmişi yok\n');
      return;
    }

    console.log('\n💳 Son 10 Ödeme');
    console.log('═══════════════════════════════════════');
    
    payments.forEach((record, index) => {
      const statusIcon = record.status === 'confirmed' ? '✅' : record.status === 'pending' ? '⏳' : '❌';
      const time = new Date(record.timestamp).toLocaleString('tr-TR');
      console.log(`${index + 1}. ${statusIcon} ${record.amount} ${record.assetCode} - ${record.status}`);
      console.log(`   ${time}`);
    });
    
    console.log('═══════════════════════════════════════\n');
  }

  private showSummary(): void {
    const summary = this.agent.getSessionSummary(this.userWallet);
    console.log('\n' + summary + '\n');
  }

  private showCacheInfo(): void {
    console.log('\n💾 Cache Bilgisi');
    console.log('═══════════════════════════════════════');
    console.log('Cache TTL: 24 saat');
    console.log('Aynı varlık 24 saat içinde tekrar sorgulanırsa');
    console.log('cache\'den döndürülür ve ödeme istenmez.');
    console.log('═══════════════════════════════════════\n');
  }

  private showCircuitBreakerStatus(): void {
    const status = this.toolExecutor.getCircuitBreakerStatus();
    
    console.log('\n⚡ Circuit Breaker Durumu');
    console.log('═══════════════════════════════════════');
    
    if (Object.keys(status).length === 0) {
      console.log('✅ Tüm servisler normal çalışıyor');
    } else {
      Object.entries(status).forEach(([tool, info]) => {
        const statusIcon = info.isOpen ? '🔴' : '🟡';
        const statusText = info.isOpen ? 'AÇIK (Servis Kullanılamaz)' : 'KAPALI (Normal)';
        console.log(`${statusIcon} ${tool}: ${statusText}`);
        console.log(`   Başarısız Denemeler: ${info.failures}`);
        console.log(`   Son Hata: ${new Date(info.lastFailure).toLocaleString('tr-TR')}`);
      });
    }
    
    console.log('\n💡 İpucu: Circuit breaker 5 başarısız denemeden sonra');
    console.log('   60 saniye boyunca servisi devre dışı bırakır.');
    console.log('═══════════════════════════════════════\n');
  }

  private showAnalytics(): void {
    console.log(this.queryAnalytics.generateSummary());
  }

  private showRevenue(): void {
    console.log(this.revenueTracker.generateSummary());
  }

  private showFraudDetection(): void {
    console.log(this.fraudDetector.generateSummary());
  }
}

// CLI başlatma fonksiyonu
export async function startCLI() {
  console.log('🚀 ChainTotal Risk Assessment Agent Başlatılıyor...\n');

  // Konfigürasyon kontrolü
  if (!validateConfig()) {
    console.error('❌ Konfigürasyon hatası! Lütfen .env dosyasını kontrol edin.');
    console.error('💡 İpucu: .env.example dosyasını .env olarak kopyalayın ve düzenleyin.\n');
    process.exit(1);
  }

  // Kullanıcı cüzdanını al (gerçek uygulamada authentication olur)
  const userWallet = process.env.USER_WALLET || 'GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ';

  const cli = new ChainTotalCLI(userWallet);
  await cli.start();
}
