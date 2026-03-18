"use client"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  count?: number
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  className?: string
}

export function LoadingSkeleton({
  count = 8,
  columns = { default: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  className
}: LoadingSkeletonProps) {
  const gridClass = cn(
    "grid",
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    "gap-3 sm:gap-4",
    className
  )

  return (
    <div className={gridClass}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-zinc-200 aspect-square rounded-2xl border-2 border-black" />
        </div>
      ))}
    </div>
  )
}
