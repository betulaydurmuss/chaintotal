import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { RiskLevel } from '@types/index'

export interface RiskScoreCircleProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

export const RiskScoreCircle = ({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
  className,
}: RiskScoreCircleProps) => {
  const [displayScore, setDisplayScore] = useState(0)

  // Animate score counter
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score)
      return
    }

    let start = 0
    const duration = 2000 // 2 seconds
    const increment = score / (duration / 16) // 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [score, animated])

  // Determine risk level and color
  const getRiskLevel = (score: number): RiskLevel => {
    if (score <= 30) return 'low'
    if (score <= 60) return 'medium'
    return 'high'
  }

  const riskLevel = getRiskLevel(score)
  
  const colors = {
    low: { stroke: '#00FF00', glow: 'shadow-glow-success' },
    medium: { stroke: '#FFB800', glow: 'shadow-glow-warning' },
    high: { stroke: '#FF0055', glow: 'shadow-glow-danger' },
  }

  const sizes = {
    sm: { circle: 80, stroke: 6, text: 'text-xl' },
    md: { circle: 120, stroke: 8, text: 'text-3xl' },
    lg: { circle: 160, stroke: 10, text: 'text-5xl' },
  }

  const { circle, stroke, text } = sizes[size]
  const radius = (circle - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayScore / 100) * circumference

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        <svg
          width={circle}
          height={circle}
          className={clsx('transform -rotate-90', colors[riskLevel].glow)}
        >
          {/* Background circle */}
          <circle
            cx={circle / 2}
            cy={circle / 2}
            r={radius}
            stroke="#1E2139"
            strokeWidth={stroke}
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={circle / 2}
            cy={circle / 2}
            r={radius}
            stroke={colors[riskLevel].stroke}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className={clsx('font-bold', text)}
              style={{ color: colors[riskLevel].stroke }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {displayScore}
            </motion.div>
            <div className="text-xs text-text-muted">/ 100</div>
          </div>
        </div>
      </div>

      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-sm font-medium text-text-muted">Risk Score</div>
          <div
            className="text-lg font-bold"
            style={{ color: colors[riskLevel].stroke }}
          >
            {riskLevel === 'low' && 'Düşük Risk'}
            {riskLevel === 'medium' && 'Orta Risk'}
            {riskLevel === 'high' && 'Yüksek Risk'}
          </div>
        </motion.div>
      )}
    </div>
  )
}
