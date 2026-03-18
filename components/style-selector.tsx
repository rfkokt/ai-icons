"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiAdjustmentsHorizontal, HiChevronDown, HiCheck } from "react-icons/hi2"
import { cn } from "@/lib/utils"

interface StyleOption {
  id: string
  name: string
  description: string
  color: string
}

interface StyleSelectorProps {
  selectedStyle: string
  onStyleChange: (styleId: string) => void
  disabled?: boolean
  styles?: StyleOption[]
}

const DEFAULT_STYLES: StyleOption[] = [
  { id: "minimalist", name: "Minimalist", description: "Clean, simple lines", color: "bg-zinc-100" },
  { id: "outline", name: "Outline", description: "Line art style", color: "bg-white border-2 border-black" },
  { id: "filled", name: "Filled", description: "Solid filled icons", color: "bg-black" },
  { id: "duotone", name: "Duotone", description: "Two-tone style", color: "bg-gradient-to-br from-zinc-200 to-zinc-400" },
  { id: "3d", name: "3D", description: "Three dimensional", color: "bg-zinc-300 shadow-[4px_4px_0px_0px_#000000]" },
  { id: "flat", name: "Flat", description: "Flat design", color: "bg-zinc-200" },
  { id: "hand-drawn", name: "Hand Drawn", description: "Organic sketch look", color: "bg-yellow-100" },
  { id: "neon", name: "Neon", description: "Glowing neon style", color: "bg-[#B9FF66] shadow-[0_0_20px_#B9FF66]" },
]

export function StyleSelector({
  selectedStyle,
  onStyleChange,
  disabled = false,
  styles = DEFAULT_STYLES
}: StyleSelectorProps) {
  const currentStyle = styles.find(s => s.id === selectedStyle)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="h-9 sm:h-11 text-xs sm:text-sm font-bold inline-flex items-center justify-center border-2 sm:border-3 border-black bg-white px-2.5 sm:px-4 rounded-lg sm:rounded-xl shadow-[2px_2px_0px_0px_#000000] sm:shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        disabled={disabled}
      >
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-300 mr-1.5 sm:mr-2" />
        <span className="max-w-[100px] sm:max-w-none truncate">{currentStyle?.name || selectedStyle}</span>
        <HiChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
        <div className="p-3">
          <p className="text-xs font-bold text-zinc-500 mb-2 px-1">ICON STYLE</p>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {styles.map((style) => (
              <DropdownMenuItem
                key={style.id}
                className={cn(
                  "flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl border-2",
                  selectedStyle === style.id 
                    ? 'bg-[#B9FF66] border-black' 
                    : 'border-transparent hover:bg-zinc-100'
                )}
                onClick={() => onStyleChange(style.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg border-2 border-black flex-shrink-0", style.color)} />
                  <div>
                    <div className="text-sm font-bold">{style.name}</div>
                    <div className="text-xs text-zinc-500">{style.description}</div>
                  </div>
                </div>
                {selectedStyle === style.id && <HiCheck className="h-5 w-5 text-black" />}
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
