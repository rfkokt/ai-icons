"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiAdjustmentsHorizontal } from "react-icons/hi2"
import { cn } from "@/lib/utils"

interface CountSelectorProps {
  count: number
  onCountChange: (count: number) => void
  options?: number[]
  disabled?: boolean
}

export function CountSelector({
  count,
  onCountChange,
  options = [4, 8, 12, 16],
  disabled = false
}: CountSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="h-9 sm:h-11 gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl inline-flex items-center justify-center border-2 sm:border-3 border-black bg-white px-2.5 sm:px-4 shadow-[2px_2px_0px_0px_#000000] sm:shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        disabled={disabled}
      >
        <HiAdjustmentsHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">{count} Icons</span>
        <span className="sm:hidden">{count}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
        <div className="px-4 py-4">
          <p className="text-sm font-black mb-3">Number of Icons</p>
          <div className="grid grid-cols-4 gap-2">
            {options.map((c) => (
              <Button
                key={c}
                variant={count === c ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-10 text-sm font-bold",
                  count === c 
                    ? 'bg-[#B9FF66] text-black border-2 border-black' 
                    : 'border-2 border-black hover:bg-zinc-100'
                )}
                onClick={() => onCountChange(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
