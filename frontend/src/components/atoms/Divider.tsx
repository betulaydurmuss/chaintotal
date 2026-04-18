import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'primary'
}

export const Divider = ({
  orientation = 'horizontal',
  variant = 'default',
  className,
  ...props
}: DividerProps) => {
  const variants = {
    default: 'bg-border',
    primary: 'bg-primary/30',
  }

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={clsx('w-px h-full', variants[variant], className)}
        {...props}
      />
    )
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={clsx('w-full h-px border-0', variants[variant], className)}
      {...props}
    />
  )
}
