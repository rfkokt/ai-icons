import { Button } from "@/components/ui/button"

interface QuickPromptButtonProps {
  suggestion: string
  onClick: (suggestion: string) => void
}

export function QuickPromptButton({ suggestion, onClick }: QuickPromptButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick(suggestion)}
      className="px-3 py-2 sm:py-1.5 text-xs sm:text-sm text-zinc-600 h-auto"
    >
      {suggestion}
    </Button>
  )
}
