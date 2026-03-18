"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HiArrowDownTray, HiTrash, HiClock, HiSparkles } from "react-icons/hi2"
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

  const handleDownloadPng = (key: string, prompt: string) => {
    const downloadUrl = `/api/download/${encodeURIComponent(key)}?format=png`
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `${prompt.replace(/\s+/g, "-")}.png`
    a.click()
    toast.success("PNG downloading...")
  }

  const handleDownloadSvg = (key: string, prompt: string) => {
    const downloadUrl = `/api/download/${encodeURIComponent(key)}?format=svg`
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `${prompt.replace(/\s+/g, "-")}.svg`
    a.click()
    toast.success("SVG downloading...")
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B9FF66] rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-black brutalist-shadow-sm">
            <HiClock className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">History</h1>
            <p className="text-sm text-zinc-500">Your generated icons</p>
          </div>
        </div>

        {icons.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-zinc-200">
              <HiSparkles className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">
              No icons yet
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base">
              Start generating icons to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {icons.map((icon) => (
              <div
                key={icon.id}
                className="bg-white rounded-xl border-2 border-black brutalist-shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square p-3 sm:p-4 flex items-center justify-center bg-zinc-50">
                  {icon.png_url ? (
                    <img
                      src={icon.png_url}
                      alt={icon.prompt}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-zinc-400 text-xs">No preview</div>
                  )}
                </div>
                
                <div className="p-2 sm:p-3 border-t border-zinc-100">
                  <p className="text-xs sm:text-sm font-medium text-zinc-900 truncate mb-1">
                    {icon.prompt}
                  </p>
                  <p className="text-xs text-zinc-500 mb-2">
                    {formatDate(icon.created_at)}
                  </p>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs border border-black rounded flex-1"
                      onClick={() => handleDownloadPng(icon.png_key!, icon.prompt)}
                    >
                      <HiArrowDownTray className="h-3 w-3 mr-1" />
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs border border-black rounded flex-1"
                      onClick={() => handleDownloadSvg(icon.png_key!, icon.prompt)}
                    >
                      <HiArrowDownTray className="h-3 w-3 mr-1" />
                      SVG
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}