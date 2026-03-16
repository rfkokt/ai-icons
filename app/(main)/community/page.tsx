"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HiClock, HiHeart } from "react-icons/hi2"
import { IconCard } from "@/components/icon-card"
import { cn } from "@/lib/utils"

const communityIcons = [
  { id: 1, prompt: "Shopping cart", likes: 128, date: "2 hours ago" },
  { id: 2, prompt: "Notification bell", likes: 95, date: "5 hours ago" },
  { id: 3, prompt: "Settings gear", likes: 87, date: "1 day ago" },
  { id: 4, prompt: "User avatar", likes: 156, date: "2 days ago" },
  { id: 5, prompt: "Message bubble", likes: 203, date: "3 days ago" },
  { id: 6, prompt: "Chart dashboard", likes: 145, date: "4 days ago" },
  { id: 7, prompt: "Calendar icon", likes: 112, date: "5 days ago" },
  { id: 8, prompt: "Search magnifier", likes: 89, date: "1 week ago" },
  { id: 9, prompt: "Download arrow", likes: 167, date: "1 week ago" },
  { id: 10, prompt: "Upload cloud", likes: 134, date: "2 weeks ago" },
  { id: 11, prompt: "Lock security", likes: 198, date: "2 weeks ago" },
  { id: 12, prompt: "Play button", likes: 221, date: "3 weeks ago" },
]

type FilterType = "latest" | "mostLoved"

export default function CommunityPage() {
  const [filter, setFilter] = useState<FilterType>("latest")

  const sortedIcons = [...communityIcons].sort((a, b) => {
    if (filter === "mostLoved") {
      return b.likes - a.likes
    }
    return b.id - a.id
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-auto sm:h-14 bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Community</h1>
          <p className="text-xs text-zinc-500 hidden sm:block">Explore icons created by the community</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("latest")}
            className={cn(
              "h-10 sm:h-9 flex-1 sm:flex-none px-4 rounded-md text-sm font-medium transition-colors",
              filter === "latest"
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-transparent"
            )}
          >
            <HiClock className="h-4 w-4 mr-1.5" />
            Latest
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("mostLoved")}
            className={cn(
              "h-10 sm:h-9 flex-1 sm:flex-none px-4 rounded-md text-sm font-medium transition-colors",
              filter === "mostLoved"
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-transparent"
            )}
          >
            <HiHeart className="h-4 w-4 mr-1.5" />
            Most Loved
          </Button>
        </div>
      </header>

      {/* Grid Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 pb-20 lg:pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {sortedIcons.map((icon) => (
            <IconCard
              key={icon.id}
              id={icon.id}
              prompt={icon.prompt}
              likes={icon.likes}
              date={icon.date}
            />
          ))}
        </div>
      </main>
    </div>
  )
}