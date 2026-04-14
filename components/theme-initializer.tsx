"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/lib/store"

export function ThemeInitializer() {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme to DOM whenever it changes
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
  }, [theme])

  return null
}
