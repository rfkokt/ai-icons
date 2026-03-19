import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") || "latest"
    const prompt = searchParams.get("prompt")

    let query = supabase
      .from("generated_icons")
      .select(`
        id,
        prompt,
        png_key,
        created_at,
        shared_at,
        users!inner (
          clerk_id,
          name,
          avatar_url
        )
      `)
      .eq("is_public", true)

    if (prompt) {
      query = query.ilike("prompt", `%${prompt}%`)
    }

    query = query.order("shared_at", { ascending: false, nullsFirst: false })

    const { data, error } = await query

    if (error) {
      console.error("Fetch community icons error:", error)
      return NextResponse.json({ error: "Failed to fetch icons" }, { status: 500 })
    }

    // Transform data to match expected format
    const icons = data.map((icon: any) => ({
      id: icon.id,
      prompt: icon.prompt,
      src: icon.png_key ? `/api/download/${encodeURIComponent(icon.png_key)}` : undefined,
      format: icon.png_key ? "png" : undefined,
      likes: 0, // TODO: Add likes column to database
      date: formatDate(icon.created_at),
      sharedBy: icon.users?.name || null,
      sharedByAvatar: icon.users?.avatar_url || null,
    }))

    return NextResponse.json(icons)
  } catch (error) {
    console.error("Community icons error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffMs / 604800000)

  if (diffMins < 60) return "Just now"
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`
  return "Long ago"
}
