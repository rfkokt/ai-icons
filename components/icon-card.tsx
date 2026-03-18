import { Card } from "@/components/ui/card"
import { HiSparkles, HiHeart, HiCheck } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import { IconActionBar } from "./icon-action-bar"

type IconCardVariant = "community" | "library" | "generated"

interface IconCardProps {
  id: string | number
  src?: string | null
  alt?: string
  prompt?: string
  variant?: IconCardVariant
  format?: string
  likes?: number
  date?: string
  isSelectMode?: boolean
  isSelected?: boolean
  onSelect?: (id: string | number) => void
  onClick?: () => void
  onShare?: () => void
  onDelete?: () => void
  showActionBar?: boolean
  actionBarPosition?: "inside" | "outside"
  aspectRatio?: "square" | "video"
  className?: string
}

export function IconCard({
  id,
  src,
  alt = "Icon",
  prompt,
  variant = "library",
  format,
  likes,
  date,
  isSelectMode = false,
  isSelected = false,
  onSelect,
  onClick,
  onShare,
  onDelete,
  showActionBar = true,
  actionBarPosition = "outside",
  aspectRatio = "square",
  className,
}: IconCardProps) {
  const handleClick = () => {
    if (isSelectMode && onSelect) {
      onSelect(id)
    } else if (onClick) {
      onClick()
    }
  }

  const renderIcon = () => (
    <div className={cn(
      "w-full h-full flex items-center justify-center",
      aspectRatio === "square" ? "bg-gradient-to-br from-white via-zinc-50 to-zinc-100" : "bg-zinc-100"
    )}>
      {src ? (
        <img src={src} alt={alt} className="max-w-[85%] max-h-[85%] object-contain" />
      ) : (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 rounded-xl border-2 border-zinc-300 flex items-center justify-center">
          <HiSparkles className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400" />
        </div>
      )}
    </div>
  )

  if (variant === "generated") {
    return (
      <div className={cn(
        "group relative rounded-xl border-3 border-transparent shadow-[4px_4px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-300",
        className
      )}>
        <Card
          className="bg-white rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-300 cursor-pointer overflow-hidden"
          onClick={handleClick}
        >
          <div className={cn(
            "aspect-square p-4 sm:p-6",
            aspectRatio === "square" ? "" : "aspect-video"
          )}>
            {renderIcon()}
          </div>
        </Card>

        {showActionBar && (
          <div className={cn(
            "absolute bottom-3 left-3 right-3",
            actionBarPosition === "inside" ? "opacity-0 group-hover:opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          )}>
            <IconActionBar
              iconKey={format}
              prompt={prompt}
              onShare={onShare}
              showShare={!!onShare}
            />
          </div>
        )}
      </div>
    )
  }

  if (variant === "library") {
    return (
      <div className={cn(
        "group relative",
        className
      )}>
        <Card
          className={cn(
            "rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-300 cursor-pointer overflow-hidden",
            isSelectMode && isSelected && "ring-4 ring-[#B9FF66]",
            isSelectMode && "cursor-pointer"
          )}
          onClick={handleClick}
        >
          {isSelectMode && (
            <div
              className={cn(
                "absolute top-2 left-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                isSelected ? "bg-[#B9FF66] border-[#B9FF66]" : "bg-white border-zinc-300"
              )}
            >
              {isSelected && <HiCheck className="h-3.5 w-3.5 text-black" />}
            </div>
          )}
          <div className={cn(
            "aspect-square p-3 sm:p-4",
            aspectRatio === "square" ? "" : "aspect-video"
          )}>
            {renderIcon()}
          </div>
        </Card>

        {showActionBar && (
          <div className={cn(
            "absolute bottom-3 left-3 right-3",
            actionBarPosition === "inside" ? "opacity-0 group-hover:opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          )}>
            <IconActionBar
              iconKey={format}
              prompt={prompt}
              onShare={onShare}
              onDelete={onDelete}
              showShare={!!onShare}
              showDelete={!!onDelete}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <Card
      className={cn(
        "group aspect-square rounded-xl sm:rounded-2xl border-2 border-zinc-200 bg-white p-3 sm:p-4 cursor-pointer hover:border-zinc-300 hover:shadow-lg transition-all duration-200 overflow-hidden",
        className
      )}
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-lg sm:rounded-xl group-hover:bg-[#B9FF66] transition-colors duration-200">
        {src ? (
          <img src={src} alt={alt} className="max-w-[80%] max-h-[80%] object-contain" />
        ) : (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 group-hover:bg-zinc-300 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        {date && <span className="text-[10px] sm:text-xs text-zinc-500">{date}</span>}
        {likes !== undefined && (
          <div className="flex items-center gap-1">
            <HiHeart className="h-3 w-3" />
            <span className="text-[10px] sm:text-xs text-zinc-500">{likes}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
