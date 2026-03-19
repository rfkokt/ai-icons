"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface LoadableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string
}

export function LoadableImage({
  className,
  skeletonClassName,
  src,
  alt,
  onLoad,
  ...props
}: LoadableImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true)
    onLoad?.(e)
  }

  return (
    <>
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            skeletonClassName
          )}
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <div className="absolute inset-0 rounded-xl bg-zinc-200 animate-pulse" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          className,
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleLoad}
        {...props}
      />
    </>
  )
}
