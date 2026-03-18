"use client"

import { useState, useEffect } from "react"
import { HiClock } from "react-icons/hi2"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { IconCard } from "@/components/icon-card"
import { useDownload } from "@/hooks/use-download"
import { toast } from "sonner"

interface HistoryIcon {
  id: string
  prompt: string
  style: string
  png_url: string | null
  png_key: string | null
  svg_url: string | null
  svg_key: string | null
  created_at: string
}

export default function HistoryPage() {
  const [icons, setIcons] = useState<HistoryIcon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { download } = useDownload()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history")
      const data = await response.json()
      
      if (data.success) {
        setIcons(data.icons)
      } else {
        toast.error("Failed to load history")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      
      if (data.success) {
        setIcons((prev) => prev.filter((icon) => icon.id !== id))
        toast.success("Icon deleted")
      } else {
        toast.error("Failed to delete icon")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <PageHeader
        icon={<HiClock className="h-6 w-6" />}
        title="History"
        description="Your generated icons"
        variant="white"
      />

      <div className="max-w-6xl mx-auto mt-6 sm:mt-8">
        {icons.length === 0 ? (
          <EmptyState
            variant="minimal"
            icon={<HiClock className="h-8 w-8 text-zinc-400" />}
            title="No icons yet"
            description="Start generating icons to see them here"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {icons.map((icon) => (
              <IconCard
                key={icon.id}
                id={icon.id}
                src={icon.png_url}
                alt={icon.prompt}
                prompt={icon.prompt}
                format={icon.png_key || undefined}
                date={new Date(icon.created_at).toLocaleDateString()}
                variant="library"
                onDelete={() => handleDelete(icon.id)}
                showActionBar
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
