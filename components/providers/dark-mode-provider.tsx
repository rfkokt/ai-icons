/* eslint-disable -- setState in effect is necessary for SSR hydration */
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useThemeStore } from "@/lib/store"

type Theme = "light" | "dark"

const DEFAULT_STORAGE_KEY = "theme-preference"
const DEFAULT_THEME: Theme = "light"

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

// Safe localStorage access with SSR fallback
const getStorageItem = (key: string): string | null => {
  try {
    return typeof window !== "undefined" ? localStorage.getItem(key) : null
  } catch {
    return null
  }
}

const setStorageItem = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value)
    }
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function DarkModeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = DEFAULT_STORAGE_KEY,
}: DarkModeProviderProps) {
  const [isClient, setIsClient] = useState(false)
  const storeTheme = useThemeStore((state) => state.theme)
  const setThemeStore = useThemeStore((state) => state.setTheme)

  // Handle client-side mounting to avoid hydration mismatch
  // NOTE: setState in effect is necessary for SSR hydration to prevent mismatch
  useEffect(() => {
    setIsClient(true)

    // Initialize theme from localStorage or system preference on mount
    const storedTheme = getStorageItem(storageKey) as Theme | null
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
    if (!isClient) return

    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(storeTheme)

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", storeTheme === "dark" ? "#09090b" : "#ffffff")
    }
  }, [storeTheme, isClient])

  // Listen for system theme changes
  useEffect(() => {
    if (!isClient) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const storedTheme = getStorageItem(storageKey)
      if (!storedTheme) {
        setThemeStore(e.matches ? "dark" : "light")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [isClient, storageKey, setThemeStore])

  const contextValue: DarkModeContextValue = {
    theme: isClient ? storeTheme : defaultTheme,
    setTheme: (theme: Theme) => {
      setThemeStore(theme)
      setStorageItem(storageKey, theme)
    },
    toggleTheme: () => {
      const newTheme = storeTheme === "light" ? "dark" : "light"
      setThemeStore(newTheme)
      setStorageItem(storageKey, newTheme)
    },
    isDarkMode: isClient ? storeTheme === "dark" : defaultTheme === "dark",
  }

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  )
}
