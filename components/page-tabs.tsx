"use client"

import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PageTabsProps {
  tabs: string[]
  activeTab: number
  onTabChange: (index: number) => void
  className?: string
}

export function PageTabs({ tabs, activeTab, onTabChange, className }: PageTabsProps) {
  return (
    <Tabs value={String(activeTab)} onValueChange={(v) => onTabChange(Number(v))} className={className}>
      <TabsList>
        {tabs.map((tab, index) => (
          <TabsTrigger key={tab} value={String(index)}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}