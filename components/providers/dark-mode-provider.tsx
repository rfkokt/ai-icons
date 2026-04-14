/* eslint-disable -- setState in effect is necessary for SSR hydration */
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useThemeStore } from "@/lib/store"

/**
 * Represents the available theme options.
 */
type Theme = "light" | "dark"

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
}

export function DarkModeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
}: DarkModeProviderProps) {
  const [isClient, setIsClient] = useState(false)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  // Handle client-side mounting to avoid hydration mismatch
  // NOTE: setState in effect is necessary for SSR hydration to prevent mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!isClient) return

    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#ffffff")
    }
  }, [theme, isClient])

  // Listen for system theme changes
  useEffect(() => {
    if (!isClient) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      // (Zustand persist will have the saved preference)
      const zustandStorage = localStorage.getItem("theme-preference")
      if (!zustandStorage) {
        setTheme(e.matches ? "dark" : "light")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [isClient, setTheme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const contextValue: DarkModeContextValue = {
    theme: isClient ? theme : defaultTheme,
    setTheme,
    toggleTheme,
    isDarkMode: isClient ? theme === "dark" : defaultTheme === "dark",
    isLoading: !isClient,
  }

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  )
}
