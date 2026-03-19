"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HiBolt, HiClock, HiHeart, HiArrowUpTray, HiTrash } from "react-icons/hi2"
import { useState } from "react"

// ============================================================================
// QUICK ACTION BUTTON COMPONENT
// ============================================================================

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "primary" | "secondary" | "danger"
  disabled?: boolean
  loading?: boolean
}

interface QuickActionProps extends QuickAction {
  className?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function QuickAction({
  label,
  icon,
  onClick,
  variant = "primary",
  disabled = false,
  loading = false,
  className,
  size = "md",
  showLabel = true
}: QuickActionProps) {
  const [isPressed, setIsPressed] = useState(false)

  const baseStyles = "relative flex items-center justify-center gap-2 font-bold transition-all duration-150 border-2 border-black"

  const sizeStyles = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-5 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  }

  const variantStyles = {
    primary: cn(
      "bg-[#B9FF66] text-black",
      "hover:bg-[#a8e555]",
      "hover:shadow-[4px_4px_0px_0px_#000000]",
      "hover:-translate-y-0.5",
      "active:shadow-[2px_2px_0px_0px_#000000]",
      "active:translate-y-0",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
    ),
    secondary: cn(
      "bg-white text-black",
      "hover:bg-zinc-50",
      "brutalist-shadow-sm",
      "hover:shadow-[4px_4px_0px_0px_#000000]",
      "hover:-translate-y-0.5",
      "active:shadow-[2px_2px_0px_0px_#000000]",
      "active:translate-y-0",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brutalist-sm disabled:hover:translate-y-0"
    ),
    danger: cn(
      "bg-[#FF6B6B] text-white",
      "hover:bg-[#ff5555]",
      "hover:shadow-[4px_4px_0px_0px_#000000]",
      "hover:-translate-y-0.5",
      "active:shadow-[2px_2px_0px_0px_#000000]",
      "active:translate-y-0",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
    )
  }

  const handleClick = () => {
    if (!disabled && !loading) {
      // Press animation feedback
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), 150)
      onClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        isPressed && "shadow-[2px_2px_0px_0px_#000000] translate-y-0",
        className
      )}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {showLabel && <span>{label}</span>}
    </button>
  )
}

// ============================================================================
// QUICK ACTIONS PANEL COMPONENT
// ============================================================================

interface QuickActionsPanelProps {
  actions: QuickAction[]
  layout?: "horizontal" | "vertical" | "grid"
  className?: string
}

export function QuickActionsPanel({
  actions,
  layout = "horizontal",
  className
}: QuickActionsPanelProps) {
  const layoutStyles = {
    horizontal: "flex flex-wrap items-center gap-3",
    vertical: "flex flex-col gap-3",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
  }

  return (
    <div className={cn(layoutStyles[layout], className)}>
      {actions.map((action) => (
        <QuickAction key={action.id} {...action} />
      ))}
    </div>
  )
}

// ============================================================================
// FLOATING ACTION BAR (Bottom of screen for mobile-first)
// ============================================================================

interface FloatingActionBarProps {
  actions: QuickAction[]
  className?: string
}

export function FloatingActionBar({ actions, className }: FloatingActionBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "p-4 sm:p-6",
        "bg-white/95 backdrop-blur-sm",
        "border-t-2 border-black",
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        <QuickActionsPanel actions={actions} layout="horizontal" />
      </div>
    </div>
  )
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example 1: Generate page quick actions
export function GeneratePageActions() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => setIsGenerating(false), 2000)
  }

  const actions: QuickAction[] = [
    {
      id: "generate",
      label: "Generate",
      icon: <HiBolt className="w-5 h-5" />,
      onClick: handleGenerate,
      variant: "primary",
      loading: isGenerating
    },
    {
      id: "history",
      label: "History",
      icon: <HiClock className="w-5 h-5" />,
      onClick: () => console.log("Open history"),
      variant: "secondary"
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: <HiHeart className="w-5 h-5" />,
      onClick: () => console.log("Open favorites"),
      variant: "secondary"
    }
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Desktop: Top actions bar */}
      <div className="hidden lg:block">
        <QuickActionsPanel actions={actions} layout="horizontal" />
      </div>

      {/* Mobile: Floating action bar */}
      <div className="lg:hidden">
        <FloatingActionBar actions={actions} />
      </div>
    </div>
  )
}

// Example 2: Library page actions
export function LibraryPageActions() {
  const [selectedCount, setSelectedCount] = useState(0)

  const actions: QuickAction[] = [
    {
      id: "download",
      label: `Download${selectedCount > 0 ? ` (${selectedCount})` : ""}`,
      icon: <HiArrowUpTray className="w-5 h-5" />,
      onClick: () => console.log("Download selected"),
      variant: "primary",
      disabled: selectedCount === 0
    },
    {
      id: "delete",
      label: "Delete",
      icon: <HiTrash className="w-5 h-5" />,
      onClick: () => console.log("Delete selected"),
      variant: "danger",
      disabled: selectedCount === 0
    }
  ]

  return (
    <div className="p-6">
      <QuickActionsPanel actions={actions} layout="horizontal" />
    </div>
  )
}

// ============================================================================
// ACTION FEEDBACK COMPONENT
// ============================================================================

interface ActionFeedbackProps {
  show: boolean
  message: string
  type?: "success" | "error" | "info"
}

export function ActionFeedback({ show, message, type = "success" }: ActionFeedbackProps) {
  if (!show) return null

  const typeStyles = {
    success: "bg-[#B9FF66] border-black",
    error: "bg-[#FF6B6B] border-black text-white",
    info: "bg-white border-black"
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50",
        "px-6 py-4 rounded-xl",
        "border-2 border-black",
        "brutalist-shadow-sm",
        "font-bold",
        "animate-in slide-in-from-top-2 fade-in duration-300",
        typeStyles[type]
      )}
    >
      {message}
    </div>
  )
}
