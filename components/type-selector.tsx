"use client"

import { Button } from "@/components/ui/button"
import { HiSparkles, HiPhoto, HiUserGroup } from "react-icons/hi2"
import { cn } from "@/lib/utils"

type GenerateType = "icon" | "image" | "character"

interface TypeSelectorProps {
  selectedType: GenerateType
  onTypeChange: (type: GenerateType) => void
  disabled?: boolean
}

const TYPE_OPTIONS: Array<{ 
  id: GenerateType
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { 
    id: "icon", 
    name: "Icon", 
    description: "UI icons, symbols, logos",
    icon: HiSparkles 
  },
  { 
    id: "image", 
    name: "Image", 
    description: "Illustrations, scenes",
    icon: HiPhoto
  },
  { 
    id: "character", 
    name: "Character", 
    description: "People, avatars, transparent",
    icon: HiUserGroup
  },
]

export function TypeSelector({
  selectedType,
  onTypeChange,
  disabled = false
}: TypeSelectorProps) {
  return (
    <div className="relative inline-flex">
      <div className="flex bg-white border-[3px] border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_#000000]">
        {TYPE_OPTIONS.map((type, index) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          
          return (
            <button
              key={type.id}
              disabled={disabled}
              onClick={() => onTypeChange(type.id)}
              className={cn(
                "relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 h-9 sm:h-11 text-xs sm:text-sm font-black transition-all",
                isSelected 
                  ? "bg-[#B9FF66] text-black" 
                  : "bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700",
                index > 0 && "border-l-[2px] border-black/20"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform",
                isSelected ? "scale-110" : ""
              )} />
              <span className="hidden sm:inline">{type.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
