"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiSparkles, HiAdjustmentsHorizontal, HiChevronDown, HiTrash, HiCheck, HiArrowDownTray, HiShare, HiEllipsisVertical } from "react-icons/hi2"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { QuickPromptButton } from "@/components/quick-prompt-button"
import { toast } from "sonner"
import gsap from "gsap"

const STYLES = [
  { id: "minimalist", name: "Minimalist", description: "Clean, simple lines", color: "bg-zinc-100" },
  { id: "outline", name: "Outline", description: "Line art style", color: "bg-white border-2 border-black" },
  { id: "filled", name: "Filled", description: "Solid filled icons", color: "bg-black" },
  { id: "duotone", name: "Duotone", description: "Two-tone style", color: "bg-gradient-to-br from-zinc-200 to-zinc-400" },
  { id: "3d", name: "3D", description: "Three dimensional", color: "bg-zinc-300 shadow-[4px_4px_0px_0px_#000000]" },
  { id: "flat", name: "Flat", description: "Flat design", color: "bg-zinc-200" },
  { id: "hand-drawn", name: "Hand Drawn", description: "Organic sketch look", color: "bg-yellow-100" },
  { id: "neon", name: "Neon", description: "Glowing neon style", color: "bg-[#B9FF66] shadow-[0_0_20px_#B9FF66]" },
]

interface GeneratedIcon {
  preview: string
  png: { url: string; key: string }
  prompt: string
  id?: string
}

interface GeneratedPack {
  id: string
  prompt: string
  icons: GeneratedIcon[]
  isExpanded: boolean
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPacks, setGeneratedPacks] = useState<GeneratedPack[]>([])
  const [selectedStyle, setSelectedStyle] = useState("minimalist")
  const [format, setFormat] = useState({ count: 8 })
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [iconToShare, setIconToShare] = useState<string | null>(null)

  // Delete confirmation dialog state
  const [deletePackDialogOpen, setDeletePackDialogOpen] = useState(false)
  const [packToDelete, setPackToDelete] = useState<string | null>(null)

  const generatingRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  // Animate generated packs
  useEffect(() => {
    if (generatedPacks.length > 0) {
      gsap.from(".generated-pack", {
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
      })
    }
  }, [generatedPacks])

  // Animate generating state
  useEffect(() => {
    if (isGenerating && generatingRef.current) {
      gsap.fromTo(generatingRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      )

      // Animate loading dots
      gsap.to(".loading-dot", {
        y: -10,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.15,
        ease: "power1.inOut"
      })
    }
  }, [isGenerating])

  const togglePack = (packId: string) => {
    const pack = generatedPacks.find(p => p.id === packId)
    if (!pack) return

    const willExpand = !pack.isExpanded

    // Animate the content div
    const contentDiv = document.querySelector(`[data-pack-id="${packId}"] .pack-content`)
    if (contentDiv) {
      if (willExpand) {
        // Expand animation
        gsap.to(contentDiv, {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          onStart: () => {
            gsap.set(contentDiv, { display: "block" })
          }
        })
      } else {
        // Collapse animation
        gsap.to(contentDiv, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(contentDiv, { display: "none" })
          }
        })
      }
    }

    // Update state after animation starts
    setGeneratedPacks(prev => prev.map(p =>
      p.id === packId ? { ...p, isExpanded: willExpand } : p
    ))
  }

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
          format: {
            count: format.count,
            iconType: "UI",
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
          prompt: data.prompt,
          icons: data.icons,
          isExpanded: true,
        }
        setGeneratedPacks((prev) => [newPack, ...prev])
        toast.success(`Generated ${data.icons.length} icons!`)

        // Success animation
        if (successRef.current) {
          gsap.fromTo(successRef.current,
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
          )
        }
      } else {
        toast.error(data.error || "Failed to generate icons")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsGenerating(false)
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

    // Delete all icons from database
    const iconIds = pack.icons.map(icon => icon.id).filter(Boolean) as string[]

    if (iconIds.length > 0) {
      try {
        // Delete all icons in parallel
        await Promise.all(
          iconIds.map(id =>
            fetch(`/api/icon/${id}`, { method: "DELETE" })
              .then(res => res.json())
              .then(data => {
                if (!data.success) {
                  console.error(`Failed to delete icon ${id}`)
                }
              })
              .catch(err => console.error(`Error deleting icon ${id}:`, err))
          )
        )
      } catch (error) {
        console.error("Error deleting icons:", error)
        toast.error("Some icons failed to delete")
      }
    }

    // Remove from local state
    setGeneratedPacks((prev) => prev.filter((p) => p.id !== packToDelete))
    toast.success("Pack deleted")
    setPackToDelete(null)
  }

  const handleShareToCommunity = async (iconId: string) => {
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

  const handleDownloadPack = async (packId: string, format: "png" | "svg") => {
    const pack = generatedPacks.find(p => p.id === packId)
    if (!pack) return

    const loadingId = toast.loading(`Creating ZIP file...`)

    try {
      // Dynamically import JSZip
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      // Add all icons to the ZIP
      for (let i = 0; i < pack.icons.length; i++) {
        const icon = pack.icons[i]
        const downloadUrl = `/api/download/${encodeURIComponent(icon.png.key)}?format=${format}`

        try {
          const response = await fetch(downloadUrl)
          const blob = await response.blob()
          // Add to ZIP with proper filename
          zip.file(`${pack.prompt.replace(/\s+/g, "-")}-${i + 1}.${format}`, blob)
        } catch (err) {
          console.error(`Failed to add icon ${i} to ZIP:`, err)
        }
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = window.URL.createObjectURL(zipBlob)

      // Download ZIP
      const a = document.createElement("a")
      a.href = url
      a.download = `${pack.prompt.replace(/\s+/g, "-")}-${format.toUpperCase()}-icons.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.dismiss(loadingId)
      toast.success(`Pack downloaded: ${pack.icons.length} ${format.toUpperCase()} icons`)
    } catch (error) {
      console.error("Download pack error:", error)
      toast.error("Failed to download pack")
    }
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Generating Animation Overlay - Centered */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div ref={generatingRef} className="relative">
            {/* Animated background rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 border-4 border-[#B9FF66] border-t-transparent rounded-full animate-spin" />
              <div className="absolute w-32 h-32 border-4 border-[#B9FF66]/60 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <div className="absolute w-24 h-24 border-4 border-[#B9FF66]/40 border-l-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }} />
            </div>

            {/* Main card */}
            <div className="relative bg-[#B9FF66] rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-8 sm:p-10">
              <div className="flex flex-col items-center gap-6">
                {/* Icon */}
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
                    <HiSparkles className="h-10 w-10 text-black animate-pulse" />
                  </div>
                  {/* Orbiting dots */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full animate-bounce" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-zinc-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute -top-2 left-1/2 w-3 h-3 bg-zinc-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>

                {/* Text */}
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-black text-black mb-2">Creating Magic...</h3>
                  <p className="text-base font-bold text-zinc-800 flex items-center justify-center gap-1">
                    Generating {format.count} unique icons
                    <span className="loading-dot">.</span>
                    <span className="loading-dot">.</span>
                    <span className="loading-dot">.</span>
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-48 h-3 bg-white/50 rounded-full border-2 border-black overflow-hidden">
                  <div className="h-full bg-black rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Generated Icons Display */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="w-full max-w-6xl mx-auto">

            <div className="space-y-6">
              {generatedPacks.length > 0 ? (
                generatedPacks.map((pack) => (
                  <div key={pack.id} className="generated-pack bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden" role="region" aria-labelledby={`pack-title-${pack.id}`}>
                    {/* Pack Header - More compact */}
                    <div
                      role="button"
                      tabIndex={0}
                      className="bg-[#B9FF66] border-b-4 border-black p-3 sm:p-4 flex items-center justify-between cursor-pointer transition-all duration-200"
                      onClick={() => togglePack(pack.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          togglePack(pack.id)
                        }
                      }}
                      aria-expanded={pack.isExpanded}
                      aria-label={`Toggle ${pack.prompt} pack`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Pack Badge - Smaller */}
                        <div className="bg-black text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                          Pack
                        </div>

                        {/* Title and Icon Count - Smaller fonts */}
                        <div className="flex-1 min-w-0">
                          <h2 id={`pack-title-${pack.id}`} className="text-base sm:text-lg lg:text-xl font-black tracking-tighter text-black truncate">
                            {pack.prompt}
                          </h2>
                          <p className="text-xs sm:text-sm font-medium text-zinc-800 mt-0.5 flex items-center gap-1.5">
                            <HiSparkles className="h-3 w-3" />
                            {pack.icons.length} icons
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 ml-3">
                        {/* Download Actions - Smaller */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="hidden sm:flex h-8 px-3 items-center gap-1.5 bg-white hover:bg-[#B9FF66] border-2 border-black rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HiArrowDownTray className="h-3.5 w-3.5" />
                            <span>Download</span>
                            <HiChevronDown className="h-3 w-3" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000000]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              className="flex items-center gap-2 px-3 py-2 hover:bg-[#B9FF66] cursor-pointer font-bold text-sm"
                              onClick={() => handleDownloadPack(pack.id, "png")}
                            >
                              <HiArrowDownTray className="h-3.5 w-3.5" />
                              <div>
                                <div className="text-xs">PNG Pack</div>
                                <div className="text-[10px] text-zinc-500 font-normal">{pack.icons.length} icons</div>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 px-3 py-2 hover:bg-[#B9FF66] cursor-pointer font-bold text-sm"
                              onClick={() => handleDownloadPack(pack.id, "svg")}
                            >
                              <HiArrowDownTray className="h-3.5 w-3.5" />
                              <div>
                                <div className="text-xs">SVG Pack</div>
                                <div className="text-[10px] text-zinc-500 font-normal">{pack.icons.length} icons</div>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile: Direct download button */}
                        <div className="sm:hidden">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 bg-white hover:bg-[#B9FF66] border-2 border-black rounded-lg p-0 shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadPack(pack.id, "png")
                            }}
                          >
                            <HiArrowDownTray className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Delete Button - Smaller */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white h-8 px-3 border-2 border-black rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPackToDelete(pack.id)
                            setDeletePackDialogOpen(true)
                          }}
                        >
                          <HiTrash className="h-3.5 w-3.5 sm:mr-1" />
                          <span className="hidden sm:inline font-semibold">Delete</span>
                        </Button>

                        {/* Expand/Collapse Button - Smaller */}
                        <button
                          className={`h-8 w-8 flex items-center justify-center border-2 border-black rounded-lg bg-white shadow-[2px_2px_0px_0px_#000000] transition-all duration-200 ${pack.isExpanded ? 'rotate-180' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePack(pack.id)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              e.stopPropagation()
                              togglePack(pack.id)
                            }
                          }}
                          aria-expanded={pack.isExpanded}
                          aria-label={pack.isExpanded ? 'Collapse pack' : 'Expand pack'}
                        >
                          <HiChevronDown className="h-4 w-4 text-black" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Icons Grid - Much bigger cards */}
                    {pack.isExpanded && (
                      <div
                        data-pack-id={pack.id}
                        className="pack-content p-4 sm:p-6 bg-gradient-to-br from-zinc-50 to-white border-t-4 border-black"
                      >
                        <div className="grid grid-cols-5 gap-4">
                          {pack.icons.map((icon, index) => (
                            <div
                              key={`${icon.png.key}-${index}`}
                              className="icon-card group relative rounded-xl border-3 border-transparent shadow-[4px_4px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-300"
                            >
                              {/* Icon Card - 3 per row */}
                              <Card className="bg-white rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="aspect-square p-4 sm:p-6 flex items-center justify-center bg-gradient-to-br from-white via-zinc-50 to-zinc-100">
                                  {icon.preview ? (
                                    <img src={icon.preview} alt={icon.prompt} className="max-w-[75%] max-h-[75%] object-contain" />
                                  ) : (
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 rounded-xl border-2 border-zinc-300 flex items-center justify-center">
                                      <HiSparkles className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400" />
                                    </div>
                                  )}
                                </div>
                              </Card>

                              {/* Action Bar - Proportional to card size */}
                              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                                {/* Share Button */}
                                <button
                                  onClick={() => icon.id && handleShareToCommunity(icon.id)}
                                  className="flex-1 h-10 bg-white hover:bg-[#B9FF66] border-3 border-black rounded-full flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-bold uppercase"
                                  title="Share to community"
                                  aria-label="Share to community"
                                >
                                  <HiShare className="h-4 w-4" />
                                  <span>Share</span>
                                </button>

                                {/* More Options Dropdown */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    className="h-10 w-10 bg-white hover:bg-zinc-50 border-3 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-zinc-700 cursor-pointer"
                                    aria-label="More options"
                                  >
                                    <HiEllipsisVertical className="h-5 w-5" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => handleDownloadPng(icon.png.key, icon.prompt)}>
                                      <HiArrowDownTray className="h-4 w-4 mr-2" />
                                      <span>Download PNG</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDownloadSvg(icon.png.key, icon.prompt)}>
                                      <HiArrowDownTray className="h-4 w-4 mr-2" />
                                      <span>Download SVG</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                /* Empty State - Improved */
                !isGenerating && (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div ref={successRef} className="inline-flex items-center justify-center w-32 h-32 bg-[#B9FF66] rounded-3xl border-4 border-black mb-10 shadow-[8px_8px_0px_0px_#000000]">
                      <HiSparkles className="h-16 w-16 text-black" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-zinc-900 mb-6">
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

        {/* Prompt Input Section */}
        <div className="flex-shrink-0 px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_0px_#000000] sm:shadow-[6px_6px_0px_0px_#000000] p-3 sm:p-5">
              {/* Textarea */}
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

              {/* Options Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Count Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="h-9 sm:h-11 gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl inline-flex items-center justify-center border-2 sm:border-3 border-black bg-white px-2.5 sm:px-4 shadow-[2px_2px_0px_0px_#000000] sm:shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
                      disabled={isGenerating}
                    >
                      <HiAdjustmentsHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{format.count} Icons</span>
                      <span className="sm:hidden">{format.count}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
                      <div className="px-4 py-4">
                        <p className="text-sm font-black mb-3">Number of Icons</p>
                        <div className="grid grid-cols-4 gap-2">
                          {[4, 8, 12, 16].map((count) => (
                            <Button
                              key={count}
                              variant={format.count === count ? "default" : "outline"}
                              size="sm"
                              className={`h-10 text-sm font-bold ${format.count === count ? 'bg-[#B9FF66] text-black border-2 border-black' : 'border-2 border-black hover:bg-zinc-100'}`}
                              onClick={() => setFormat({ count })}
                            >
                              {count}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Style Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="h-9 sm:h-11 text-xs sm:text-sm font-bold inline-flex items-center justify-center border-2 sm:border-3 border-black bg-white px-2.5 sm:px-4 rounded-lg sm:rounded-xl shadow-[2px_2px_0px_0px_#000000] sm:shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
                      disabled={isGenerating}
                    >
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-300 mr-1.5 sm:mr-2" />
                      <span className="max-w-[100px] sm:max-w-none truncate">{STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle}</span>
                      <HiChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-72 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000]">
                      <div className="p-3">
                        <p className="text-xs font-bold text-zinc-500 mb-2 px-1">ICON STYLE</p>
                        <div className="space-y-1 max-h-64 overflow-y-auto">
                          {STYLES.map((style) => (
                            <DropdownMenuItem
                              key={style.id}
                              className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl border-2 ${selectedStyle === style.id ? 'bg-[#B9FF66] border-black' : 'border-transparent hover:bg-zinc-100'}`}
                              onClick={() => setSelectedStyle(style.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${style.color} border-2 border-black flex-shrink-0`} />
                                <div>
                                  <div className="text-sm font-bold">{style.name}</div>
                                  <div className="text-xs text-zinc-500">{style.description}</div>
                                </div>
                              </div>
                              {selectedStyle === style.id && <HiCheck className="h-5 w-5 text-black" />}
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Generate Button */}
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
                      <HiSparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Prompts - Horizontally Scrollable (Swipe on mobile) */}
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory -mx-1 px-1">
                {["User profile", "Settings gear", "Shopping cart", "Notification bell", "Message bubble", "Search", "Heart icon", "Calendar", "Location", "Camera"].map((suggestion) => (
                  <div key={suggestion} className="snap-start">
                    <QuickPromptButton
                      suggestion={suggestion}
                      onClick={setPrompt}
                      disabled={isGenerating}
                      className="flex-shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Confirmation Dialog */}
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

      {/* Delete Pack Confirmation Dialog */}
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
