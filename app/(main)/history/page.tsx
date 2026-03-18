"use client"

import { useState, useEffect } from "react"
import { HiClock } from "react-icons/hi2"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { IconCard } from "@/components/icon-card"
import { IconGrid } from "@/components/icon-grid"
import { PageLoading } from "@/components/page-loading"
import { useDeletePack } from "@/hooks/use-delete-pack"
import { toast } from "sonner"
import type { HistoryIcon } from "@/types/icon"

export default function HistoryPage() {
  const [icons, setIcons] = useState<HistoryIcon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { deleteIconFromPack } = useDeletePack()

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
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const success = await deleteIconFromPack("", id)
    if (success) {
      setIcons((prev) => prev.filter((icon) => icon.id !== id))
    }
  }

  if (isLoading) {
    return <PageLoading message="Loading history..." />
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
          <IconGrid>
            {icons.map((icon) => (
              <IconCard
                key={icon.id}
                id={icon.id}
                src={icon.png_url}
                prompt={icon.prompt}
                format={icon.png_key || undefined}
                date={new Date(icon.created_at).toLocaleDateString()}
                variant="library"
                onDelete={() => handleDelete(icon.id)}
                showActionBar
                showDelete
              />
            ))}
          </IconGrid>
        )}
      </div>
    </div>
  )
}
