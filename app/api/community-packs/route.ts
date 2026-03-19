import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") || "latest"

    // Get all public icons grouped by prompt
    let query = supabase
      .from("generated_icons")
      .select("id, prompt, png_key, created_at")
      .eq("is_public", true)

    // Sort based on parameter
    if (sort === "mostLoved") {
      query = query.order("created_at", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error("Fetch community icons error:", error)
      return NextResponse.json({ error: "Failed to fetch icons" }, { status: 500 })
    }

    // Group icons by prompt and create packs
    const groupedPacks = data.reduce((acc: Record<string, any[]>, icon) => {
      const prompt = icon.prompt || "Untitled"
      if (!acc[prompt]) {
        acc[prompt] = []
      }
      acc[prompt].push(icon)
      return acc
    }, {})

    // Get like counts for all packs
    const packPrompts = Object.keys(groupedPacks)
    const { data: likeCounts } = await supabase
      .from("pack_likes")
      .select("pack_id")
      .in("pack_id", packPrompts)

    const likesMap = likeCounts?.reduce((acc: Record<string, number>, like) => {
      acc[like.pack_id] = (acc[like.pack_id] || 0) + 1
      return acc
    }, {}) || {}

    // Get current user's likes
    let userLikes: Set<string> = new Set()
    if (clerkUser) {
      const { data: userLikesData } = await supabase
        .from("pack_likes")
        .select("pack_id")
        .eq("user_id", clerkUser.id)

      userLikes = new Set(userLikesData?.map(like => like.pack_id) || [])
    }

    const packs = Object.entries(groupedPacks).map(([prompt, icons]) => {
      const totalLikes = likesMap[prompt] || 0
      return {
        id: prompt, // Use prompt as ID for consistent liking
        prompt,
        preview: icons[0]?.png_key ? `/api/download/${encodeURIComponent(icons[0].png_key)}` : null,
        iconCount: icons.length,
        totalLikes,
        isLiked: userLikes.has(prompt)
      }
    })

    // Sort by likes if requested
    if (sort === "mostLoved") {
      packs.sort((a, b) => b.totalLikes - a.totalLikes)
    }

    return NextResponse.json(packs)
  } catch (error) {
    console.error("Community packs error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
