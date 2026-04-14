/* eslint-disable -- setState in effect is necessary for SSR hydration */
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useThemeStore } from "@/lib/store"
import { getStorageItem, setStorageItem } from "@/lib/utils"

/**
 * Represents the available theme options.
 */
type Theme = "light" | "dark"

/**
 * Default localStorage key for storing theme preference.
 */
const DEFAULT_STORAGE_KEY = "theme-preference"

/**
 * Default theme to use when no preference is stored.
 */
const DEFAULT_THEME: Theme = "light"

/**
 * Context value interface for dark mode state and controls.
 */
interface DarkModeContextValue {
  /** The current theme value */
  theme: Theme
  /** Function to set a specific theme */
  setTheme: (theme: Theme) => void
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void
  /** Whether dark mode is currently active */
  isDarkMode: boolean
  /** Whether the theme is still being initialized (client-side mounting) */
  isLoading: boolean
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined)

/**
 * Hook to access the dark mode context.
 * Must be used within a DarkModeProvider.
 *
 * @throws {Error} If used outside of DarkModeProvider
 * @returns The dark mode context value
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme, isLoading } = useDarkMode()
 *   if (isLoading) return <div>Loading...</div>
 *   return <button onClick={toggleTheme}>Current: {theme}</button>
 * }
 * ```
 */
export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider")
  }
  return context
}

/**
 * Props for the DarkModeProvider component.
 */
interface DarkModeProviderProps {
  /** Child components to be wrapped with the theme context */
  children: ReactNode
  /** The default theme to use before client-side initialization */
  defaultTheme?: Theme
  /** The localStorage key for persisting theme preference (defaults to "theme-preference") */
  storageKey?: string
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
    isLoading: !isClient,
  }

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  )
}
