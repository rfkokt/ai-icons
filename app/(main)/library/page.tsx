"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HiEllipsisVertical, HiArrowDownTray, HiTrash, HiCheck, HiArrowLeft, HiX } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface HistoryPack {
  id: string
  prompt: string
  iconCount: number
  preview: string | null
  created_at: string
}

interface PackIcon {
  id: string
  prompt: string
  png_key: string | null
  svg_key: string | null
  created_at: string
}

function LibraryContent() {
  const searchParams = useSearchParams()
  const packId = searchParams.get("pack")
  
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [icons, setIcons] = useState<PackIcon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [packPrompt, setPackPrompt] = useState("")
  const router = useRouter()
  
  // User's packs (for default library view)
  const [userPacks, setUserPacks] = useState<HistoryPack[]>([])
  const [isLoadingPacks, setIsLoadingPacks] = useState(true)

  useEffect(() => {
    if (packId) {
      fetchPackIcons(packId)
    } else {
      fetchPacks()
    }
  }, [packId])

  const fetchPacks = async () => {
    setIsLoadingPacks(true)
    try {
      const response = await fetch("/api/history")
      const data = await response.json()
      if (data.success) {
        setUserPacks(data.icons)
      }
    } catch (error) {
      console.error("Failed to fetch packs:", error)
    } finally {
      setIsLoadingPacks(false)
    }
  }

  const fetchPackIcons = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pack/${id}`)
      const data = await response.json()
      
      if (data.success && data.icons) {
        setIcons(data.icons)
        setPackPrompt(data.prompt || "")
      } else {
        toast.error("Failed to load pack")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode)
    setSelectedIds([])
    setActiveMenuId(null)
  }

  const handleDownloadPng = (key: string) => {
    const downloadUrl = `/api/download/${encodeURIComponent(key)}`
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = key.split("/").pop() || "icon.png"
    a.click()
    toast.success("PNG downloading...")
    setActiveMenuId(null)
  }

  const handleDownloadSvg = (key: string) => {
    const downloadUrl = `/api/download/${encodeURIComponent(key)}`
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = key.split("/").pop() || "icon.svg"
    a.click()
    toast.success("SVG downloading...")
    setActiveMenuId(null)
  }

  // Pack view
  if (packId) {
    const handleDeletePack = async () => {
      if (!confirm("Delete this pack?")) return
      try {
        const response = await fetch(`/api/pack/${packId}`, { method: "DELETE" })
        const data = await response.json()
        if (data.success) {
          toast.success("Pack deleted")
          router.push("/library")
        } else {
          toast.error("Failed to delete pack")
        }
      } catch {
        toast.error("Something went wrong")
      }
    }

    const handleDeleteIcon = async (iconId: string) => {
      try {
        const response = await fetch(`/api/icon/${iconId}`, { method: "DELETE" })
        const data = await response.json()
        if (data.success) {
          setIcons(prev => prev.filter(i => i.id !== iconId))
          toast.success("Icon deleted")
        } else {
          toast.error("Failed to delete icon")
        }
      } catch {
        toast.error("Something went wrong")
      }
    }

    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <HiArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">{packPrompt || "Pack"}</h1>
                <p className="text-sm text-zinc-500">{icons.length} icons</p>
              </div>
            </div>
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDeletePack}>
              <HiTrash className="h-4 w-4 mr-2" />
              Delete Pack
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-zinc-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {icons.map((icon) => (
                <div
                  key={icon.id}
                  className={cn(
                    "bg-white rounded-xl border-2 border-black brutalist-shadow-sm overflow-hidden hover:shadow-md transition-shadow",
                    isSelectMode && selectedIds.includes(icon.id) && "ring-2 ring-[#B9FF66]"
                  )}
                >
                  <div className="aspect-square p-3 sm:p-4 flex items-center justify-center bg-zinc-50">
                    {icon.png_key ? (
                      <img
                        src={`/api/download/${encodeURIComponent(icon.png_key)}`}
                        alt={icon.prompt}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-zinc-400 text-xs">No preview</div>
                    )}
                  </div>
                  <div className="p-2 sm:p-3 border-t border-zinc-100">
                    <p className="text-xs sm:text-sm font-medium text-zinc-900 truncate mb-2">
                      {icon.prompt}
                    </p>
                    <div className="flex gap-1">
                      {icon.png_key && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs border border-black rounded flex-1"
                          onClick={() => handleDownloadPng(icon.png_key!)}
                        >
                          PNG
                        </Button>
                      )}
                      {icon.svg_key && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs border border-black rounded flex-1"
                          onClick={() => handleDownloadSvg(icon.svg_key!)}
                        >
                          SVG
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 p-1"
                        onClick={() => handleDeleteIcon(icon.id)}
                      >
                        <HiTrash className="h-3 w-3" />
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

  // Default library view - show user's generated packs
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Library</h1>
            <p className="text-sm text-zinc-500">Your saved icons</p>
          </div>
        </div>

        {isLoadingPacks ? (
          <div className="text-center py-12 text-zinc-500">Loading...</div>
        ) : userPacks.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-zinc-200">
              <HiCheck className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">No icons yet</h2>
            <p className="text-zinc-500 text-sm sm:text-base">Start generating icons to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {userPacks.map((pack) => (
              <Card
                key={pack.id}
                className="bg-white rounded-xl border-2 border-black brutalist-shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/library?pack=${pack.id}`)}
              >
                <div className="aspect-square p-3 sm:p-4 flex items-center justify-center bg-zinc-50">
                  {pack.preview ? (
                    <img src={pack.preview} alt={pack.prompt} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-zinc-200 rounded-lg" />
                  )}
                </div>
                <div className="p-2 sm:p-3 border-t border-zinc-100">
                  <p className="text-xs sm:text-sm font-medium text-zinc-900 truncate mb-1">
                    {pack.prompt}
                  </p>
                  <p className="text-xs text-zinc-500">{pack.iconCount} icons</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Main page component that wraps LibraryContent with Suspense
export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <LibraryContent />
    </Suspense>
  )
}