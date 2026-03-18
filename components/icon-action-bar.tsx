"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HiArrowDownTray, HiShare, HiEllipsisVertical, HiTrash } from "react-icons/hi2"
import { toast } from "sonner"

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
  const [confirmType, setConfirmType] = useState<"share" | "delete" | null>(null)

  const handleShare = () => {
    if (onShare) {
      setConfirmType("share")
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      setConfirmType("delete")
    }
  }

  const handleConfirm = () => {
    if (confirmType === "share" && onShare) {
      onShare()
      toast.success("Shared to community!")
    } else if (confirmType === "delete" && onDelete) {
      onDelete()
      toast.success("Deleted")
    }
    setConfirmType(null)
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {showShare && onShare && (
          <button
            onClick={handleShare}
            className="flex-1 h-10 bg-white hover:bg-[#B9FF66] border-3 border-black rounded-full flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-bold uppercase"
          >
            <HiShare className="h-4 w-4" />
            <span>Share</span>
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 w-10 bg-white hover:bg-zinc-50 border-3 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-zinc-700">
            <HiEllipsisVertical className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
            {onDownloadPng && (
              <DropdownMenuItem onClick={onDownloadPng} className="flex items-center gap-2 cursor-pointer font-bold">
                <HiArrowDownTray className="h-4 w-4" />Download PNG
              </DropdownMenuItem>
            )}
            {onDownloadSvg && (
              <DropdownMenuItem onClick={onDownloadSvg} className="flex items-center gap-2 cursor-pointer font-bold">
                <HiArrowDownTray className="h-4 w-4" />Download SVG
              </DropdownMenuItem>
            )}
            {showDelete && onDelete && (
              <DropdownMenuItem onClick={handleDelete} className="flex items-center gap-2 cursor-pointer font-bold text-red-500">
                <HiTrash className="h-4 w-4" />Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={confirmType !== null} onOpenChange={() => setConfirmType(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white border-2 border-black rounded-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-bold">
              {confirmType === "share" ? "Share to Community?" : "Delete Icon?"}
            </DialogTitle>
            <DialogDescription className="text-zinc-600">
              {confirmType === "share" 
                ? "This icon will be visible to everyone in the community."
                : "This action cannot be undone."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmType(null)}
              className="border-2 border-black rounded-xl font-medium hover:bg-zinc-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={confirmType === "delete"
                ? "bg-red-500 hover:bg-red-600 text-white border-2 border-red-500 rounded-xl font-medium" 
                : "bg-[#B9FF66] text-black border-2 border-black hover:bg-[#88cc33] rounded-xl font-medium"
              }
            >
              {confirmType === "share" ? "Share" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
