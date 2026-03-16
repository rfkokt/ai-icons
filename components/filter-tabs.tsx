"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterTabsProps {
  tabs: { key: string; label: string; icon?: React.ReactNode }[]
  activeTab: string
  onTabChange: (key: string) => void
  className?: string
}

export function FilterTabs({ tabs, activeTab, onTabChange, className }: FilterTabsProps) {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-zinc-100 rounded-lg", className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant="ghost"
          size="sm"
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "h-10 sm:h-9 flex-1 sm:flex-none px-4 rounded-md text-sm font-medium transition-colors",
            activeTab === tab.key
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-transparent"
          )}
        >
          {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
