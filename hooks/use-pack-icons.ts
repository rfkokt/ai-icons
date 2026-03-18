"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

interface UsePackIconsOptions {
  onSuccess?: (icons: PackIcon[]) => void
  onError?: (error: Error) => void
}

export interface PackIcon {
  id: string
  prompt: string
  png_key: string | null
  svg_key: string | null
  created_at: string
}

export function usePackIcons(packId: string | null, options?: UsePackIconsOptions) {
  const [icons, setIcons] = useState<PackIcon[]>([])
  const [packPrompt, setPackPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPackIcons = async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/pack/${id}`)
      const data = await response.json()

      if (data.success && data.icons) {
        setIcons(data.icons)
        setPackPrompt(data.prompt || "")
        options?.onSuccess?.(data.icons)
      } else {
        const err = new Error(data.error || "Failed to load pack")
        setError(err)
        toast.error("Failed to load pack")
        options?.onError?.(err)
      }
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error("Something went wrong")
      options?.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeIcon = (iconId: string) => {
    setIcons(prev => prev.filter(i => i.id !== iconId))
  }

  useEffect(() => {
    if (packId) {
      fetchPackIcons(packId)
    } else {
      setIcons([])
      setPackPrompt("")
    }
  }, [packId])

  return {
    icons,
    setIcons,
    packPrompt,
    isLoading,
    error,
    fetchPackIcons: (id: string) => fetchPackIcons(id),
    removeIcon
  }
}
