"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm
}: ConfirmationModalProps) {
  if (!open) return null

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCancel}>
      <div 
        className="bg-white border-2 border-black rounded-2xl p-6 max-w-sm w-full mx-4 shadow-[8px_8px_0px_0px_#000000]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-zinc-600 mb-4">{description}</p>
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            className="border-2 border-black rounded-xl"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={handleConfirm}
            className={cn(
              "rounded-xl font-bold",
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600 border-2 border-red-500 text-white"
                : "bg-[#B9FF66] border-2 border-black text-black"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
