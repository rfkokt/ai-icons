"use client"

import { Button } from "@/components/ui/button"
import { HiTrash, HiArrowDownTray, HiShare } from "react-icons/hi2"
import { usePackDownload } from "@/hooks/use-pack-download"
import { useShareIcon } from "@/hooks/use-share-icon"

interface PackActionsProps {
  packId: string
  iconCount?: number
  onDelete?: () => void
  showShare?: boolean
  showDelete?: boolean
  className?: string
}

export function PackActions({
  packId,
  iconCount,
  onDelete,
  showShare = false,
  showDelete = true,
  className = ""
}: PackActionsProps) {
  const { downloadPackById } = usePackDownload()
  const { shareToCommunity } = useShareIcon()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => shareToCommunity(packId)}
          className="border-2 border-black rounded-xl font-medium hover:bg-zinc-100"
        >
          <HiShare className="h-4 w-4 mr-1.5" />
          Share
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadPackById(packId, "png")}
        className="border-2 border-black rounded-xl font-medium hover:bg-zinc-100"
      >
        <HiArrowDownTray className="h-4 w-4 mr-1.5" />
        PNG
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadPackById(packId, "svg")}
        className="border-2 border-black rounded-xl font-medium hover:bg-zinc-100"
      >
        <HiArrowDownTray className="h-4 w-4 mr-1.5" />
        SVG
      </Button>
      
      {showDelete && onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50"
        >
          <HiTrash className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      )}
    </div>
  )
}
