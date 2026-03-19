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
  { id: "minimalist_studio", name: "Minimalist Studio", description: "Clean, geometric, neutral pastel", color: "bg-stone-200" },
  { id: "nature_organic", name: "Nature/Organic", description: "Moss, natural light, earthy", color: "bg-emerald-200" },
  { id: "dark_luxury", name: "Dark Luxury", description: "Black marble, gold accents, moody", color: "bg-zinc-900 border border-yellow-500" },
]

const CONTENT_STYLES: StyleOption[] = [
  { id: "3d_animation", name: "3D Animation", description: "Pixar/Disney inspired, cinematic", color: "bg-blue-400" },
  { id: "anime_manga", name: "Anime/Manga", description: "Cel-shading, vibrant lines", color: "bg-pink-400" },
  { id: "isometric_game", name: "Isometric Game", description: "Low-poly, cute proportions", color: "bg-violet-300" },
]

const REAL_ESTATE_STYLES: StyleOption[] = [
  { id: "japandi", name: "Japandi", description: "Japanese minimalism, calm", color: "bg-orange-100" },
  { id: "industrial_loft", name: "Industrial Loft", description: "Red brick, metal beams", color: "bg-red-800" },
  { id: "modern_bohemian", name: "Modern Bohemian", description: "Rattan, plants, string lights", color: "bg-amber-100" },
]

const PROFESSIONAL_STYLES: StyleOption[] = [
  { id: "corporate_global", name: "Corporate Global", description: "Business attire, office bokeh", color: "bg-slate-300" },
  { id: "tech_creative", name: "Tech/Creative", description: "Casual, modern co-working", color: "bg-teal-200" },
  { id: "editorial_dark", name: "Editorial/Dark", description: "Rembrandt lighting, moody", color: "bg-zinc-800" },
]

const WEB_ASSETS_STYLES: StyleOption[] = [
  { id: "3d_clay", name: "3D Clay Icon", description: "Claymorphism, rounded shapes", color: "bg-rose-200 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]" },
  { id: "flat_vector", name: "Flat Vector", description: "Corporate Memphis, clean", color: "bg-yellow-300" },
  { id: "mesh_gradient", name: "Mesh Gradient", description: "Fluid, abstract, ultra-smooth", color: "bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400" },
  { id: "glassmorphism", name: "Glassmorphism", description: "Frosted glass, neon accents", color: "bg-zinc-200/50 border border-white" },
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
    ecommerce: "PHOTOGRAPHY STYLE",
    content: "CHARACTER STYLE",
    real_estate: "INTERIOR STYLE",
    professional: "PORTRAIT STYLE",
    web_assets: "ASSET STYLE",
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
