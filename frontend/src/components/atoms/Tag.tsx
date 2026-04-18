import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'accent'
  size?: 'sm' | 'md'
}

export const Tag = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ...props
}: TagProps) => {
  const baseStyles = 'inline-flex items-center rounded font-medium'
  
  const variants = {
    default: 'bg-surface border border-border text-text-secondary',
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  )
}
