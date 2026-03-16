import { clerkClient } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      )
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim() || user.username,
      }
    })
  } catch (error) {
    console.error("Clerk sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    )
  }
}
