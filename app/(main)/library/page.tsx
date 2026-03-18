"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiEllipsisVertical, HiArrowDownTray, HiTrash, HiCheck, HiArrowLeft, HiShare, HiChevronLeft, HiChevronRight } from "react-icons/hi2"
import { FeatureCarousel } from "@/components/ui/feature-carousel"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"

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

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packToDelete, setPackToDelete] = useState<{ id: string; prompt: string } | null>(null)
  const [deletePackDialogOpen, setDeletePackDialogOpen] = useState(false)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIconIndex, setCurrentIconIndex] = useState(0)

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
    const downloadUrl = `/api/download/${encodeURIComponent(key)}?format=png`
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = key.split("/").pop() || "icon.png"
    a.click()
    toast.success("PNG downloading...")
    setActiveMenuId(null)
  }

  const handleDownloadSvg = (key: string) => {
    const downloadUrl = `/api/download/${encodeURIComponent(key)}?format=svg`
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = key.split("/").pop()?.replace(".png", ".svg") || "icon.svg"
    a.click()
    toast.success("SVG downloading...")
    setActiveMenuId(null)
  }

  const openLightbox = (index: number) => {
    setCurrentIconIndex(index)
    setLightboxOpen(true)
  }
  const goToPrevIcon = () => {
    setCurrentIconIndex((prev) => (prev === 0 ? icons.length - 1 : prev - 1))
  }

  const goToNextIcon = () => {
    setCurrentIconIndex((prev) => (prev === icons.length - 1 ? 0 : prev + 1))
  }

  const handleShareToCommunity = async (iconId: string) => {
    try {
      const response = await fetch(`/api/icon/${iconId}/share`, { method: "POST" })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.error || "Failed to share")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  // Pack view
  if (packId) {
    const handleDeletePack = async () => {
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
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 border-2 border-black rounded-xl hover:bg-[#B9FF66] hover:border-[#B9FF66]"
                onClick={() => router.back()}
              >
                <HiArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-zinc-900">{packPrompt || "Pack"}</h1>
                <p className="text-sm text-zinc-500 mt-0.5">{icons.length} icons generated</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-medium"
              onClick={() => setDeletePackDialogOpen(true)}
            >
              <HiTrash className="h-4 w-4 mr-2" />
              Delete Pack
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-zinc-200 aspect-square rounded-2xl mb-3" />
                  <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2" />
                  <div className="h-8 bg-zinc-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
              {icons.map((icon, index) => (
                <Card
                  key={icon.id}
                  className={cn(
                    "group bg-white rounded-xl border-2 border-black brutalist-shadow-sm overflow-hidden hover:brutalist-shadow hover:-translate-y-0.5 hover:translate-x-0.5 transition-all duration-150 cursor-pointer",
                    isSelectMode && selectedIds.includes(icon.id) && "ring-4 ring-[#B9FF66]"
                  )}
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-square p-2 sm:p-3 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 relative">
                    {icon.png_key ? (
                      <img
                        src={`/api/download/${encodeURIComponent(icon.png_key)}`}
                        alt={icon.prompt}
                        className="max-w-[90%] max-h-[90%] object-contain drop-shadow-sm"
                      />
                    ) : (
                      <div className="text-zinc-400 text-xs">No preview</div>
                    )}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="absolute top-1 right-1 h-6 w-6 bg-white/90 hover:bg-white text-zinc-500 hover:text-zinc-900 rounded-md border border-zinc-200 z-10 inline-flex items-center justify-center cursor-pointer opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HiEllipsisVertical className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-white border-2 border-black rounded-xl z-50" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => handleDownloadPng(icon.png_key!)} className="cursor-pointer rounded-lg">
                          <HiArrowDownTray className="h-4 w-4 mr-2" />
                          Download PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadSvg(icon.png_key!)} className="cursor-pointer rounded-lg">
                          <HiArrowDownTray className="h-4 w-4 mr-2" />
                          Download SVG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareToCommunity(icon.id)} className="cursor-pointer rounded-lg">
                          <HiShare className="h-4 w-4 mr-2" />
                          Share to Community
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteIcon(icon.id)} className="cursor-pointer text-red-500 focus:text-red-500 rounded-lg">
                          <HiTrash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <ConfirmDialog
          open={deletePackDialogOpen}
          onOpenChange={setDeletePackDialogOpen}
          title="Delete Pack"
          description={`Are you sure you want to delete this pack? This will remove all ${icons.length} icons in this pack.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={handleDeletePack}
        />

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-4xl w-full bg-white border-2 border-black rounded-2xl p-6">
            <FeatureCarousel
              images={icons.map((icon) => ({
                src: icon.png_key ? `/api/download/${encodeURIComponent(icon.png_key)}` : '',
                alt: icon.prompt,
              })).filter(img => img.src)}
              currentIndex={currentIconIndex}
              onNext={goToNextIcon}
              onPrev={goToPrevIcon}
              onIndexChange={setCurrentIconIndex}
            />
            <div className="text-center mt-2">
              <p className="text-sm text-zinc-500">{currentIconIndex + 1} / {icons.length}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Default library view - show user's generated packs
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-zinc-900">Library</h1>
            <p className="text-sm sm:text-base text-zinc-500 mt-1">Your saved icon packs</p>
          </div>
        </div>

        {isLoadingPacks ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-200 aspect-square rounded-2xl mb-3" />
                <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-zinc-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : userPacks.length === 0 ? (
          <div className="text-center py-20 sm:py-28">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-zinc-100 rounded-3xl border-2 border-zinc-200 mb-6">
              <HiCheck className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-900 mb-3">No icons yet</h2>
            <p className="text-zinc-500 text-base sm:text-lg max-w-md mx-auto">Start generating icons to see them appear here</p>
          </div>
          ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
            {userPacks.map((pack) => (
              <div key={pack.id} className="group relative">
                <DropdownMenu>
                  <DropdownMenuTrigger className="absolute -top-1 -right-1 h-7 w-7 bg-white hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 opacity-0 group-hover:opacity-100 transition-all duration-150 rounded-lg border-2 border-black inline-flex items-center justify-center cursor-pointer z-10">
                    <HiEllipsisVertical className="h-3.5 w-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40 bg-white border-2 border-black rounded-xl z-20">
                    <DropdownMenuItem onClick={() => handleShareToCommunity(pack.id)} className="cursor-pointer rounded-lg">
                      <HiShare className="h-4 w-4 mr-2" />
                      Share to Community
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500 focus:text-red-500 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPackToDelete({ id: pack.id, prompt: pack.prompt })
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <HiTrash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="absolute -top-1 -left-1 z-10">
                  <span className="inline-flex items-center px-2 py-0.5 bg-[#B9FF66] text-zinc-900 text-[10px] font-bold rounded-md border-2 border-black">
                    {pack.iconCount}
                  </span>
                </div>
                <Card
                  className="bg-white rounded-xl border-2 border-black brutalist-shadow-sm overflow-hidden hover:brutalist-shadow hover:-translate-y-0.5 hover:translate-x-0.5 transition-all duration-150 cursor-pointer"
                  onClick={() => router.push(`/library?pack=${pack.id}`)}
                >
                  <div className="aspect-square p-2 sm:p-3 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 relative overflow-hidden">
                    {pack.preview ? (
                      <img src={pack.preview} alt={pack.prompt} className="max-w-[85%] max-h-[85%] object-contain drop-shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-200 rounded-lg" />
                    )}
                    <div className="absolute inset-0 bg-[#B9FF66]/0 group-hover:bg-[#B9FF66]/10 transition-colors duration-150" />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Pack"
        description={`Are you sure you want to delete "${packToDelete?.prompt}"? This will remove all icons in this pack.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (!packToDelete) return
          fetch(`/api/pack/${packToDelete.id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setUserPacks(prev => prev.filter(p => p.id !== packToDelete.id))
                toast.success("Pack deleted")
              } else {
                toast.error("Failed to delete pack")
              }
            })
            .catch(() => toast.error("Something went wrong"))
        }}
      />
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