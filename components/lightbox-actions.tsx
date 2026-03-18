"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiArrowDownTray, HiShare, HiTrash, HiEllipsisVertical } from "react-icons/hi2"
import { toast } from "sonner"

interface LightboxActionsProps {
  iconKey: string
  prompt: string
  onShare?: () => void
  onDelete?: () => void
}

export function LightboxActions({ iconKey, prompt, onShare, onDelete }: LightboxActionsProps) {
  const download = (format: "png" | "svg") => {
    const a = document.createElement("a")
    a.href = `/api/download/${encodeURIComponent(iconKey)}?format=${format}`
    a.download = `${prompt.replace(/\s+/g, "-")}.${format}`
    a.click()
    toast.success(`${format.toUpperCase()} downloading...`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-10 w-10 bg-white hover:bg-zinc-50 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
        <HiEllipsisVertical className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
        <DropdownMenuItem onClick={() => download("png")} className="flex items-center gap-2 cursor-pointer font-bold">
          <HiArrowDownTray className="h-4 w-4" />Download PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("svg")} className="flex items-center gap-2 cursor-pointer font-bold">
          <HiArrowDownTray className="h-4 w-4" />Download SVG
        </DropdownMenuItem>
        {onShare && (
          <DropdownMenuItem onClick={onShare} className="flex items-center gap-2 cursor-pointer font-bold">
            <HiShare className="h-4 w-4" />Share
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="flex items-center gap-2 cursor-pointer font-bold text-red-500">
            <HiTrash className="h-4 w-4" />Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
