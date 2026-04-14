import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  const { download } = useDownload()

  const handleDownloadPng = (e: any) => {
    e.stopPropagation()
    if (iconKey && prompt) {
      download(iconKey, prompt, "png")
    } else if (onDownloadPng) {
      onDownloadPng()
    }
  }

  const handleDownloadSvg = (e: any) => {
    e.stopPropagation()
    if (iconKey && prompt) {
      download(iconKey, prompt, "svg")
    } else if (onDownloadSvg) {
      onDownloadSvg()
    }
  }

  const hasSvg = !!(iconKey && prompt) || !!onDownloadSvg

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  if (variant === "button") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
            className={cn(
              "bg-white dark:bg-[#1a1a1a] hover:bg-[#B9FF66] border-2 border-black dark:border-zinc-600 rounded-lg px-3 flex items-center justify-center gap-1.5 transition-all font-bold shadow-[2px_2px_0px_0px_#000] dark:shadow-none hover:shadow-[1px_1px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 outline-none",
              size === "sm" && "h-8 px-2 text-xs",
              size === "md" && "h-9 px-3 text-sm",
              size === "lg" && "h-10 px-4 text-base",
              className
            )}
        >
            <HiArrowDownTray className={size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4 w-4" : "h-5 w-5"} />
            {size !== "sm" && <span className="hidden sm:inline">Download</span>}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[120px] bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-none">
          <DropdownMenuItem onSelect={(e: any) => handleDownloadPng(e)} className="font-bold cursor-pointer hover:bg-[#B9FF66] text-black dark:text-white w-full flex items-center">
            <HiArrowDownTray className="mr-2 h-4 w-4" /> PNG
          </DropdownMenuItem>
          {hasSvg && (
            <DropdownMenuItem onSelect={(e: any) => handleDownloadSvg(e)} className="font-bold cursor-pointer hover:bg-[#B9FF66] text-black dark:text-white w-full flex items-center">
              <HiArrowDownTray className="mr-2 h-4 w-4" /> SVG
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
          className={cn(
            "bg-[#B9FF66] hover:bg-lime-400 border-2 border-black dark:border-zinc-600 rounded-lg flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-none hover:shadow-[1px_1px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 outline-none",
            sizeClasses[size],
            className
          )}
      >
          <HiArrowDownTray className="h-4 w-4 text-black" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[120px] bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-zinc-600 rounded-xl shadow-[3px_3px_0px_0px_#000] dark:shadow-none">
        <DropdownMenuItem onSelect={(e: any) => handleDownloadPng(e)} className="font-bold cursor-pointer hover:bg-[#B9FF66] text-black dark:text-white w-full flex items-center">
          <HiArrowDownTray className="mr-2 h-4 w-4" /> PNG
        </DropdownMenuItem>
        {hasSvg && (
          <DropdownMenuItem onSelect={(e: any) => handleDownloadSvg(e)} className="font-bold cursor-pointer hover:bg-[#B9FF66] text-black dark:text-white w-full flex items-center">
            <HiArrowDownTray className="mr-2 h-4 w-4" /> SVG
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
