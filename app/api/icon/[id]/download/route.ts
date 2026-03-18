import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { getObject } from "@/lib/r2"
import sharp from "sharp"
// @ts-ignore - potrace uses CommonJS
import potrace from "potrace"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "png"

    // Get the icon
    const { data: icon, error: fetchError } = await supabaseAdmin
      .from("generated_icons")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !icon) {
      return NextResponse.json({ error: "Icon not found" }, { status: 404 })
    }

    // Check ownership or public access
    if (icon.user_id !== clerkUser.id && !icon.is_public) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // PNG download
    if (format === "png") {
      if (!icon.png_key) {
        return NextResponse.json({ error: "PNG not available" }, { status: 404 })
      }

      const pngBuffer = await getObject(icon.png_key)
      if (!pngBuffer) {
        return NextResponse.json({ error: "Failed to fetch PNG" }, { status: 500 })
      }

      return new NextResponse(new Uint8Array(pngBuffer), {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="${icon.name}.png"`,
        },
      })
    }

    // SVG download - convert on-demand from PNG
    if (format === "svg") {
      if (!icon.png_key) {
        return NextResponse.json({ error: "Source PNG not available" }, { status: 404 })
      }

      const pngBuffer = await getObject(icon.png_key)
      if (!pngBuffer) {
        return NextResponse.json({ error: "Failed to fetch PNG" }, { status: 500 })
      }

      // Convert PNG to SVG
      const svg = await convertPngToSvg(pngBuffer)

      if (!svg) {
        return NextResponse.json({ error: "Failed to convert to SVG" }, { status: 500 })
      }

      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `attachment; filename="${icon.name}.svg"`,
        },
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
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
