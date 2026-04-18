import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  placeholder?: string
  suggestions?: string[]
  loading?: boolean
  className?: string
}

export const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Enter wallet, token, dApp, NFT or domain...',
  suggestions = [],
  loading = false,
  className,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setShowSuggestions(isFocused && suggestions.length > 0 && value.length > 0)
  }, [isFocused, suggestions.length, value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
      setShowSuggestions(false)
    }
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    onSubmit(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className={clsx('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={clsx(
            'relative flex items-center gap-3 bg-surface border-2 rounded-xl px-4 py-3 transition-all duration-300',
            isFocused
              ? 'border-primary shadow-glow-cyan'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none"
            disabled={loading}
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left text-text-primary hover:bg-primary/10 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
