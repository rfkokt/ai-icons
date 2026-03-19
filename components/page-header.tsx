"use client"

import { Button } from "@/components/ui/button"
import { HiBolt } from "react-icons/hi2"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  icon?: React.ReactNode
  title: string
  description?: string
  stats?: { label: string; value: string | number }[]
  actions?: React.ReactNode
  variant?: "lime" | "white" | "dark"
  className?: string
}

export function PageHeader({
  icon,
  title,
  description,
  stats,
  actions,
  variant = "lime",
  className
}: PageHeaderProps) {
  const variantStyles = {
    lime: "bg-[#B9FF66] border-b-4 border-black",
    white: "bg-white border-b-2 border-zinc-200",
    dark: "bg-black text-[#B9FF66] border-b-4 border-[#B9FF66]"
  }

  const titleStyles = {
    lime: "text-black",
    white: "text-zinc-900",
    dark: "text-[#B9FF66]"
  }

  const descriptionStyles = {
    lime: "text-zinc-800",
    white: "text-zinc-600",
    dark: "text-zinc-300"
  }

  return (
    <div className={cn(
      "px-4 sm:px-6 lg:px-8 py-6 sm:py-8",
      variantStyles[variant],
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {icon && (
          <div className={cn(
            "inline-flex p-3 rounded-2xl mb-4",
            variant === "lime" && "bg-black text-white shadow-[4px_4px_0px_0px_#B9FF66]",
            variant === "white" && "bg-zinc-100 text-zinc-900",
            variant === "dark" && "bg-[#B9FF66] text-black"
          )}>
            {icon}
          </div>
        )}
        
        <h1 className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter",
          titleStyles[variant]
        )}>
          {title}
        </h1>

        {description && (
          <p className={cn("text-base sm:text-lg font-medium mt-1", descriptionStyles[variant])}>
            {description}
          </p>
        )}

        {stats && stats.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap mt-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={cn(
                  "px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000]",
                  variant === "lime" && "bg-white",
                  variant === "white" && "bg-zinc-100",
                  variant === "dark" && "bg-zinc-800 text-white"
                )}
              >
                <span className="text-sm font-bold text-zinc-700">
                  {stat.value} {stat.label}
                </span>
              </div>
            ))}
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
