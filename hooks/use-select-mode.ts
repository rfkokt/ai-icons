"use client"

import { useState } from "react"
import { toast } from "sonner"

interface UseSelectModeOptions<T> {
  onSelect?: (ids: T[]) => void
}

export function useSelectMode<T>(options?: UseSelectModeOptions<T>) {
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<T[]>([])

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode)
    setSelectedIds([])
  }

  const toggleSelect = (id: T) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    )
    options?.onSelect?.(selectedIds)
  }

  const selectAll = (allIds: T[]) => {
    setSelectedIds(allIds)
    options?.onSelect?.(allIds)
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  const isSelected = (id: T) => selectedIds.includes(id)

  return {
    isSelectMode,
    selectedIds,
    toggleSelectMode,
    toggleSelect,
    selectAll,
    clearSelection,
    isSelected,
    hasSelection: selectedIds.length > 0,
    selectionCount: selectedIds.length
  }
}
