"use client"

import * as React from "react"
import { HiChevronDown } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import gsap from "gsap"

// ============================================================================
// TYPES
// ============================================================================

interface AccordionContextValue {
  value: string | null
  toggleItem: (value: string) => void
  allowMultiple: boolean
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

// ============================================================================
// ROOT COMPONENT
// ============================================================================

interface AccordionProps {
  children: React.ReactNode
  className?: string
  defaultValue?: string | string[]
  allowMultiple?: boolean
}

export function Accordion({
  children,
  className,
  defaultValue,
  allowMultiple = false
}: AccordionProps) {
  const [value, setValue] = React.useState<string | string[] | null>(
    allowMultiple && Array.isArray(defaultValue) ? defaultValue : (defaultValue || null)
  )

  const toggleItem = (itemValue: string) => {
    if (allowMultiple) {
      setValue((prev) => {
        const values = Array.isArray(prev) ? prev : []
        if (values.includes(itemValue)) {
          return values.filter(v => v !== itemValue)
        } else {
          return [...values, itemValue]
        }
      })
    } else {
      setValue((prev) => (prev === itemValue ? null : itemValue))
    }
  }

  const contextValue = React.useMemo(
    () => ({
      value: allowMultiple && Array.isArray(value) ? value[0] || null : value as string | null,
      toggleItem,
      allowMultiple
    }),
    [value, allowMultiple]
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("space-y-3", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// ============================================================================
// ITEM COMPONENT
// ============================================================================

interface AccordionItemProps {
  children: React.ReactNode
  className?: string
  value: string
}

export function AccordionItem({ children, className, value }: AccordionItemProps) {
  return (
    <div className={cn("accordion-item", className)} data-value={value}>
      {children}
    </div>
  )
}

// ============================================================================
// TRIGGER COMPONENT
// ============================================================================

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  showIcon?: boolean
  variant?: "default" | "brutalist"
}

export function AccordionTrigger({
  children,
  className,
  showIcon = true,
  variant = "brutalist"
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  const itemValue = React.useContext(AccordionItemValueContext)
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleClick = () => {
    if (context) {
      context.toggleItem(itemValue)
    }
  }

  // Check if this item is expanded
  React.useEffect(() => {
    if (context) {
      const expanded = context.value === itemValue
      setIsExpanded(expanded)
    }
  }, [context, itemValue])

  const baseStyles = "flex items-center justify-between w-full text-left transition-all duration-300"

  const variantStyles = {
    default: cn(
      "px-4 py-3",
      "hover:bg-zinc-50",
      "rounded-lg"
    ),
    brutalist: cn(
      "px-6 py-4",
      "bg-white",
      "border-2 border-black",
      "rounded-xl",
      "brutalist-shadow-sm",
      "hover:shadow-[4px_4px_0px_0px_#000000]",
      "hover:-translate-y-0.5",
      "hover:bg-[#B9FF66]",
      "active:shadow-[2px_2px_0px_0px_#000000]",
      "active:translate-y-0"
    )
  }

  return (
    <button
      onClick={handleClick}
      className={cn(baseStyles, variantStyles[variant], className)}
      aria-expanded={isExpanded}
    >
      <span className="flex-1 font-bold text-lg tracking-tight">
        {children}
      </span>
      {showIcon && (
        <HiChevronDown
          className={cn(
            "w-6 h-6 transition-transform duration-300 flex-shrink-0 ml-4",
            isExpanded && "rotate-180"
          )}
        />
      )}
    </button>
  )
}

// ============================================================================
// CONTENT COMPONENT
// ============================================================================

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "brutalist"
}

export function AccordionContent({
  children,
  className,
  variant = "brutalist"
}: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  const itemValue = React.useContext(AccordionItemValueContext)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [height, setHeight] = React.useState(0)

  // Check if this item is expanded
  React.useEffect(() => {
    if (context) {
      const expanded = context.value === itemValue
      setIsOpen(expanded)

      if (expanded && contentRef.current) {
        setHeight(contentRef.current.scrollHeight)
      } else {
        setHeight(0)
      }
    }
  }, [context, itemValue])

  // GSAP animation for smooth expand/collapse
  React.useEffect(() => {
    if (!contentRef.current) return

    if (isOpen) {
      gsap.to(contentRef.current, {
        height: "auto",
        duration: 0.4,
        ease: "power2.out",
        opacity: 1
      })
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.3,
        ease: "power2.in",
        opacity: 0
      })
    }
  }, [isOpen])

  const baseStyles = "overflow-hidden"

  const variantStyles = {
    default: cn(
      "px-4 pb-3",
      "text-zinc-600"
    ),
    brutalist: cn(
      "px-6 py-4 mt-2",
      "bg-zinc-50",
      "border-2 border-black",
      "rounded-xl",
      "text-zinc-700"
    )
  }

  return (
    <div
      ref={contentRef}
      className={cn(baseStyles, "h-0 opacity-0")}
      aria-hidden={!isOpen}
    >
      <div className={cn(variantStyles[variant], className)}>
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// INTERNAL CONTEXT
// ============================================================================

const AccordionItemValueContext = React.createContext<string>("")

// ============================================================================
// WRAPPER TO SET ITEM VALUE CONTEXT
// ============================================================================

export const AccordionItemWithWrapper = ({ value, children, className }: AccordionItemProps) => {
  const context = React.useContext(AccordionContext)
  const isExpanded = context?.value === value

  return (
    <AccordionItemValueContext.Provider value={value}>
      <div className={cn("accordion-item", className)} data-value={value} data-expanded={isExpanded}>
        {children}
      </div>
    </AccordionItemValueContext.Provider>
  )
}