"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useMemo } from "react"
import { useAuthStore } from "@/lib/store"

interface UseTabStateReturn {
  activeTab: string
  setActiveTab: (tab: string) => void
  handleTabChange: (index: number) => void
  isPersonal: boolean
  isOverview: boolean
  tabs: string[]
  tabParam: string | null
}

export function useTabState(defaultTabs: string[] = ["Personal", "Overview"]): UseTabStateReturn {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  const tabParam = searchParams.get("tab")
  
  const tabs = useMemo(() => {
    return user ? defaultTabs : defaultTabs.filter((t) => t.toLowerCase() !== "overview")
  }, [user, defaultTabs])

  const activeTab = useMemo(() => {
    if (!tabParam) return tabs[0].toLowerCase()
    const normalizedTab = tabParam.toLowerCase()
    return tabs.map((t) => t.toLowerCase()).includes(normalizedTab)
      ? normalizedTab
      : tabs[0].toLowerCase()
  }, [tabParam, tabs])

  const setActiveTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", tab.toLowerCase())
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(tabs[index].toLowerCase())
    },
    [tabs, setActiveTab]
  )

  const isPersonal = activeTab === "personal"
  const isOverview = activeTab === "overview"

  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    isPersonal,
    isOverview,
    tabs,
    tabParam,
  }
}