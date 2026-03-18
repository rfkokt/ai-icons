"use client"

import { toast } from "sonner"

export function useShareIcon() {
  const shareToCommunity = async (iconId: string) => {
    try {
      const response = await fetch(`/api/icon/${iconId}/share`, { method: "POST" })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.error || "Failed to share")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }
  return { shareToCommunity }
}
