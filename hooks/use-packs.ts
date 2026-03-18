"use client"

import { useState, useEffect } from "react"

interface UsePacksOptions {
  onSuccess?: (packs: HistoryPack[]) => void
  onError?: (error: Error) => void
}

export interface HistoryPack {
  id: string
  prompt: string
  iconCount: number
  preview: string | null
  created_at: string
}

export function usePacks(options?: UsePacksOptions) {
  const [packs, setPacks] = useState<HistoryPack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPacks = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/history")
      const data = await response.json()
      
      if (data.success) {
        setPacks(data.icons)
        options?.onSuccess?.(data.icons)
      } else {
        const err = new Error(data.error || "Failed to fetch packs")
        setError(err)
        options?.onError?.(err)
      }
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addPack = (pack: HistoryPack) => {
    setPacks(prev => [pack, ...prev])
  }

  const removePack = (packId: string) => {
    setPacks(prev => prev.filter(p => p.id !== packId))
  }

  const updatePack = (packId: string, updates: Partial<HistoryPack>) => {
    setPacks(prev => prev.map(p => 
      p.id === packId ? { ...p, ...updates } : p
    ))
  }

  useEffect(() => {
    fetchPacks()
  }, [])

  return {
    packs,
    setPacks,
    isLoading,
    error,
    fetchPacks,
    addPack,
    removePack,
    updatePack,
    totalIcons: packs.reduce((sum, p) => sum + p.iconCount, 0)
  }
}
