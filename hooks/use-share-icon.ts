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

  const sharePackToCommunity = async (packId: string) => {
    try {
      const response = await fetch(`/api/pack/${packId}/share`, { method: "POST" })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        return true
      } else {
        toast.error(data.error || "Failed to share")
        return false
      }
    } catch {
      toast.error("Something went wrong")
      return false
    }
  }

  return { shareToCommunity, sharePackToCommunity }
}
