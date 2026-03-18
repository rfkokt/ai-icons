"use client"

import { useState } from "react"
import { toast } from "sonner"

interface UseConfirmDialogReturn {
  confirmType: "share" | "delete" | null
  setConfirmType: (type: "share" | "delete" | null) => void
  openConfirm: (type: "share" | "delete") => void
  handleConfirm: (onShare?: () => void, onDelete?: () => void) => void
}

export function useConfirmDialog(): UseConfirmDialogReturn {
  const [confirmType, setConfirmType] = useState<"share" | "delete" | null>(null)

  const openConfirm = (type: "share" | "delete") => {
    setConfirmType(type)
  }

  const handleConfirm = (onShare?: () => void, onDelete?: () => void) => {
    if (confirmType === "share" && onShare) {
      onShare()
      toast.success("Shared to community!")
    } else if (confirmType === "delete" && onDelete) {
      onDelete()
      toast.success("Deleted")
    }
    setConfirmType(null)
  }

  return { confirmType, setConfirmType, openConfirm, handleConfirm }
}
