import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import JSZip from "jszip"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const userId = clerkUser.id
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "png" // png or svg

    // Get the icon to find the base prompt
    const { data: targetIcon, error: targetError } = await supabaseAdmin
      .from("generated_icons")
      .select("prompt, user_id")
      .eq("id", id)
      .single()

    if (targetError || !targetIcon) {
      return NextResponse.json({ success: false, error: "Pack not found" }, { status: 404 })
    }

    // Verify ownership
    if (targetIcon.user_id !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    // Extract base prompt
    const basePrompt = targetIcon.prompt.replace(/-\d+$/, '')

    // Find all icons with the same base prompt
    const { data: icons, error } = await supabaseAdmin
      .from("generated_icons")
      .select("id, prompt, png_key, svg_key")
      .eq("user_id", userId)
      .like("prompt", `${basePrompt}-%`)
      .order("prompt", { ascending: true })

    if (error || !icons || icons.length === 0) {
      return NextResponse.json({ success: false, error: "No icons found" }, { status: 404 })
    }

    // Create ZIP file
    const zip = new JSZip()

    // Get the correct key based on format
    const keyField = format === "svg" ? "svg_key" : "png_key"

    // Download all files and add to ZIP
    for (const icon of icons) {
      const key = icon[keyField]
      if (!key) continue

      // Download file from R2
      const { data: fileData, error: downloadError } = await supabaseAdmin.storage
        .from("icons")
        .download(key)

      if (downloadError || !fileData) {
        console.error(`Failed to download ${key}:`, downloadError)
        continue
      }

      // Get file extension
      const extension = format === "svg" ? "svg" : "png"

      // Add to ZIP with clean filename
      const cleanPrompt = icon.prompt.replace(/-\d+$/, '').replace(/[^a-zA-Z0-9]/g, '_')
      const filename = `${cleanPrompt}-${icon.id.slice(0, 8)}.${extension}`

      // Convert blob to array buffer
      const arrayBuffer = await fileData.arrayBuffer()
      zip.file(filename, arrayBuffer)
    }

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" })

    // Create filename from base prompt
    const cleanBasePrompt = basePrompt.replace(/[^a-zA-Z0-9]/g, '_')
    const zipFilename = `${cleanBasePrompt}-icons.${format}.zip`

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFilename}"`,
      },
    })
  } catch (error) {
    console.error("Download pack API error:", error)
    return NextResponse.json({ success: false, error: "Failed to download pack" }, { status: 500 })
  }
}
