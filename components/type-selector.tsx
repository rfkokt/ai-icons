"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiShoppingBag, HiUserGroup, HiHomeModern, HiBriefcase, HiSquare3Stack3D, HiChevronDown, HiCheck } from "react-icons/hi2"
import { cn } from "@/lib/utils"

export type GenerateType = "ecommerce" | "content" | "real_estate" | "professional" | "web_assets"

interface TypeSelectorProps {
  selectedType: GenerateType
  onTypeChange: (type: GenerateType) => void
  disabled?: boolean
}

export const TYPE_OPTIONS = [
  { id: "ecommerce" as GenerateType, name: "E-Commerce", description: "Product photography", icon: HiShoppingBag, color: "text-amber-500" },
  { id: "content" as GenerateType, name: "Content", description: "Characters & Animation", icon: HiUserGroup, color: "text-blue-500" },
  { id: "real_estate" as GenerateType, name: "Interior", description: "Real Estate & Spaces", icon: HiHomeModern, color: "text-emerald-500" },
  { id: "professional" as GenerateType, name: "Portrait", description: "Professional Headshots", icon: HiBriefcase, color: "text-purple-500" },
  { id: "web_assets" as GenerateType, name: "Web UI", description: "Assets & Elements", icon: HiSquare3Stack3D, color: "text-rose-500" },
]

export function TypeSelector({
  selectedType,
  onTypeChange,
  disabled = false
}: TypeSelectorProps) {
  const currentType = TYPE_OPTIONS.find(t => t.id === selectedType) || TYPE_OPTIONS[0]
  const DisplayIcon = currentType.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="h-9 sm:h-11 text-xs sm:text-sm font-bold inline-flex items-center justify-center border-2 sm:border-3 border-black bg-white px-2.5 sm:px-4 rounded-lg sm:rounded-xl shadow-[2px_2px_0px_0px_#000000] sm:shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        disabled={disabled}
      >
        <DisplayIcon className={cn("h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2", currentType.color)} />
        <span className="max-w-[100px] sm:max-w-none truncate">{currentType.name}</span>
        <HiChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px] bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
        <div className="p-3">
          <p className="text-xs font-black text-zinc-500 mb-2 px-1 uppercase tracking-wider">CATEGORY</p>
          <div className="space-y-1">
            {TYPE_OPTIONS.map((type) => {
              const Icon = type.icon
              const isSelected = selectedType === type.id
              return (
                <DropdownMenuItem
                  key={type.id}
                  className={cn(
                    "flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl border-2",
                    isSelected 
                      ? 'bg-[#B9FF66] border-black' 
                      : 'border-transparent hover:bg-zinc-100'
                  )}
                  onClick={() => onTypeChange(type.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border-2 border-black bg-white flex items-center justify-center flex-shrink-0">
                      <Icon className={cn("h-4 w-4", type.color)} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{type.name}</div>
                      <div className="text-xs text-zinc-500">{type.description}</div>
                    </div>
                  </div>
                  {isSelected && <HiCheck className="h-5 w-5 text-black" />}
                </DropdownMenuItem>
              )
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
