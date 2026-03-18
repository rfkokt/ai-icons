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

    const { id } = await params

    // Get the icon to verify ownership
    const { data: icon, error: fetchError } = await supabaseAdmin
      .from("generated_icons")
      .select("id, user_id, is_public")
      .eq("id", id)
      .single()

    if (fetchError || !icon) {
      return NextResponse.json({ error: "Icon not found" }, { status: 404 })
    }

    if (icon.user_id !== clerkUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Toggle is_public
    const newPublicState = !icon.is_public
    const { error: updateError } = await supabaseAdmin
      .from("generated_icons")
      .update({ 
        is_public: newPublicState,
        shared_at: newPublicState ? new Date().toISOString() : null 
      })
      .eq("id", id)

    if (updateError) {
      console.error("Share error:", updateError)
      return NextResponse.json({ error: "Failed to share" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      is_public: newPublicState,
      message: newPublicState ? "Shared to community!" : "Removed from community"
    })
  } catch (error) {
    console.error("Share error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
