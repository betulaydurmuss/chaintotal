import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import type { RiskLevel } from '@types/index'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...props
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full font-semibold'
  
  const variants = {
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-danger/20 text-danger',
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-surface border border-border text-text-secondary',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  )
}

// Risk Level Badge
export const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const variants: Record<RiskLevel, BadgeProps['variant']> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  }

  const labels: Record<RiskLevel, string> = {
    low: 'Düşük Risk',
    medium: 'Orta Risk',
    high: 'Yüksek Risk',
  }

  return <Badge variant={variants[level]}>{labels[level]}</Badge>
}
