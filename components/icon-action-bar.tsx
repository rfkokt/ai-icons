"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { HiArrowDownTray, HiShare, HiEllipsisVertical, HiTrash } from "react-icons/hi2"
import { useDownload } from "@/hooks/use-download"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"
import { cn } from "@/lib/utils"

interface IconActionBarProps {
  iconKey?: string
  prompt?: string
  iconCount?: number
  onShare?: () => void
  onDownloadPng?: () => void
  onDownloadSvg?: () => void
  onDelete?: () => void
  showShare?: boolean
  showDelete?: boolean
  className?: string
}

export function IconActionBar({
  iconKey,
  prompt,
  iconCount,
  onShare,
  onDownloadPng,
  onDownloadSvg,
  onDelete,
  showShare = true,
  showDelete = false,
  className = "",
}: IconActionBarProps) {
  const { download } = useDownload()
  const { confirmType, setConfirmType, handleConfirm } = useConfirmDialog()

  const handleDownloadPng = () => {
    if (iconKey && prompt) {
      download(iconKey, prompt, "png")
    } else if (onDownloadPng) {
      onDownloadPng()
    }
  }

  const handleDownloadSvg = () => {
    if (iconKey && prompt) {
      download(iconKey, prompt, "svg")
    } else if (onDownloadSvg) {
      onDownloadSvg()
    }
  }

  return (
    <>
      <div className={cn("inline-flex h-8 sm:h-9 items-stretch bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-full shadow-[2px_2px_0_0_#000] dark:shadow-none hover:shadow-[1px_1px_0_0_#000] hover:translate-x-px hover:translate-y-px transition-all overflow-hidden", className)}>
        {showShare && onShare && (
          <>
            <button
              onClick={() => onShare()}
              className="flex-1 px-3 hover:bg-[#B9FF66] flex items-center justify-center gap-1.5 transition-colors text-[10px] sm:text-xs font-black uppercase text-black"
            >
              <HiShare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <div className="w-0.5 bg-black shrink-0" />
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="px-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors text-black outline-none min-w-[2rem] sm:min-w-[2.25rem]">
            <HiEllipsisVertical className="h-4 w-4 sm:h-5 sm:w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-xl shadow-[3px_3px_0px_0px_#000000] dark:shadow-none">
            <DropdownMenuItem onClick={handleDownloadPng} className="flex items-center gap-2 cursor-pointer font-bold text-black dark:text-white">
              <HiArrowDownTray className="h-4 w-4" />Download PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadSvg} className="flex items-center gap-2 cursor-pointer font-bold text-black dark:text-white">
              <HiArrowDownTray className="h-4 w-4" />Download SVG
            </DropdownMenuItem>
            {showDelete && onDelete && (
              <DropdownMenuItem onClick={() => setConfirmType("delete")} className="flex items-center gap-2 cursor-pointer font-bold text-red-500 dark:text-red-400">
                <HiTrash className="h-4 w-4" />Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {confirmType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-[8px_8px_0px_0px_#000000] dark:shadow-none">
            <h3 className="text-lg font-bold mb-2 text-black dark:text-white">
              {confirmType === "share" ? "Share to Community?" : "Delete?"}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {confirmType === "share"
                ? `This ${iconCount && iconCount > 1 ? "pack" : "icon"} will be visible to everyone in the community.`
                : "This action cannot be undone."
              }
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmType(null)} className="border-2 border-black dark:border-zinc-600 rounded-xl bg-white dark:bg-[#141414] text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700">
                Cancel
              </Button>
              <Button
                onClick={() => handleConfirm(onShare, onDelete)}
                className={confirmType === "delete"
                  ? "bg-red-500 hover:bg-red-600 border-2 border-red-500 text-white rounded-xl"
                  : "bg-[#B9FF66] border-2 border-black dark:border-zinc-600 rounded-xl hover:bg-lime-400"
                }
              >
                {confirmType === "share" ? "Share" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
