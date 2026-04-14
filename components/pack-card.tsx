import { Card } from "@/components/ui/card"
import { HiBolt, HiShare, HiTrash } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import { LoadableImage } from "./loadable-image"
import { HeartSmooth } from "./icons/heart-smooth"
import { DownloadDropdown } from "./download-dropdown"

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
  disableHover?: boolean
  className?: string
  sharedBy?: string | null
  sharedByAvatar?: string | null
  showSharedBy?: boolean
  totalLikes?: number
  isLiked?: boolean
  onLike?: () => void
  variant?: "default" | "community"
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
  disableHover = false,
  className,
  sharedBy,
  sharedByAvatar,
  showSharedBy = false,
  totalLikes,
  isLiked,
  onLike,
  variant = "default",
}: PackCardProps) {
  return (
    <div className={cn("pack-card group relative flex flex-col mt-2 ml-2 sm:mt-0 sm:ml-0", className)}>
      <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 z-10">
        <div className="bg-[#B9FF66] border-3 border-black rounded-xl px-2.5 py-1 shadow-[3px_3px_0px_0px_#000000] min-w-[28px] flex items-center justify-center">
          <span className="text-xs font-black text-black">{iconCount}</span>
        </div>
      </div>

      {variant === "community" && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
          <DownloadDropdown
            onDownloadPng={onDownloadPng}
            onDownloadSvg={onDownloadSvg}
            size="sm"
            variant="icon"
          />
          {onDelete && (
            <div
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-lg h-8 w-8 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-none hover:shadow-[1px_1px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
              title="Unshare"
            >
              <HiTrash className="h-3.5 w-3.5 text-red-500 hover:text-white transition-colors" />
            </div>
          )}
        </div>
      )}

      <Card
        className={cn(
          "bg-white dark:bg-[#141414] rounded-xl border-3 border-black dark:border-zinc-600 transition-all duration-300 cursor-pointer overflow-hidden",
          "shadow-[4px_4px_0px_0px_#000000] dark:shadow-none",
          !disableHover && "group-hover:shadow-[8px_8px_0px_0px_#000000] group-hover:-translate-y-1 group-hover:translate-x-1"
        )}
        onClick={onClick}
      >
        <div className="aspect-square p-4 flex items-center justify-center bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-[#1a1a1a] dark:via-[#141414] dark:to-[#0f0f0f] relative">
          {preview ? (
            <LoadableImage src={preview} alt={prompt} className="max-w-[80%] max-h-[80%] object-contain" />
          ) : (
            <div className="w-16 h-16 bg-white rounded-2xl border-3 border-black shadow-[4px_4px_0_0_#000000] flex items-center justify-center">
              <span className="text-2xl font-black text-black">?</span>
            </div>
          )}
          {showSharedBy && sharedBy && (
            <div className="absolute -bottom-2 left-2 right-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 min-w-0 flex-1">
                {sharedByAvatar ? (
                  <img
                    src={sharedByAvatar}
                    alt={sharedBy}
                    className="w-5 h-5 rounded-full object-cover border-2 border-black shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#B9FF66] border-2 border-black flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] font-black text-black">
                      {sharedBy.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-[9px] font-bold text-black dark:text-white bg-white/90 dark:bg-zinc-800/90 px-1.5 py-0.5 rounded border border-black dark:border-zinc-600 truncate">
                  {sharedBy}
                </span>
              </div>
              {totalLikes !== undefined && (
                <button
                  onClick={(e) => { e.stopPropagation(); onLike?.() }}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-1 bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-full px-2 py-0.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-none text-xs font-bold",
                    isLiked && "shadow-[2px_2px_0px_0px_#B9FF66] dark:shadow-none"
                  )}
                >
                  <HeartSmooth filled={isLiked} className="h-3 w-3" />
                  {totalLikes}
                </button>
              )}
            </div>
          )}
        </div>
      </Card>

      {variant === "default" && showActionBar && (
        <div className="absolute bottom-3 left-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            {onShare && (
              <button
                onClick={(e) => { e.stopPropagation(); onShare() }}
                className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-lg px-2.5 py-1 flex items-center gap-1.5 hover:bg-[#B9FF66] hover:shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-none text-xs font-bold"
              >
                <HiShare className="h-3.5 w-3.5 text-black" />
                Share
              </button>
            )}
            <DownloadDropdown
              onDownloadPng={onDownloadPng}
              onDownloadSvg={onDownloadSvg}
              size="sm"
              variant="icon"
            />
            {onDelete && (
              <div
                onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-lg h-8 w-8 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-none hover:shadow-[1px_1px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
              >
                <HiTrash className="h-3.5 w-3.5 text-red-500 hover:text-white transition-colors" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
