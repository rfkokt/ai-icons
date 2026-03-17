"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-2 border-black rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="text-zinc-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-2 border-black rounded-xl font-medium hover:bg-zinc-100"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={variant === "destructive" 
              ? "bg-red-500 hover:bg-red-600 text-white border-2 border-red-500 rounded-xl font-medium" 
              : "bg-[#B9FF66] text-black border-2 border-black hover:bg-[#88cc33] rounded-xl font-medium"
            }
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
