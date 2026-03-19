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

    const { id: packPrompt } = await params
    const userId = clerkUser.id

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { data: icons, error: fetchError } = await supabaseAdmin
      .from("generated_icons")
      .select("id")
      .eq("user_id", userId)
      .ilike("prompt", `${packPrompt}%`)

    if (fetchError) {
      console.error("Fetch icons error:", fetchError)
      return NextResponse.json({ error: "Failed to fetch icons" }, { status: 500 })
    }

    if (!icons || icons.length === 0) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 })
    }

    const { error: updateError } = await supabaseAdmin
      .from("generated_icons")
      .update({
        is_public: false,
        shared_at: null
      })
      .eq("user_id", userId)
      .ilike("prompt", `${packPrompt}%`)

    if (updateError) {
      console.error("Unshare pack error:", updateError)
      return NextResponse.json({ error: "Failed to unshare pack" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Pack unshared successfully"
    })
  } catch (error) {
    console.error("Unshare pack error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
