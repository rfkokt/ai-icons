import { Card } from "@/components/ui/card"
import { HiSparkles, HiShare } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import { IconActionBar } from "./icon-action-bar"

interface PackCardProps {
  id: string
  preview?: string | null
  prompt: string
  iconCount: number
  onClick?: () => void
  onShare?: () => void
  onDownloadPng?: () => void
  onDownloadSvg?: () => void
  onDelete?: () => void
  showActionBar?: boolean
  className?: string
}

export function PackCard({
  id,
  preview,
  prompt,
  iconCount,
  onClick,
  onShare,
  onDownloadPng,
  onDownloadSvg,
  onDelete,
  showActionBar = true,
  className,
}: PackCardProps) {
  return (
    <div className={cn("pack-card group relative", className)}>
      <div className="absolute -top-3 -left-3 z-10">
        <div className="bg-[#B9FF66] border-3 border-black rounded-xl px-2.5 py-1 shadow-[3px_3px_0px_0px_#000000] min-w-[28px] flex items-center justify-center">
          <span className="text-xs font-black text-black">{iconCount}</span>
        </div>
      </div>

      <Card
        className="bg-white rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        <div className="aspect-square p-4 flex items-center justify-center bg-gradient-to-br from-white via-zinc-50 to-zinc-100">
          {preview ? (
            <img src={preview} alt={prompt} className="max-w-[80%] max-h-[80%] object-contain" />
          ) : (
            <div className="w-16 h-16 bg-zinc-200 rounded-2xl border-2 border-zinc-300 flex items-center justify-center">
              <HiSparkles className="h-8 w-8 text-zinc-400" />
            </div>
          )}
        </div>
      </Card>

      {showActionBar && (
        <div className="absolute bottom-3 left-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          <IconActionBar
            onShare={onShare}
            onDownloadPng={onDownloadPng}
            onDownloadSvg={onDownloadSvg}
            onDelete={onDelete}
            showShare={!!onShare}
            showDelete={!!onDelete}
          />
        </div>
      )}
    </div>
  )
}
