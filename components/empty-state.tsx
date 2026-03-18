import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateVariant = "default" | "brutalist" | "minimal"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  variant?: EmptyStateVariant
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  variant = "default",
  action,
  className,
}: EmptyStateProps) {
  if (variant === "brutalist") {
    return (
      <div className={cn("text-center py-16 sm:py-24", className)}>
        {icon && (
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#B9FF66] rounded-3xl border-3 border-black mb-6 shadow-[6px_6px_0px_0px_#000000]">
            {icon}
          </div>
        )}
        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-zinc-500 text-lg max-w-md mx-auto mb-6">
            {description}
          </p>
        )}
        {action && (
          <Button
            className="bg-[#B9FF66] hover:bg-[#a8e655] text-black border-3 border-black rounded-xl px-8 py-3 text-lg font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            onClick={action.onClick}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("text-center py-8", className)}>
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 rounded-2xl mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-zinc-900 mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-zinc-500">{description}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn("text-center py-12 sm:py-16", className)}>
      {icon && (
        <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-100 rounded-full mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm sm:text-base text-zinc-500 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <Button
          variant="outline"
          className="mt-4 border-2 border-black rounded-xl font-bold shadow-sm hover:shadow-none transition-all"
          onClick={action.onClick}
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  )
}
