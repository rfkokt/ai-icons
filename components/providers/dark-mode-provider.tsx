"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useThemeStore } from "@/lib/store"

type Theme = "light" | "dark"

interface DarkModeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDarkMode: boolean
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined)

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider")
  }
  return context
}

interface DarkModeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function DarkModeProvider({
  children,
  defaultTheme = "light",
  storageKey = "theme-preference",
}: DarkModeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const storeTheme = useThemeStore((state) => state.theme)
  const setThemeStore = useThemeStore((state) => state.setTheme)
  const toggleThemeStore = useThemeStore((state) => state.toggleTheme)

  // Handle client-side mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Initialize theme from localStorage or system preference on mount
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      setThemeStore(storedTheme)
    } else {
      // Use system preference as fallback
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const systemTheme: Theme = systemPrefersDark ? "dark" : "light"
      setThemeStore(systemTheme)
    }
  }, [storageKey, setThemeStore])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(storeTheme)

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", storeTheme === "dark" ? "#09090b" : "#ffffff")
    }
  }, [storeTheme, mounted])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const storedTheme = localStorage.getItem(storageKey)
      if (!storedTheme) {
        setThemeStore(e.matches ? "dark" : "light")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [mounted, storageKey, setThemeStore])

  const contextValue: DarkModeContextValue = {
    theme: mounted ? storeTheme : defaultTheme,
    setTheme: (theme: Theme) => {
      setThemeStore(theme)
      localStorage.setItem(storageKey, theme)
    },
    toggleTheme: () => {
      toggleThemeStore()
      const newTheme = storeTheme === "light" ? "dark" : "light"
      localStorage.setItem(storageKey, newTheme)
    },
    isDarkMode: mounted ? storeTheme === "dark" : defaultTheme === "dark",
  }

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  )
}
