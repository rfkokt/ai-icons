"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BrutalistButtonProps {
  children: React.ReactNode
  variant?: "lime" | "dark" | "white" | "outline"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
}

export function BrutalistButton({
  children,
  variant = "lime",
  size = "md",
  onClick,
  disabled = false,
  className,
  type = "button"
}: BrutalistButtonProps) {
  const baseStyles = "font-black border-2 sm:border-3 border-black rounded-lg sm:rounded-xl transition-all hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    lime: "bg-[#B9FF66] hover:bg-[#a8e655] text-black shadow-[2px_2px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] sm:hover:shadow-[2px_2px_0px_0px_#000000]",
    dark: "bg-black text-[#B9FF66] shadow-[2px_2px_0px_0px_#B9FF66] sm:shadow-[4px_4px_0px_0px_#B9FF66] hover:shadow-[1px_1px_0px_0px_#B9FF66] sm:hover:shadow-[2px_2px_0px_0px_#B9FF66]",
    white: "bg-white hover:bg-zinc-50 text-zinc-900 shadow-[2px_2px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] sm:hover:shadow-[2px_2px_0px_0px_#000000]",
    outline: "bg-transparent hover:bg-zinc-50 text-zinc-900 border-2 border-black shadow-[2px_2px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] sm:hover:shadow-[2px_2px_0px_0px_#000000]"
  }

  const sizes = {
    sm: "h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm",
    md: "h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base",
    lg: "h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg"
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {children}
    </Button>
  )
}
