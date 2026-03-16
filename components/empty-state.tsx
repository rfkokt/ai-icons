import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <Card className={cn(
      "p-8 rounded-2xl border-2 border-zinc-200 bg-zinc-50 text-center",
      className
    )}>
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-zinc-200">
        {icon}
      </div>
      <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-xs mx-auto">{description}</p>
    </Card>
  )
}
