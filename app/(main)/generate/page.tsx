"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HiSparkles, HiAdjustmentsHorizontal, HiArrowTopRightOnSquare, HiChevronDown, HiCheck, HiTrash } from "react-icons/hi2"
import { QuickPromptButton } from "@/components/quick-prompt-button"
import { toast } from "sonner"

interface GeneratedIcon {
  url: string
  prompt: string
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([])
  const [selectedStyle, setSelectedStyle] = useState("minimalist")

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
        body: JSON.stringify({ prompt, style: selectedStyle }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedIcons((prev) => [data, ...prev])
        toast.success("Icon generated!")
      } else {
        toast.error(data.error || "Failed to generate icon")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleGenerate()
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Empty State - only show when no icons generated */}
      {generatedIcons.length === 0 && (
        <div className="text-center mb-6 lg:mb-8">
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
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs sm:text-sm brutalist-border-2 rounded-lg flex-shrink-0"
                disabled={isGenerating}
              >
                <HiAdjustmentsHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Options
              </Button>

              <Separator orientation="vertical" className="hidden sm:block h-5" />

              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs sm:text-sm text-zinc-500 flex-shrink-0"
                disabled={isGenerating}
              >
                Style: {selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)}
                <HiChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
              </Button>
            </div>

            <Button 
              className="bg-[#B9FF66] text-black border-2 border-black rounded-xl px-4 sm:px-6 h-9 text-sm font-semibold brutalist-shadow-sm hover:bg-[#a8ef55] w-full sm:w-auto disabled:opacity-50"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <span className="animate-pulse">Generating...</span>
                </>
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

      {/* Generated Icons Grid */}
      {generatedIcons.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Generated Icons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {generatedIcons.map((icon, index) => (
              <div
                key={`${icon.url}-${index}`}
                className="group relative bg-white rounded-xl border-2 border-black brutalist-shadow-sm overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="aspect-square p-4 flex items-center justify-center bg-zinc-50">
                  <img
                    src={icon.url}
                    alt={icon.prompt}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-2 border-t border-zinc-100">
                  <p className="text-xs text-zinc-600 truncate">{icon.prompt}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white border-2 border-black rounded-lg"
                    onClick={() => navigator.clipboard.writeText(icon.url)}
                  >
                    <HiCheck className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Bottom Padding for Bottom Nav */}
      <div className="lg:hidden h-4" />
    </div>
  )
}
