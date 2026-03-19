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

    console.log("Like request:", { packId, userId })

    // Check if already liked
    const { data: existingLike, error: checkError } = await supabaseAdmin
      .from("pack_likes")
      .select("id")
      .eq("pack_id", packId)
      .eq("user_id", userId)
      .single()

    console.log("Existing like check:", { existingLike, checkError })

    if (checkError && checkError.code !== "PGRST116") {
      // Not found is ok, means not liked yet
      console.error("Check like error:", checkError)
    }

    if (existingLike) {
      // Unlike (remove)
      const { error: deleteError } = await supabaseAdmin
        .from("pack_likes")
        .delete()
        .eq("pack_id", packId)
        .eq("user_id", userId)

      if (deleteError) {
        console.error("Unlike error:", deleteError)
        return NextResponse.json({ error: "Failed to unlike" }, { status: 500 })
      }

      // Get new like count
      const { data: allLikes, error: countError } = await supabaseAdmin
        .from("pack_likes")
        .select("id")
        .eq("pack_id", packId)

      const likeCount = allLikes?.length || 0

      return NextResponse.json({
        success: true,
        liked: false,
        message: "Removed from liked",
        likeCount
      })
    } else {
      // Like (insert)
      const { error: insertError } = await supabaseAdmin
        .from("pack_likes")
        .insert({ pack_id: packId, user_id: userId })

      if (insertError) {
        console.error("Like error:", insertError)
        return NextResponse.json({ error: "Failed to like", details: insertError }, { status: 500 })
      }

      // Get new like count
      const { data: allLikes, error: countError } = await supabaseAdmin
        .from("pack_likes")
        .select("id")
        .eq("pack_id", packId)

      const likeCount = allLikes?.length || 0

      return NextResponse.json({
        success: true,
        liked: true,
        message: "Added to liked!",
        likeCount
      })
    }
  } catch (error) {
    console.error("Like toggle error:", error)
    return NextResponse.json({ error: "Something went wrong", details: String(error) }, { status: 500 })
  }
}
