"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { HiArrowLeft, HiSparkles } from "react-icons/hi2"
import { FeatureCarousel } from "@/components/ui/feature-carousel"
import { IconCard } from "@/components/icon-card"
import { PackCard } from "@/components/pack-card"
import { EmptyState } from "@/components/empty-state"
import { IconActions } from "@/components/icon-actions"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { PageHeader } from "@/components/page-header"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { IconGrid } from "@/components/icon-grid"
import { PageLoading } from "@/components/page-loading"
import { useLightbox } from "@/hooks/use-lightbox"
import { useStaggerAnimation } from "@/hooks/use-stagger-animation"
import { usePacks } from "@/hooks/use-packs"
import { usePackIcons } from "@/hooks/use-pack-icons"
import { useDeletePack } from "@/hooks/use-delete-pack"
import { useSelectMode } from "@/hooks/use-select-mode"
import { useShareIcon } from "@/hooks/use-share-icon"
import { useDownload } from "@/hooks/use-download"
import { toast } from "sonner"

function LibraryContent() {
  const searchParams = useSearchParams()
  const packId = searchParams.get("pack")
  const router = useRouter()

  const { download } = useDownload()
  const { shareToCommunity } = useShareIcon()
  const { deletePack, deleteIconFromPack } = useDeletePack()
  
  const { packs, setPacks, isLoading: isLoadingPacks, totalIcons } = usePacks()
  const { 
    icons, setIcons, packPrompt, isLoading: isLoadingIcons, 
    removeIcon 
  } = usePackIcons(packId)
  
  const { isSelectMode, selectedIds, toggleSelectMode, toggleSelect, isSelected } = useSelectMode<string>()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packToDelete, setPackToDelete] = useState<{ id: string; prompt: string } | null>(null)
  const [deletePackDialogOpen, setDeletePackDialogOpen] = useState(false)

  const lightbox = useLightbox(icons.length)

  const staggerRef = useStaggerAnimation([isLoadingPacks, isLoadingIcons, packId], {
    selector: ".pack-card, .icon-card",
    y: 60,
    duration: 0.6,
    stagger: 0.08
  })

  const handleDeletePack = async () => {
    if (!packId) return
    const success = await deletePack(packId)
    if (success) {
      router.push("/library")
    }
  }

  const handleDeleteIcon = async (iconId: string) => {
    const success = await deleteIconFromPack(packId!, iconId)
    if (success) {
      removeIcon(iconId)
    }
  }

  if (packId) {
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
                <HiSparkles className="h-4 w-4 mr-2" />
                Delete Pack
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-40 sm:pb-12">
          <div className="max-w-7xl mx-auto" ref={staggerRef}>
            {isLoadingIcons ? (
              <LoadingSkeleton count={12} />
            ) : icons.length === 0 ? (
              <EmptyState
                variant="brutalist"
                icon={<HiSparkles className="h-10 w-10 text-zinc-400" />}
                title="No icons yet"
                description="Generate some icons to fill this pack!"
              />
            ) : (
              <IconGrid>
                {icons.map((icon, index) => (
                  <IconCard
                    key={icon.id}
                    id={icon.id}
                    src={icon.png_key ? `/api/download/${encodeURIComponent(icon.png_key)}` : undefined}
                    alt={icon.prompt}
                    prompt={icon.prompt}
                    format={icon.png_key || undefined}
                    variant="library"
                    onClick={() => lightbox.open(index)}
                    onShare={() => shareToCommunity(icon.id)}
                    onDelete={() => handleDeleteIcon(icon.id)}
                    showActionBar
                  />
                ))}
              </IconGrid>
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

        <Dialog open={lightbox.isOpen} onOpenChange={lightbox.close}>
          <DialogContent className="max-w-4xl w-full bg-white border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full border-2 border-black">
                <span className="text-sm font-bold text-zinc-700">{lightbox.currentIndex + 1} / {icons.length}</span>
              </div>
              {icons[lightbox.currentIndex] && (
                <IconActions
                  iconKey={icons[lightbox.currentIndex].png_key!}
                  prompt={icons[lightbox.currentIndex].prompt}
                  onShare={() => shareToCommunity(icons[lightbox.currentIndex].id)}
                  onDelete={() => handleDeleteIcon(icons[lightbox.currentIndex].id)}
                />
              )}
            </div>
            <FeatureCarousel
              images={icons.map((icon) => ({
                src: icon.png_key ? `/api/download/${encodeURIComponent(icon.png_key)}` : '',
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
    <div className="flex-1 min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 overflow-y-auto" ref={staggerRef}>
      <PageHeader
        icon={<HiSparkles className="h-8 w-8" />}
        title="Your Library"
        variant="lime"
        stats={[
          { label: "packs saved", value: packs.length },
          { label: "total icons", value: totalIcons }
        ]}
        actions={
          <button
            className="bg-black text-white border-3 border-black rounded-xl px-4 py-2 shadow-[3px_3px_0px_0px_#B9FF66] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            onClick={() => router.push("/generate")}
          >
            <span className="text-sm font-bold">Start creating →</span>
          </button>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-40 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          {isLoadingPacks ? (
            <LoadingSkeleton count={8} />
          ) : packs.length === 0 ? (
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
            <IconGrid>
              {packs.map((pack) => (
                <PackCard
                  key={pack.id}
                  id={pack.id}
                  preview={pack.preview}
                  prompt={pack.prompt}
                  iconCount={pack.iconCount}
                  onClick={() => router.push(`/library?pack=${pack.id}`)}
                  onShare={() => shareToCommunity(pack.id)}
                  onDownloadPng={() => {}}
                  onDownloadSvg={() => {}}
                  onDelete={() => {
                    setPackToDelete({ id: pack.id, prompt: pack.prompt })
                    setDeleteDialogOpen(true)
                  }}
                />
              ))}
            </IconGrid>
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
        onConfirm={async () => {
          if (!packToDelete) return
          const success = await deletePack(packToDelete.id)
          if (success) {
            setPacks(prev => prev.filter(p => p.id !== packToDelete.id))
          }
        }}
      />
    </div>
  )
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<PageLoading message="Loading library..." />}>
      <LibraryContent />
    </Suspense>
  )
}
