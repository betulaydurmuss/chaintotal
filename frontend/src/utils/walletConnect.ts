export type WalletType = 'freighter' | 'demo' | 'none'

/**
 * Check if Freighter is installed
 */
export async function isFreighterInstalled(): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return !!(window as any).freighter
}

/**
 * Connect to Freighter wallet
 */
export async function connectFreighter(): Promise<{
  success: boolean
  wallet?: string
  error?: string
}> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const freighter = (window as any).freighter
    
    if (!freighter) {
      return {
        success: false,
        error: 'Freighter bulunamadı',
      }
    }

    const publicKey = await freighter.getPublicKey()
    
    if (!publicKey) {
      return {
        success: false,
        error: 'Public key alınamadı',
      }
    }

    return {
      success: true,
      wallet: publicKey,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Connect with demo wallet (for testing)
 */
export async function connectDemo(): Promise<{
  success: boolean
  wallet?: string
  error?: string
}> {
  // Generate random Stellar address for demo
  const demoWallet = 'GCZAMPLE' + Math.random().toString(36).substring(2, 50).toUpperCase().padEnd(48, 'X')
  
  return {
    success: true,
    wallet: demoWallet,
  }
}

/**
 * Format wallet address
 */
export function formatWalletAddress(address: string, chars: number = 4): string {
  if (!address || address.length <= chars * 2) return address
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`
}
