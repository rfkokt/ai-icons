import { NextRequest, NextResponse } from "next/server"
import { getObject } from "@/lib/r2"
import sharp from "sharp"

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

    const isPng = decodedKey.endsWith(".png")
    const contentType = isPng ? "image/png" : "image/svg+xml"

    // For PNG files, ensure alpha channel is preserved (transparent background)
    let outputData: Buffer | Uint8Array = data
    if (isPng) {
      outputData = await sharp(data)
        .ensureAlpha()
        .png({ force: true })
        .toBuffer()
    }

    return new NextResponse(new Uint8Array(outputData), {
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
