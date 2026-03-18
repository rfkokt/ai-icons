"use client"

import { toast } from "sonner"
import JSZip from "jszip"

interface UsePackDownloadOptions {
  onSuccess?: (format: string, count: number) => void
  onError?: (error: Error) => void
}

export function usePackDownload(options?: UsePackDownloadOptions) {
  const downloadPack = async (
    icons: { png_key: string; prompt: string }[],
    packPrompt: string,
    format: "png" | "svg"
  ) => {
    const loadingId = toast.loading(`Creating ZIP file...`)

    try {
      const zip = new JSZip()

      for (let i = 0; i < icons.length; i++) {
        const icon = icons[i]
        const downloadUrl = `/api/download/${encodeURIComponent(icon.png_key)}?format=${format}`

        try {
          const response = await fetch(downloadUrl)
          const blob = await response.blob()
          zip.file(`${packPrompt.replace(/\s+/g, "-")}-${i + 1}.${format}`, blob)
        } catch (err) {
          console.error(`Failed to add icon ${i} to ZIP:`, err)
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = window.URL.createObjectURL(zipBlob)

      const a = document.createElement("a")
      a.href = url
      a.download = `${packPrompt.replace(/\s+/g, "-")}-${format.toUpperCase()}-icons.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.dismiss(loadingId)
      toast.success(`Pack downloaded: ${icons.length} ${format.toUpperCase()} icons`)
      options?.onSuccess?.(format, icons.length)
    } catch (error) {
      toast.dismiss(loadingId)
      toast.error("Failed to download pack")
      options?.onError?.(error as Error)
    }
  }

  const downloadPackById = async (packId: string, format: "png" | "svg") => {
    const loadingId = toast.loading(`Downloading ${format.toUpperCase()} pack...`)
    
    try {
      const downloadUrl = `/api/pack/${packId}/download?format=${format}`
      const response = await fetch(downloadUrl)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to download")
      }

      const contentDisposition = response.headers.get("Content-Disposition")
      let filename = `pack-icons.${format}.zip`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/)
        if (match?.[1]) filename = match[1]
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.dismiss(loadingId)
      toast.success(`Pack downloaded as ${format.toUpperCase()}!`)
    } catch (error) {
      toast.dismiss(loadingId)
      toast.error(error instanceof Error ? error.message : "Failed to download pack")
      options?.onError?.(error as Error)
    }
  }

  return { downloadPack, downloadPackById }
}
