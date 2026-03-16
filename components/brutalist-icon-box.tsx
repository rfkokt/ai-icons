import { cn } from "@/lib/utils"
import { IconType } from "react-icons"

interface BrutalistIconBoxProps {
  icon: IconType
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "dark"
  className?: string
}

export function BrutalistIconBox({ 
  icon: Icon, 
  size = "md", 
  variant = "primary",
  className 
}: BrutalistIconBoxProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12 sm:w-16 sm:h-16",
    lg: "w-16 h-16",
  }

  const variantClasses = {
    primary: "bg-[#B9FF66]",
    secondary: "bg-white",
    dark: "bg-black",
  }

  const iconSizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6 sm:h-8 sm:w-8",
    lg: "h-8 w-8",
  }

  const iconColorClass = variant === "dark" ? "text-white" : "text-black"

  return (
    <div className={cn(
      "rounded-2xl flex items-center justify-center border-2 border-black brutalist-shadow-sm",
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <Icon className={cn(iconSizeClasses[size], iconColorClass)} />
    </div>
  )
}
