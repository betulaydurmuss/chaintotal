import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  stellar: {
    network: process.env.STELLAR_NETWORK || 'testnet',
    horizonUrl: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    agentSecretKey: process.env.AGENT_SECRET_KEY || '',
  },
  x402: {
    tokenIssuer: process.env.X402_TOKEN_ISSUER || '',
    tokenCode: process.env.X402_TOKEN_CODE || 'x402',
    paymentAmount: parseFloat(process.env.PAYMENT_AMOUNT || '1'),
  },
  api: {
    etherscan: process.env.ETHERSCAN_API_KEY || '',
    blockchainInfo: process.env.BLOCKCHAIN_INFO_API_KEY || '',
  }
};

export function validateConfig(): boolean {
  if (!config.stellar.agentSecretKey) {
    console.error('❌ AGENT_SECRET_KEY eksik!');
    return false;
  }
  if (!config.x402.tokenIssuer) {
    console.error('❌ X402_TOKEN_ISSUER eksik!');
    return false;
  }
  return true;
}
