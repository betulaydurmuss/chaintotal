import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, Users, Shield } from 'lucide-react'
import { Badge } from '@components/atoms/Badge'
import { MetricCard } from '@components/molecules/MetricCard'

export const Community = () => {
  const mockAlerts = [
    {
      id: '1',
      severity: 'high',
      title: 'Phishing Campaign Detected',
      description: 'Multiple reports of fake wallet connection requests',
      reports: 45,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      severity: 'medium',
      title: 'Suspicious Token Contract',
      description: 'Unusual transfer patterns detected in new token',
      reports: 23,
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      severity: 'low',
      title: 'Domain Typosquatting',
      description: 'Similar domain registered mimicking popular dApp',
      reports: 12,
      timestamp: '1 day ago',
    },
  ]

  const sentimentData = [
    { label: 'Positive', value: 65, color: 'success' },
    { label: 'Neutral', value: 25, color: 'warning' },
    { label: 'Negative', value: 10, color: 'danger' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Community Feed</h1>
        <p className="text-text-muted mt-1">
          Latest threat intelligence from the community
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Reports"
          value="156"
          icon={AlertTriangle}
          variant="danger"
        />
        <MetricCard
          label="Community Members"
          value="12.5K"
          icon={Users}
          variant="primary"
        />
        <MetricCard
          label="Threats Blocked"
          value="2,341"
          icon={Shield}
          variant="success"
        />
        <MetricCard
          label="Trending Alerts"
          value="8"
          icon={TrendingUp}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Alerts Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Recent Threat Alerts
          </h2>

          {mockAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-hover"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    alert.severity === 'high'
                      ? 'bg-danger/20'
                      : alert.severity === 'medium'
                      ? 'bg-warning/20'
                      : 'bg-success/20'
                  }`}
                >
                  <AlertTriangle
                    className={`w-6 h-6 ${
                      alert.severity === 'high'
                        ? 'text-danger'
                        : alert.severity === 'medium'
                        ? 'text-warning'
                        : 'text-success'
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-text-primary">
                      {alert.title}
                    </h3>
                    <Badge
                      variant={
                        alert.severity === 'high'
                          ? 'danger'
                          : alert.severity === 'medium'
                          ? 'warning'
                          : 'success'
                      }
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </div>

                  <p className="text-sm text-text-muted mb-3">
                    {alert.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span>{alert.reports} reports</span>
                    <span>•</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sentiment Gauge */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Community Sentiment
          </h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card space-y-4"
          >
            {sentimentData.map((item, index) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">{item.label}</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    className={`h-full ${
                      item.color === 'success'
                        ? 'bg-success'
                        : item.color === 'warning'
                        ? 'bg-warning'
                        : 'bg-danger'
                    }`}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Report Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="card space-y-3"
          >
            <h3 className="font-semibold text-text-primary">Report Stats</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Today</span>
                <span className="font-semibold text-text-primary">23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">This Week</span>
                <span className="font-semibold text-text-primary">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">This Month</span>
                <span className="font-semibold text-text-primary">892</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
