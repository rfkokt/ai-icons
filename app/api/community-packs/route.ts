import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") || "latest"

    // Get all public icons grouped by prompt with user info
    let query = supabase
      .from("generated_icons")
      .select(`
        id,
        prompt,
        png_key,
        created_at,
        shared_at,
        user_id,
        users!inner (
          clerk_id,
          name,
          avatar_url
        )
      `)
      .eq("is_public", true)

    if (sort === "mostLoved") {
      query = query.order("shared_at", { ascending: false, nullsFirst: false })
    } else {
      query = query.order("shared_at", { ascending: false, nullsFirst: false })
    }

    const { data, error } = await query

    if (error) {
      console.error("Fetch community icons error:", error)
      return NextResponse.json({ error: "Failed to fetch icons" }, { status: 500 })
    }

    // Group icons by base prompt and create packs, tracking user info
    const groupedPacks = data.reduce((acc: Record<string, any[]>, icon) => {
      const basePrompt = icon.prompt.replace(/-\d+$/, '')
      if (!acc[basePrompt]) {
        acc[basePrompt] = []
      }
      acc[basePrompt].push(icon)
      return acc
    }, {})

    // Get the user info for each pack (from the first icon in each group)
    const packUserInfo = Object.entries(groupedPacks).reduce((acc: Record<string, { name: string | null; avatar_url: string | null; clerk_id: string | null }>, [basePrompt, icons]: [string, any[]]) => {
      const firstIcon = icons[0]
      if (firstIcon?.users) {
        acc[basePrompt] = {
          name: firstIcon.users.name,
          avatar_url: firstIcon.users.avatar_url,
          clerk_id: firstIcon.users.clerk_id
        }
      }
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

    const packs = Object.entries(groupedPacks).map(([basePrompt, icons]) => {
      const totalLikes = likesMap[basePrompt] || 0
      const userInfo = packUserInfo[basePrompt] || { name: null, avatar_url: null, clerk_id: null }
      const isOwner = clerkUser ? clerkUser.id === userInfo.clerk_id : false
      return {
        id: basePrompt,
        prompt: basePrompt,
        preview: icons[0]?.png_key ? `/api/download/${encodeURIComponent(icons[0].png_key)}` : null,
        iconCount: icons.length,
        totalLikes,
        isLiked: userLikes.has(basePrompt),
        sharedBy: userInfo.name,
        sharedByAvatar: userInfo.avatar_url,
        isOwner,
        pngKeys: icons.map(i => i.png_key).filter(Boolean)
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
