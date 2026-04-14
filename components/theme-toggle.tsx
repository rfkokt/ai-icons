"use client"

import { useThemeStore } from "@/lib/store"
import { HiSun, HiMoon } from "react-icons/hi2"

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#444] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#444] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-200 flex items-center justify-center"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <HiMoon className="w-6 h-6 text-zinc-800" />
      ) : (
        <HiSun className="w-6 h-6 text-yellow-400" />
      )}
    </button>
  )
}
