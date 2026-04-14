import { Card } from "@/components/ui/card"
import { IconType } from "react-icons"

interface StatCardProps {
  label: string
  value: string
  icon: IconType
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#141414]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-100 dark:bg-[#1a1a1a] rounded-lg flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        </div>
      </div>
    </Card>
  )
}
