"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HiBolt } from "react-icons/hi2"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { QuickPromptButton } from "@/components/quick-prompt-button"
import { IconCard } from "@/components/icon-card"
import { GeneratingOverlay } from "@/components/generating-overlay"
import { PackAccordion } from "@/components/pack-accordion"
import { StyleSelector } from "@/components/style-selector"
import { TypeSelector, type GenerateType } from "@/components/type-selector"
import { CountSelector } from "@/components/count-selector"
import { FeatureCarousel } from "@/components/ui/feature-carousel"
import { IconActions } from "@/components/icon-actions"
import { useLightbox } from "@/hooks/use-lightbox"
import { PageLoading } from "@/components/page-loading"
import { useDownload } from "@/hooks/use-download"
import { usePackDownload } from "@/hooks/use-pack-download"
import { useShareIcon } from "@/hooks/use-share-icon"
import { useStaggerAnimation } from "@/hooks/use-stagger-animation"
import { usePromptSuggestions } from "@/hooks/use-prompt-suggestions"
import { toast } from "sonner"
import gsap from "gsap"
import type { GeneratedIcon, GeneratedPack } from "@/types/icon"

export default function GeneratePage() {
  const [mounted, setMounted] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPacks, setGeneratedPacks] = useState<GeneratedPack[]>([])
  const [selectedStyle, setSelectedStyle] = useState("minimalist_studio")
  const [generateType, setGenerateType] = useState<GenerateType>("ecommerce")
  const [iconCount, setIconCount] = useState(4)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [iconToShare, setIconToShare] = useState<string | null>(null)

  const [deletePackDialogOpen, setDeletePackDialogOpen] = useState(false)
  const [packToDelete, setPackToDelete] = useState<string | null>(null)
  const [lightboxPack, setLightboxPack] = useState<GeneratedPack | null>(null)
  
  const lightbox = useLightbox(lightboxPack?.icons.length || 0)

  const openLightbox = (pack: GeneratedPack, index: number) => {
    setLightboxPack(pack)
    lightbox.open(index)
  }

  const generatingRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const { download } = useDownload()
  const { downloadPack } = usePackDownload()
  const { shareToCommunity } = useShareIcon()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const defaultStyles: Record<GenerateType, string> = {
      ecommerce: "minimalist_studio",
      content: "3d_animation",
      real_estate: "japandi",
      professional: "corporate_global",
      web_assets: "3d_clay",
    }
    setSelectedStyle(defaultStyles[generateType])
  }, [generateType])

  const { suggestions } = usePromptSuggestions(prompt, { minLength: 2, maxSuggestions: 3 })

  const defaultSuggestions = [
    "Premium coffee cup with latte art",
    "Modern minimal workspace with macbook",
    "Cute robotic dog fetching a bone",
  ]

  const staggerRef = useStaggerAnimation([generatedPacks.length], {
    selector: ".generated-pack",
    y: 40,
    duration: 0.5,
    stagger: 0.1
  })

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          count: iconCount,
          format: {
            iconType: generateType,
            background: "transparent",
            designStyle: selectedStyle,
            colorPalette: "monochrome",
            visualDetails: "clean lines"
          }
        }),
      })

      const data = await response.json()

      if (data.success && data.icons) {
        const newPack: GeneratedPack = {
          id: Date.now().toString(),
          prompt: data.displayName || data.prompt,
          icons: data.icons,
        }
        setGeneratedPacks((prev) => [newPack, ...prev])
        toast.success(`Generated ${data.icons.length} icons!`)

        if (successRef.current) {
          gsap.fromTo(successRef.current,
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
          )
        }
      } else {
        toast.error(data.error || "Failed to generate icons")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const confirmDeletePack = async () => {
    if (!packToDelete) return

    const pack = generatedPacks.find(p => p.id === packToDelete)
    if (!pack) return

    const iconIds = pack.icons.map(icon => icon.id).filter(Boolean) as string[]

    if (iconIds.length > 0) {
      try {
        await Promise.all(
          iconIds.map(id =>
            fetch(`/api/icon/${id}`, { method: "DELETE" })
              .then(res => res.json())
              .catch(err => console.error(`Error deleting icon ${id}:`, err))
          )
        )
      } catch {
        toast.error("Some icons failed to delete")
      }
    }

    setGeneratedPacks((prev) => prev.filter((p) => p.id !== packToDelete))
    toast.success("Pack deleted")
    setPackToDelete(null)
  }

  const handleShareToCommunity = (iconId: string) => {
    setIconToShare(iconId)
    setShareDialogOpen(true)
  }

  const confirmShare = async () => {
    if (!iconToShare) return

    try {
      const response = await fetch(`/api/icon/${iconToShare}/share`, { method: "POST" })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.error || "Failed to share")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setShareDialogOpen(false)
      setIconToShare(null)
    }
  }

  const handleDownloadPack = (packId: string, downloadFormat: "png" | "svg") => {
    const pack = generatedPacks.find(p => p.id === packId)
    if (!pack) return
    downloadPack(
      pack.icons.map(icon => ({ png_key: icon.png.key, prompt: icon.prompt })),
      pack.prompt,
      downloadFormat
    )
  }

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f3f4f6] bg-grid-pattern">
        <div className="w-10 h-10 border-4 border-[#B9FF66] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#f3f4f6] bg-grid-pattern">
      {isGenerating && (
        <GeneratingOverlay iconCount={iconCount} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="w-full max-w-6xl mx-auto" ref={staggerRef}>
            <div className="space-y-6">
              {generatedPacks.length > 0 ? (
                generatedPacks.map((pack) => (
                  <PackAccordion
                    key={pack.id}
                    id={pack.id}
                    prompt={pack.prompt}
                    iconCount={pack.icons.length}
                    defaultExpanded
                    className="generated-pack"
                    onDelete={() => {
                      setPackToDelete(pack.id)
                      setDeletePackDialogOpen(true)
                    }}
                    onDownloadPng={() => handleDownloadPack(pack.id, "png")}
                    onDownloadSvg={() => handleDownloadPack(pack.id, "svg")}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                      {pack.icons.map((icon, index) => (
                        <IconCard
                          key={`${icon.png.key}-${index}`}
                          id={`${pack.id}-${index}`}
                          src={icon.preview}
                          prompt={icon.prompt}
                          format={icon.png.key}
                          variant="generated"
                          transparentBg
                          showActionBar
                          onClick={() => openLightbox(pack, index)}
                          onShare={() => icon.id && shareToCommunity(icon.id)}
                        />
                      ))}
                    </div>
                  </PackAccordion>
                ))
              ) : (
                !isGenerating && (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-zinc-900 mb-6 mt-12">
                      Create Your Icon
                    </h1>
                    <p className="text-zinc-500 text-lg sm:text-xl max-w-lg mx-auto">
                      Describe the icon you want to create and let AI do the magic
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_0px_#000000] sm:shadow-[6px_6px_0px_0px_#000000] p-3 sm:p-5">
              <div className="mb-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your icon... e.g., 'A shopping cart icon'"
                  className="w-full resize-none border-2 border-black rounded-lg bg-zinc-50 px-3 py-2.5 text-sm placeholder:text-zinc-400 min-h-[60px] sm:min-h-[80px] font-medium focus:outline-none focus:ring-2 focus:ring-[#B9FF66] transition-all"
                  rows={2}
                  disabled={isGenerating}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeSelector
                    selectedType={generateType}
                    onTypeChange={setGenerateType}
                    disabled={isGenerating}
                  />
                  <StyleSelector
                    selectedStyle={selectedStyle}
                    onStyleChange={setSelectedStyle}
                    disabled={isGenerating}
                    type={generateType}
                  />
                  <CountSelector
                    count={iconCount}
                    onCountChange={setIconCount}
                    disabled={isGenerating}
                  />
                </div>

                <Button
                  className="bg-[#B9FF66] hover:bg-[#a8e655] text-black border-2 sm:border-3 border-black rounded-lg sm:rounded-xl px-4 sm:px-8 h-9 sm:h-11 text-sm sm:text-base font-black shadow-[2px_2px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] sm:hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all w-full sm:w-auto disabled:opacity-50"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 sm:border-3 border-black border-t-transparent rounded-full animate-spin mr-1.5 sm:mr-2" />
                      <span className="hidden sm:inline">Generating...</span>
                      <span className="sm:hidden">Gen...</span>
                    </>
                  ) : (
                    <>
                      <HiBolt className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory -mx-1 px-1">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <div key={suggestion} className="snap-start">
                      <QuickPromptButton
                        suggestion={suggestion}
                        onClick={setPrompt}
                        disabled={isGenerating}
                        className="flex-shrink-0"
                      />
                    </div>
                  ))
                ) : (
                  defaultSuggestions.map((suggestion) => (
                    <div key={suggestion} className="snap-start">
                      <QuickPromptButton
                        suggestion={suggestion}
                        onClick={setPrompt}
                        disabled={isGenerating}
                        className="flex-shrink-0"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-white border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter">Share to Community</DialogTitle>
            <DialogDescription className="text-zinc-600">
              Are you sure you want to share this icon to the community? Others will be able to see and use it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              className="border-2 border-black rounded-xl font-bold shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              onClick={() => setShareDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#B9FF66] hover:bg-[#a8e655] border-3 border-black rounded-xl font-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              onClick={confirmShare}
            >
              Share Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={lightbox.isOpen} onOpenChange={lightbox.close}>
        <DialogContent className="max-w-5xl p-0 gap-0 w-[95vw] bg-white border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000000] overflow-hidden">
          {lightboxPack && (
            <>
              <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-black bg-zinc-50 relative z-10 min-h-[72px]">
                {/* Left Badge */}
                <div className="flex-shrink-0 z-10">
                  <div className="inline-flex items-center justify-center min-w-[4rem] px-3 py-1.5 bg-[#B9FF66] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-sm font-black text-black">
                    {lightbox.currentIndex + 1} / {lightboxPack.icons.length}
                  </div>
                </div>
                
                {/* Center Title */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[40%] text-center z-0 hidden sm:block">
                  <h3 className="font-bold text-base sm:text-lg truncate text-zinc-800 px-4">
                    {lightboxPack.prompt}
                  </h3>
                </div>
                
                {/* Right Actions */}
                <div className="flex-shrink-0 flex items-center z-10 pr-10 sm:pr-12">
                  {lightboxPack.icons[lightbox.currentIndex] && (
                    <IconActions
                      iconKey={lightboxPack.icons[lightbox.currentIndex].png.key}
                      prompt={lightboxPack.icons[lightbox.currentIndex].prompt}
                      onShare={() => {
                        const id = lightboxPack.icons[lightbox.currentIndex].id
                        if (id) shareToCommunity(id)
                      }}
                      onDelete={() => {
                        toast.error("Please delete the entire pack below")
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-8 bg-zinc-100/50 flex flex-col items-center justify-center min-h-[350px] md:min-h-[450px]">
                <FeatureCarousel
                  images={lightboxPack.icons.map((icon) => ({
                    src: `/api/download/${encodeURIComponent(icon.png.key)}`,
                    alt: icon.prompt,
                  }))}
                  currentIndex={lightbox.currentIndex}
                  onNext={lightbox.goToNext}
                  onPrev={lightbox.goToPrev}
                  onIndexChange={lightbox.setCurrentIndex}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletePackDialogOpen}
        onOpenChange={setDeletePackDialogOpen}
        title="Delete Pack"
        description={`Are you sure you want to delete this pack? This will remove all ${packToDelete ? generatedPacks.find(p => p.id === packToDelete)?.icons.length : 0} icons in this pack. This action cannot be undone.`}
        confirmText="Delete Pack"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDeletePack}
      />
    </div>
  )
}
