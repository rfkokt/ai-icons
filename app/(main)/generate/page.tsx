"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HiSparkles, HiAdjustmentsHorizontal, HiArrowTopRightOnSquare, HiChevronDown } from "react-icons/hi2"
import { QuickPromptButton } from "@/components/quick-prompt-button"

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Empty State */}
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

      {/* Floating Prompt Bar */}
      <div className="w-full max-w-2xl px-2 sm:px-0">
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-black brutalist-shadow p-2 sm:p-3">
          {/* Prompt Input */}
          <div className="p-2 sm:p-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your icon... e.g., 'A shopping cart icon with a small bag inside'"
              className="w-full resize-none border-none outline-none text-sm placeholder:text-zinc-400 min-h-[60px] sm:min-h-[80px]"
              rows={2}
            />
          </div>

          {/* Options Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-2 sm:px-3 pb-2 sm:pb-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-10 sm:h-9 gap-1.5 text-xs sm:text-sm brutalist-border-2 rounded-lg flex-shrink-0"
              >
                <HiAdjustmentsHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Options
              </Button>

              <Separator orientation="vertical" className="hidden sm:block h-5" />

              <Button
                variant="ghost"
                size="sm"
                className="h-10 sm:h-9 text-xs sm:text-sm text-zinc-500 flex-shrink-0"
              >
                Style: Minimalist
                <HiChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
              </Button>
            </div>

            <Button className="bg-[#B9FF66] text-black border-2 border-black rounded-xl px-4 sm:px-6 h-10 sm:h-11 text-sm font-semibold brutalist-shadow-sm hover:bg-[#a8ef55] w-full sm:w-auto">
              Generate
              <HiArrowTopRightOnSquare className="h-4 w-4 ml-1.5" />
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
            />
          ))}
        </div>
      </div>

      {/* Mobile Bottom Padding for Bottom Nav */}
      <div className="lg:hidden h-4" />
    </div>
  )
}