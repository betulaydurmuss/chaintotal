# KIRO AI Agent Framework Integration

## Overview

ChainTotal Risk Assessment Agent now uses the **KIRO AI Agent Framework** for tool-based execution, retry logic, and circuit breaker patterns.

## Architecture

### Components

1. **AgentLoop** (`src/tools/agentLoop.ts`)
   - Main execution loop
   - 6-step workflow orchestration
   - Intent recognition and routing

2. **ToolExecutor** (`src/tools/toolExecutor.ts`)
   - Tool execution engine
   - Retry logic (max 3 attempts with exponential backoff)
   - Circuit breaker pattern (5 failures threshold, 60s timeout)
   - Fallback to cached data on failure

3. **ToolRegistry** (`src/tools/toolRegistry.ts`)
   - Tool definitions and schemas
   - Parameter validation
   - 5 registered tools

## Execution Flow

```
User Input
    ↓
1. Intent Recognition
    ↓
2. Payment Authorization
    ↓
3. Payment Process (Stellar Transaction)
    ↓
4. Transaction Confirmation
    ↓
5. Analysis Execute
    ↓
6. User Response & Session Update
```

## Tools

### 1. stellar_payment_initiator
**Purpose**: Process Stellar x402 micropayments

**Parameters**:
- `destination_wallet` (string): Service wallet address
- `amount` (string): Payment amount
- `asset` (string): Asset code (x402)
- `user_wallet` (string): User's wallet address
- `transaction_hash` (string, optional): Existing transaction hash

**Returns**:
```json
{
  "tx_hash": "string",
  "status": "success|failed|pending",
  "error": "string (optional)"
}
```

### 2. risk_analysis_engine
**Purpose**: Perform comprehensive risk analysis

**Parameters**:
- `asset_type` (enum): wallet|token|dapp|nft|website
- `asset_id` (string): Asset identifier
- `user_wallet` (string): User's wallet address

**Returns**:
```json
{
  "risk_score": 0-100,
  "risk_level": "LOW|MEDIUM|HIGH",
  "analysis_data": {
    "technical_analysis": {},
    "community_signals": [],
    "recommendations": []
  }
}
```

### 3. community_intelligence_fetcher
**Purpose**: Aggregate community signals and social media data

**Parameters**:
- `asset_identifier` (string): Asset identifier
- `asset_type` (enum): wallet|token|dapp|nft|website

**Returns**:
```json
{
  "sentiment": -1 to 1,
  "reports": [],
  "community_size": number,
  "mention_frequency": number,
  "growth_rate": number
}
```

### 4. blockchain_data_aggregator
**Purpose**: Collect and analyze blockchain data

**Parameters**:
- `contract_address` (string): Smart contract address
- `chain` (enum): ethereum|stellar|bsc|polygon

**Returns**:
```json
{
  "tx_history": [],
  "holder_data": {},
  "contract_code": "string",
  "verified": boolean
}
```

### 5. session_manager
**Purpose**: Manage user sessions and cache

**Parameters**:
- `action` (enum): get_stats|get_history|get_payments|check_cache|end_session
- `user_wallet` (string): User's wallet address
- `asset_type` (string, optional): For cache check
- `asset_identifier` (string, optional): For cache check

**Returns**:
```json
{
  "result": any
}
```

## Error Recovery

### Retry Logic
- **Max Attempts**: 3
- **Backoff Strategy**: Exponential (2^attempt * 1000ms)
- **Retry Sequence**: 1s → 2s → 4s

### Circuit Breaker
- **Threshold**: 5 consecutive failures
- **Timeout**: 60 seconds
- **Behavior**: 
  - CLOSED: Normal operation
  - OPEN: Block all requests for 60s
  - HALF-OPEN: Allow test request after timeout

### Fallback Strategy
- Cache hit → Return cached result (no payment)
- Analysis failure → Attempt fallback to old cache
- Payment failure → Return error with retry option

## CLI Integration

### New Commands

```bash
# Show circuit breaker status
circuit

# Show execution details (DEBUG mode)
DEBUG=true npm start
```

### Debug Mode Output

When `DEBUG=true`:
```
📊 Execution Details:
   Success: true
   Execution Time: 1234ms
   Tool Calls: 3
   1. session_manager
   2. stellar_payment_initiator
   3. risk_analysis_engine

⚠️  Circuit Breaker Status:
   stellar_payment_initiator: CLOSED (0 failures)
```

## Cache Strategy

### 24-Hour Cache
- Same asset queried within 24 hours → Return cached result
- No payment required for cache hits
- Cache age displayed to user

### Cache Flow
```
User Query
    ↓
Check Cache (session_manager tool)
    ↓
Cache Hit? → Yes → Return cached result (no payment)
    ↓ No
Request Payment
    ↓
Perform Analysis
    ↓
Cache Result (24h TTL)
```

## Session Management

### Session State
```typescript
{
  sessionId: string;
  userWallet: string;
  queryHistory: QueryRecord[];
  paymentLedger: PaymentRecord[];
  subscriptionLevel: 'free' | 'pro';
  stats: {
    totalQueries: number;
    successfulQueries: number;
    failedQueries: number;
    cacheHits: number;
    totalPayments: number;
    totalSpent: number;
  }
}
```

### Session Commands
- `stats` - Show session statistics
- `history` - Show query history (last 10)
- `payments` - Show payment ledger (last 10)
- `summary` - Show session summary
- `cache` - Show cache information
- `circuit` - Show circuit breaker status

## Example Execution

### Scenario 1: New Query (Cache Miss)

```
💬 Siz: 0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b adresini analiz et

🤖 Agent Loop Started
═══════════════════════════════════════
📝 Step 1: Intent Recognition
   Intent: QUERY_RISK_SCORE
   Confidence: 95.0%

💳 Step 2: Payment Authorization
   ❌ Cache miss - Ödeme gerekli

💰 Step 3: Payment Process
🔧 Tool Execution: stellar_payment_initiator
✅ Tool execution completed in 234ms

🔍 Step 4: Analysis Execute
🔧 Tool Execution: risk_analysis_engine
✅ Tool execution completed in 1567ms

📊 Step 5: User Response
✅ Analiz Tamamlandı!

📊 Risk Skoru: 42/100
🎯 Risk Seviyesi: MEDIUM

💡 Öneriler:
   ⚠️ ORTA RİSK: Dikkatli olun ve küçük miktarlarla başlayın
   📊 Topluluk geri bildirimlerini takip edin
```

### Scenario 2: Cached Query (Cache Hit)

```
💬 Siz: 0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b adresini analiz et

🤖 Agent Loop Started
═══════════════════════════════════════
📝 Step 1: Intent Recognition
   Intent: QUERY_RISK_SCORE
   Confidence: 95.0%

💳 Step 2: Payment Authorization
🔧 Tool Execution: session_manager
   ✅ Cache hit - Ödeme gerekmiyor

📊 Cache'den: Risk Score = 42/100 (4 saat önce güncellenmiş)
✅ Ödeme gerekmiyor (cache hit)

📊 Risk Skoru: 42/100
🎯 Risk Seviyesi: MEDIUM
```

### Scenario 3: Circuit Breaker Open

```
💬 Siz: 0x123... adresini analiz et

🤖 Agent Loop Started
═══════════════════════════════════════
📝 Step 1: Intent Recognition
   Intent: QUERY_RISK_SCORE

💳 Step 2: Payment Authorization
🔧 Tool Execution: stellar_payment_initiator
⚠️  Circuit breaker is OPEN for stellar_payment_initiator
❌ Tool execution failed

❌ Ödeme başarısız: Circuit breaker is open. Service temporarily unavailable.

💡 İpucu: Lütfen 60 saniye sonra tekrar deneyin.
```

## Testing

### Test Circuit Breaker

```bash
# Simulate 5 consecutive failures
# Circuit breaker will open after 5th failure
# Wait 60 seconds for circuit to close
```

### Test Retry Logic

```bash
# Simulate network timeout
# Tool executor will retry 3 times with exponential backoff
```

### Test Cache

```bash
# Query same asset twice within 24 hours
# Second query should return cached result without payment
```

## Performance Metrics

### Tool Execution Times (Average)
- `stellar_payment_initiator`: 200-500ms
- `risk_analysis_engine`: 1000-2000ms
- `community_intelligence_fetcher`: 500-1000ms
- `blockchain_data_aggregator`: 800-1500ms
- `session_manager`: 10-50ms

### Circuit Breaker Stats
- Threshold: 5 failures
- Timeout: 60 seconds
- Recovery: Automatic after timeout

## Future Enhancements

1. **Tool Execution Metrics**
   - Add execution time tracking to session stats
   - Show average tool execution times
   - Track circuit breaker open/close events

2. **Advanced Retry Strategies**
   - Configurable retry count
   - Custom backoff strategies
   - Retry only on specific errors

3. **Circuit Breaker Improvements**
   - Per-user circuit breakers
   - Configurable thresholds
   - Half-open state testing

4. **Tool Chaining**
   - Parallel tool execution
   - Conditional tool execution
   - Tool result caching

## Troubleshooting

### Circuit Breaker Stuck Open
```bash
# Check circuit breaker status
circuit

# Wait for timeout (60s) or restart application
```

### Tool Execution Timeout
```bash
# Enable debug mode
DEBUG=true npm start

# Check execution times and retry attempts
```

### Cache Not Working
```bash
# Check cache info
cache

# Verify asset identifier is exactly the same
# Cache is case-sensitive
```

## References

- [DIALOG_FLOW_EXAMPLES.md](./DIALOG_FLOW_EXAMPLES.md) - Detailed execution scenarios
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SESSION_MANAGEMENT.md](./SESSION_MANAGEMENT.md) - Session management details
- [PAYMENT_GUIDE.md](./PAYMENT_GUIDE.md) - Payment flow documentation
