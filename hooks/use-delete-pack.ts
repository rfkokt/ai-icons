"use client"

import { toast } from "sonner"

interface UseDeletePackOptions {
  onSuccess?: (packId: string) => void
  onError?: (error: Error) => void
}

export function useDeletePack(options?: UseDeletePackOptions) {
  const deletePack = async (packId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/pack/${packId}`, { method: "DELETE" })
      const data = await response.json()
      
      if (data.success) {
        toast.success("Pack deleted")
        options?.onSuccess?.(packId)
        return true
      } else {
        toast.error(data.error || "Failed to delete pack")
        return false
      }
    } catch (error) {
      console.error("Error deleting pack:", error)
      toast.error("Something went wrong")
      options?.onError?.(error as Error)
      return false
    }
  }

  const deleteIconFromPack = async (packId: string, iconId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/icon/${iconId}`, { method: "DELETE" })
      const data = await response.json()
      
      if (data.success) {
        toast.success("Icon deleted")
        return true
      } else {
        toast.error(data.error || "Failed to delete icon")
        return false
      }
    } catch (error) {
      console.error("Error deleting icon:", error)
      toast.error("Something went wrong")
      options?.onError?.(error as Error)
      return false
    }
  }

  return { deletePack, deleteIconFromPack }
}
