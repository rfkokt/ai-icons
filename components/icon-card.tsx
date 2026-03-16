import { Card } from "@/components/ui/card"
import { HiHeart, HiEllipsisVertical, HiArrowDownTray, HiTrash, HiCheck } from "react-icons/hi2"

interface IconCardProps {
  id: number
  prompt: string
  date?: string
  likes?: number
  format?: string
  variant?: "community" | "library"
  isSelectMode?: boolean
  isSelected?: boolean
  onSelect?: (id: number) => void
}

export function IconCard({ 
  id, 
  prompt, 
  date, 
  likes, 
  format, 
  variant = "community",
  isSelectMode = false,
  isSelected = false,
  onSelect,
}: IconCardProps) {
  if (variant === "library") {
    return (
      <Card
        className={`group relative aspect-square rounded-xl sm:rounded-2xl border-2 bg-white p-3 sm:p-4 cursor-pointer transition-all duration-200 overflow-hidden ${
          isSelected
            ? "border-[#B9FF66] ring-2 ring-[#B9FF66]"
            : "border-zinc-200 hover:border-zinc-300 hover:shadow-lg"
        }`}
        onClick={() => isSelectMode && onSelect?.(id)}
      >
        {/* Selection Check */}
        {isSelectMode && (
          <div
            className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? "bg-[#B9FF66] border-[#B9FF66]"
                : "bg-white border-zinc-300"
            }`}
          >
            {isSelected && (
              <HiCheck className="h-3.5 w-3.5 text-black" />
            )}
          </div>
        )}

        {/* Icon Placeholder */}
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-lg sm:rounded-xl">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 rounded-lg sm:rounded-xl flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Format Badge */}
        {format && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 bg-white/90 rounded text-xs font-medium text-zinc-600">
              {format}
            </span>
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card className="group aspect-square rounded-xl sm:rounded-2xl border-2 border-zinc-200 bg-white p-3 sm:p-4 cursor-pointer hover:border-zinc-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-lg sm:rounded-xl group-hover:bg-[#B9FF66] transition-colors duration-200">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 group-hover:bg-zinc-300 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="text-[10px] sm:text-xs text-zinc-500">{date}</span>
        <div className="flex items-center gap-1">
          <HiHeart className="h-3 w-3" />
          <span className="text-[10px] sm:text-xs text-zinc-500">{likes}</span>
        </div>
      </div>
    </Card>
  )
}
