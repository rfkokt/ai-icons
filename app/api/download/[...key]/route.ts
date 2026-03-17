import { NextRequest, NextResponse } from "next/server"
import { getObject } from "@/lib/r2"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params
    const decodedKey = decodeURIComponent(key.join("/"))
    
    const data = await getObject(decodedKey)
    
    if (!data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const contentType = decodedKey.endsWith(".png") ? "image/png" : "image/svg+xml"

    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${decodedKey.split("/").pop()}"`,
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
