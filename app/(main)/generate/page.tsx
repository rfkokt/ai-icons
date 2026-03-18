"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiSparkles, HiAdjustmentsHorizontal, HiChevronDown, HiTrash, HiCheck, HiArrowDownTray, HiPhoto } from "react-icons/hi2"
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
    setGeneratedPacks(prev => prev.map(pack =>
      pack.id === packId ? { ...pack, isExpanded: !pack.isExpanded } : pack
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

  const handleDeletePack = (packId: string) => {
    setGeneratedPacks((prev) => prev.filter((p) => p.id !== packId))
    toast.success("Pack deleted")
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Generated Icons Display */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="w-full max-w-6xl mx-auto">
            {/* Generating Animation */}
            {isGenerating && (
              <div ref={generatingRef} className="mb-8 bg-[#B9FF66] rounded-2xl border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-6 sm:p-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    <HiSparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-black text-black">Generating your icons...</h3>
                    <p className="text-sm font-bold text-zinc-800 mt-1 flex items-center justify-center gap-1">
                      Creating {format.count} amazing icons
                      <span className="loading-dot">.</span>
                      <span className="loading-dot">.</span>
                      <span className="loading-dot">.</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {generatedPacks.length > 0 ? (
                generatedPacks.map((pack) => (
                  <div key={pack.id} className="generated-pack bg-white rounded-2xl border-3 border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden">
                    {/* Pack Header */}
                    <div
                      className="p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-[#B9FF66] to-[#a8e655] cursor-pointer hover:from-[#B9FF66] hover:to-[#B9FF66] transition-all duration-200 border-b-3 border-black"
                      onClick={() => togglePack(pack.id)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Preview Grid */}
                        <div className="grid grid-cols-4 gap-1.5 bg-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                          {pack.icons.slice(0, 4).map((icon, i) => (
                            <div key={i} className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center overflow-hidden">
                              {icon.preview ? (
                                <img src={icon.preview} alt="" className="w-full h-full object-contain p-1" />
                              ) : (
                                <div className="w-4 h-4 bg-zinc-200 rounded" />
                              )}
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-black text-black">{pack.prompt}</p>
                          <p className="text-xs sm:text-sm font-bold text-zinc-800 mt-0.5 flex items-center gap-1">
                            <HiSparkles className="h-3.5 w-3.5" />
                            {pack.icons.length} icons generated
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-100 h-9 px-3 border-2 border-transparent hover:border-red-300 rounded-xl font-bold transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePack(pack.id)
                          }}
                        >
                          <HiTrash className="h-4 w-4 sm:mr-1.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                        <div className={`h-10 w-10 flex items-center justify-center border-3 border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_#000000] transition-transform duration-200 ${pack.isExpanded ? 'rotate-180' : ''}`}>
                          <HiChevronDown className="h-5 w-5 text-black" />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Icons Grid */}
                    {pack.isExpanded && (
                      <div className="p-4 sm:p-6 bg-zinc-50 border-t-3 border-black">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                          {pack.icons.map((icon, index) => (
                            <div
                              key={`${icon.png.key}-${index}`}
                              className="group relative bg-white rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:translate-x-1 transition-all duration-200 overflow-hidden"
                            >
                              {/* Quick Download Button */}
                              <button
                                onClick={() => handleDownloadPng(icon.png.key, icon.prompt)}
                                className="absolute top-2 right-2 h-7 w-7 bg-[#B9FF66] hover:bg-[#a8e655] border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all opacity-0 group-hover:opacity-100 lg:opacity-0 z-10"
                                title="Download PNG"
                              >
                                <HiArrowDownTray className="h-3.5 w-3.5 text-black" />
                              </button>

                              <div className="aspect-square p-3 flex items-center justify-center bg-gradient-to-br from-white via-zinc-50 to-zinc-100">
                                {icon.preview ? (
                                  <img src={icon.preview} alt={icon.prompt} className="max-w-[85%] max-h-[85%] object-contain" />
                                ) : (
                                  <div className="w-10 h-10 bg-zinc-200 rounded-lg animate-pulse" />
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="p-2 bg-white border-t-2 border-black flex gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs border-2 border-black rounded-lg font-bold hover:bg-[#B9FF66] hover:border-[#B9FF66] flex-1 shadow-[1px_1px_0px_0px_#000000] hover:shadow-[0.5px_0.5px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                                  onClick={() => handleDownloadPng(icon.png.key, icon.prompt)}
                                >
                                  PNG
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs border-2 border-black rounded-lg font-bold hover:bg-[#B9FF66] hover:border-[#B9FF66] flex-1 shadow-[1px_1px_0px_0px_#000000] hover:shadow-[0.5px_0.5px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                                  onClick={() => handleDownloadSvg(icon.png.key, icon.prompt)}
                                >
                                  SVG
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                /* Empty State */
                !isGenerating && (
                  <div className="text-center py-16 sm:py-24">
                    <div ref={successRef} className="inline-flex items-center justify-center w-28 h-28 bg-[#B9FF66] rounded-3xl border-3 border-black mb-8 shadow-[8px_8px_0px_0px_#000000]">
                      <HiSparkles className="h-14 w-14 text-black" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 mb-4">
                      Create Your Icon
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-md mx-auto">
                      Describe the icon you want to create and let AI do the magic
                    </p>

                    {/* Example Icons */}
                    <div className="flex justify-center gap-4 mt-10">
                      {["User", "Cart", "Bell", "Gear", "Mail"].map((item) => (
                        <div key={item} className="w-14 h-14 bg-white rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center">
                          <HiPhoto className="h-7 w-7 text-zinc-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Prompt Input Section */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-4 sm:p-6">
              {/* Textarea */}
              <div className="mb-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your icon... e.g., 'A shopping cart icon with a small bag inside'"
                  className="w-full resize-none border-3 border-black rounded-xl bg-zinc-50 px-4 py-3 text-base placeholder:text-zinc-400 min-h-[100px] font-medium focus:outline-none focus:ring-4 focus:ring-[#B9FF66] transition-all"
                  rows={3}
                  disabled={isGenerating}
                />
              </div>

              {/* Options Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Count Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="h-11 gap-2 text-sm font-bold rounded-xl inline-flex items-center justify-center border-3 border-black bg-white px-4 shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 cursor-pointer"
                      disabled={isGenerating}
                    >
                      <HiAdjustmentsHorizontal className="h-4 w-4" />
                      {format.count} Icons
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
                      className="h-11 text-sm font-bold inline-flex items-center justify-center border-3 border-black bg-white px-4 rounded-xl shadow-[3px_3px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 cursor-pointer"
                      disabled={isGenerating}
                    >
                      <span className="w-3 h-3 rounded-full bg-zinc-300 mr-2" />
                      {STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle}
                      <HiChevronDown className="h-4 w-4 ml-1.5" />
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
                  className="bg-[#B9FF66] hover:bg-[#a8e655] text-black border-3 border-black rounded-xl px-8 h-11 text-base font-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all w-full sm:w-auto disabled:opacity-50"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <div className="h-5 w-5 border-3 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <HiSparkles className="h-5 w-5 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2 justify-center">
                {["User profile avatar", "Settings gear", "Shopping cart", "Notification bell", "Message bubble"].map((suggestion) => (
                  <QuickPromptButton
                    key={suggestion}
                    suggestion={suggestion}
                    onClick={setPrompt}
                    disabled={isGenerating}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
