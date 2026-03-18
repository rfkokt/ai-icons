import { NextRequest, NextResponse } from "next/server"
import { getObject } from "@/lib/r2"
import sharp from "sharp"
// @ts-ignore - potrace uses CommonJS
import potrace from "potrace"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params
    const decodedKey = decodeURIComponent(key.join("/"))
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "auto"

    const data = await getObject(decodedKey)

    if (!data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // If format=svg and key is PNG, convert on-the-fly
    if (format === "svg" && decodedKey.endsWith(".png")) {
      const svg = await convertPngToSvg(data)
      if (!svg) {
        return NextResponse.json({ error: "SVG conversion failed" }, { status: 500 })
      }
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `attachment; filename="${decodedKey.split("/").pop()?.replace(".png", ".svg")}"`,
        },
      })
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

async function convertPngToSvg(pngBuffer: Buffer): Promise<string | null> {
  try {
    // Preprocess: resize dan threshold untuk hanya ambil icon nya
    const processedBuffer = await sharp(pngBuffer)
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .grayscale()
      .threshold(128) // Binary: pixel > 128 jadi putih, < 128 jadi hitam
      .png()
      .toBuffer()

    // Use Potrace class directly for more reliable behavior
    return new Promise<string>((resolve) => {
      // @ts-ignore - Potrace class exists in runtime
      const tracer = new potrace.Potrace({
        threshold: 128, // explicit threshold
        turdSize: 2, // Hapus speckles kecil
        optCurve: true, // Smooth curves
        optTolerance: 0.2,
        color: '#000000',
        background: 'transparent',
      })

      // @ts-ignore - loadImage accepts Buffer
      tracer.loadImage(processedBuffer, (err: Error | null) => {
        if (err) {
          console.error("Potrace loadImage error:", err)
          resolve(null as unknown as string)
          return
        }

        try {
          const svg = tracer.getSVG()
          resolve(svg)
        } catch (e) {
          console.error("Potrace getSVG error:", e)
          resolve(null as unknown as string)
        }
      })
    })
  } catch (error) {
    console.error("PNG to SVG conversion error:", error)
    return null
  }
}
