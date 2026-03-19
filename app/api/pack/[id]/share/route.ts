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

    const { data: firstIcon, error: iconError } = await supabaseAdmin
      .from("generated_icons")
      .select("id, prompt")
      .eq("id", packId)
      .eq("user_id", userId)
      .single()

    if (iconError || !firstIcon) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 })
    }

    const basePrompt = firstIcon.prompt.replace(/-\d+$/, '')

    const { data: allUserIcons, error: allIconsError } = await supabaseAdmin
      .from("generated_icons")
      .select("id")
      .eq("user_id", userId)
      .ilike("prompt", `${basePrompt}%`)

    if (allIconsError) {
      console.error("Fetch icons error:", allIconsError)
      return NextResponse.json({ error: "Failed to fetch icons" }, { status: 500 })
    }

    if (!allUserIcons || allUserIcons.length === 0) {
      return NextResponse.json({ error: "No icons in this pack" }, { status: 404 })
    }

    const { error: updateError } = await supabaseAdmin
      .from("generated_icons")
      .update({
        is_public: true,
        shared_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .ilike("prompt", `${basePrompt}%`)

    if (updateError) {
      console.error("Share pack error:", updateError)
      return NextResponse.json({ error: "Failed to share pack" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      count: allUserIcons.length,
      message: `Shared ${allUserIcons.length} icons as a pack to community!`
    })
  } catch (error) {
    console.error("Share pack error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
