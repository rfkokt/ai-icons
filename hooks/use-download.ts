"use client"

import { toast } from "sonner"

interface UseDownloadOptions {
  onSuccess?: (format: string) => void
  onError?: (error: Error) => void
}

export function useDownload(options?: UseDownloadOptions) {
  const download = async (key: string, prompt: string, format: "png" | "svg") => {
    try {
      const a = document.createElement("a")
      a.href = `/api/download/${encodeURIComponent(key)}?format=${format}`
      a.download = `${prompt.replace(/\s+/g, "-")}.${format}`
      a.click()
      toast.success(`${format.toUpperCase()} downloading...`)
      options?.onSuccess?.(format)
    } catch (error) {
      toast.error("Download failed")
      options?.onError?.(error as Error)
    }
  }

  return { download }
}
