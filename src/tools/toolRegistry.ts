/**
 * Tool Registry
 * 
 * KIRO AI Agent Framework için tool tanımlamaları
 */

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  returns: {
    type: string;
    properties: Record<string, any>;
  };
}

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  stellar_payment_initiator: {
    name: 'stellar_payment_initiator',
    description: 'Stellar ağı üzerinden x402 token ödemesi başlatır',
    parameters: {
      type: 'object',
      properties: {
        destination_wallet: {
          type: 'string',
          description: 'Hedef Stellar wallet adresi (G ile başlayan 56 karakter)'
        },
        amount: {
          type: 'string',
          description: 'Ödeme miktarı'
        },
        asset: {
          type: 'string',
          description: 'Asset kodu (örn: x402)'
        },
        user_wallet: {
          type: 'string',
          description: 'Kullanıcı wallet adresi'
        },
        transaction_hash: {
          type: 'string',
          description: 'Mevcut transaction hash (opsiyonel)',
          optional: true
        }
      },
      required: ['destination_wallet', 'amount', 'asset', 'user_wallet']
    },
    returns: {
      type: 'object',
      properties: {
        tx_hash: { type: 'string' },
        status: { type: 'string', enum: ['success', 'failed', 'pending'] },
        error: { type: 'string', optional: true }
      }
    }
  },

  risk_analysis_engine: {
    name: 'risk_analysis_engine',
    description: 'Kripto varlık için kapsamlı risk analizi yapar',
    parameters: {
      type: 'object',
      properties: {
        asset_type: {
          type: 'string',
          enum: ['wallet', 'token', 'dapp', 'nft', 'website'],
          description: 'Varlık tipi'
        },
        asset_id: {
          type: 'string',
          description: 'Varlık tanımlayıcısı (adres, token sembolü, URL vb.)'
        },
        user_wallet: {
          type: 'string',
          description: 'Kullanıcı wallet adresi'
        }
      },
      required: ['asset_type', 'asset_id', 'user_wallet']
    },
    returns: {
      type: 'object',
      properties: {
        risk_score: { type: 'number', min: 0, max: 100 },
        risk_level: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
        analysis_data: {
          type: 'object',
          properties: {
            technical_analysis: { type: 'object' },
            community_signals: { type: 'array' },
            recommendations: { type: 'array' }
          }
        }
      }
    }
  },

  community_intelligence_fetcher: {
    name: 'community_intelligence_fetcher',
    description: 'Topluluk sinyalleri ve sosyal medya verilerini toplar',
    parameters: {
      type: 'object',
      properties: {
        asset_identifier: {
          type: 'string',
          description: 'Varlık tanımlayıcısı'
        },
        asset_type: {
          type: 'string',
          enum: ['wallet', 'token', 'dapp', 'nft', 'website'],
          description: 'Varlık tipi'
        }
      },
      required: ['asset_identifier', 'asset_type']
    },
    returns: {
      type: 'object',
      properties: {
        sentiment: { type: 'number', min: -1, max: 1 },
        reports: { type: 'array' },
        community_size: { type: 'number' },
        mention_frequency: { type: 'number' },
        growth_rate: { type: 'number' }
      }
    }
  },

  blockchain_data_aggregator: {
    name: 'blockchain_data_aggregator',
    description: 'Blockchain verilerini toplar ve analiz eder',
    parameters: {
      type: 'object',
      properties: {
        contract_address: {
          type: 'string',
          description: 'Smart contract adresi'
        },
        chain: {
          type: 'string',
          enum: ['ethereum', 'stellar', 'bsc', 'polygon'],
          description: 'Blockchain ağı'
        }
      },
      required: ['contract_address', 'chain']
    },
    returns: {
      type: 'object',
      properties: {
        tx_history: { type: 'array' },
        holder_data: { type: 'object' },
        contract_code: { type: 'string' },
        verified: { type: 'boolean' }
      }
    }
  },

  session_manager: {
    name: 'session_manager',
    description: 'Kullanıcı oturumu ve cache yönetimi',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['get_stats', 'get_history', 'get_payments', 'check_cache', 'end_session'],
          description: 'Yapılacak işlem'
        },
        user_wallet: {
          type: 'string',
          description: 'Kullanıcı wallet adresi'
        },
        asset_type: {
          type: 'string',
          optional: true,
          description: 'Cache kontrolü için varlık tipi'
        },
        asset_identifier: {
          type: 'string',
          optional: true,
          description: 'Cache kontrolü için varlık tanımlayıcısı'
        }
      },
      required: ['action', 'user_wallet']
    },
    returns: {
      type: 'object',
      properties: {
        result: { type: 'any' }
      }
    }
  }
};

/**
 * Tool tanımlarını listele
 */
export function listTools(): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY);
}

/**
 * Tool tanımını getir
 */
export function getTool(toolName: string): ToolDefinition | null {
  return TOOL_REGISTRY[toolName] || null;
}

/**
 * Tool parametrelerini validate et
 */
export function validateToolParams(toolName: string, params: any): { valid: boolean; errors: string[] } {
  const tool = getTool(toolName);
  
  if (!tool) {
    return { valid: false, errors: [`Tool not found: ${toolName}`] };
  }

  const errors: string[] = [];
  const required = tool.parameters.required || [];

  // Required parametreleri kontrol et
  for (const param of required) {
    if (!(param in params)) {
      errors.push(`Missing required parameter: ${param}`);
    }
  }

  // Tip kontrolü (basit)
  for (const [key, value] of Object.entries(params)) {
    const paramDef = tool.parameters.properties[key];
    if (!paramDef) {
      errors.push(`Unknown parameter: ${key}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
