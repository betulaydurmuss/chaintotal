# ChainTotal Risk Assessment Agent - Architecture Diagram

## System Architecture with KIRO AI Agent Framework

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE (CLI)                            │
│                                                                          │
│  Commands: analyze, stats, history, payments, circuit, help             │
│  Debug Mode: DEBUG=true for detailed execution logs                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP (6 Steps)                             │
│                                                                          │
│  Step 1: User Input → Intent Recognition                                │
│  Step 2: Intent Match → Payment Authorization                           │
│  Step 3: Payment Process → Stellar Transaction                          │
│  Step 4: Transaction Confirmation → Analysis Execute                    │
│  Step 5: Analysis Result → User Response                                │
│  Step 6: Session Update → Ledger Record                                 │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         INTENT CLASSIFIER                                │
│                                                                          │
│  Intents:                                                                │
│  • QUERY_RISK_SCORE      - Risk analysis request                        │
│  • CHECK_PAYMENT_STATUS  - Payment status check                         │
│  • VIEW_HISTORY          - Query history                                │
│  • GET_HELP              - Help request                                 │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          TOOL EXECUTOR                                   │
│                                                                          │
│  Features:                                                               │
│  • Retry Logic (max 3 attempts, exponential backoff)                    │
│  • Circuit Breaker (5 failures → 60s timeout)                           │
│  • Fallback Strategies (cache, old data)                                │
│  • Parameter Validation                                                 │
│  • Execution Time Tracking                                              │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          TOOL REGISTRY                                   │
│                                                                          │
│  5 Specialized Tools:                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 1. stellar_payment_initiator                                     │  │
│  │    • Process Stellar x402 micropayments                          │  │
│  │    • Validate transactions                                       │  │
│  │    • Generate payment headers                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 2. risk_analysis_engine                                          │  │
│  │    • Perform comprehensive risk analysis                         │  │
│  │    • Cache-aware execution                                       │  │
│  │    • Technical (60%) + Community (40%) scoring                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 3. community_intelligence_fetcher                                │  │
│  │    • Aggregate community signals                                 │  │
│  │    • Social media sentiment analysis                             │  │
│  │    • Threat intelligence gathering                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 4. blockchain_data_aggregator                                    │  │
│  │    • Collect blockchain data                                     │  │
│  │    • Smart contract analysis                                     │  │
│  │    • Transaction history                                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 5. session_manager                                               │  │
│  │    • Session state management                                    │  │
│  │    • Cache operations (24h TTL)                                  │  │
│  │    • Statistics tracking                                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CORE SERVICES                                    │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │ PaymentService   │  │ DataCollector    │  │ RiskCalculator   │     │
│  │                  │  │                  │  │                  │     │
│  │ • Stellar SDK    │  │ • Community Data │  │ • Risk Scoring   │     │
│  │ • x402 Payments  │  │ • Technical Data │  │ • Factor Weights │     │
│  │ • Validation     │  │ • Verification   │  │ • Recommendations│     │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐                            │
│  │ SessionManager   │  │ CacheService     │                            │
│  │                  │  │                  │                            │
│  │ • User Sessions  │  │ • 24h Cache      │                            │
│  │ • Query History  │  │ • Expiration     │                            │
│  │ • Payment Ledger │  │ • Cleanup        │                            │
│  └──────────────────┘  └──────────────────┘                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Scenario 1: New Query (Cache Miss)

```
User Input: "0x742d35Cc... adresini analiz et"
    │
    ▼
┌─────────────────────────────────────────┐
│ Step 1: Intent Recognition              │
│ Result: QUERY_RISK_SCORE                │
│ Confidence: 95%                         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 2: Payment Authorization           │
│ Tool: session_manager (check_cache)    │
│ Result: Cache MISS                      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 3: Payment Process                 │
│ Tool: stellar_payment_initiator         │
│ Result: tx_hash = "abc123..."           │
│ Time: 234ms                             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 4: Analysis Execute                │
│ Tool: risk_analysis_engine              │
│ Result: risk_score = 42/100             │
│ Time: 1567ms                            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 5: User Response                   │
│ Format: Turkish, with emojis            │
│ Display: Risk score, level, recommendations │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 6: Session Update                  │
│ • Cache result (24h TTL)                │
│ • Add to query history                  │
│ • Update payment ledger                 │
│ • Update statistics                     │
└─────────────────────────────────────────┘
```

### Scenario 2: Cached Query (Cache Hit)

```
User Input: "0x742d35Cc... adresini analiz et" (same address)
    │
    ▼
┌─────────────────────────────────────────┐
│ Step 1: Intent Recognition              │
│ Result: QUERY_RISK_SCORE                │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 2: Payment Authorization           │
│ Tool: session_manager (check_cache)    │
│ Result: Cache HIT (4 hours old)        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 3: SKIP Payment (Cache Hit)        │
│ No payment required                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 4: Return Cached Result            │
│ Tool: risk_analysis_engine (cached)    │
│ Result: risk_score = 42/100             │
│ Time: 10ms (from cache)                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 5: User Response                   │
│ Message: "📊 Cache'den: Risk Score = 42"│
│ Note: "4 saat önce güncellenmiş"       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Step 6: Session Update                  │
│ • Add to query history (cached=true)   │
│ • Update cache hit counter              │
└─────────────────────────────────────────┘
```

## Error Recovery Flow

### Retry Logic

```
Tool Execution Attempt 1
    │
    ▼
  Failed? ──No──> Success ──> Return Result
    │
   Yes
    │
    ▼
Wait 1 second (2^1 * 1000ms)
    │
    ▼
Tool Execution Attempt 2
    │
    ▼
  Failed? ──No──> Success ──> Return Result
    │
   Yes
    │
    ▼
Wait 2 seconds (2^2 * 1000ms)
    │
    ▼
Tool Execution Attempt 3
    │
    ▼
  Failed? ──No──> Success ──> Return Result
    │
   Yes
    │
    ▼
Return Error (Max retries exceeded)
```

### Circuit Breaker State Machine

```
┌─────────────────────────────────────────┐
│           CLOSED (Normal)               │
│                                         │
│  • All requests allowed                 │
│  • Failures counted                     │
│  • Success resets counter               │
└────────────┬────────────────────────────┘
             │
             │ 5 consecutive failures
             ▼
┌─────────────────────────────────────────┐
│           OPEN (Blocked)                │
│                                         │
│  • All requests blocked                 │
│  • Return error immediately             │
│  • Wait 60 seconds                      │
└────────────┬────────────────────────────┘
             │
             │ 60 seconds elapsed
             ▼
┌─────────────────────────────────────────┐
│         HALF-OPEN (Testing)             │
│                                         │
│  • Allow one test request               │
│  • Success → CLOSED                     │
│  • Failure → OPEN                       │
└─────────────────────────────────────────┘
```

## Cache Strategy

```
┌─────────────────────────────────────────┐
│         User Query Received             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│    Check Cache (session_manager)        │
└────────────┬────────────────────────────┘
             │
        ┌────┴────┐
        │         │
     Found     Not Found
        │         │
        ▼         ▼
┌──────────┐  ┌──────────┐
│ Age < 24h│  │ Request  │
│    ?     │  │ Payment  │
└────┬─────┘  └────┬─────┘
     │             │
   Yes             │
     │             ▼
     │      ┌──────────────┐
     │      │ Perform      │
     │      │ Analysis     │
     │      └────┬─────────┘
     │           │
     │           ▼
     │      ┌──────────────┐
     │      │ Cache Result │
     │      │ (24h TTL)    │
     │      └────┬─────────┘
     │           │
     └───────────┴──────────┐
                            │
                            ▼
                   ┌──────────────┐
                   │ Return Result│
                   └──────────────┘
```

## Session Management

```
┌─────────────────────────────────────────┐
│           User Session                   │
│                                         │
│  sessionId: "uuid"                      │
│  userWallet: "GXXX..." (encrypted)      │
│  createdAt: timestamp                   │
│  lastActivity: timestamp                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Query History                   │   │
│  │ • queryId                       │   │
│  │ • assetType                     │   │
│  │ • riskScore                     │   │
│  │ • cached (true/false)           │   │
│  │ • timestamp                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Payment Ledger                  │   │
│  │ • transactionId                 │   │
│  │ • amount                        │   │
│  │ • assetCode                     │   │
│  │ • status                        │   │
│  │ • timestamp                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Statistics                      │   │
│  │ • totalQueries: 10              │   │
│  │ • successfulQueries: 8          │   │
│  │ • failedQueries: 2              │   │
│  │ • cacheHits: 3                  │   │
│  │ • totalPayments: 7              │   │
│  │ • totalSpent: 7 x402            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Performance Metrics

```
┌─────────────────────────────────────────────────────────┐
│              Tool Execution Times                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  stellar_payment_initiator    ████░░░░░░  200-500ms    │
│  risk_analysis_engine         ████████░░  1000-2000ms  │
│  community_intelligence       █████░░░░░  500-1000ms   │
│  blockchain_data_aggregator   ██████░░░░  800-1500ms   │
│  session_manager              █░░░░░░░░░  10-50ms      │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Cache Performance                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Cache Hit Rate:        30-40%                          │
│  Cache Miss Rate:       60-70%                          │
│  Average Cache Age:     8-12 hours                      │
│  Cache TTL:             24 hours                        │
│  Payment Savings:       30-40% (via cache hits)         │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Error Recovery                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Retry Success Rate:    85-90%                          │
│  Circuit Breaker Opens: <1% of requests                 │
│  Fallback Usage:        5-10% of requests               │
│  Average Retry Count:   1.2 attempts                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│         Frontend / Interface            │
│                                         │
│  • Node.js CLI (readline)               │
│  • Interactive prompts                  │
│  • Colored output                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Application Layer               │
│                                         │
│  • TypeScript (strict mode)             │
│  • KIRO AI Agent Framework              │
│  • Tool-based architecture              │
│  • Async/await patterns                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Business Logic                  │
│                                         │
│  • Intent Classification (NLP)          │
│  • Risk Calculation Engine              │
│  • Data Collection Services             │
│  • Session Management                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         External Services               │
│                                         │
│  • Stellar SDK (x402 payments)          │
│  • Blockchain APIs (mock)               │
│  • Social Media APIs (mock)             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Data Storage                    │
│                                         │
│  • In-Memory Cache (24h TTL)            │
│  • Session State (in-memory)            │
│  • Query History (in-memory)            │
│  • Payment Ledger (in-memory)           │
└─────────────────────────────────────────┘
```

---

**Version**: 1.1.0
**Date**: 2024-01-20
**Architecture**: KIRO AI Agent Framework
