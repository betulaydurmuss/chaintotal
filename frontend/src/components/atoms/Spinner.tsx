import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'white'
}

export const Spinner = ({
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: SpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const variants = {
    primary: 'text-primary',
    white: 'text-white',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx('inline-flex items-center justify-center', className)}
      {...props}
    >
      <Loader2
        className={clsx('animate-spin', sizes[size], variants[variant])}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
