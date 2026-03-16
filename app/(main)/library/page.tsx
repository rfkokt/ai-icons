"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HiEllipsisVertical, HiArrowDownTray, HiTrash, HiCheck } from "react-icons/hi2"
import { cn } from "@/lib/utils"

const libraryIcons = [
  { id: 1, prompt: "Shopping cart icon", date: "2 hours ago", format: "SVG" },
  { id: 2, prompt: "Notification bell", date: "5 hours ago", format: "PNG" },
  { id: 3, prompt: "Settings gear", date: "1 day ago", format: "SVG" },
  { id: 4, prompt: "User profile avatar", date: "2 days ago", format: "PNG" },
  { id: 5, prompt: "Message bubble", date: "3 days ago", format: "SVG" },
  { id: 6, prompt: "Chart dashboard", date: "4 days ago", format: "PNG" },
  { id: 7, prompt: "Calendar icon", date: "5 days ago", format: "SVG" },
  { id: 8, prompt: "Search magnifier", date: "1 week ago", format: "PNG" },
  { id: 9, prompt: "Download arrow", date: "1 week ago", format: "SVG" },
  { id: 10, prompt: "Upload cloud", date: "2 weeks ago", format: "PNG" },
  { id: 11, prompt: "Lock security", date: "2 weeks ago", format: "SVG" },
  { id: 12, prompt: "Play button", date: "3 weeks ago", format: "PNG" },
]

export default function LibraryPage() {
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode)
    setSelectedIds([])
    setActiveMenuId(null)
  }

  const handleDownload = (id: number) => {
    console.log("Download", id)
    setActiveMenuId(null)
  }

  const handleDelete = (id: number) => {
    console.log("Delete", id)
    setActiveMenuId(null)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-auto sm:h-14 bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 sm:py-0 flex items-center justify-between gap-2 shrink-0">
        <h1 className="text-base sm:text-lg font-bold text-zinc-900 truncate">My Library</h1>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {isSelectMode && (
            <span className="text-sm text-zinc-500 hidden sm:inline">
              {selectedIds.length} selected
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectMode}
            className={cn(
              "h-10 sm:h-8 px-3 sm:px-4 brutalist-border-2 rounded-lg text-sm",
              isSelectMode && "bg-zinc-900 text-white hover:bg-zinc-800"
            )}
          >
            {isSelectMode ? "Cancel" : "Select"}
          </Button>
        </div>
      </header>

      {/* Grid Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 pb-20 lg:pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {libraryIcons.map((icon) => (
            <Card
              key={icon.id}
              className={cn(
                "group relative aspect-square rounded-xl sm:rounded-2xl border-2 bg-white p-3 sm:p-4 cursor-pointer transition-all duration-200 overflow-hidden",
                selectedIds.includes(icon.id)
                  ? "border-[#B9FF66] ring-2 ring-[#B9FF66]"
                  : "border-zinc-200 hover:border-zinc-300 hover:shadow-lg"
              )}
              onClick={() => isSelectMode && toggleSelect(icon.id)}
            >
              {/* Selection Check */}
              {isSelectMode && (
                <div
                  className={cn(
                    "absolute top-2 left-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedIds.includes(icon.id)
                      ? "bg-[#B9FF66] border-[#B9FF66]"
                      : "bg-white border-zinc-300"
                  )}
                >
                  {selectedIds.includes(icon.id) && (
                    <HiCheck className="h-3.5 w-3.5 text-black" />
                  )}
                </div>
              )}

              {/* Context Menu - Touch Friendly */}
              {!isSelectMode && (
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveMenuId(activeMenuId === icon.id ? null : icon.id)
                    }}
                    className="w-9 h-9 sm:w-8 sm:h-8 bg-white rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"
                  >
                    <HiEllipsisVertical className="h-4 w-4 text-zinc-500" />
                  </Button>
                  
                  {/* Menu - Show on click for mobile, hover for desktop */}
                  {activeMenuId === icon.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-zinc-200 shadow-lg py-1 min-w-[130px] z-20">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(icon.id)
                        }}
                        className="w-full px-3 py-2.5 sm:py-2 text-sm text-left flex items-center gap-2 hover:bg-zinc-50 text-zinc-900 justify-start"
                      >
                        <HiArrowDownTray className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(icon.id)
                        }}
                        className="w-full px-3 py-2.5 sm:py-2 text-sm text-left flex items-center gap-2 hover:bg-zinc-50 text-red-500 justify-start"
                      >
                        <HiTrash className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Icon Placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-lg sm:rounded-xl">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Actions - Mobile Bottom Bar */}
        {isSelectMode && selectedIds.length > 0 && (
          <div className="fixed bottom-16 lg:bottom-6 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto bg-white border-2 border-black brutalist-shadow rounded-xl p-2 flex flex-col sm:flex-row items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-11 sm:h-9 brutalist-border-2 rounded-lg touch-manipulation"
            >
              <HiArrowDownTray className="h-4 w-4 mr-1.5" />
              Download Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-11 sm:h-9 brutalist-border-2 rounded-lg text-red-500 hover:text-red-600 touch-manipulation"
            >
              <HiTrash className="h-4 w-4 mr-1.5" />
              Delete Selected
            </Button>
          </div>
        )}
      </main>

      {/* Click outside to close menu */}
      {activeMenuId !== null && (
        <div
          className="fixed inset-0 z-10 lg:hidden"
          onClick={() => setActiveMenuId(null)}
        />
      )}
    </div>
  )
}