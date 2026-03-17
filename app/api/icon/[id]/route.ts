import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    // Delete the specific icon
    const { error: deleteError } = await supabaseAdmin
      .from("generated_icons")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (deleteError) {
      console.error("Failed to delete icon:", deleteError)
      return NextResponse.json({ success: false, error: "Failed to delete" })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete icon API error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete" })
  }
}