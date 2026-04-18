import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { LucideIcon } from 'lucide-react'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'muted'
}

export const Icon = ({
  icon: IconComponent,
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: IconProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const variants = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    muted: 'text-text-muted',
  }

  return (
    <span
      className={clsx('inline-flex items-center justify-center', className)}
      {...props}
    >
      <IconComponent className={clsx(sizes[size], variants[variant])} />
    </span>
  )
}
