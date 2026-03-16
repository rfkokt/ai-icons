"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Sliders, ArrowUpRight } from "lucide-react"

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* Empty State */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#B9FF66] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          Create Your Icon
        </h1>
        <p className="text-zinc-500 max-w-md">
          Describe the icon you want to create and let AI do the magic
        </p>
      </div>

      {/* Floating Prompt Bar */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl border-2 border-black brutalist-shadow p-2">
          {/* Prompt Input */}
          <div className="p-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your icon... e.g., 'A shopping cart icon with a small bag inside'"
              className="w-full resize-none border-none outline-none text-sm placeholder:text-zinc-400 min-h-[60px]"
              rows={2}
            />
          </div>

          {/* Options Bar */}
          <div className="flex items-center justify-between gap-2 px-3 pb-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs brutalist-border-2 rounded-lg"
              >
                <Sliders className="h-3.5 w-3.5" />
                Options
              </Button>

              <Separator orientation="vertical" className="h-5" />

              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-zinc-500"
              >
                Style: Minimalist
              </Button>
            </div>

            <Button className="bg-[#B9FF66] text-black border-2 border-black rounded-xl px-4 h-9 text-sm font-semibold brutalist-shadow-sm hover:bg-[#a8ef55]">
              Generate
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {[
            "User profile avatar",
            "Settings gear",
            "Shopping cart",
            "Notification bell",
            "Message bubble",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}