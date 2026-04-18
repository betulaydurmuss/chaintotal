import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface StatusIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  status: 'online' | 'offline' | 'warning' | 'error'
  label?: string
  showPulse?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const StatusIndicator = ({
  status,
  label,
  showPulse = true,
  size = 'md',
  className,
  ...props
}: StatusIndicatorProps) => {
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-text-muted',
    warning: 'bg-warning',
    error: 'bg-danger',
  }

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <div
      className={clsx('inline-flex items-center gap-2', className)}
      {...props}
    >
      <div className="relative">
        <div
          className={clsx(
            'rounded-full',
            sizes[size],
            statusColors[status]
          )}
        />
        {showPulse && status === 'online' && (
          <div
            className={clsx(
              'absolute inset-0 rounded-full animate-pulse-glow',
              statusColors[status],
              'opacity-75'
            )}
          />
        )}
      </div>
      
      {label && (
        <span className="text-sm font-medium text-text-primary">{label}</span>
      )}
    </div>
  )
}
