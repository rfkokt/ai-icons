import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: packId } = await params
    const userId = clerkUser.id

    // Get all icons in the pack
    const { data: icons, error: fetchError } = await supabaseAdmin
      .from("generated_icons")
      .select("id, user_id, is_public")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Fetch icons error:", fetchError)
      return NextResponse.json({ error: "Failed to fetch icons" }, { status: 500 })
    }

    // If packId is provided, only share icons with that pack's prompt
    // Get the pack prompt first
    let targetPrompt = null
    if (packId !== "all") {
      const { data: pack } = await supabaseAdmin
        .from("history_packs")
        .select("prompt")
        .eq("id", packId)
        .single()

      if (pack) {
        targetPrompt = pack.prompt
      }
    }

    const iconsToShare = targetPrompt
      ? icons.filter(icon => icon.prompt === targetPrompt)
      : icons

    if (iconsToShare.length === 0) {
      return NextResponse.json({ error: "No icons to share" }, { status: 404 })
    }

    // Share all icons (set is_public to true and shared_at)
    const { error: updateError } = await supabaseAdmin
      .from("generated_icons")
      .update({
        is_public: true,
        shared_at: new Date().toISOString()
      })
      .in("id", iconsToShare.map(icon => icon.id))

    if (updateError) {
      console.error("Share pack error:", updateError)
      return NextResponse.json({ error: "Failed to share pack" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      count: iconsToShare.length,
      message: `Shared ${iconsToShare.length} icon${iconsToShare.length > 1 ? 's' : ''} to community!`
    })
  } catch (error) {
    console.error("Share pack error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
