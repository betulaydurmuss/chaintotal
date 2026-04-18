/**
 * Test KIRO AI Agent Framework Integration
 * 
 * This script demonstrates the AgentLoop execution with various scenarios
 */

import { AgentLoop } from './src/tools/agentLoop';
import { ToolExecutor } from './src/tools/toolExecutor';
import { IntentClassifier } from './src/nlp/intentClassifier';
import { PaymentService } from './src/stellar/paymentService';
import { DataCollector } from './src/analysis/dataCollector';
import { RiskCalculator } from './src/analysis/riskCalculator';
import { SessionManager } from './src/session/sessionManager';
import { CacheService } from './src/session/cacheService';

async function testAgentLoop() {
  console.log('🧪 Testing KIRO AI Agent Framework Integration\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Initialize components
  const paymentService = new PaymentService();
  const dataCollector = new DataCollector();
  const riskCalculator = new RiskCalculator();
  const sessionManager = new SessionManager();
  const cacheService = new CacheService(sessionManager);

  const toolExecutor = new ToolExecutor(
    paymentService,
    dataCollector,
    riskCalculator,
    sessionManager,
    cacheService
  );

  const intentClassifier = new IntentClassifier();
  const agentLoop = new AgentLoop(
    intentClassifier,
    toolExecutor,
    sessionManager
  );

  // Test wallet
  const userWallet = 'GCZAMPLE7IXQKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQHKQ';

  // Test scenarios
  const scenarios = [
    {
      name: 'Scenario 1: Risk Analysis Query',
      input: '0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b adresini analiz et',
      description: 'User requests risk analysis for an Ethereum address'
    },
    {
      name: 'Scenario 2: Token Safety Check',
      input: 'BTC token güvenli mi?',
      description: 'User asks if BTC token is safe'
    },
    {
      name: 'Scenario 3: Payment Status Check',
      input: 'Ödeme durumu nedir?',
      description: 'User checks payment status'
    },
    {
      name: 'Scenario 4: View History',
      input: 'Son 5 analiz sonucumu göster',
      description: 'User requests query history'
    },
    {
      name: 'Scenario 5: Get Help',
      input: 'Nasıl kullanılıyor?',
      description: 'User requests help'
    }
  ];

  // Run scenarios
  for (const scenario of scenarios) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 ${scenario.name}`);
    console.log(`📝 Description: ${scenario.description}`);
    console.log(`💬 User Input: "${scenario.input}"`);
    console.log('='.repeat(60));

    try {
      const result = await agentLoop.execute(scenario.input, userWallet);

      console.log('\n📊 Execution Result:');
      console.log(`   Success: ${result.success ? '✅' : '❌'}`);
      console.log(`   Execution Time: ${result.executionTime}ms`);
      console.log(`   Tool Calls: ${result.toolCalls.length}`);

      if (result.toolCalls.length > 0) {
        console.log('\n🔧 Tool Calls:');
        result.toolCalls.forEach((call, index) => {
          console.log(`   ${index + 1}. ${call.tool}`);
          if (call.expected_output) {
            console.log(`      Expected Output: ${call.expected_output}`);
          }
        });
      }

      console.log('\n🤖 Agent Response:');
      console.log(result.response);

    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}`);
    }

    // Wait between scenarios
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Show circuit breaker status
  console.log('\n' + '='.repeat(60));
  console.log('⚡ Circuit Breaker Status');
  console.log('='.repeat(60));

  const circuitStatus = toolExecutor.getCircuitBreakerStatus();
  if (Object.keys(circuitStatus).length === 0) {
    console.log('✅ All services are operating normally');
  } else {
    Object.entries(circuitStatus).forEach(([tool, status]) => {
      const statusIcon = status.isOpen ? '🔴' : '🟡';
      const statusText = status.isOpen ? 'OPEN' : 'CLOSED';
      console.log(`${statusIcon} ${tool}: ${statusText} (${status.failures} failures)`);
    });
  }

  // Show session stats
  console.log('\n' + '='.repeat(60));
  console.log('📊 Session Statistics');
  console.log('='.repeat(60));

  const stats = sessionManager.getSessionStats(userWallet);
  if (stats) {
    console.log(`Total Queries: ${stats.totalQueries}`);
    console.log(`Successful: ${stats.successfulQueries}`);
    console.log(`Failed: ${stats.failedQueries}`);
    console.log(`Cache Hits: ${stats.cacheHits}`);
    console.log(`Total Payments: ${stats.totalPayments}`);
    console.log(`Total Spent: ${stats.totalSpent} x402`);
  } else {
    console.log('No session data available');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test completed!');
  console.log('='.repeat(60) + '\n');
}

// Run tests
testAgentLoop().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
