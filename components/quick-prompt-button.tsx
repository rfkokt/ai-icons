import { Button } from "@/components/ui/button"

interface QuickPromptButtonProps {
  suggestion: string
  onClick: (suggestion: string) => void
  className?: string
}

export function QuickPromptButton({ suggestion, onClick, className }: QuickPromptButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick(suggestion)}
      className={`px-3 py-2 sm:py-1.5 text-xs sm:text-sm text-zinc-600 h-auto border-2 border-black rounded-lg bg-white hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${className || ''}`}
    >
      {suggestion}
    </Button>
  )
}
