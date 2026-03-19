"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiSparkles, HiArrowDownTray, HiTrash, HiChevronDown } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import gsap from "gsap"

interface PackAccordionProps {
  id: string
  prompt: string
  iconCount: number
  children: React.ReactNode
  onDelete?: () => void
  onDownloadPng?: () => void
  onDownloadSvg?: () => void
  defaultExpanded?: boolean
  className?: string
}

export function PackAccordion({
  id,
  prompt,
  iconCount,
  children,
  onDelete,
  onDownloadPng,
  onDownloadSvg,
  defaultExpanded = false,
  className,
}: PackAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    if (!contentRef.current) return

    if (isExpanded) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        onStart: () => {
          gsap.set(contentRef.current, { display: "block" })
        }
      })
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(contentRef.current, { display: "none" })
        }
      })
    }
  }, [isExpanded])

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden",
        className
      )}
      role="region"
      aria-labelledby={`pack-title-${id}`}
    >
      <div
        role="button"
        tabIndex={0}
        className="bg-[#B9FF66] border-b-4 border-black p-3 sm:p-4 flex items-center justify-between cursor-pointer transition-all duration-200"
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        aria-expanded={isExpanded}
        aria-label={`Toggle ${prompt} pack`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="bg-black text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
            Pack
          </div>
          <div className="flex-1 min-w-0">
            <h2 id={`pack-title-${id}`} className="text-base sm:text-lg lg:text-xl font-black tracking-tighter text-black truncate">
              {prompt}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-zinc-800 mt-0.5 flex items-center gap-1.5">
              {iconCount} icons
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-3">
          {onDownloadPng && onDownloadSvg && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="hidden sm:flex h-8 px-3 items-center gap-1.5 bg-white hover:bg-[#B9FF66] border-2 border-black rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HiArrowDownTray className="h-3.5 w-3.5" />
                  <span>Download</span>
                  <HiChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000000]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#B9FF66] cursor-pointer font-bold text-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownloadPng()
                    }}
                  >
                    <HiArrowDownTray className="h-3.5 w-3.5" />
                    <div>
                      <div className="text-xs">PNG Pack</div>
                      <div className="text-[10px] text-zinc-500 font-normal">{iconCount} icons</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#B9FF66] cursor-pointer font-bold text-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownloadSvg()
                    }}
                  >
                    <HiArrowDownTray className="h-3.5 w-3.5" />
                    <div>
                      <div className="text-xs">SVG Pack</div>
                      <div className="text-[10px] text-zinc-500 font-normal">{iconCount} icons</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 bg-white hover:bg-[#B9FF66] border-2 border-black rounded-lg p-0 shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownloadPng()
                  }}
                >
                  <HiArrowDownTray className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white h-8 px-3 border-2 border-black rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <HiTrash className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline font-semibold">Delete</span>
            </Button>
          )}

          <button
            className={cn(
              "h-10 w-10 sm:h-8 sm:w-8 flex items-center justify-center border-2 border-black rounded-lg bg-white shadow-[2px_2px_0px_0px_#000000] transition-all duration-200",
              isExpanded && "rotate-180"
            )}
            onClick={(e) => {
              e.stopPropagation()
              toggle()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                toggle()
              }
            }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse pack' : 'Expand pack'}
          >
            <HiChevronDown className="h-4 w-4 text-black" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          ref={contentRef}
          data-pack-id={id}
          className="pack-content p-4 sm:p-6 bg-gradient-to-br from-zinc-50 to-white border-t-4 border-black"
        >
          {children}
        </div>
      )}
    </div>
  )
}
