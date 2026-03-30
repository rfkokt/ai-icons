"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { HiSun, HiMoon } from "react-icons/hi2"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn("w-11 h-11 rounded-xl bg-zinc-100 animate-pulse", className)} />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
        "border-2 border-black shadow-[2px_2px_0_0_#000]",
        "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_#000]",
        isDark ? "bg-zinc-900 text-white" : "bg-[#B9FF66] text-black",
        className
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <HiSun className="h-5 w-5" />
      ) : (
        <HiMoon className="h-5 w-5" />
      )}
    </button>
  )
}
