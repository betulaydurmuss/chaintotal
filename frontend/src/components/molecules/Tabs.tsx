import { useState } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

export interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'pills'
  className?: string
}

export const Tabs = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const baseStyles = 'relative flex gap-1'
  const variantStyles = {
    default: 'border-b border-border',
    pills: 'bg-surface rounded-lg p-1',
  }

  const tabBaseStyles = 'relative px-4 py-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'
  
  const tabVariantStyles = {
    default: (isActive: boolean) =>
      clsx(
        'border-b-2',
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-text-muted hover:text-text-primary'
      ),
    pills: (isActive: boolean) =>
      clsx(
        'rounded-md',
        isActive
          ? 'bg-primary text-white'
          : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
      ),
  }

  return (
    <div
      role="tablist"
      className={clsx(baseStyles, variantStyles[variant], className)}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={clsx(
              tabBaseStyles,
              tabVariantStyles[variant](isActive)
            )}
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>

            {variant === 'default' && isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
