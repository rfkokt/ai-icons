import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get the icon to find the base prompt
    const { data: targetIcon, error: targetError } = await supabaseAdmin
      .from("generated_icons")
      .select("name, prompt")
      .eq("id", id)
      .single()

    if (targetError || !targetIcon) {
      return NextResponse.json({ success: false, error: "Pack not found" }, { status: 404 })
    }

    // Extract base prompt
    const basePrompt = targetIcon.prompt.replace(/-\d+$/, '')

    // Find all icons with the same base prompt
    const { data: icons, error } = await supabaseAdmin
      .from("generated_icons")
      .select("id, prompt, png_key, svg_key, created_at")
      .like("prompt", `${basePrompt}-%`)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Failed to fetch pack:", error)
      return NextResponse.json({ success: false, icons: [] })
    }

    const baseName = targetIcon.name ? targetIcon.name.replace(/-\d+$/, '') : basePrompt

    return NextResponse.json({
      success: true,
      prompt: baseName,
      icons: icons || [],
    })
  } catch (error) {
    console.error("Pack API error:", error)
    return NextResponse.json({ success: false, icons: [] })
  }
}

export async function DELETE(
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

    // Get the icon to find the base prompt
    const { data: targetIcon } = await supabaseAdmin
      .from("generated_icons")
      .select("prompt")
      .eq("id", id)
      .single()

    if (!targetIcon) {
      return NextResponse.json({ success: false, error: "Icon not found" }, { status: 404 })
    }

    // Extract base prompt and delete all icons with the same base prompt
    const basePrompt = targetIcon.prompt.replace(/-\d+$/, '')
    
    // Delete all icons with this base prompt
    const { error: deleteError } = await supabaseAdmin
      .from("generated_icons")
      .delete()
      .eq("user_id", userId)
      .like("prompt", `${basePrompt}-%`)

    if (deleteError) {
      console.error("Failed to delete pack:", deleteError)
      return NextResponse.json({ success: false, error: "Failed to delete" })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete pack API error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete" })
  }
}