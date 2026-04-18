import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: any
  }
}

export interface WalletState {
  address: string | null
  balance: string | null
  chainId: number | null
  isConnected: boolean
}

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask)
}

/**
 * Connect to MetaMask
 */
export const connectMetaMask = async (): Promise<WalletState> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask yüklü değil')
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    
    // Request account access
    const accounts = await provider.send('eth_requestAccounts', [])
    
    if (!accounts || accounts.length === 0) {
      throw new Error('Hesap bulunamadı')
    }

    const address = accounts[0]
    const balance = await provider.getBalance(address)
    const network = await provider.getNetwork()

    return {
      address,
      balance: ethers.formatEther(balance),
      chainId: Number(network.chainId),
      isConnected: true,
    }
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Kullanıcı bağlantıyı reddetti')
    }
    throw error
  }
}

/**
 * Get current account
 */
export const getCurrentAccount = async (): Promise<WalletState | null> => {
  if (!isMetaMaskInstalled()) {
    return null
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_accounts', [])

    if (!accounts || accounts.length === 0) {
      return null
    }

    const address = accounts[0]
    const balance = await provider.getBalance(address)
    const network = await provider.getNetwork()

    return {
      address,
      balance: ethers.formatEther(balance),
      chainId: Number(network.chainId),
      isConnected: true,
    }
  } catch (error) {
    console.error('Get account error:', error)
    return null
  }
}

/**
 * Disconnect wallet
 */
export const disconnectWallet = (): WalletState => {
  return {
    address: null,
    balance: null,
    chainId: null,
    isConnected: false,
  }
}

/**
 * Format address for display
 */
export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

/**
 * Format balance for display
 */
export const formatBalance = (balance: string | number): string => {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance
  return num.toFixed(2)
}

/**
 * Setup account change listener
 */
export const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback)
  }
}

/**
 * Setup chain change listener
 */
export const onChainChanged = (callback: (chainId: string) => void) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback)
  }
}

/**
 * Remove listeners
 */
export const removeListeners = () => {
  if (window.ethereum) {
    window.ethereum.removeAllListeners('accountsChanged')
    window.ethereum.removeAllListeners('chainChanged')
  }
}
