import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    const userId = clerkUser?.id || "user_3B1Xbgsjx3jd6ogLftxzQ9lqweH"

    const { data: icons, error } = await supabaseAdmin
      .from("generated_icons")
      .select("id, name, prompt, png_key, svg_key, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch history:", error)
      return NextResponse.json({ success: true, icons: [] })
    }

    if (!icons || icons.length === 0) {
      return NextResponse.json({ success: true, icons: [] })
    }

    // Group icons by base prompt
    const packs: Record<string, { prompt: string; icons: typeof icons; created_at: string }> = {}
    
    for (const icon of icons) {
      const basePrompt = icon.prompt.replace(/-\d+$/, '')
      const baseName = icon.name ? icon.name.replace(/-\d+$/, '') : basePrompt
      
      if (!packs[basePrompt]) {
        packs[basePrompt] = {
          prompt: baseName,
          icons: [],
          created_at: icon.created_at,
        }
      }
      packs[basePrompt].icons.push(icon)
      if (new Date(icon.created_at) < new Date(packs[basePrompt].created_at)) {
        packs[basePrompt].created_at = icon.created_at
      }
    }

    const packList = Object.values(packs).map(pack => ({
      id: pack.icons[0]?.id,
      prompt: pack.prompt,
      iconCount: pack.icons.length,
      preview: pack.icons[0]?.png_key ? `/api/download/${encodeURIComponent(pack.icons[0].png_key)}` : null,
      created_at: pack.created_at,
    }))

    return NextResponse.json({
      success: true,
      icons: packList,
    })
  } catch (error) {
    console.error("History API error:", error)
    return NextResponse.json({ success: true, icons: [] })
  }
}