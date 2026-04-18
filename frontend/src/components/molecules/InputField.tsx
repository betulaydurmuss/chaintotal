import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { Input } from '@components/atoms/Input'

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, fullWidth = false, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        
        <Input
          ref={ref}
          id={inputId}
          error={error}
          fullWidth={fullWidth}
          {...props}
        />

        {(error || helperText) && (
          <p
            id={`${inputId}-${error ? 'error' : 'helper'}`}
            className={clsx(
              'text-xs',
              error ? 'text-danger' : 'text-text-muted'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

InputField.displayName = 'InputField'
