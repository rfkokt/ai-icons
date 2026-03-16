"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HiClipboard, HiCheckCircle } from "react-icons/hi2"

interface CopyLinkButtonProps {
  text: string
  className?: string
}

export function CopyLinkButton({ text, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      onClick={handleCopy}
      className={className}
    >
      {copied ? <HiCheckCircle className="h-4 w-4" /> : <HiClipboard className="h-4 w-4" />}
      <span className="ml-2">{copied ? "Copied" : "Copy Link"}</span>
    </Button>
  )
}
