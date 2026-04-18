import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  onRemove?: () => void
  variant?: 'default' | 'primary' | 'accent'
}

export const Chip = ({
  label,
  onRemove,
  variant = 'default',
  className,
  ...props
}: ChipProps) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors'
  
  const variants = {
    default: 'bg-surface border border-border text-text-primary hover:border-primary',
    primary: 'bg-primary/20 text-primary hover:bg-primary/30',
    accent: 'bg-accent/20 text-accent hover:bg-accent/30',
  }

  return (
    <div className={clsx(baseStyles, variants[variant], className)} {...props}>
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
