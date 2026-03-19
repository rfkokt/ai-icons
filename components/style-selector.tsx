"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiChevronDown, HiCheck } from "react-icons/hi2"
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
  type?: "icon" | "image" | "character"
}

const ICON_STYLES: StyleOption[] = [
  { id: "minimalist", name: "Minimalist", description: "Clean, simple geometric shapes", color: "bg-zinc-100" },
  { id: "outline", name: "Outline", description: "Clean line art, black strokes", color: "bg-white border-2 border-black" },
  { id: "filled", name: "Filled", description: "Solid black fill", color: "bg-black" },
  { id: "duotone", name: "Duotone", description: "Two-tone with shading", color: "bg-gradient-to-br from-zinc-200 to-zinc-500" },
  { id: "3d", name: "3D", description: "Dimensional with depth", color: "bg-zinc-300 shadow-[4px_4px_0px_0px_#000000]" },
  { id: "flat", name: "Flat", description: "Simple 2D shapes", color: "bg-zinc-200" },
  { id: "hand-drawn", name: "Hand Drawn", description: "Sketchy organic lines", color: "bg-yellow-100" },
  { id: "neon", name: "Neon", description: "Glowing bright colors", color: "bg-[#B9FF66] shadow-[0_0_15px_#B9FF66]" },
]

const IMAGE_STYLES: StyleOption[] = [
  { id: "flat", name: "Flat", description: "Solid colors, clean shapes", color: "bg-gradient-to-br from-pink-400 to-purple-500" },
  { id: "minimalist", name: "Minimalist", description: "Limited colors, simple", color: "bg-zinc-100" },
  { id: "outline", name: "Line Art", description: "Clean strokes, no fill", color: "bg-white border-2 border-black" },
  { id: "3d", name: "3D Render", description: "Volumetric, realistic", color: "bg-gradient-to-br from-zinc-300 to-zinc-500" },
  { id: "illustrative", name: "Illustrative", description: "Artistic, detailed", color: "bg-gradient-to-br from-blue-400 to-teal-400" },
  { id: "watercolor", name: "Watercolor", description: "Soft, painterly", color: "bg-gradient-to-br from-pink-200 to-blue-200" },
  { id: "geometric", name: "Geometric", description: "Sharp angles, patterns", color: "bg-gradient-to-br from-orange-400 to-red-500" },
  { id: "retro", name: "Retro", description: "Vintage inspired", color: "bg-gradient-to-br from-amber-400 to-orange-500" },
]

const CHARACTER_STYLES: StyleOption[] = [
  { id: "flat", name: "Flat", description: "2D vector, bold colors", color: "bg-gradient-to-br from-blue-400 to-indigo-500" },
  { id: "3d", name: "3D Render", description: "Volumetric, realistic", color: "bg-gradient-to-br from-zinc-300 to-zinc-500" },
  { id: "chibi", name: "Chibi", description: "Cute, big head", color: "bg-gradient-to-br from-pink-300 to-pink-500" },
  { id: "anime", name: "Anime", description: "Japanese style", color: "bg-gradient-to-br from-purple-400 to-pink-500" },
  { id: "cartoon", name: "Cartoon", description: "Fun, exaggerated", color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
  { id: "realistic", name: "Realistic", description: "Photo-like", color: "bg-gradient-to-br from-zinc-200 to-zinc-400" },
  { id: "pixel", name: "Pixel Art", description: "Retro 8-bit", color: "bg-gradient-to-br from-emerald-400 to-teal-500" },
  { id: "sketch", name: "Sketch", description: "Hand-drawn", color: "bg-yellow-100" },
]

const TYPE_STYLES = {
  icon: ICON_STYLES,
  image: IMAGE_STYLES,
  character: CHARACTER_STYLES,
}

export function StyleSelector({
  selectedStyle,
  onStyleChange,
  disabled = false,
  type = "icon"
}: StyleSelectorProps) {
  const styles = TYPE_STYLES[type]
  const currentStyle = styles.find(s => s.id === selectedStyle)
  const fallbackStyle = styles[0]

  const displayStyle = currentStyle || fallbackStyle

  const typeLabel = {
    icon: "ICON STYLE",
    image: "ILLUSTRATION STYLE",
    character: "CHARACTER STYLE",
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
