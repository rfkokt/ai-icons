import { HiCreditCard } from "react-icons/hi2"
import { cn } from "@/lib/utils"

interface CreditBadgeProps {
  credits: number
  className?: string
}

export function CreditBadge({ credits, className }: CreditBadgeProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 bg-white border-2 border-black rounded-full px-3 py-2 brutalist-shadow-sm h-10",
        className
      )}
    >
      <div className="w-7 h-7 bg-[#B9FF66] rounded-full flex items-center justify-center border border-black shrink-0">
        <HiCreditCard className="w-4 h-4 text-black" />
      </div>
      <span className="text-base font-bold text-zinc-800">{credits}</span>
    </div>
  )
}
