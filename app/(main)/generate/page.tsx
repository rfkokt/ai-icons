"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HiBolt } from "react-icons/hi2"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { IconCard } from "@/components/icon-card"
import { GeneratingOverlay } from "@/components/generating-overlay"
import type { GenerateType } from "@/components/type-selector"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MessageCircle, Wand2, Cpu, Monitor, Palette, ImageIcon, Loader2 } from "lucide-react"

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
                <div className="bg-white rounded-[24px] border-3 border-black p-4 sm:p-6 shadow-[8px_8px_0px_0px_#000000]">
                  
                  {/* Latest Generation (Dashed Area) */}
                  <div className="rounded-2xl flex flex-col items-center justify-center bg-zinc-50 border-3 border-dashed border-black min-h-[300px] p-4 sm:p-6 mb-6">
                    <div className="w-full flex items-center justify-between mb-4">
                      <h3 className="font-black text-black text-lg">Latest Generation: <span className="font-bold text-zinc-600">{generatedPacks[0].prompt}</span></h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadPack(generatedPacks[0].id, "png")} className="border-2 border-black font-bold h-8 hover:bg-[#B9FF66]">
                          Download Pack
                        </Button>
                      </div>
                    </div>
                    
                    {/* Single Large Image View */}
                    <div className="w-full max-w-sm mx-auto">
                      <IconCard
                        id={`${generatedPacks[0].id}-0`}
                        src={generatedPacks[0].icons[0].preview}
                        prompt={generatedPacks[0].icons[0].prompt}
                        format={generatedPacks[0].icons[0].png.key}
                        variant="generated"
                        transparentBg
                        showActionBar
                        onClick={() => openLightbox(generatedPacks[0], 0)}
                        onShare={() => generatedPacks[0].icons[0].id && shareToCommunity(generatedPacks[0].icons[0].id)}
                      />
                    </div>
                  </div>

                  {/* Recent Generations Gallery */}
                  {(generatedPacks[0].icons.length > 1 || generatedPacks.length > 1) && (
                    <div className="space-y-4 pt-4 border-t-3 border-black">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-black">Recent Generations</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                        {/* Remaining icons from latest pack */}
                        {generatedPacks[0].icons.slice(1).map((icon, index) => (
                          <IconCard
                            key={`${icon.png.key}-${index + 1}`}
                            id={`${generatedPacks[0].id}-${index + 1}`}
                            src={icon.preview}
                            prompt={icon.prompt}
                            format={icon.png.key}
                            variant="generated"
                            transparentBg
                            showActionBar
                            onClick={() => openLightbox(generatedPacks[0], index + 1)}
                            onShare={() => icon.id && shareToCommunity(icon.id)}
                          />
                        ))}
                        {/* Icons from older packs */}
                        {generatedPacks.slice(1).flatMap(pack => 
                          pack.icons.map((icon, index) => (
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
                          ))
                        ).slice(0, 12)}
                      </div>
                    </div>
                  )}
                </div>
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
            <div className="bg-white rounded-xl sm:rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] sm:shadow-[8px_8px_0px_0px_#000000] p-4 sm:p-6 flex flex-col gap-5">
              
              {/* Prompt Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-black" />
                  <span className="text-base font-black text-black">Prompt</span>
                </div>
                <Popover>
                  <PopoverTrigger className="inline-flex h-8 items-center px-3 border-2 border-black rounded-lg font-bold text-black text-sm bg-white hover:bg-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66]">
                    <Wand2 className="w-4 h-4 mr-2" /> Idea
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3 border-3 border-black rounded-xl shadow-[4px_4px_0_0_#000]">
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-black">Suggestions</h4>
                      <div className="space-y-2">
                        {(suggestions.length > 0 ? suggestions : defaultSuggestions).slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setPrompt(suggestion)}
                            className="w-full text-left p-2.5 text-sm font-medium hover:bg-[#B9FF66] border border-transparent hover:border-black rounded-lg transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your icon... e.g., 'A shopping cart icon'"
                disabled={isGenerating}
                className="w-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border-2 border-black rounded-xl bg-zinc-50 px-4 py-3 text-base placeholder:text-zinc-500 min-h-[80px] font-medium focus-visible:ring-[#B9FF66] transition-all"
              />

              {/* Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                {/* Component Type (Mapped from Model) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-black" /> Category
                  </label>
                  <Select value={generateType} onValueChange={(value: GenerateType) => setGenerateType(value)} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">Ecommerce</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="web_assets">Web Assets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Style Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Palette className="w-4 h-4 text-black" /> Style
                  </label>
                  <Select value={selectedStyle} onValueChange={(value: string) => setSelectedStyle(value)} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimalist_studio">Minimalist Studio</SelectItem>
                      <SelectItem value="3d_clay">3D Clay</SelectItem>
                      <SelectItem value="corporate_global">Corporate</SelectItem>
                      <SelectItem value="japandi">Japandi</SelectItem>
                      <SelectItem value="3d_animation">3D Animation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Count Select (Mapped from Quality) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-black" /> Count
                  </label>
                  <Select value={iconCount.toString()} onValueChange={(value: string) => setIconCount(parseInt(value))} disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Icon</SelectItem>
                      <SelectItem value="2">2 Icons</SelectItem>
                      <SelectItem value="4">4 Icons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Background Select Context */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-black" /> Context
                  </label>
                  <Select defaultValue="transparent" disabled={isGenerating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transparent">Transparent</SelectItem>
                      <SelectItem value="solid">Solid Background</SelectItem>
                      <SelectItem value="studio">Studio Environment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#B9FF66] hover:bg-[#a8e655] text-black text-lg font-black rounded-xl border-3 border-black shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:shadow-[4px_4px_0_0_#000000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Icons...
                    </>
                  ) : (
                    <>
                      <HiBolt className="w-5 h-5 fill-black" />
                      Generate Pack
                    </>
                  )}
                </Button>
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
