"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HiAdjustmentsHorizontal, HiArrowTopRightOnSquare, HiChevronDown } from "react-icons/hi2"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onGenerate?: () => void
  onOptionsClick?: () => void
  onStyleClick?: () => void
  styleLabel?: string
}

export function PromptInput({
  value,
  onChange,
  placeholder = "Describe your icon...",
  onGenerate,
  onOptionsClick,
  onStyleClick,
  styleLabel = "Style: Minimalist"
}: PromptInputProps) {
  return (
    <div className="w-full max-w-2xl px-2 sm:px-0">
      <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-black brutalist-shadow p-2 sm:p-3">
        <div className="p-2 sm:p-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-none border-none outline-none text-sm placeholder:text-zinc-400 min-h-[60px] sm:min-h-[80px]"
            rows={2}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-2 sm:px-3 pb-2 sm:pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {onOptionsClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOptionsClick}
                className="h-10 sm:h-9 gap-1.5 text-xs sm:text-sm brutalist-border-2 rounded-lg flex-shrink-0"
              >
                <HiAdjustmentsHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Options
              </Button>
            )}

            {onOptionsClick && onStyleClick && (
              <Separator orientation="vertical" className="hidden sm:block h-5" />
            )}

            {onStyleClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onStyleClick}
                className="h-10 sm:h-9 text-xs sm:text-sm text-zinc-500 flex-shrink-0"
              >
                {styleLabel}
                <HiChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
              </Button>
            )}
          </div>

          {onGenerate && (
            <Button 
              onClick={onGenerate}
              className="bg-[#B9FF66] text-black border-2 border-black rounded-xl px-4 sm:px-6 h-10 sm:h-11 text-sm font-semibold brutalist-shadow-sm hover:bg-[#a8ef55] w-full sm:w-auto"
            >
              Generate
              <HiArrowTopRightOnSquare className="h-4 w-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
