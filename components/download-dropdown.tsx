"use client"

import { useState, useRef, useEffect } from "react"
import { HiArrowDownTray } from "react-icons/hi2"
import { useDownload } from "@/hooks/use-download"
import { cn } from "@/lib/utils"

interface DownloadDropdownProps {
  iconKey?: string
  prompt?: string
  onDownloadPng?: () => void
  onDownloadSvg?: () => void
  size?: "sm" | "md" | "lg"
  variant?: "button" | "icon"
  className?: string
}

export function DownloadDropdown({
  iconKey,
  prompt,
  onDownloadPng,
  onDownloadSvg,
  size = "md",
  variant = "button",
  className,
}: DownloadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { download } = useDownload()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDownloadPng = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (iconKey && prompt) {
      download(iconKey, prompt, "png")
    } else if (onDownloadPng) {
      onDownloadPng()
    }
    setIsOpen(false)
  }

  const handleDownloadSvg = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (iconKey && prompt) {
      download(iconKey, prompt, "svg")
    } else if (onDownloadSvg) {
      onDownloadSvg()
    }
    setIsOpen(false)
  }

  const hasSvg = !!(iconKey && prompt) || !!onDownloadSvg

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  if (variant === "button") {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "bg-white hover:bg-[#B9FF66] border-2 border-black rounded-lg px-3 flex items-center justify-center gap-1.5 transition-all font-bold shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5",
            size === "sm" && "h-8 px-2 text-xs",
            size === "md" && "h-9 px-3 text-sm",
            size === "lg" && "h-10 px-4 text-base",
            className
          )}
        >
          <HiArrowDownTray className={size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4 w-4" : "h-5 w-5"} />
          {size !== "sm" && <span>Download</span>}
        </button>
        {isOpen && (
          <div className="absolute top-full mt-1 right-0 z-50 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] min-w-[120px] overflow-hidden">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left font-bold hover:bg-[#B9FF66] transition-colors"
            >
              <HiArrowDownTray className="h-4 w-4" />
              PNG
            </button>
            {hasSvg && (
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left font-bold hover:bg-[#B9FF66] transition-colors"
              >
                <HiArrowDownTray className="h-4 w-4" />
                SVG
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "bg-[#B9FF66] hover:bg-lime-400 border-2 border-black rounded-lg flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5",
          sizeClasses[size],
          className
        )}
      >
        <HiArrowDownTray className="h-3.5 w-3.5 text-black" />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 z-50 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] min-w-[100px] overflow-hidden">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left font-bold hover:bg-[#B9FF66] transition-colors"
          >
            <HiArrowDownTray className="h-4 w-4" />
            PNG
          </button>
          {hasSvg && (
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left font-bold hover:bg-[#B9FF66] transition-colors"
            >
              <HiArrowDownTray className="h-4 w-4" />
              SVG
            </button>
          )}
        </div>
      )}
    </div>
  )
}
