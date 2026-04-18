import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, fullWidth = false, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'input',
          error && 'border-danger focus:border-danger focus:shadow-glow-danger',
          fullWidth && 'w-full',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
