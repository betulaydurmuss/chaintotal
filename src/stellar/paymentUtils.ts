import * as StellarSdk from 'stellar-sdk';
import { config } from '../config';

/**
 * Stellar Payment Utility Functions
 * 
 * Kullanıcıların ödeme yapması için yardımcı fonksiyonlar
 */

/**
 * Kullanıcı için ödeme transaction'ı oluşturur
 * 
 * @param userSecretKey - Kullanıcının secret key'i
 * @param destination - ChainTotal service wallet
 * @param amount - Ödeme miktarı
 * @param assetCode - Asset kodu (x402)
 * @param assetIssuer - Asset issuer public key
 * @param memo - Transaction memo
 */
export async function createPaymentTransaction(
  userSecretKey: string,
  destination: string,
  amount: string,
  assetCode: string,
  assetIssuer: string,
  memo?: string
): Promise<{ transaction: StellarSdk.Transaction; hash: string }> {
  
  // Network seçimi
  const server = config.stellar.network === 'public'
    ? new StellarSdk.Horizon.Server('https://horizon.stellar.org')
    : new StellarSdk.Horizon.Server(config.stellar.horizonUrl);

  const networkPassphrase = config.stellar.network === 'public'
    ? StellarSdk.Networks.PUBLIC
    : StellarSdk.Networks.TESTNET;

  // Kullanıcı keypair
  const userKeypair = StellarSdk.Keypair.fromSecret(userSecretKey);

  // Kullanıcı hesabını yükle
  const userAccount = await server.loadAccount(userKeypair.publicKey());

  // Asset tanımla
  const asset = new StellarSdk.Asset(assetCode, assetIssuer);

  // Transaction builder
  const transactionBuilder = new StellarSdk.TransactionBuilder(userAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase
  });

  // Payment operation ekle
  transactionBuilder.addOperation(
    StellarSdk.Operation.payment({
      destination,
      asset,
      amount
    })
  );

  // Memo ekle (opsiyonel)
  if (memo) {
    transactionBuilder.addMemo(StellarSdk.Memo.text(memo));
  }

  // Timeout ekle (30 saniye)
  transactionBuilder.setTimeout(30);

  // Transaction'ı oluştur
  const transaction = transactionBuilder.build();

  // Transaction'ı imzala
  transaction.sign(userKeypair);

  // Transaction hash
  const hash = transaction.hash().toString('hex');

  return { transaction, hash };
}

/**
 * Transaction'ı Stellar ağına gönderir
 */
export async function submitPaymentTransaction(
  transaction: StellarSdk.Transaction
): Promise<{ success: boolean; hash: string; error?: string }> {
  
  const server = config.stellar.network === 'public'
    ? new StellarSdk.Horizon.Server('https://horizon.stellar.org')
    : new StellarSdk.Horizon.Server(config.stellar.horizonUrl);

  try {
    const result = await server.submitTransaction(transaction);
    
    return {
      success: true,
      hash: result.hash
    };
  } catch (error: any) {
    return {
      success: false,
      hash: transaction.hash().toString('hex'),
      error: error.message
    };
  }
}

/**
 * Kullanıcı için trustline oluşturur (x402 token için)
 */
export async function createTrustline(
  userSecretKey: string,
  assetCode: string,
  assetIssuer: string,
  limit?: string
): Promise<{ success: boolean; hash?: string; error?: string }> {
  
  const server = config.stellar.network === 'public'
    ? new StellarSdk.Horizon.Server('https://horizon.stellar.org')
    : new StellarSdk.Horizon.Server(config.stellar.horizonUrl);

  const networkPassphrase = config.stellar.network === 'public'
    ? StellarSdk.Networks.PUBLIC
    : StellarSdk.Networks.TESTNET;

  try {
    const userKeypair = StellarSdk.Keypair.fromSecret(userSecretKey);
    const userAccount = await server.loadAccount(userKeypair.publicKey());

    const asset = new StellarSdk.Asset(assetCode, assetIssuer);

    const transaction = new StellarSdk.TransactionBuilder(userAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase
    })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset,
          limit
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(userKeypair);

    const result = await server.submitTransaction(transaction);

    return {
      success: true,
      hash: result.hash
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Kullanıcının x402 bakiyesini kontrol eder
 */
export async function checkX402Balance(
  publicKey: string
): Promise<{ balance: number; hasTrustline: boolean }> {
  
  const server = config.stellar.network === 'public'
    ? new StellarSdk.Horizon.Server('https://horizon.stellar.org')
    : new StellarSdk.Horizon.Server(config.stellar.horizonUrl);

  try {
    const account = await server.loadAccount(publicKey);
    
    const x402Balance = account.balances.find(b => 
      b.asset_type !== 'native' &&
      (b as any).asset_code === config.x402.tokenCode &&
      (b as any).asset_issuer === config.x402.tokenIssuer
    );

    if (x402Balance) {
      return {
        balance: parseFloat(x402Balance.balance),
        hasTrustline: true
      };
    }

    return {
      balance: 0,
      hasTrustline: false
    };
  } catch (error) {
    return {
      balance: 0,
      hasTrustline: false
    };
  }
}

/**
 * Payment örneği oluşturur (test için)
 */
export function generatePaymentExample(): string {
  return `
// Örnek: ChainTotal'a x402 ödeme yapma

import * as StellarSdk from 'stellar-sdk';

async function payForAnalysis() {
  // 1. Stellar SDK'yı yapılandır
  const server = new StellarSdk.Horizon.Server('${config.stellar.horizonUrl}');
  const networkPassphrase = StellarSdk.Networks.${config.stellar.network.toUpperCase()};

  // 2. Kullanıcı keypair (kendi secret key'inizi kullanın)
  const userKeypair = StellarSdk.Keypair.fromSecret('YOUR_SECRET_KEY');

  // 3. Hesabı yükle
  const userAccount = await server.loadAccount(userKeypair.publicKey());

  // 4. x402 asset tanımla
  const x402Asset = new StellarSdk.Asset('${config.x402.tokenCode}', '${config.x402.tokenIssuer}');

  // 5. Transaction oluştur
  const transaction = new StellarSdk.TransactionBuilder(userAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: 'CHAINTOTAL_SERVICE_WALLET',
        asset: x402Asset,
        amount: '${config.x402.paymentAmount}'
      })
    )
    .addMemo(StellarSdk.Memo.text('ChainTotal-' + Date.now()))
    .setTimeout(30)
    .build();

  // 6. İmzala
  transaction.sign(userKeypair);

  // 7. Gönder
  const result = await server.submitTransaction(transaction);
  
  console.log('Transaction Hash:', result.hash);
  return result.hash;
}
`;
}
