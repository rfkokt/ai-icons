"use client"

import { Spinner } from "@/components/ui/spinner"

interface PageLoadingProps {
  message?: string
  className?: string
}

export function PageLoading({ message = "Loading...", className }: PageLoadingProps) {
  return (
    <div className={`flex-1 flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 ${className}`}>
      <div className="text-center">
        <Spinner className="h-12 w-12 border-4 border-black border-t-[#B9FF66] mx-auto mb-4" />
        <p className="text-lg font-bold text-zinc-700">{message}</p>
      </div>
    </div>
  )
}
