import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download } from 'lucide-react'
import { Button } from '@components/atoms/Button'
import { Badge, RiskBadge } from '@components/atoms/Badge'
import { Input } from '@components/atoms/Input'
import { useNavigate } from 'react-router-dom'
import type { RiskLevel } from '@types/index'

export const History = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  // Mock data
  const mockHistory = [
    {
      id: '1',
      asset: '0x742d35Cc6634C0532925a3b844Bc9e7595f42D1b',
      type: 'wallet',
      riskScore: 35,
      riskLevel: 'low' as RiskLevel,
      date: '2026-04-18 14:30',
      status: 'success',
    },
    {
      id: '2',
      asset: 'USDC Token',
      type: 'token',
      riskScore: 15,
      riskLevel: 'low' as RiskLevel,
      date: '2026-04-18 12:15',
      status: 'success',
    },
    {
      id: '3',
      asset: 'Uniswap dApp',
      type: 'dapp',
      riskScore: 25,
      riskLevel: 'low' as RiskLevel,
      date: '2026-04-17 18:45',
      status: 'success',
    },
    {
      id: '4',
      asset: '0x8888...8888',
      type: 'wallet',
      riskScore: 75,
      riskLevel: 'high' as RiskLevel,
      date: '2026-04-17 10:20',
      status: 'success',
    },
    {
      id: '5',
      asset: 'Bored Ape #1234',
      type: 'nft',
      riskScore: 45,
      riskLevel: 'medium' as RiskLevel,
      date: '2026-04-16 16:30',
      status: 'success',
    },
  ]

  const assetTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'wallet', label: 'Wallet' },
    { value: 'token', label: 'Token' },
    { value: 'dapp', label: 'dApp' },
    { value: 'nft', label: 'NFT' },
    { value: 'website', label: 'Website' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Query History</h1>
          <p className="text-text-muted mt-1">
            View all your past risk assessments
          </p>
        </div>
        
        <Button
          variant="secondary"
          icon={<Download className="w-4 h-4" />}
        >
          Export
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              type="text"
              placeholder="Search by asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-text-muted" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input min-w-[150px]"
            >
              {assetTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <p className="text-sm text-text-muted mb-1">Total Queries</p>
          <p className="text-3xl font-bold text-text-primary">
            {mockHistory.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <p className="text-sm text-text-muted mb-1">Avg Risk Score</p>
          <p className="text-3xl font-bold text-warning">39</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <p className="text-sm text-text-muted mb-1">High Risk Found</p>
          <p className="text-3xl font-bold text-danger">1</p>
        </motion.div>
      </div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                  Asset
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                  Risk Score
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                  Risk Level
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="border-b border-border hover:bg-surface transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-text-primary">
                      {item.asset}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" size="sm">
                      {item.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-text-primary">
                      {item.riskScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={item.riskLevel} />
                  </td>
                  <td className="py-3 px-4 text-sm text-text-muted">
                    {item.date}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/results/${item.id}`)}
                    >
                      View
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <p className="text-sm text-text-muted">
            Showing 1 to {mockHistory.length} of {mockHistory.length} results
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
