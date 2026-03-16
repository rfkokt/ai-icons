"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const communityIcons = [
  { id: 1, prompt: "Shopping cart", likes: 128 },
  { id: 2, prompt: "Notification bell", likes: 95 },
  { id: 3, prompt: "Settings gear", likes: 87 },
  { id: 4, prompt: "User avatar", likes: 156 },
  { id: 5, prompt: "Message bubble", likes: 203 },
  { id: 6, prompt: "Chart dashboard", likes: 145 },
  { id: 7, prompt: "Calendar icon", likes: 112 },
  { id: 8, prompt: "Search magnifier", likes: 89 },
  { id: 9, prompt: "Download arrow", likes: 167 },
  { id: 10, prompt: "Upload cloud", likes: 134 },
  { id: 11, prompt: "Lock security", likes: 198 },
  { id: 12, prompt: "Play button", likes: 221 },
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
      <header className="h-14 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Community</h1>
          <p className="text-xs text-zinc-500">Explore icons created by the community</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("latest")}
            className={cn(
              "h-8 px-4 rounded-md text-sm font-medium transition-colors",
              filter === "latest"
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-transparent"
            )}
          >
            <Clock className="h-4 w-4 mr-1.5" />
            Latest
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("mostLoved")}
            className={cn(
              "h-8 px-4 rounded-md text-sm font-medium transition-colors",
              filter === "mostLoved"
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-transparent"
            )}
          >
            <Heart className="h-4 w-4 mr-1.5" />
            Most Loved
          </Button>
        </div>
      </header>

      {/* Grid Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {sortedIcons.map((icon) => (
            <Card
              key={icon.id}
              className="group aspect-square rounded-2xl border-2 border-zinc-200 bg-white p-4 cursor-pointer hover:border-zinc-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-xl group-hover:bg-[#B9FF66] transition-colors duration-200">
                {/* Placeholder for actual icon image */}
                <div className="w-16 h-16 bg-zinc-200 group-hover:bg-zinc-300 rounded-xl flex items-center justify-center transition-colors">
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
      </main>
    </div>
  )
}