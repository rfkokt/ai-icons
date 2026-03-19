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
    <div className="flex items-center gap-2 p-1.5 bg-zinc-100 rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant="ghost"
          size="sm"
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "h-10 sm:h-9 flex-none px-4 rounded-lg text-sm transition-all border-2 border-transparent",
            activeTab === tab.key
              ? "bg-[#B9FF66] text-black font-black border-black shadow-[2px_2px_0_0_#000]"
              : "text-zinc-600 font-bold hover:text-black hover:bg-white hover:border-black hover:shadow-[2px_2px_0_0_#000]"
          )}
        >
          {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
