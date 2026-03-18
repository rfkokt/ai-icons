"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface UseStaggerAnimationOptions {
  selector: string
  y?: number
  duration?: number
  stagger?: number
  ease?: string
}

export function useStaggerAnimation(
  deps: unknown[],
  options: UseStaggerAnimationOptions
) {
  const { selector, y = 40, duration = 0.5, stagger = 0.1, ease = "back.out(1.7)" } = options
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    
    const elements = ref.current.querySelectorAll(selector)
    if (elements.length === 0) return

    gsap.from(elements, {
      y,
      opacity: 0,
      duration,
      stagger,
      ease,
    })
  }, deps)

  return ref
}
