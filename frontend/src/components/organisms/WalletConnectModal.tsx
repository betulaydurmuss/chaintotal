import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, ExternalLink, Zap } from 'lucide-react'
import { Button } from '@components/atoms/Button'
import { connectFreighter, connectDemo, isFreighterInstalled } from '@utils/walletConnect'
import { useUserStore } from '@stores/userStore'
import toast from 'react-hot-toast'

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WalletConnectModal = ({ isOpen, onClose }: WalletConnectModalProps) => {
  const { setUser } = useUserStore()
  const [connecting, setConnecting] = useState<'freighter' | 'demo' | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (isOpen) {
      isFreighterInstalled().then(setInstalled)
    }
  }, [isOpen])

  const handleConnect = async (type: 'freighter' | 'demo') => {
    setConnecting(type)
    try {
      const result = type === 'freighter' 
        ? await connectFreighter()
        : await connectDemo()

      if (result.success && result.wallet) {
        setUser({
          wallet: result.wallet,
          balance: 15.42,
          queryCount: 0,
        })
        toast.success(`✅ ${type === 'freighter' ? 'Freighter' : 'Demo wallet'} bağlandı!`)
        onClose()
      } else {
        toast.error(`❌ ${result.error}`)
      }
    } catch (error: any) {
      toast.error(`❌ Hata: ${error.message}`)
    } finally {
      setConnecting(null)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-surface rounded-2xl border border-border shadow-2xl"
        >
          <div className="gradient-primary p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Wallet Bağla</h2>
                  <p className="text-sm text-white/80">Devam etmek için seç</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {/* Freighter Option */}
            {installed ? (
              <button
                onClick={() => handleConnect('freighter')}
                disabled={connecting === 'freighter'}
                className="w-full flex items-center justify-between p-4 bg-background border-2 border-primary rounded-lg hover:bg-primary/10 transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">
                    🌟
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-text-primary">Freighter</p>
                    <p className="text-sm text-text-muted">Stellar Wallet</p>
                  </div>
                </div>
                {connecting === 'freighter' && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            ) : (
              <div className="p-4 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center text-2xl opacity-50">
                    🌟
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-text-primary">Freighter</p>
                    <p className="text-sm text-text-muted">Yüklü değil</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open('https://freighter.app', '_blank')}
                  icon={<ExternalLink className="w-4 h-4" />}
                  className="w-full"
                >
                  Freighter Yükle
                </Button>
              </div>
            )}

            {/* Demo Wallet Option */}
            <button
              onClick={() => handleConnect('demo')}
              disabled={connecting === 'demo'}
              className="w-full flex items-center justify-between p-4 bg-background border-2 border-warning rounded-lg hover:bg-warning/10 transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="text-left">
                  <p className="font-semibold text-text-primary">Demo Wallet</p>
                  <p className="text-sm text-text-muted">Test için hızlı bağlan</p>
                </div>
              </div>
              {connecting === 'demo' && (
                <div className="w-5 h-5 border-2 border-warning border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
