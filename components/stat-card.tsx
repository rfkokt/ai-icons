import { Card } from "@/components/ui/card"
import { IconType } from "react-icons"

interface StatCardProps {
  label: string
  value: string
  icon: IconType
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-4 rounded-xl border-2 border-zinc-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-zinc-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </div>
    </Card>
  )
}
