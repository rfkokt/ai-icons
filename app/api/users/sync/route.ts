import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { clerkId, email, name, imageUrl } = await req.json()

    if (!clerkId || !email) {
      return NextResponse.json(
        { error: "Missing clerkId or email" },
        { status: 400 }
      )
    }

    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", clerkId)
      .single()

    if (existingUser) {
      await supabaseAdmin
        .from("users")
        .update({ email, name, avatar_url: imageUrl, updated_at: new Date().toISOString() })
        .eq("clerk_id", clerkId)

      return NextResponse.json({ success: true, user: existingUser })
    }

    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert({
        clerk_id: clerkId,
        email,
        name: name || email.split("@")[0],
        avatar_url: imageUrl || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("Sync user error:", error)
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    )
  }
}
