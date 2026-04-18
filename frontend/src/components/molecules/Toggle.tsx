import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, checked, className, id, ...props }, ref) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={clsx('flex items-start gap-3', className)}>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${toggleId}-label` : undefined}
          onClick={() => {
            const input = document.getElementById(toggleId) as HTMLInputElement
            input?.click()
          }}
          className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
            checked ? 'bg-primary' : 'bg-border'
          )}
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={clsx(
              'inline-block h-4 w-4 rounded-full bg-white shadow-lg',
              checked ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>

        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          checked={checked}
          className="sr-only"
          {...props}
        />

        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                id={`${toggleId}-label`}
                htmlFor={toggleId}
                className="text-sm font-medium text-text-primary cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-text-muted">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
