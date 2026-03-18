"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiEllipsisVertical, HiArrowDownTray, HiTrash, HiArrowLeft, HiShare, HiSparkles, HiFolderOpen } from "react-icons/hi2"
import { FeatureCarousel } from "@/components/ui/feature-carousel"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import gsap from "gsap"

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

  // Animate cards on load
  useEffect(() => {
    if (!isLoadingPacks && userPacks.length > 0 && !packId) {
      gsap.from(".pack-card", {
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.7)",
      })
    }
    if (!isLoading && icons.length > 0 && packId) {
      gsap.from(".icon-card", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.7)",
      })
    }
  }, [isLoading, isLoadingPacks, packId, userPacks.length, icons.length])

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
      <div className="flex-1 min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 overflow-y-auto">
        {/* Hero Header */}
        <div className="bg-[#B9FF66] border-b-4 border-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white border-3 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer" onClick={() => router.back()}>
                  <HiArrowLeft className="h-5 w-5 text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                      Pack
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-black">
                      {packPrompt || "Untitled Pack"}
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-zinc-800 mt-1 flex items-center gap-2">
                    <HiSparkles className="h-4 w-4" />
                    {icons.length} icons generated
                  </p>
                </div>
              </div>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white border-3 border-black rounded-xl px-5 py-2.5 font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                onClick={() => setDeletePackDialogOpen(true)}
              >
                <HiTrash className="h-4 w-4 mr-2" />
                Delete Pack
              </Button>
            </div>
          </div>
        </div>

        {/* Icons Grid */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-zinc-200 aspect-square rounded-2xl border-2 border-black" />
                  </div>
                ))}
              </div>
            ) : icons.length === 0 ? (
              <div className="text-center py-16 sm:py-24">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-100 rounded-3xl border-3 border-black mb-6 shadow-[6px_6px_0px_0px_#000000]">
                  <HiFolderOpen className="h-10 w-10 text-zinc-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-zinc-900 mb-3">No icons yet</h2>
                <p className="text-zinc-500">Generate some icons to fill this pack!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {icons.map((icon, index) => (
                  <div
                    key={icon.id}
                    className="icon-card group relative"
                  >
                    {/* Quick Actions - Always visible on mobile, hover on desktop */}
                    <div className="absolute -top-3 -right-3 z-20 flex flex-col gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadPng(icon.png_key!)
                        }}
                        className="h-7 w-7 bg-[#B9FF66] hover:bg-[#a8e655] border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                        title="Download PNG"
                      >
                        <HiArrowDownTray className="h-3.5 w-3.5 text-black" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="h-7 w-7 bg-white hover:bg-zinc-50 border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HiEllipsisVertical className="h-3.5 w-3.5 text-zinc-700" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
                          <DropdownMenuItem onClick={() => handleDownloadSvg(icon.png_key!)} className="cursor-pointer py-2.5 rounded-lg">
                            <HiArrowDownTray className="h-4 w-4 mr-2" />
                            <span className="font-medium">Download SVG</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareToCommunity(icon.id)} className="cursor-pointer py-2.5 rounded-lg">
                            <HiShare className="h-4 w-4 mr-2" />
                            <span className="font-medium">Share to Community</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteIcon(icon.id)} className="cursor-pointer text-red-600 focus:text-red-600 py-2.5 rounded-lg">
                            <HiTrash className="h-4 w-4 mr-2" />
                            <span className="font-medium">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Icon Card */}
                    <Card
                      className={cn(
                        "aspect-square bg-white rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-200 cursor-pointer overflow-hidden",
                        isSelectMode && selectedIds.includes(icon.id) && "ring-4 ring-[#B9FF66]"
                      )}
                      onClick={() => openLightbox(index)}
                    >
                      <div className="aspect-square p-3 flex items-center justify-center bg-gradient-to-br from-white via-zinc-50 to-zinc-100 relative">
                        {icon.png_key ? (
                          <img
                            src={`/api/download/${encodeURIComponent(icon.png_key)}`}
                            alt={icon.prompt}
                            className="max-w-[85%] max-h-[85%] object-contain"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-zinc-200 rounded-xl border-2 border-zinc-300 flex items-center justify-center">
                            <HiSparkles className="h-6 w-6 text-zinc-400" />
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-[#B9FF66]/0 group-hover:bg-[#B9FF66]/10 transition-colors duration-200 pointer-events-none" />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <DialogContent className="max-w-4xl w-full bg-white border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] p-6">
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
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full border-2 border-black mb-4">
                <span className="text-sm font-bold text-zinc-700">{currentIconIndex + 1} / {icons.length}</span>
              </div>
              {icons[currentIconIndex] && (
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button
                    className="bg-white hover:bg-[#B9FF66] border-3 border-black rounded-xl px-6 py-3 text-base font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    onClick={() => {
                      const icon = icons[currentIconIndex]
                      if (icon.png_key) {
                        const downloadUrl = `/api/download/${encodeURIComponent(icon.png_key)}?format=png`
                        const a = document.createElement("a")
                        a.href = downloadUrl
                        a.download = `${icon.prompt.replace(/\s+/g, "-")}.png`
                        a.click()
                        toast.success("PNG downloading...")
                      }
                    }}
                  >
                    <HiArrowDownTray className="h-5 w-5 mr-2" />
                    PNG
                  </Button>
                  <Button
                    className="bg-white hover:bg-[#B9FF66] border-3 border-black rounded-xl px-6 py-3 text-base font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    onClick={() => {
                      const icon = icons[currentIconIndex]
                      if (icon.png_key) {
                        const downloadUrl = `/api/download/${encodeURIComponent(icon.png_key)}?format=svg`
                        const a = document.createElement("a")
                        a.href = downloadUrl
                        a.download = `${icon.prompt.replace(/\s+/g, "-")}.svg`
                        a.click()
                        toast.success("SVG downloading...")
                      }
                    }}
                  >
                    <HiArrowDownTray className="h-5 w-5 mr-2" />
                    SVG
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Default library view - show user's generated packs
  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 overflow-y-auto">
      {/* Hero Header */}
      <div className="bg-[#B9FF66] border-b-4 border-black px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-black text-white p-3 rounded-2xl shadow-[4px_4px_0px_0px_#B9FF66]">
              <HiFolderOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-black">
                Your Library
              </h1>
              <p className="text-base sm:text-lg font-medium text-zinc-800 mt-1">
                {userPacks.length} pack{userPacks.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          {/* Stats Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white border-3 border-black rounded-xl px-4 py-2 shadow-[3px_3px_0px_0px_#000000]">
              <span className="text-sm font-bold text-zinc-700">
                {userPacks.reduce((sum, p) => sum + p.iconCount, 0)} total icons
              </span>
            </div>
            <div className="bg-black text-white border-3 border-black rounded-xl px-4 py-2 shadow-[3px_3px_0px_0px_#B9FF66]">
              <span className="text-sm font-bold">
                Start creating →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {isLoadingPacks ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-zinc-200 aspect-square rounded-2xl border-3 border-black" />
                </div>
              ))}
            </div>
          ) : userPacks.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-[#B9FF66] rounded-3xl border-3 border-black mb-6 shadow-[6px_6px_0px_0px_#000000]">
                <HiSparkles className="h-12 w-12 text-black" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 mb-4">
                Your library is empty
              </h2>
              <p className="text-zinc-500 text-lg max-w-md mx-auto mb-6">
                Start generating icons to see them appear here
              </p>
              <Button
                className="bg-[#B9FF66] hover:bg-[#a8e655] text-black border-3 border-black rounded-xl px-8 py-3 text-lg font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                onClick={() => router.push("/generate")}
              >
                <HiSparkles className="h-5 w-5 mr-2" />
                Generate Icons
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {userPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="pack-card group relative"
                >
                  {/* Quick Actions - Always visible on mobile, hover on desktop */}
                  <div className="absolute -top-3 -right-3 z-20 flex gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="h-8 w-8 bg-white hover:bg-zinc-50 border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <HiEllipsisVertical className="h-4 w-4 text-zinc-700" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
                        <DropdownMenuItem onClick={() => handleShareToCommunity(pack.id)} className="cursor-pointer py-2.5 rounded-lg">
                          <HiShare className="h-4 w-4 mr-2" />
                          <span className="font-medium">Share to Community</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600 py-2.5 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPackToDelete({ id: pack.id, prompt: pack.prompt })
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <HiTrash className="h-4 w-4 mr-2" />
                          <span className="font-medium">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Icon Count Badge */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className="bg-[#B9FF66] border-3 border-black rounded-xl px-2.5 py-1 shadow-[3px_3px_0px_0px_#000000]">
                      <span className="text-xs font-black text-black">{pack.iconCount}</span>
                    </div>
                  </div>

                  {/* Pack Card */}
                  <Card
                    className="bg-white rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() => router.push(`/library?pack=${pack.id}`)}
                  >
                    <div className="aspect-square p-4 flex items-center justify-center bg-gradient-to-br from-white via-zinc-50 to-zinc-100 relative">
                      {pack.preview ? (
                        <img src={pack.preview} alt={pack.prompt} className="max-w-[80%] max-h-[80%] object-contain" />
                      ) : (
                        <div className="w-16 h-16 bg-zinc-200 rounded-2xl border-2 border-zinc-300 flex items-center justify-center">
                          <HiSparkles className="h-8 w-8 text-zinc-400" />
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#B9FF66]/0 group-hover:bg-[#B9FF66]/10 transition-colors duration-200 pointer-events-none" />
                    </div>
                    {/* Pack Title */}
                    <div className="p-3 bg-white border-t-2 border-black">
                      <p className="text-xs font-bold text-zinc-800 truncate">{pack.prompt}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
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
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-4 border-black border-t-[#B9FF66] rounded-full mb-4" />
          <p className="text-lg font-bold text-zinc-700">Loading library...</p>
        </div>
      </div>
    }>
      <LibraryContent />
    </Suspense>
  )
}
