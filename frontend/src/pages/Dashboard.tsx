import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, TrendingUp, CheckCircle, Database, Activity } from 'lucide-react'
import { SearchBar } from '@components/molecules/SearchBar'
import { Button } from '@components/atoms/Button'
import { Badge } from '@components/atoms/Badge'
import { MetricCard } from '@components/molecules/MetricCard'
import { Tabs, Tab } from '@components/molecules/Tabs'
import { useUserStore } from '@stores/userStore'
import { useAnalysisStore } from '@stores/analysisStore'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@api/client'
import toast from 'react-hot-toast'
import type { AssetType } from '@types/index'

export const Dashboard = () => {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const { setIsAnalyzing } = useAnalysisStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>('wallet')

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.getAnalytics().then((res) => res.data),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Analyze mutation
  const analyzeMutation = useMutation({
    mutationFn: (query: string) =>
      api.analyze({ query, userWallet: user?.wallet || '' }),
    onSuccess: (response) => {
      toast.success('✅ Analiz tamamlandı!')
      setIsAnalyzing(false)
      // Navigate to results page
      navigate(`/results/${Date.now()}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || '❌ Analiz başarısız oldu')
      setIsAnalyzing(false)
    },
  })

  const handleAnalyze = (query: string) => {
    if (!query.trim()) {
      toast.error('⚠️ Lütfen analiz edilecek bir varlık girin')
      return
    }

    setIsAnalyzing(true)
    analyzeMutation.mutate(query)
  }

  const assetTabs: Tab[] = [
    { id: 'wallet', label: 'Wallet', icon: <span>🔐</span> },
    { id: 'token', label: 'Token', icon: <span>🪙</span> },
    { id: 'dapp', label: 'dApp', icon: <span>📱</span> },
    { id: 'nft', label: 'NFT', icon: <span>🖼️</span> },
    { id: 'website', label: 'Website', icon: <span>🌐</span> },
  ]

  const exampleQueries = [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b',
    'USDC token analiz et',
    'Uniswap dApp güvenli mi?',
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="gradient-primary rounded-2xl p-8 md:p-12"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Instant Crypto Risk Assessment
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Enter a wallet, token, dApp, NFT or domain
          </p>

          {/* Search Bar */}
          <div className="mt-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleAnalyze}
              suggestions={exampleQueries}
              loading={analyzeMutation.isPending}
            />
          </div>

          {/* Asset Type Tabs */}
          <div className="flex justify-center">
            <Tabs
              tabs={assetTabs}
              defaultTab={selectedAssetType}
              onChange={(id) => setSelectedAssetType(id as AssetType)}
              variant="pills"
            />
          </div>

          {/* Analyze Button */}
          <Button
            size="lg"
            onClick={() => handleAnalyze(searchQuery)}
            loading={analyzeMutation.isPending}
            disabled={!searchQuery.trim()}
            icon={<Search className="w-5 h-5" />}
            className="min-w-[200px]"
          >
            {analyzeMutation.isPending ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Queries Today"
          value={analytics?.totalQueries || 0}
          icon={Activity}
          variant="primary"
        />
        <MetricCard
          label="Success Rate"
          value={`${Math.round(analytics?.paymentSuccessRate || 0)}%`}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          label="Cache Hit Rate"
          value={`${Math.round(analytics?.cacheHitRate || 0)}%`}
          icon={Database}
          variant="accent"
        />
        <MetricCard
          label="Avg Processing"
          value={`${Math.round(analytics?.averageProcessingTime || 0)}ms`}
          icon={TrendingUp}
          variant="warning"
        />
      </div>

      {/* Recent Queries Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            Recent Queries
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/history')}
          >
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl">🔐</span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    0x742d...42D1b
                  </p>
                  <p className="text-sm text-text-muted">2 hours ago</p>
                </div>
              </div>
              <Badge variant="success">Low Risk</Badge>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="card-hover cursor-pointer"
          onClick={() => navigate('/history')}
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            📜 Query History
          </h3>
          <p className="text-sm text-text-muted">
            View all your past risk assessments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="card-hover cursor-pointer"
          onClick={() => navigate('/community')}
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            🌐 Community Feed
          </h3>
          <p className="text-sm text-text-muted">
            Latest threat intelligence from the community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="card-hover cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            💳 Top Up Balance
          </h3>
          <p className="text-sm text-text-muted">
            Add more x402 tokens to your account
          </p>
        </motion.div>
      </div>
    </div>
  )
}
