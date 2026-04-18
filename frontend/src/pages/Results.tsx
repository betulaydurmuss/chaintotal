import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Bell, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/atoms/Button'
import { Badge, RiskBadge } from '@components/atoms/Badge'
import { RiskScoreCircle } from '@components/molecules/RiskScoreCircle'
import { Tabs, Tab } from '@components/molecules/Tabs'
import { useState } from 'react'

export const Results = () => {
  const { queryId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('onchain')

  // Mock data - replace with actual API call
  const mockResult = {
    assetType: 'wallet',
    assetIdentifier: '0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b',
    riskScore: 35,
    riskLevel: 'low' as const,
    technicalScore: 40,
    communityScore: 28,
    timestamp: new Date().toISOString(),
  }

  const analysisTabs: Tab[] = [
    { id: 'onchain', label: 'On-Chain Analysis' },
    { id: 'community', label: 'Community Intelligence' },
    { id: 'security', label: 'Security Audit' },
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        icon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </Button>

      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Risk Score (35%) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4 space-y-6"
        >
          {/* Risk Score Card */}
          <div className="card text-center">
            <RiskScoreCircle
              score={mockResult.riskScore}
              size="lg"
              showLabel
              animated
            />
          </div>

          {/* Breakdown Card */}
          <div className="card space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Score Breakdown
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Technical (60%)</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {mockResult.technicalScore}/100
                  </span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockResult.technicalScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Community (40%)</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {mockResult.communityScore}/100
                  </span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockResult.communityScore}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <RiskBadge level={mockResult.riskLevel} />
            </div>
          </div>
        </motion.div>

        {/* Center Column - Analysis Tabs (40%) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="card">
            <Tabs
              tabs={analysisTabs}
              defaultTab={activeTab}
              onChange={setActiveTab}
            />

            <div className="mt-6 space-y-4">
              {activeTab === 'onchain' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    On-Chain Data
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Transaction Count</span>
                      <span className="font-semibold">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Balance</span>
                      <span className="font-semibold">15.42 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">First Seen</span>
                      <span className="font-semibold">2021-03-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Last Active</span>
                      <span className="font-semibold">2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'community' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Community Signals
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="success" size="sm">Positive</Badge>
                        <span className="text-xs text-text-muted">Twitter</span>
                      </div>
                      <p className="text-sm text-text-primary">
                        Verified by multiple community members
                      </p>
                    </div>
                    <div className="p-3 bg-surface border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" size="sm">Neutral</Badge>
                        <span className="text-xs text-text-muted">Reddit</span>
                      </div>
                      <p className="text-sm text-text-primary">
                        No significant reports found
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Security Assessment
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                      <p className="text-sm font-semibold text-success mb-1">
                        ✓ No critical vulnerabilities found
                      </p>
                      <p className="text-xs text-text-muted">
                        Smart contract verified and audited
                      </p>
                    </div>
                    <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                      <p className="text-sm font-semibold text-warning mb-1">
                        ⚠ Medium: Centralization risk
                      </p>
                      <p className="text-xs text-text-muted">
                        Single owner has significant control
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Quick Actions (25%) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-3 space-y-4"
        >
          <div className="card space-y-3">
            <h3 className="text-lg font-semibold text-text-primary">
              Quick Actions
            </h3>
            
            <Button
              variant="secondary"
              fullWidth
              icon={<Eye className="w-4 h-4" />}
            >
              Watch
            </Button>
            
            <Button
              variant="secondary"
              fullWidth
              icon={<Share2 className="w-4 h-4" />}
            >
              Share
            </Button>
            
            <Button
              variant="secondary"
              fullWidth
              icon={<Bell className="w-4 h-4" />}
            >
              Set Alert
            </Button>
          </div>

          {/* Metadata */}
          <div className="card space-y-3">
            <h3 className="text-lg font-semibold text-text-primary">
              Metadata
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Asset Type</span>
                <Badge variant="primary" size="sm">
                  {mockResult.assetType}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Analyzed</span>
                <span className="text-text-primary">Just now</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Query ID</span>
                <span className="text-text-primary font-mono text-xs">
                  {queryId?.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
