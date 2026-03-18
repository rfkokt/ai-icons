import { cn } from "@/lib/utils"

interface IconGridProps {
  children: React.ReactNode
  className?: string
}

export function IconGrid({ children, className }: IconGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4",
      className
    )}>
      {children}
    </div>
  )
}
