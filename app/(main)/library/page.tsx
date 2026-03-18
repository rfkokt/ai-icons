"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { HiArrowLeft, HiSparkles, HiFolderOpen, HiTrash } from "react-icons/hi2"
import { FeatureCarousel } from "@/components/ui/feature-carousel"
import { IconCard } from "@/components/icon-card"
import { PackCard } from "@/components/pack-card"
import { EmptyState } from "@/components/empty-state"
import { IconActions } from "@/components/icon-actions"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useDownload } from "@/hooks/use-download"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
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
  const [icons, setIcons] = useState<PackIcon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [packPrompt, setPackPrompt] = useState("")
  const router = useRouter()

  const [userPacks, setUserPacks] = useState<HistoryPack[]>([])
  const [isLoadingPacks, setIsLoadingPacks] = useState(true)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packToDelete, setPackToDelete] = useState<{ id: string; prompt: string } | null>(null)
  const [deletePackDialogOpen, setDeletePackDialogOpen] = useState(false)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIconIndex, setCurrentIconIndex] = useState(0)
  const { download } = useDownload()

  useEffect(() => {
    if (packId) {
      fetchPackIcons(packId)
    } else {
      fetchPacks()
    }
  }, [packId])

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

  const handleDownloadPack = async (packId: string, format: "png" | "svg") => {
    try {
      toast.loading(`Downloading ${format.toUpperCase()} pack...`)
      const downloadUrl = `/api/pack/${packId}/download?format=${format}`
      const response = await fetch(downloadUrl)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to download")
      }

      const contentDisposition = response.headers.get("Content-Disposition")
      let filename = `pack-icons.${format}.zip`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/)
        if (match?.[1]) filename = match[1]
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Pack downloaded as ${format.toUpperCase()}!`)
    } catch (error) {
      console.error("Download pack error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to download pack")
    }
  }

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
        <div className="bg-[#B9FF66] border-b-4 border-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  className="bg-white border-3 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  onClick={() => router.back()}
                >
                  <HiArrowLeft className="h-5 w-5 text-black" />
                </button>
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

        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-40 sm:pb-12">
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
              <EmptyState
                variant="brutalist"
                icon={<HiFolderOpen className="h-10 w-10 text-zinc-400" />}
                title="No icons yet"
                description="Generate some icons to fill this pack!"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {icons.map((icon, index) => (
                  <IconCard
                    key={icon.id}
                    id={icon.id}
                    src={icon.png_key ? `/api/download/${encodeURIComponent(icon.png_key)}` : undefined}
                    alt={icon.prompt}
                    prompt={icon.prompt}
                    format={icon.png_key || undefined}
                    variant="library"
                    onClick={() => openLightbox(index)}
                    onShare={() => handleShareToCommunity(icon.id)}
                    onDelete={() => handleDeleteIcon(icon.id)}
                    showActionBar
                  />
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
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full border-2 border-black">
                <span className="text-sm font-bold text-zinc-700">{currentIconIndex + 1} / {icons.length}</span>
              </div>
              {icons[currentIconIndex] && (
                <IconActions
                  iconKey={icons[currentIconIndex].png_key!}
                  prompt={icons[currentIconIndex].prompt}
                  onShare={() => handleShareToCommunity(icons[currentIconIndex].id)}
                  onDelete={() => handleDeleteIcon(icons[currentIconIndex].id)}
                />
              )}
            </div>
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
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 overflow-y-auto">
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
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white border-3 border-black rounded-xl px-4 py-2 shadow-[3px_3px_0px_0px_#000000]">
              <span className="text-sm font-bold text-zinc-700">
                {userPacks.reduce((sum, p) => sum + p.iconCount, 0)} total icons
              </span>
            </div>
            <button
              className="bg-black text-white border-3 border-black rounded-xl px-4 py-2 shadow-[3px_3px_0px_0px_#B9FF66] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              onClick={() => router.push("/generate")}
            >
              <span className="text-sm font-bold">
                Start creating →
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-40 sm:pb-12">
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
            <EmptyState
              variant="brutalist"
              icon={<HiSparkles className="h-12 w-12 text-black" />}
              title="Your library is empty"
              description="Start generating icons to see them appear here"
              action={{
                label: "Generate Icons",
                onClick: () => router.push("/generate"),
                icon: <HiSparkles className="h-5 w-5" />
              }}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {userPacks.map((pack) => (
                <PackCard
                  key={pack.id}
                  id={pack.id}
                  preview={pack.preview}
                  prompt={pack.prompt}
                  iconCount={pack.iconCount}
                  onClick={() => router.push(`/library?pack=${pack.id}`)}
                  onShare={() => handleShareToCommunity(pack.id)}
                  onDownloadPng={() => handleDownloadPack(pack.id, "png")}
                  onDownloadSvg={() => handleDownloadPack(pack.id, "svg")}
                  onDelete={() => {
                    setPackToDelete({ id: pack.id, prompt: pack.prompt })
                    setDeleteDialogOpen(true)
                  }}
                />
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
