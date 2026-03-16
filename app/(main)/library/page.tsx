"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MoreVertical, Download, Trash2, Check } from "lucide-react"
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

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode)
    setSelectedIds([])
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-bold text-zinc-900">My Library</h1>

        <div className="flex items-center gap-2">
          {isSelectMode && (
            <span className="text-sm text-zinc-500">
              {selectedIds.length} selected
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectMode}
            className={cn(
              "h-8 brutalist-border-2 rounded-lg",
              isSelectMode && "bg-zinc-900 text-white hover:bg-zinc-800"
            )}
          >
            {isSelectMode ? "Cancel" : "Select"}
          </Button>
        </div>
      </header>

      {/* Grid Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {libraryIcons.map((icon) => (
            <Card
              key={icon.id}
              className={cn(
                "group relative aspect-square rounded-2xl border-2 bg-white p-4 cursor-pointer transition-all duration-200 overflow-hidden",
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
                    "absolute top-2 left-2 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedIds.includes(icon.id)
                      ? "bg-[#B9FF66] border-[#B9FF66]"
                      : "bg-white border-zinc-300"
                  )}
                >
                  {selectedIds.includes(icon.id) && (
                    <Check className="h-3 w-3 text-black" />
                  )}
                </div>
              )}

              {/* Context Menu */}
              {!isSelectMode && (
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative group/menu">
                    <button className="w-8 h-8 bg-white rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50">
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-zinc-200 shadow-lg py-1 hidden group-hover/menu:block min-w-[120px]">
                      <button className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-zinc-50">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                      <button className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-zinc-50 text-red-500">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Icon Placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-xl">
                <div className="w-16 h-16 bg-zinc-200 rounded-xl flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-10 h-10 text-zinc-400"
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

        {/* Selected Actions */}
        {isSelectMode && selectedIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border-2 border-black brutalist-shadow rounded-xl p-2 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 brutalist-border-2 rounded-lg"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 brutalist-border-2 rounded-lg text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete Selected
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}