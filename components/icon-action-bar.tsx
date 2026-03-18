import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiArrowDownTray, HiShare, HiEllipsisVertical, HiTrash } from "react-icons/hi2"

interface IconActionBarProps {
  onShare?: () => void
  onDownloadPng?: () => void
  onDownloadSvg?: () => void
  onDelete?: () => void
  showShare?: boolean
  showDelete?: boolean
  className?: string
}

export function IconActionBar({
  onShare,
  onDownloadPng,
  onDownloadSvg,
  onDelete,
  showShare = true,
  showDelete = false,
  className = "",
}: IconActionBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showShare && (
        <button
          onClick={onShare}
          className="flex-1 h-10 bg-white hover:bg-[#B9FF66] border-3 border-black rounded-full flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-bold uppercase"
          title="Share"
        >
          <HiShare className="h-4 w-4" />
          <span>Share</span>
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          className="h-10 w-10 bg-white hover:bg-zinc-50 border-3 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-zinc-700 cursor-pointer"
          aria-label="More options"
        >
          <HiEllipsisVertical className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {onDownloadPng && (
            <DropdownMenuItem onClick={onDownloadPng}>
              <HiArrowDownTray className="h-4 w-4 mr-2" />
              <span>Download PNG</span>
            </DropdownMenuItem>
          )}
          {onDownloadSvg && (
            <DropdownMenuItem onClick={onDownloadSvg}>
              <HiArrowDownTray className="h-4 w-4 mr-2" />
              <span>Download SVG</span>
            </DropdownMenuItem>
          )}
          {showDelete && onDelete && (
            <DropdownMenuItem
              variant="destructive"
              onClick={onDelete}
            >
              <HiTrash className="h-4 w-4 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
