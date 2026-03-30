"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiChevronDown, HiCheck } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import type { GenerateType } from "./type-selector"

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
  type?: GenerateType
}

const ECOMMERCE_STYLES: StyleOption[] = [
  { id: "outline", name: "Outline", description: "Single stroke, clean lines", color: "bg-white border-2 border-black" },
  { id: "filled", name: "Filled", description: "Solid fill, no outline", color: "bg-black" },
  { id: "duotone", name: "Duotone", description: "Two-tone, primary with accent", color: "bg-gradient-to-br from-black to-zinc-400" },
]

const CONTENT_STYLES: StyleOption[] = [
  { id: "filled", name: "Filled", description: "Solid fill, bold look", color: "bg-black" },
  { id: "outline", name: "Outline", description: "Line art style", color: "bg-white border-2 border-black" },
  { id: "colored", name: "Colored", description: "Vibrant color fill", color: "bg-[#B9FF66]" },
]

const REAL_ESTATE_STYLES: StyleOption[] = [
  { id: "duotone", name: "Duotone", description: "Primary + accent color", color: "bg-gradient-to-br from-black to-zinc-400" },
  { id: "outline", name: "Outline", description: "Minimal line icon", color: "bg-white border-2 border-black" },
  { id: "filled", name: "Filled", description: "Solid black icon", color: "bg-black" },
]

const PROFESSIONAL_STYLES: StyleOption[] = [
  { id: "colored", name: "Colored", description: "Single vibrant color", color: "bg-[#B9FF66]" },
  { id: "filled", name: "Filled", description: "Solid fill icon", color: "bg-black" },
  { id: "duotone", name: "Duotone", description: "Two-tone style", color: "bg-gradient-to-br from-black to-zinc-400" },
]

const WEB_ASSETS_STYLES: StyleOption[] = [
  { id: "3d", name: "3D Icon", description: "Slight depth, modern look", color: "bg-gradient-to-br from-zinc-200 to-zinc-400" },
  { id: "filled", name: "Filled", description: "Solid fill, clean", color: "bg-black" },
  { id: "outline", name: "Outline", description: "Line icon style", color: "bg-white border-2 border-black" },
]

const TYPE_STYLES: Record<GenerateType, StyleOption[]> = {
  ecommerce: ECOMMERCE_STYLES,
  content: CONTENT_STYLES,
  real_estate: REAL_ESTATE_STYLES,
  professional: PROFESSIONAL_STYLES,
  web_assets: WEB_ASSETS_STYLES,
}

export function StyleSelector({
  selectedStyle,
  onStyleChange,
  disabled = false,
  type = "ecommerce"
}: StyleSelectorProps) {
  const styles = TYPE_STYLES[type] || TYPE_STYLES.ecommerce
  const currentStyle = styles.find(s => s.id === selectedStyle)
  const fallbackStyle = styles[0]

  const displayStyle = currentStyle || fallbackStyle

  const typeLabel: Record<GenerateType, string> = {
    ecommerce: "ICON STYLE",
    content: "ICON STYLE",
    real_estate: "ICON STYLE",
    professional: "ICON STYLE",
    web_assets: "ICON STYLE",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="h-9 sm:h-11 text-xs sm:text-sm font-bold inline-flex items-center justify-center border-2 sm:border-3 border-black bg-white px-2.5 sm:px-4 rounded-lg sm:rounded-xl shadow-[2px_2px_0px_0px_#000000] sm:shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        disabled={disabled}
      >
        <span className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-1.5 sm:mr-2", displayStyle.color)} />
        <span className="max-w-[100px] sm:max-w-none truncate">{displayStyle.name}</span>
        <HiChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
        <div className="p-3">
          <p className="text-xs font-black text-zinc-500 mb-2 px-1 uppercase tracking-wider">{typeLabel[type]}</p>
          <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
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
