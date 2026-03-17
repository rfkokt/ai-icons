import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = clerkUser.id
    const { id } = await params

    const { error } = await supabaseAdmin
      .from("generated_icons")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Failed to delete icon:", error)
      return NextResponse.json({ error: "Failed to delete icon" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete API error:", error)
    return NextResponse.json({ error: "Failed to delete icon" }, { status: 500 })
  }
}