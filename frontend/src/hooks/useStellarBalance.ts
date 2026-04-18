import { useState, useEffect } from 'react'

const WALLET = 'GA65QD5ZANY6TB3O7GCQGNNT7QFVAB4N5CQKGVE3BLNX6TD4YHTI4I7O'
const HORIZON_URL = 'https://horizon-testnet.stellar.org'

export interface StellarBalance {
  xlm: string
  loading: boolean
  error: string | null
}

export const useStellarBalance = () => {
  const [data, setData] = useState<StellarBalance>({
    xlm: '0',
    loading: true,
    error: null,
  })

  const fetchBalance = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      const res = await fetch(`${HORIZON_URL}/accounts/${WALLET}`)
      
      if (!res.ok) {
        throw new Error('Hesap bulunamadı')
      }

      const account = await res.json()
      const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native')
      const xlm = xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : '0'

      setData({ xlm, loading: false, error: null })
    } catch (err: any) {
      setData({ xlm: '0', loading: false, error: err.message })
    }
  }

  useEffect(() => {
    fetchBalance()
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  return { ...data, refresh: fetchBalance }
}
