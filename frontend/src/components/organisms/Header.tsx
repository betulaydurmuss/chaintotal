import { Link } from 'react-router-dom'
import { Menu, X, Wallet, LogOut, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@components/atoms/Button'
import { StatusIndicator } from '@components/molecules/StatusIndicator'
import { useUserStore } from '@stores/userStore'
import { useStellarBalance } from '@hooks/useStellarBalance'
import {
  isMetaMaskInstalled,
  connectMetaMask,
  getCurrentAccount,
  formatAddress,
  onAccountsChanged,
  onChainChanged,
  removeListeners,
  type WalletState,
} from '@utils/metamask'
import {
  isFreighterInstalled,
  connectFreighter,
  checkFreighterConnection,
  formatStellarAddress,
  type FreighterWalletState,
} from '@utils/freighter'
import toast from 'react-hot-toast'

const STELLAR_WALLET = 'GA65QD5ZANY6TB3O7GCQGNNT7QFVAB4N5CQKGVE3BLNX6TD4YHTI4I7O'

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [metamaskWallet, setMetamaskWallet] = useState<WalletState | null>(null)
  const [freighterWallet, setFreighterWallet] = useState<FreighterWalletState | null>(null)
  const [walletType, setWalletType] = useState<'metamask' | 'freighter' | 'stellar' | null>(null)
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  const setUser = useUserStore((state) => state.setUser)
  const updateBalance = useUserStore((state) => state.updateBalance)

  // Fetch real Stellar balance
  const { xlm, loading: balanceLoading, refresh: refreshBalance } = useStellarBalance()

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'History', href: '/history' },
    { name: 'Community', href: '/community' },
  ]

  // Check for existing connection on mount
  useEffect(() => {
    // Always load Stellar wallet
    setWalletType('stellar')
    setUser({
      wallet: STELLAR_WALLET,
      balance: parseFloat(xlm),
      queryCount: 0,
    })

    const checkConnections = async () => {
      // Check MetaMask
      const metamaskAccount = await getCurrentAccount()
      if (metamaskAccount) {
        setMetamaskWallet(metamaskAccount)
        setWalletType('metamask')
        setUser({
          wallet: metamaskAccount.address!,
          balance: parseFloat(metamaskAccount.balance!) * 1000,
          queryCount: 0,
        })
        return
      }

      // Check Freighter
      const freighterAccount = await checkFreighterConnection()
      if (freighterAccount) {
        setFreighterWallet(freighterAccount)
        setWalletType('freighter')
        setUser({
          wallet: freighterAccount.publicKey!,
          balance: parseFloat(freighterAccount.balance || '0'),
          queryCount: 0,
        })
      }
    }
    checkConnections()

    onAccountsChanged((accounts) => {
      if (accounts.length === 0 && walletType === 'metamask') {
        handleDisconnect()
      } else if (walletType === 'metamask') {
        checkConnections()
      }
    })

    onChainChanged(() => {
      if (walletType === 'metamask') window.location.reload()
    })

    return () => { removeListeners() }
  }, [])

  // Update balance when xlm changes
  useEffect(() => {
    if (walletType === 'stellar' && xlm !== '0') {
      updateBalance(parseFloat(xlm))
    }
  }, [xlm])

  const handleConnectMetaMask = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('❌ MetaMask yüklü değil')
      window.open('https://metamask.io', '_blank')
      return
    }

    try {
      const wallet = await connectMetaMask()
      setMetamaskWallet(wallet)
      setWalletType('metamask')
      setUser({
        wallet: wallet.address!,
        balance: parseFloat(wallet.balance!) * 1000,
        queryCount: 0,
      })
      toast.success('✅ MetaMask bağlandı!')
    } catch (error: any) {
      toast.error(`❌ ${error.message}`)
    }
  }

  const handleConnectFreighter = async () => {
    if (!isFreighterInstalled()) {
      toast.error('❌ Freighter yüklü değil')
      window.open('https://freighter.app', '_blank')
      return
    }

    try {
      const wallet = await connectFreighter()
      setFreighterWallet(wallet)
      setWalletType('freighter')
      setUser({
        wallet: wallet.publicKey!,
        balance: parseFloat(wallet.balance || '0'),
        queryCount: 0,
      })
      toast.success(`✅ Freighter bağlandı! Bakiye: ${wallet.balance} XLM`)
    } catch (error: any) {
      toast.error(`❌ ${error.message}`)
    }
  }

  const handleDisconnect = () => {
    setMetamaskWallet(null)
    setFreighterWallet(null)
    setWalletType(null)
    clearUser()
    toast.success('✅ Wallet bağlantısı kesildi')
  }

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/95 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow-cyan transition-all duration-300">
              <span className="text-2xl">🔐</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-text-primary">ChainTotal</h1>
              <p className="text-xs text-text-muted">Risk Assessment</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Network Status */}
            <StatusIndicator
              status="online"
              label="Connected"
              className="hidden lg:flex"
            />

            {user ? (
              <>
                {/* User Balance */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border border-border">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    {balanceLoading ? '...' : `${xlm} XLM`}
                  </span>
                  <button onClick={refreshBalance} className="text-text-muted hover:text-primary">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>

                {/* User Wallet */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<span className="text-lg">{walletType === 'metamask' ? '🦊' : '🌟'}</span>}
                  >
                    {walletType === 'metamask'
                      ? formatAddress(user.wallet)
                      : formatStellarAddress(user.wallet)
                    }
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnect}
                    icon={<LogOut className="w-4 h-4" />}
                    className="text-danger hover:bg-danger/10"
                    title="Disconnect Wallet"
                  />
                </div>
              </>
            ) : (
              /* Connect Wallet Buttons */
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConnectMetaMask}
                  icon={<span className="text-lg">🦊</span>}
                >
                  MetaMask
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleConnectFreighter}
                  icon={<span className="text-lg">🌟</span>}
                >
                  Freighter
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-text-muted hover:text-primary hover:bg-surface rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-sm text-text-muted">Wallet</span>
                      <span className="text-sm font-medium text-text-primary">
                        {walletType === 'metamask' 
                          ? formatAddress(user.wallet)
                          : formatStellarAddress(user.wallet)
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-sm text-text-muted">Type</span>
                      <span className="text-sm font-medium text-text-primary">
                        {walletType === 'metamask' ? '🦊 MetaMask' : '🌟 Freighter'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-sm text-text-muted">Balance</span>
                      <span className="text-sm font-semibold text-primary">
                        {user.balance.toFixed(2)} {walletType === 'freighter' ? 'XLM' : 'ETH'}
                      </span>
                    </div>
                    <div className="px-4 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDisconnect}
                        icon={<LogOut className="w-4 h-4" />}
                        className="w-full text-danger hover:bg-danger/10"
                      >
                        Disconnect Wallet
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-2 space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleConnectMetaMask}
                      icon={<span className="text-lg">🦊</span>}
                      className="w-full"
                    >
                      Connect MetaMask
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleConnectFreighter}
                      icon={<span className="text-lg">🌟</span>}
                      className="w-full"
                    >
                      Connect Freighter
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-text-muted">Network</span>
                  <StatusIndicator status="online" label="Connected" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  </>
  )
}
