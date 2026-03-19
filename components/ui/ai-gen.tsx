"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  MessageCircle,
  Sparkles,
  Wand2,
  Loader2,
  Play,
  Pause,
  RotateCw,
  History,
  AlertCircle,
  Palette,
  ImageIcon,
  Sun,
  User,
  Monitor,
  Cpu,
  RatioIcon as AspectRatio,
  Film,
  CuboidIcon as Cube,
  ArrowLeft,
  Clock,
  Search,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

type GenerationMode = "image" | "video" | "avatar"

interface GenerationSettings {
  style: string
  backgroundColor: string
  lighting: string
  pose: string
  aspectRatio: string
  aiModel: string
  resolution: string
  prompt: string
  negativePrompt: string
  seed?: number
  steps?: number
}

interface HistoryItem {
  id: string
  type: GenerationMode
  url: string
  prompt: string
  timestamp: Date
}

export function AIMultiModalGeneration() {
  const [mode, setMode] = useState<GenerationMode>("image")
  const [showForm, setShowForm] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const [generatedItems, setGeneratedItems] = useState<HistoryItem[]>([
    {
      id: "1",
      type: "image",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      prompt: "Minimalist brutalist 3D shape floating",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      type: "image",
      url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop",
      prompt: "Neon liquid gradients blending",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ])

  const [settings, setSettings] = useState<GenerationSettings>({
    style: "minimalist_studio",
    backgroundColor: "transparent",
    lighting: "studio",
    pose: "front",
    aspectRatio: "1:1",
    aiModel: "stable-diffusion-xl",
    resolution: "1024x1024",
    prompt: "",
    negativePrompt: "blurry, low quality, distorted features, text",
  })

  const placeholderPrompts = {
    image: "Describe your icon... e.g., 'A shopping cart icon'",
    video: "Short animation of a rotating coin",
    avatar: "3D avatar of a young professional with glasses, detailed face",
  }

  const loadingTexts = {
    image: ["Creating your masterpiece...", "Finding the perfect colors...", "Adding the final touches..."],
    video: ["Generating video frames...", "Applying motion effects...", "Rendering your video..."],
    avatar: ["Building 3D mesh...", "Applying textures...", "Finalizing your avatar..."],
  }

  const aiModels = {
    image: [
      { value: "stable-diffusion-xl", label: "Stable Diffusion XL" },
      { value: "midjourney-v5", label: "Midjourney v5" },
      { value: "dalle-3", label: "DALL-E 3" },
      { value: "imagen", label: "Imagen" },
    ],
    video: [
      { value: "gen-2", label: "Gen-2" },
      { value: "runway-gen-2", label: "Runway Gen-2" },
      { value: "pika-labs", label: "Pika Labs" },
      { value: "sora", label: "Sora" },
    ],
    avatar: [
      { value: "dreamshaper-3d", label: "DreamShaper 3D" },
      { value: "3d-diffusion", label: "3D Diffusion" },
      { value: "meshy", label: "Meshy" },
      { value: "luma", label: "Luma AI" },
    ],
  }

  const resolutions = {
    image: [
      { value: "512x512", label: "512×512" },
      { value: "768x768", label: "768×768" },
      { value: "1024x1024", label: "1024×1024" },
      { value: "1536x1536", label: "1536×1536" },
    ],
    video: [
      { value: "512x512", label: "512×512" },
      { value: "768x768", label: "768×768" },
      { value: "1024x576", label: "1024×576 (16:9)" },
      { value: "1280x720", label: "1280×720 (HD)" },
    ],
    avatar: [
      { value: "512x512", label: "512×512" },
      { value: "768x768", label: "768×768" },
      { value: "1024x1024", label: "1024×1024" },
      { value: "2048x2048", label: "2048×2048" },
    ],
  }

  useEffect(() => {
    if (mode === "image") {
      setPromptSuggestions([
        "Premium coffee cup with latte art",
        "Modern minimal workspace with macbook",
        "Cute robotic dog fetching a bone",
      ])
    } else if (mode === "video") {
      setPromptSuggestions([
        "Person walking in urban environment, cinematic lighting",
        "Close-up of face with changing expressions",
        "Rotating view of subject in studio setting",
      ])
    } else {
      setPromptSuggestions([
        "Realistic 3D avatar with professional attire",
        "Stylized cartoon character with expressive features",
        "Detailed 3D bust with photorealistic textures",
      ])
    }
  }, [mode])

  useEffect(() => {
    if (!isLoading) {
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + (mode === "image" ? 1.5 : mode === "video" ? 0.8 : 0.5)
      })
    }, 30)

    return () => clearInterval(interval)
  }, [isLoading, mode])

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts[mode].length)
    }, 1500)

    return () => clearInterval(interval)
  }, [isLoading, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings.prompt.trim()) {
      setError("Please enter a prompt first")
      return
    }
    
    setShowForm(false)
    setIsLoading(true)
    setError(null)

    try {
      // Direct integration with existing API logic
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: settings.prompt,
          style: settings.style,
          count: 1, // Only 1 for demo purposes
          format: {
            iconType: "ecommerce",
            background: settings.backgroundColor === "transparent" ? "transparent" : "solid",
            designStyle: settings.style,
            colorPalette: "monochrome",
            visualDetails: "clean lines"
          }
        }),
      })

      const data = await response.json()

      if (data.success && data.icons && data.icons.length > 0) {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          type: mode,
          url: data.icons[0].preview,
          prompt: settings.prompt,
          timestamp: new Date(),
        }
        setGeneratedItems((prev) => [newItem, ...prev])
        toast.success("Generated successfully!")
      } else {
        // Fallback to simulation if API fails or quota exceeded
        console.warn("API failed, falling back to simulated image", data.error)
        await new Promise((resolve) => setTimeout(resolve, 3000))
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          type: mode,
          url: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2564&auto=format&fit=crop",
          prompt: settings.prompt,
          timestamp: new Date(),
        }
        setGeneratedItems((prev) => [newItem, ...prev])
        toast.success("Generated successfully! (Simulated)")
      }
    } catch (err) {
      setError(`Failed to generate ${mode}. Please try again.`)
      setShowForm(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSettings = () => {
    setShowForm(true)
    setShowHistory(false)
    setError(null)
  }

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode)
    setShowForm(true)
    setShowHistory(false)
    setError(null)
  }

  const handleViewHistory = () => {
    setShowForm(false)
    setShowHistory(true)
  }

  const handleSelectHistoryItem = (id: string) => {
    const item = generatedItems.find((item) => item.id === id)
    if (item) {
      setMode(item.type)
      // Moving selected item to the top
      setGeneratedItems((prev) => [item, ...prev.filter(i => i.id !== id)])
      setShowHistory(false)
      setShowForm(false)
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings({ ...settings, prompt: e.target.value })
  }

  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings({ ...settings, negativePrompt: e.target.value })
  }

  const handleSeedChange = (value: number[]) => {
    setSettings({ ...settings, seed: value[0] })
  }

  const handleStepsChange = (value: number[]) => {
    setSettings({ ...settings, steps: value[0] })
  }

  const applyPromptSuggestion = (suggestion: string) => {
    setSettings({ ...settings, prompt: suggestion })
  }

  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleRotate = () => setIsRotating(!isRotating)

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString()
  }

  const filteredItems = generatedItems.filter((item) => item.prompt.toLowerCase().includes(searchQuery.toLowerCase()))

  const renderHeader = () => (
    <div className="p-4 sm:p-5 flex items-center justify-between border-b-3 border-black bg-white rounded-t-[20px] z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="text-xl font-black text-black">AI Multi-Modal Generation</h3>
          <p className="text-sm font-semibold text-zinc-500">Create stunning Neo-Brutalist elements</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleViewHistory}
        className="p-2 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 border-2 border-black bg-white hover:bg-[#B9FF66] shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-black font-bold"
      >
        <History className="w-5 h-5" />
        <span className="hidden sm:inline">History</span>
      </button>
    </div>
  )

  const renderError = () =>
    error && (
      <div className="m-4 px-4 py-3 flex items-center gap-2 text-sm font-bold border-2 border-black shadow-[4px_4px_0_0_#000] text-black bg-red-400 rounded-xl">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>{error}</p>
      </div>
    )

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="space-y-4">
        <div className="space-y-2">
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
                    {promptSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => applyPromptSuggestion(suggestion)}
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
            value={settings.prompt}
            onChange={handlePromptChange}
            placeholder={placeholderPrompts[mode]}
          />
        </div>

        <div className="flex items-center space-x-3 bg-zinc-100 p-3 rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000]">
          <Switch id="advanced-mode" checked={advancedMode} onCheckedChange={setAdvancedMode} />
          <Label htmlFor="advanced-mode" className="text-sm font-black text-black">
            Advanced Mode
          </Label>
        </div>

        {advancedMode && (
          <div className="space-y-4 p-4 bg-zinc-50 border-2 border-black rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <div className="space-y-2">
              <label className="text-sm font-black text-black">Negative Prompt</label>
              <Textarea
                value={settings.negativePrompt}
                onChange={handleNegativePromptChange}
                placeholder="Elements to avoid in generation"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-black">Seed</label>
                <span className="text-sm font-bold bg-[#B9FF66] px-2 py-0.5 rounded-md border border-black">{settings.seed || 0}</span>
              </div>
              <Slider defaultValue={[settings.seed || 0]} max={1000000} step={1} onValueChange={handleSeedChange} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-black">Steps</label>
                <span className="text-sm font-bold bg-[#B9FF66] px-2 py-0.5 rounded-md border border-black">{settings.steps || 30}</span>
              </div>
              <Slider
                defaultValue={[settings.steps || 30]}
                min={10}
                max={150}
                step={1}
                onValueChange={handleStepsChange}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 mt-auto pt-4">
        {renderSettings()}

        <button
          type="submit"
          disabled={isLoading || !settings.prompt.trim()}
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#B9FF66] hover:bg-[#a8e655] text-black text-lg font-black rounded-xl border-3 border-black shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:shadow-[4px_4px_0_0_#000000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          <Sparkles className="w-5 h-5 fill-black" />
          Generate {mode === "image" ? "Icon" : mode === "video" ? "Video" : "Avatar"}
        </button>
      </div>
    </form>
  )

  const renderSettings = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* AI Model Select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold flex items-center gap-2">
          <Cpu className="w-4 h-4 text-black" /> Model
        </label>
        <Select value={settings.aiModel} onValueChange={(value: string) => setSettings({ ...settings, aiModel: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {aiModels[mode].map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resolution Select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold flex items-center gap-2">
          <Monitor className="w-4 h-4 text-black" /> Quality
        </label>
        <Select value={settings.resolution} onValueChange={(value: string) => setSettings({ ...settings, resolution: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {resolutions[mode].map((res) => (
              <SelectItem key={res.value} value={res.value}>
                {res.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Style Select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold flex items-center gap-2">
          <Palette className="w-4 h-4 text-black" /> Style
        </label>
        <Select value={settings.style} onValueChange={(value: string) => setSettings({ ...settings, style: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimalist_studio">Minimalist Studio</SelectItem>
            <SelectItem value="artistic">Artistic</SelectItem>
            <SelectItem value="3d_clay">3D Clay</SelectItem>
            <SelectItem value="isometric">Isometric</SelectItem>
            {mode === "avatar" && <SelectItem value="cartoon">Cartoon</SelectItem>}
            {mode === "video" && <SelectItem value="cinematic">Cinematic</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {/* Background Select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-black" /> Context
        </label>
        <Select
          value={settings.backgroundColor}
          onValueChange={(value: string) => setSettings({ ...settings, backgroundColor: value }) }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transparent">Transparent</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="solid">Solid Color</SelectItem>
            {mode !== "avatar" && <SelectItem value="outdoor">Outdoor</SelectItem>}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderPreview = () => (
    <div className="p-4 sm:p-6 flex flex-col h-full flex-1 overflow-y-auto">
      <div className="rounded-2xl mb-6 flex flex-1 items-center justify-center bg-zinc-50 border-3 border-black border-dashed min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 p-6 w-full max-w-sm">
            <div className="relative w-24 h-24">
              <Loader2 className="w-full h-full animate-spin text-black drop-shadow-md" />
              <div className="absolute inset-0 bg-transparent rounded-full border-4 border-[#B9FF66] opacity-30 shadow-[0_0_15px_#B9FF66]" />
            </div>
            <div className="space-y-2 text-center w-full">
              <p className="text-lg font-black text-black">
                {loadingTexts[mode][currentTextIndex]}
              </p>
              <div className="w-full h-4 bg-white border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0_0_#000]">
                <div
                  className="h-full bg-[#B9FF66] transition-all duration-300 ease-linear border-r-2 border-black"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full h-full p-2">
            <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden shadow-[8px_8px_0_0_#000] border-4 border-black group">
              <Image
                src={generatedItems[0]?.url || "/placeholder.svg?height=400&width=400"}
                fill
                alt={`AI generated ${mode}`}
                className={`object-cover ${isRotating ? "animate-spin-slow" : ""}`}
              />

              {mode !== "image" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-white border-3 border-black hover:bg-[#B9FF66] shadow-[4px_4px_0_0_#000] transition-colors"
                  >
                    {isPlaying ? <Pause className="w-8 h-8 text-black" /> : <Play className="w-8 h-8 text-black ml-1" />}
                  </button>
                </div>
              )}

              {mode === "avatar" && (
                <button
                  onClick={toggleRotate}
                  className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white border-3 border-black hover:bg-[#B9FF66] shadow-[4px_4px_0_0_#000] transition-colors"
                >
                  <RotateCw className="w-6 h-6 text-black" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="space-y-6 mt-auto">
          {renderGallery()}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleBackToSettings}
              className="w-full sm:w-1/2 h-12 flex items-center justify-center gap-2 bg-white text-black text-base font-bold rounded-xl border-3 border-black shadow-[4px_4px_0_0_#000000] hover:bg-zinc-100 hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Wand2 className="w-4 h-4" /> Edit / Try Again
            </button>
            <button
              className="w-full sm:w-1/2 h-12 flex items-center justify-center gap-2 bg-[#B9FF66] hover:bg-[#a8e655] text-black text-base font-black rounded-xl border-3 border-black shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <ArrowLeft className="w-5 h-5 -rotate-90" /> Download
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderGallery = () => {
    const items = generatedItems.slice(0, 4)
    if (items.length === 0) return null

    return (
      <div className="space-y-3 p-4 bg-zinc-50 border-2 border-black rounded-xl">
        <h4 className="text-sm font-black text-black">Recent Generations</h4>
        <div className="grid grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer" onClick={() => handleSelectHistoryItem(item.id)}>
              <Image src={item.url} alt={item.prompt} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-xs px-2 text-center line-clamp-2">{item.prompt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderHistory = () => (
    <div className="flex flex-col h-full flex-1 overflow-hidden p-4 sm:p-6 bg-zinc-50 rounded-b-[20px]">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleBackToSettings} className="p-2 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search generations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border-2 border-black text-base font-medium shadow-[2px_2px_0_0_#000] rounded-xl focus-visible:ring-[#B9FF66]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-1 pb-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Clock className="w-12 h-12 text-zinc-300 mb-3" />
            <p className="text-lg font-bold text-zinc-400">No generations found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectHistoryItem(item.id)}
              className="flex items-center gap-4 p-3 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer transition-all"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-black">
                <Image src={item.url} alt={item.prompt} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-black truncate">{item.prompt}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-300">{formatDate(item.timestamp)}</span>
                  <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-300 capitalize">{item.type}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="relative w-full max-w-4xl bg-white border-4 border-black rounded-[24px] shadow-[8px_8px_0px_0px_#000000] min-h-[680px] flex flex-col mx-auto overflow-hidden">
      {renderHeader()}

      <div className="px-4 pt-4 shrink-0 bg-white border-b-3 border-black">
        <Tabs value={mode} onValueChange={(value) => handleModeChange(value as GenerationMode)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full bg-zinc-100 border-2 border-black p-1 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <TabsTrigger value="image" className="flex items-center gap-2 data-[state=active]:bg-[#B9FF66] data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-sm rounded-lg font-black py-2 transition-all">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Icon</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2 data-[state=active]:bg-[#B9FF66] data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-sm rounded-lg font-black py-2 transition-all">
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Video</span>
            </TabsTrigger>
            <TabsTrigger value="avatar" className="flex items-center gap-2 data-[state=active]:bg-[#B9FF66] data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-sm rounded-lg font-black py-2 transition-all">
              <Cube className="w-4 h-4" />
              <span className="hidden sm:inline">3D Avatar</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        {renderError()}
        {showHistory ? renderHistory() : showForm ? renderForm() : renderPreview()}
      </div>
    </div>
  )
}
