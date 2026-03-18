"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiArrowDownTray, HiShare, HiTrash, HiEllipsisVertical } from "react-icons/hi2"
import { useDownload } from "@/hooks/use-download"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"

interface IconActionsProps {
  iconKey: string
  prompt: string
  onShare?: () => void
  onDelete?: () => void
}

export function IconActions({ iconKey, prompt, onShare, onDelete }: IconActionsProps) {
  const { download } = useDownload()
  const { confirmType, setConfirmType, handleConfirm } = useConfirmDialog()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-10 w-10 bg-white hover:bg-zinc-50 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
          <HiEllipsisVertical className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
          <DropdownMenuItem onClick={() => download(iconKey, prompt, "png")} className="flex items-center gap-2 cursor-pointer font-bold">
            <HiArrowDownTray className="h-4 w-4" />Download PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => download(iconKey, prompt, "svg")} className="flex items-center gap-2 cursor-pointer font-bold">
            <HiArrowDownTray className="h-4 w-4" />Download SVG
          </DropdownMenuItem>
          {onShare && (
            <DropdownMenuItem onClick={() => setConfirmType("share")} className="flex items-center gap-2 cursor-pointer font-bold">
              <HiShare className="h-4 w-4" />Share
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={() => setConfirmType("delete")} className="flex items-center gap-2 cursor-pointer font-bold text-red-500">
              <HiTrash className="h-4 w-4" />Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {confirmType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white border-2 border-black rounded-2xl p-6 max-w-sm w-full mx-4 shadow-[8px_8px_0px_0px_#000000]">
            <h3 className="text-lg font-bold mb-2">
              {confirmType === "share" ? "Share to Community?" : "Delete Icon?"}
            </h3>
            <p className="text-zinc-600 mb-4">
              {confirmType === "share" 
                ? "This icon will be visible to everyone in the community."
                : "This action cannot be undone."}
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmType(null)} className="border-2 border-black rounded-xl">
                Cancel
              </Button>
              <Button 
                onClick={() => handleConfirm(onShare, onDelete)} 
                className={confirmType === "delete" ? "bg-red-500 hover:bg-red-600 border-2 border-red-500 text-white rounded-xl" : "bg-[#B9FF66] border-2 border-black rounded-xl"}
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
