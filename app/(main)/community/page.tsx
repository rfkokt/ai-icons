"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { HiClock, HiBolt, HiArrowLeft, HiArrowDownTray, HiTrash } from "react-icons/hi2"
import { IconCard } from "@/components/icon-card"
import { PackCard } from "@/components/pack-card"
import { FilterTabs } from "@/components/filter-tabs"
import { IconGrid } from "@/components/icon-grid"
import { PageLoading } from "@/components/page-loading"
import { EmptyState } from "@/components/empty-state"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FeatureCarousel } from "@/components/ui/feature-carousel"
import { HeartSmooth } from "@/components/icons/heart-smooth"
import { useLightbox } from "@/hooks/use-lightbox"
import { useStaggerAnimation } from "@/hooks/use-stagger-animation"
import { useRouter } from "next/navigation"
import { useDownload } from "@/hooks/use-download"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "sonner"
import type { CommunityIcon, CommunityPack } from "@/types/icon"

type FilterType = "latest" | "mostLoved"

function CommunityContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const packPrompt = searchParams.get("pack")
  const [filter, setFilter] = useState<FilterType>("latest")
  const [packs, setPacks] = useState<CommunityPack[]>([])
  const [selectedPackIcons, setSelectedPackIcons] = useState<CommunityIcon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPack, setIsLoadingPack] = useState(false)
  const [animatingHeart, setAnimatingHeart] = useState<string | null>(null)
  const { download } = useDownload()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packToDelete, setPackToDelete] = useState<{ id: string; prompt: string } | null>(null)

  const lightbox = useLightbox(selectedPackIcons.length)

  const staggerRef = useStaggerAnimation([isLoading, isLoadingPack, packPrompt], {
    selector: ".pack-card, .icon-card",
    y: 60,
    duration: 0.6,
    stagger: 0.08
  })

  useEffect(() => {
    fetchCommunityPacks()
  }, [filter])

  useEffect(() => {
    if (packPrompt) {
      fetchPackIcons(packPrompt)
    } else {
      setSelectedPackIcons([])
    }
  }, [packPrompt])

  const fetchCommunityPacks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/community-packs?sort=${filter}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setPacks(data)
    } catch (error) {
      console.error("Failed to fetch community packs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPackIcons = async (prompt: string) => {
    setIsLoadingPack(true)
    try {
      const response = await fetch(`/api/icons?prompt=${encodeURIComponent(prompt)}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data: CommunityIcon[] = await response.json()
      setSelectedPackIcons(data)
    } catch (error) {
      console.error("Failed to fetch pack icons:", error)
    } finally {
      setIsLoadingPack(false)
    }
  }

  const handleLikePack = (packId: string) => {
    const pack = packs.find(p => p.id === packId)
    if (!pack) return

    const newLikedState = !pack.isLiked
    const previousState = pack.isLiked
    const previousCount = pack.totalLikes

    setPacks(prevPacks =>
      prevPacks.map(p =>
        p.id === packId
          ? { ...p, totalLikes: newLikedState ? p.totalLikes + 1 : p.totalLikes - 1, isLiked: newLikedState }
          : p
      )
    )

    if (newLikedState) {
      setAnimatingHeart(packId)
      setTimeout(() => setAnimatingHeart(null), 600)
    }

    fetch(`/api/pack/${encodeURIComponent(packId)}/like`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPacks(prevPacks =>
            prevPacks.map(p =>
              p.id === packId
                ? { ...p, totalLikes: data.likeCount ?? p.totalLikes, isLiked: data.liked }
                : p
            )
          )
        } else {
          setPacks(prevPacks =>
            prevPacks.map(p =>
              p.id === packId
                ? { ...p, totalLikes: previousCount, isLiked: previousState }
                : p
            )
          )
        }
      })
      .catch(() => {
        setPacks(prevPacks =>
          prevPacks.map(p =>
            p.id === packId
              ? { ...p, totalLikes: previousCount, isLiked: previousState }
              : p
          )
        )
      })
  }

  const handleDeletePack = (packId: string, prompt: string) => {
    setPackToDelete({ id: packId, prompt })
    setDeleteDialogOpen(true)
  }

  const confirmDeletePack = async () => {
    if (!packToDelete) return
    try {
      const response = await fetch(`/api/community-pack/${encodeURIComponent(packToDelete.id)}/delete`, {
        method: "POST"
      })
      const data = await response.json()
      if (data.success) {
        toast.success("Pack unshared successfully")
        setPacks(prev => prev.filter(p => p.id !== packToDelete.id))
      } else {
        toast.error(data.error || "Failed to unshare pack")
      }
    } catch {
      toast.error("Something went wrong")
    }
    setDeleteDialogOpen(false)
    setPackToDelete(null)
  }

  const handleDownloadPng = (pack: CommunityPack) => {
    if (pack.pngKeys && pack.pngKeys.length > 0) {
      pack.pngKeys.forEach((key, i) => {
        setTimeout(() => download(key, `${pack.prompt}-${i + 1}`, "png"), i * 200)
      })
    }
  }

  const handleDownloadSvg = (pack: CommunityPack) => {
    if (pack.pngKeys && pack.pngKeys.length > 0) {
      pack.pngKeys.forEach((key, i) => {
        setTimeout(() => download(key, `${pack.prompt}-${i + 1}`, "svg"), i * 200)
      })
    }
  }

  if (packPrompt && selectedPackIcons.length > 0) {
    return (
      <div className="flex-1 min-h-screen bg-[#f3f4f6] bg-grid-pattern overflow-y-auto">
        <div className="bg-[#B9FF66] border-b-4 border-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  className="bg-white border-3 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  onClick={() => router.push("/community")}
                >
                  <HiArrowLeft className="h-5 w-5 text-black" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0">
                      Pack
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-black truncate">
                      {packPrompt.length > 40 ? packPrompt.slice(0, 40) + "…" : packPrompt}
                    </h1>
                  </div>
                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <p className="text-sm sm:text-base font-medium text-zinc-800 flex items-center gap-2">
                      <HiBolt className="h-4 w-4" />
                      {selectedPackIcons.length} community icons
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-40 sm:pb-12">
          <div className="max-w-7xl mx-auto" ref={staggerRef}>
            {isLoadingPack ? (
              <PageLoading message="Loading icons..." />
            ) : selectedPackIcons.length === 0 ? (
              <EmptyState
                variant="brutalist"
                icon={<HiBolt className="h-10 w-10 text-zinc-400" />}
                title="No icons found"
                description="This pack doesn't have any shared icons yet."
              />
            ) : (
              <IconGrid>
                {selectedPackIcons.map((icon, index) => (
                  <IconCard
                    key={icon.id}
                    id={icon.id}
                    src={icon.src}
                    prompt={icon.prompt}
                    format={icon.format as any}
                    variant="community"
                    showMeta={false}
                    onClick={() => lightbox.open(index)}
                    onDownloadPng={icon.src ? () => { 
                      const key = icon.src!.replace('/api/download/', ''); 
                      download(key, `${icon.prompt}-${index + 1}`, "png") 
                    } : undefined}
                    onDownloadSvg={icon.src ? () => { 
                      const key = icon.src!.replace('/api/download/', ''); 
                      download(key, `${icon.prompt}-${index + 1}`, "svg") 
                    } : undefined}
                    onDelete={icon.isOwner ? () => { setPackToDelete({ id: packPrompt!, prompt: packPrompt! }); setDeleteDialogOpen(true) } : undefined}
                    isOwner={icon.isOwner}
                  />
                ))}
              </IconGrid>
            )}
          </div>
        </div>

        <Dialog open={lightbox.isOpen} onOpenChange={lightbox.close}>
          <DialogContent className="max-w-4xl w-full bg-white border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] p-6">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-black bg-zinc-50 relative z-10 min-h-[72px]">
              {/* Left Badge */}
              <div className="flex-shrink-0 z-10">
                <div className="inline-flex items-center justify-center min-w-[4rem] px-3 py-1.5 bg-zinc-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-sm font-bold text-zinc-700">
                  {lightbox.currentIndex + 1} / {selectedPackIcons.length}
                </div>
              </div>

              {/* Center Title */}
              {packPrompt && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[40%] text-center z-0 hidden sm:block">
                  <h3 className="font-bold text-base sm:text-lg truncate text-zinc-800 px-4">
                    {packPrompt}
                  </h3>
                </div>
              )}
              
              {/* Right Placeholder to align perfectly since Community has no IconActions in header */}
              <div className="flex-shrink-0 w-10 pr-10 sm:pr-12"></div>
            </div>
            <FeatureCarousel
              images={selectedPackIcons.map((icon) => ({
                src: icon.src || '',
                alt: icon.prompt,
              })).filter(img => img.src)}
              currentIndex={lightbox.currentIndex}
              onNext={lightbox.goToNext}
              onPrev={lightbox.goToPrev}
              onIndexChange={lightbox.setCurrentIndex}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-[#f3f4f6] bg-grid-pattern overflow-y-auto">
      <header className="h-auto sm:h-14 bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 shrink-0 sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Community</h1>
          <p className="text-xs text-zinc-500 hidden sm:block">Explore icons created by the community</p>
        </div>
        <FilterTabs
          tabs={[
            { key: "latest", label: "Latest", icon: <HiClock className="h-4 w-4" /> },
            {
              key: "mostLoved",
              label: "Most Loved",
              icon: <HeartSmooth style={{ width: "20px", height: "20px" }} />
            }
          ]}
          activeTab={filter}
          onTabChange={(key) => setFilter(key as FilterType)}
          className="w-full sm:w-auto"
        />
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-40 sm:pb-12">
        <div className="max-w-7xl mx-auto" ref={staggerRef}>
          {isLoading ? (
            <PageLoading message="Loading community packs..." />
          ) : packs.length === 0 ? (
            <EmptyState
              variant="brutalist"
              icon={
                <svg className="h-12 w-12 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06a5.5 5.5 0 0 0 7.78-7.78l-1.06-1.06a5.5 5.5 0 0 0-7.78 0z" />
                </svg>
              }
              title="No community icons yet"
              description="Be the first to share your icons with the community!"
            />
          ) : (
            <IconGrid>
              {packs.map((pack) => (
                <PackCard
                  key={pack.id}
                  id={pack.id}
                  preview={pack.preview}
                  prompt={pack.prompt}
                  iconCount={pack.iconCount}
                  onClick={() => router.push(`/community?pack=${encodeURIComponent(pack.prompt)}`)}
                  onDownloadPng={() => handleDownloadPng(pack)}
                  onDownloadSvg={() => handleDownloadSvg(pack)}
                  onDelete={pack.isOwner ? () => handleDeletePack(pack.id, pack.prompt) : undefined}
                  showActionBar={true}
                  sharedBy={pack.sharedBy}
                  sharedByAvatar={pack.sharedByAvatar}
                  showSharedBy={true}
                  totalLikes={pack.totalLikes}
                  isLiked={pack.isLiked}
                  onLike={() => handleLikePack(pack.id)}
                  variant="community"
                />
              ))}
            </IconGrid>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Unshare Pack"
        description={`Are you sure you want to unshare "${packToDelete?.prompt}"? This will remove it from the community.`}
        confirmText="Unshare"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDeletePack}
      />
    </div>
  )
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<PageLoading message="Loading community..." />}>
      <CommunityContent />
    </Suspense>
  )
}
