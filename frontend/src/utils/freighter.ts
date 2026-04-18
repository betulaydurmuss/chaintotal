declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<boolean>
      getPublicKey: () => Promise<string>
      signTransaction: (xdr: string, opts?: any) => Promise<string>
    }
  }
}

export interface FreighterWalletState {
  publicKey: string | null
  balance: string | null
  isConnected: boolean
}

/**
 * Check if Freighter is installed
 */
export const isFreighterInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.freighter !== 'undefined'
}

/**
 * Get Stellar account balance
 */
const getStellarBalance = async (publicKey: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://horizon-testnet.stellar.org/accounts/${publicKey}`
    )
    
    if (!response.ok) {
      return '0'
    }

    const data = await response.json()
    const xlmBalance = data.balances.find((b: any) => b.asset_type === 'native')
    
    return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : '0'
  } catch (error) {
    console.error('Balance fetch error:', error)
    return '0'
  }
}

/**
 * Connect to Freighter wallet
 */
export const connectFreighter = async (): Promise<FreighterWalletState> => {
  if (!isFreighterInstalled()) {
    throw new Error('Freighter yüklü değil')
  }

  try {
    const publicKey = await window.freighter!.getPublicKey()
    
    if (!publicKey) {
      throw new Error('Public key alınamadı')
    }

    const balance = await getStellarBalance(publicKey)

    return {
      publicKey,
      balance,
      isConnected: true,
    }
  } catch (error: any) {
    if (error.message?.includes('User declined')) {
      throw new Error('Kullanıcı bağlantıyı reddetti')
    }
    throw error
  }
}

/**
 * Check if already connected
 */
export const checkFreighterConnection = async (): Promise<FreighterWalletState | null> => {
  if (!isFreighterInstalled()) {
    return null
  }

  try {
    const isConnected = await window.freighter!.isConnected()
    
    if (!isConnected) {
      return null
    }

    const publicKey = await window.freighter!.getPublicKey()
    const balance = await getStellarBalance(publicKey)
    
    return {
      publicKey,
      balance,
      isConnected: true,
    }
  } catch (error) {
    console.error('Freighter connection check error:', error)
    return null
  }
}

/**
 * Disconnect wallet
 */
export const disconnectFreighter = (): FreighterWalletState => {
  return {
    publicKey: null,
    balance: null,
    isConnected: false,
  }
}

/**
 * Format Stellar address for display
 */
export const formatStellarAddress = (address: string): string => {
  if (!address) return ''
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
}
