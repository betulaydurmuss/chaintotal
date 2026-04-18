/**
 * Validate Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate Stellar address
 */
export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z0-9]{55}$/.test(address)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Detect asset type from input
 */
export function detectAssetType(input: string): 'wallet' | 'token' | 'website' | 'unknown' {
  if (isValidEthereumAddress(input) || isValidStellarAddress(input)) {
    return 'wallet'
  }
  
  if (isValidUrl(input)) {
    return 'website'
  }
  
  // Simple heuristic for token names
  if (/^[A-Z]{2,10}$/.test(input)) {
    return 'token'
  }
  
  return 'unknown'
}
