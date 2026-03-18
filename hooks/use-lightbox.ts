"use client"

import { useState } from "react"

interface UseLightboxReturn {
  currentIndex: number
  isOpen: boolean
  goToPrev: () => void
  goToNext: () => void
  open: (index: number) => void
  close: () => void
  setCurrentIndex: (index: number) => void
}

export function useLightbox(totalItems: number): UseLightboxReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const goToPrev = () => setCurrentIndex(prev => prev === 0 ? totalItems - 1 : prev - 1)
  const goToNext = () => setCurrentIndex(prev => prev === totalItems - 1 ? 0 : prev + 1)
  const open = (index: number) => { setCurrentIndex(index); setIsOpen(true) }
  const close = () => setIsOpen(false)

  return { currentIndex, isOpen, goToPrev, goToNext, open, close, setCurrentIndex }
}
