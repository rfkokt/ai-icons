"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiSparkles, HiAdjustmentsHorizontal, HiArrowTopRightOnSquare, HiChevronDown, HiTrash, HiCheck } from "react-icons/hi2"
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
  preview?: string
  png?: { url: string; key: string }
  svg?: { code: string; url: string; key: string }
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
    const downloadUrl = `/api/download/${encodeURIComponent(key)}`
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `${prompt.replace(/\s+/g, "-")}.png`
    a.click()
    toast.success("PNG downloading...")
  }

  const handleDownloadSvg = (key: string, prompt: string) => {
    const downloadUrl = `/api/download/${encodeURIComponent(key)}`
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
    <div className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Generated Packs - Above Prompt */}
      {generatedPacks.length > 0 && (
        <div className="w-full max-w-4xl mb-6 space-y-4">
          {generatedPacks.map((pack) => (
            <div key={pack.id} className="bg-white rounded-xl border-2 border-black brutalist-shadow-sm overflow-hidden">
              {/* Pack Header - Click to expand/collapse */}
              <div 
                className="p-3 flex items-center justify-between bg-zinc-50 border-b border-zinc-100 cursor-pointer"
                onClick={() => togglePack(pack.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="grid grid-cols-2 gap-1">
                    {pack.icons.slice(0, 4).map((icon, i) => (
                      <div key={i} className="w-8 h-8 bg-white border border-zinc-200 rounded flex items-center justify-center overflow-hidden">
                        {icon.preview && <img src={icon.preview} alt="" className="w-full h-full object-contain" />}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{pack.prompt}</p>
                    <p className="text-xs text-zinc-500">{pack.icons.length} icons</p>
                  </div>
                </div>
                <HiChevronDown className={`h-5 w-5 text-zinc-400 transition-transform ${pack.isExpanded ? 'rotate-180' : ''}`} />
              </div>

              {/* Pack Contents - Expandable */}
              {pack.isExpanded && (
                <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {pack.icons.map((icon, index) => (
                    <div
                      key={`${icon.png?.key || icon.svg?.key || index}-${index}`}
                      className="bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden"
                    >
                      {/* Preview */}
                      <div className="aspect-square p-2 flex items-center justify-center bg-white">
                        {icon.preview ? (
                          <img src={icon.preview} alt={icon.prompt} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <div className="text-zinc-400 text-xs">No preview</div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="p-1.5 flex gap-1">
                        {icon.png && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs border border-black rounded flex-1"
                            onClick={() => handleDownloadPng(icon.png!.key, icon.prompt)}
                          >
                            PNG
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs border border-zinc-300 rounded flex-1 text-zinc-400 cursor-not-allowed"
                          disabled
                        >
                          SVG
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delete Pack */}
              <div className="p-2 border-t border-zinc-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-zinc-400 hover:text-red-500"
                  onClick={() => setGeneratedPacks((prev) => prev.filter((p) => p.id !== pack.id))}
                >
                  <HiTrash className="h-4 w-4 mr-1" />
                  Delete Pack
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State - Only show when no packs */}
      {generatedPacks.length === 0 && (
        <div className="text-center mb-6 lg:mb-8 mt-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#B9FF66] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-black brutalist-shadow-sm">
            <HiSparkles className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
            Create Your Icon
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base max-w-md px-4">
            Describe the icon you want to create and let AI do the magic
          </p>
        </div>
      )}

      {/* Floating Prompt Bar */}
      <div className="w-full max-w-2xl px-2 sm:px-0">
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-black brutalist-shadow p-2 sm:p-3">
          {/* Prompt Input */}
          <div className="p-2 sm:p-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your icon... e.g., 'A shopping cart icon with a small bag inside'"
              className="w-full resize-none border-none outline-none text-sm placeholder:text-zinc-400 min-h-[60px] sm:min-h-[80px]"
              rows={2}
              disabled={isGenerating}
            />
          </div>

          {/* Options Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 sm:px-3 pb-2 sm:pb-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 text-xs sm:text-sm brutalist-border-2 rounded-lg flex-shrink-0"
                    disabled={isGenerating}
                  >
                    <HiAdjustmentsHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium mb-2">Icon Count</p>
                    <div className="flex gap-1 flex-wrap">
                      {[4, 8, 12, 16].map((count) => (
                        <Button
                          key={count}
                          variant={format.count === count ? "default" : "outline"}
                          size="sm"
                          className="h-8 text-xs"
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
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-xs sm:text-sm text-zinc-500 flex-shrink-0"
                    disabled={isGenerating}
                  >
                    Style: {STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle}
                    <HiChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <div className="space-y-1 p-1">
                    {STYLES.map((style) => (
                      <DropdownMenuItem
                        key={style.id}
                        className={`flex items-center justify-between cursor-pointer ${selectedStyle === style.id ? 'bg-zinc-100' : ''}`}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <div>
                          <div className="text-sm">{style.name}</div>
                          <div className="text-xs text-zinc-500">{style.description}</div>
                        </div>
                        {selectedStyle === style.id && <HiCheck className="h-4 w-4" />}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button 
              className="bg-[#B9FF66] text-black border-2 border-black rounded-xl px-4 sm:px-6 h-9 text-sm font-semibold brutalist-shadow-sm hover:bg-[#a8ef55] w-full sm:w-auto disabled:opacity-50"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <span className="animate-pulse">Generating...</span>
              ) : (
                <>
                  Generate
                  <HiArrowTopRightOnSquare className="h-4 w-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 justify-center">
          {[
            "User profile avatar",
            "Settings gear",
            "Shopping cart",
            "Notification bell",
            "Message bubble",
          ].map((suggestion) => (
            <QuickPromptButton
              key={suggestion}
              suggestion={suggestion}
              onClick={setPrompt}
              disabled={isGenerating}
            />
          ))}
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-4" />
    </div>
  )
}
