"use client"

import { Card } from "@/components/ui/card"
import { HiSparkles, HiHeart, HiCheck } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import { IconActionBar } from "./icon-action-bar"
import { LoadableImage } from "./loadable-image"

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
  transparentBg?: boolean
  onSelect?: (id: string | number) => void
  onClick?: () => void
  onShare?: () => void
  onDelete?: () => void
  showActionBar?: boolean
  showDelete?: boolean
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
  transparentBg = false,
  onSelect,
  onClick,
  onShare,
  onDelete,
  showActionBar = true,
  showDelete = false,
  className,
}: IconCardProps) {
  const handleClick = () => {
    if (isSelectMode && onSelect) {
      onSelect(id)
    } else if (onClick) {
      onClick()
    }
  }

  const renderContent = (isTransparent: boolean) => (
    <>
      {isSelectMode && (
        <div
          className={cn(
            "absolute top-2 left-2 z-20 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
            isSelected ? "bg-[#B9FF66] border-[#B9FF66]" : "bg-white border-zinc-300"
          )}
        >
          {isSelected && <HiCheck className="h-3.5 w-3.5 text-black" />}
        </div>
      )}
      <div className={cn(
        "aspect-square p-3 sm:p-4 flex items-center justify-center",
        isTransparent && "bg-transparent"
      )}>
        {src ? (
          <LoadableImage src={src} alt={alt} className="max-w-[85%] max-h-[85%] object-contain" />
        ) : (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 rounded-xl border-2 border-zinc-300 flex items-center justify-center">
            <HiSparkles className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400" />
          </div>
        )}
      </div>
    </>
  )

  if (variant === "community") {
    return (
      <Card
        className={cn(
          "group relative aspect-square rounded-xl sm:rounded-2xl border-2 border-zinc-200 bg-white p-3 sm:p-4 cursor-pointer hover:border-zinc-300 hover:shadow-lg transition-all duration-200 overflow-visible",
          className
        )}
        onClick={handleClick}
      >
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-lg sm:rounded-xl group-hover:bg-[#B9FF66] transition-colors duration-200">
          {src ? (
            <LoadableImage src={src} alt={alt} className="max-w-[80%] max-h-[80%] object-contain" />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 group-hover:bg-zinc-300 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors">
              <HiSparkles className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400" />
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

  if (variant === "generated" && transparentBg) {
    return (
      <div className={cn("group relative", className)}>
        <div
          className={cn(
            "relative rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] group-hover:shadow-[8px_8px_0px_0px_#000000] group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 cursor-pointer overflow-hidden",
            isSelectMode && isSelected && "ring-4 ring-[#B9FF66]"
          )}
          onClick={handleClick}
        >
          <div className="checkerboard absolute inset-0 z-0" />
          {src && (
            <LoadableImage 
              src={src} 
              alt={alt} 
              className="relative z-10 w-full aspect-square object-contain p-3 sm:p-4" 
            />
          )}
        </div>

        {showActionBar && (
          <div className={cn(
            "absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}>
            <div className="pointer-events-auto">
              <IconActionBar
                iconKey={format}
                prompt={prompt}
                onShare={onShare}
                onDelete={onDelete}
                showShare={!!onShare}
                showDelete={showDelete && !!onDelete}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("group relative", className)}>
      <div
        className={cn(
          "rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] group-hover:shadow-[8px_8px_0px_0px_#000000] group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 cursor-pointer overflow-hidden bg-white",
          isSelectMode && isSelected && "ring-4 ring-[#B9FF66]"
        )}
        onClick={handleClick}
      >
        {renderContent(false)}
      </div>

      {showActionBar && (
        <div className={cn(
          "absolute bottom-3 left-3 right-3 z-10",
          variant === "generated" ? "opacity-0 group-hover:opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
          "transition-opacity duration-300"
        )}>
          <div className="pointer-events-auto">
            <IconActionBar
              iconKey={format}
              prompt={prompt}
              onShare={onShare}
              onDelete={onDelete}
              showShare={!!onShare}
              showDelete={showDelete && !!onDelete}
            />
          </div>
        </div>
      )}
    </div>
  )
}
