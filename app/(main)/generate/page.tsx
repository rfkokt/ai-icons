"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiSparkles, HiAdjustmentsHorizontal, HiArrowTopRightOnSquare, HiChevronDown, HiTrash, HiCheck, HiArrowDownTray } from "react-icons/hi2"
import { QuickPromptButton } from "@/components/quick-prompt-button"
import { toast } from "sonner"

const STYLES = [
  { id: "minimalist", name: "Minimalist", description: "Clean, simple lines" },
  { id: "outline", name: "Outline", description: "Line art style" },
  { id: "filled", name: "Filled", description: "Solid filled icons" },
  { id: "duotone", name: "Duotone", description: "Two-tone style" },
  { id: "3d", name: "3D", description: "Three dimensional" },
  { id: "flat", name: "Flat", description: "Flat design" },
  { id: "hand-drawn", name: "Hand Drawn", description: "Organic sketch look" },
  { id: "neon", name: "Neon", description: "Glowing neon style" },
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

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {generatedPacks.length > 0 ? (
              generatedPacks.map((pack) => (
                <div key={pack.id} className="bg-white rounded-2xl border-2 border-black brutalist-shadow-sm overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between bg-gradient-to-r from-zinc-50 to-white cursor-pointer hover:from-[#B9FF66]/10 hover:to-zinc-50 transition-all duration-200 border-b-2 border-black"
                    onClick={() => togglePack(pack.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="grid grid-cols-4 gap-1.5">
                        {pack.icons.slice(0, 4).map((icon, i) => (
                          <div key={i} className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                            {icon.preview ? <img src={icon.preview} alt="" className="w-full h-full object-contain" /> : <div className="w-4 h-4 bg-zinc-200 rounded" />}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-zinc-900">{pack.prompt}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{pack.icons.length} icons</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 h-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          setGeneratedPacks((prev) => prev.filter((p) => p.id !== pack.id))
                        }}
                      >
                        <HiTrash className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                      <div className={`h-10 w-10 flex items-center justify-center border-2 border-black rounded-xl bg-white transition-transform duration-200 ${pack.isExpanded ? 'rotate-180' : ''}`}>
                        <HiChevronDown className="h-5 w-5 text-zinc-900" />
                      </div>
                    </div>
                  </div>
                  {pack.isExpanded && (
                    <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 bg-zinc-50">
                      {pack.icons.map((icon, index) => (
                        <div key={`${icon.png.key}-${index}`} className="bg-white rounded-2xl border-2 border-black brutalist-shadow-sm overflow-hidden hover:brutalist-shadow hover:-translate-y-1 hover:translate-x-1 transition-all duration-200">
                          <div className="aspect-square p-4 sm:p-6 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-white">
                            {icon.preview ? <img src={icon.preview} alt={icon.prompt} className="max-w-[85%] max-h-[85%] object-contain drop-shadow-lg" /> : <div className="text-zinc-400 text-sm">Loading...</div>}
                          </div>
                          <div className="p-3 sm:p-4 border-t-2 border-black flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs sm:text-sm border-2 border-black rounded-lg font-medium hover:bg-[#B9FF66] hover:border-[#B9FF66] flex-1"
                              onClick={() => handleDownloadPng(icon.png.key, icon.prompt)}
                            >
                              PNG
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs sm:text-sm border-2 border-black rounded-lg font-medium hover:bg-[#B9FF66] hover:border-[#B9FF66] flex-1"
                              onClick={() => handleDownloadSvg(icon.png.key, icon.prompt)}
                            >
                              SVG
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 sm:py-24">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-[#B9FF66] rounded-3xl border-2 border-black brutalist-shadow-sm mb-6">
                  <HiSparkles className="h-10 w-10 sm:h-12 sm:w-12 text-black" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-zinc-900 mb-3">Create Your Icon</h1>
                <p className="text-zinc-500 text-base sm:text-lg max-w-md mx-auto">Describe the icon you want to create and let AI do the magic</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-black brutalist-shadow p-3 sm:p-4">
              <div className="p-3 sm:p-4">
                <textarea 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Describe your icon... e.g., 'A shopping cart icon with a small bag inside'" 
                  className="w-full resize-none border-none outline-none text-sm sm:text-base placeholder:text-zinc-400 min-h-[80px] sm:min-h-[100px] font-medium"
                  rows={3} 
                  disabled={isGenerating} 
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-10 gap-2 text-sm font-medium brutalist-border-2 rounded-xl flex-shrink-0 inline-flex items-center justify-center border-2 border-black bg-white px-4 py-2 transition-colors hover:bg-zinc-100 disabled:opacity-50 cursor-pointer" disabled={isGenerating}>
                      <HiAdjustmentsHorizontal className="h-4 w-4" />
                      Options
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <div className="px-3 py-3">
                        <p className="text-sm font-bold mb-3">Icon Count</p>
                        <div className="flex gap-2 flex-wrap">
                          {[4, 8, 12, 16].map((count) => (
                            <Button 
                              key={count} 
                              variant={format.count === count ? "default" : "outline"} 
                              size="sm" 
                              className={`h-9 text-sm font-medium ${format.count === count ? 'bg-[#B9FF66] text-black border-2 border-black' : 'border-2 border-black hover:bg-zinc-100'}`}
                              onClick={() => setFormat({ count })}
                            >
                              {count}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-10 text-sm font-medium inline-flex items-center justify-center transition-colors hover:bg-zinc-100 disabled:opacity-50 cursor-pointer px-3 py-2 rounded-xl" disabled={isGenerating}>
                      Style: {STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle}
                      <HiChevronDown className="h-4 w-4 ml-1.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <div className="space-y-1 p-2">
                        {STYLES.map((style) => (
                          <DropdownMenuItem 
                            key={style.id} 
                            className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-lg ${selectedStyle === style.id ? 'bg-[#B9FF66]' : 'hover:bg-zinc-100'}`} 
                            onClick={() => setSelectedStyle(style.id)}
                          >
                            <div>
                              <div className="text-sm font-bold">{style.name}</div>
                              <div className="text-xs text-zinc-500">{style.description}</div>
                            </div>
                            {selectedStyle === style.id && <HiCheck className="h-5 w-5" />}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button 
                  className="bg-[#B9FF66] text-black border-2 border-black rounded-xl px-6 sm:px-8 h-10 sm:h-11 text-sm font-bold brutalist-shadow-sm hover:bg-[#a8ef55] w-full sm:w-auto disabled:opacity-50" 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <span className="animate-pulse">Generating...</span>
                  ) : (
                    <>
                      <HiSparkles className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-5 justify-center">
              {["User profile avatar", "Settings gear", "Shopping cart", "Notification bell", "Message bubble"].map((suggestion) => (
                <QuickPromptButton key={suggestion} suggestion={suggestion} onClick={setPrompt} disabled={isGenerating} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}