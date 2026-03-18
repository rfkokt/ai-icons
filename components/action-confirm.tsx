"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HiArrowDownTray, HiShare, HiTrash, HiEllipsisVertical } from "react-icons/hi2"
import { toast } from "sonner"

interface ActionConfirmProps {
  iconKey: string
  prompt: string
  onShare?: () => void
  onDelete?: () => void
}

export function ActionConfirm({ iconKey, prompt, onShare, onDelete }: ActionConfirmProps) {
  const [confirmType, setConfirmType] = useState<"share" | "delete" | null>(null)

  const download = (format: "png" | "svg") => {
    const a = document.createElement("a")
    a.href = `/api/download/${encodeURIComponent(iconKey)}?format=${format}`
    a.download = `${prompt.replace(/\s+/g, "-")}.${format}`
    a.click()
    toast.success(`${format.toUpperCase()} downloading...`)
  }

  const handleShare = () => {
    setConfirmType("share")
  }

  const handleDelete = () => {
    setConfirmType("delete")
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
            <DropdownMenuItem onClick={handleShare} className="flex items-center gap-2 cursor-pointer font-bold">
              <HiShare className="h-4 w-4" />Share
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={handleDelete} className="flex items-center gap-2 cursor-pointer font-bold text-red-500">
              <HiTrash className="h-4 w-4" />Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
