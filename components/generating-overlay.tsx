"use client"

import { forwardRef } from "react"
import { HiSparkles } from "react-icons/hi2"

interface GeneratingOverlayProps {
  iconCount?: number
  className?: string
}

export const GeneratingOverlay = forwardRef<HTMLDivElement, GeneratingOverlayProps>(
  function GeneratingOverlay({ iconCount = 8, className = "" }, ref) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ${className}`}>
        <div ref={ref} className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-[#B9FF66] border-t-transparent rounded-full animate-spin" />
            <div className="absolute w-32 h-32 border-4 border-[#B9FF66]/60 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <div className="absolute w-24 h-24 border-4 border-[#B9FF66]/40 border-l-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }} />
          </div>

          <div className="relative bg-[#B9FF66] rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-8 sm:p-10">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
                  <HiSparkles className="h-10 w-10 text-black animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full animate-bounce" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-zinc-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="absolute -top-2 left-1/2 w-3 h-3 bg-zinc-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>

              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-black text-black mb-2">Creating Magic...</h3>
                <p className="text-base font-bold text-zinc-800 flex items-center justify-center gap-1">
                  Generating {iconCount} unique icons
                  <span className="loading-dot">.</span>
                  <span className="loading-dot">.</span>
                  <span className="loading-dot">.</span>
                </p>
              </div>

              <div className="w-48 h-3 bg-white/50 rounded-full border-2 border-black overflow-hidden">
                <div className="h-full bg-black rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
