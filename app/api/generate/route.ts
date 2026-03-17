import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { uploadFile } from "@/lib/r2"
import { supabaseAdmin } from "@/lib/supabase"
import sharp from "sharp"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta"
const GEMINI_MODEL_IMAGE = "gemini-2.5-flash-image"

interface GenerateRequest {
  prompt?: string
  style?: string
  format?: {
    count: number
    iconType: string
    background: string
    designStyle: string
    colorPalette: string
    visualDetails: string
  }
}

const STYLE_PROMPTS: Record<string, string> = {
  minimalist: "Clean, minimalist design with simple geometric shapes, black strokes on white/transparent background",
  outline: "Outline/stroke style icon, clean line art, black lines on transparent",
  filled: "Filled solid icon, black fill on transparent background",
  duotone: "Duotone two-tone icon, two contrasting colors",
  "3d": "3D dimensional icon, depth and perspective",
  flat: "Flat design icon, simple 2D shapes, solid colors",
  "hand-drawn": "Hand-drawn sketch style, organic imperfect lines",
  neon: "Neon glowing icon, bright colors with glow effect",
}

function buildIconPrompt(userPrompt: string, style: string): string {
  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.minimalist
  
  return `Create a professional UI icon for "${userPrompt}". 

Style: ${stylePrompt}

Requirements:
- Professional icon design
- Transparent background
- Square format
- High quality
- No text, no labels`
}

async function generateIconImage(prompt: string, style: string): Promise<Buffer | null> {
  const fullPrompt = buildIconPrompt(prompt, style)
  console.log("Calling Gemini API with prompt:", prompt.slice(0, 50))

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/models/${GEMINI_MODEL_IMAGE}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseModalities: ["IMAGE"],
          },
        }),
      }
    )

    const data = await response.json()
    console.log("Gemini response status:", response.status)

    if (data.error) {
      console.error("Gemini Image API error:", data.error)
      return null
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      const base64 = data.candidates[0].content.parts[0].inlineData.data
      console.log("Image generated successfully, size:", base64.length)
      return Buffer.from(base64, "base64")
    }

    console.log("No image data in response")
    return null
  } catch (error) {
    console.error("Gemini Image API error:", error)
    return null
  }
}

async function convertPngToSvg(pngBuffer: Buffer): Promise<string> {
  try {
    // Downsample to small grid for clean icon
    const gridSize = 24
    const image = sharp(pngBuffer)
    
    const { data, info } = await image
      .resize(gridSize, gridSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true })
    
    const width = info.width
    const height = info.height
    
    // Calculate grid cell size
    const cellW = gridSize / width
    const cellH = gridSize / height
    
    // Create grid of content presence
    const grid: boolean[][] = []
    const threshold = 100
    
    for (let gy = 0; gy < height; gy++) {
      grid[gy] = []
      for (let gx = 0; gx < width; gx++) {
        const idx = (gy * width + gx)
        const pixel = data[idx]
        grid[gy][gx] = pixel < threshold
      }
    }
    
    // Generate SVG with merged rectangles
    let svgContent = ""
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x]) {
          // Calculate position and size
          const px = Math.round((x / width) * 24 * 100) / 100
          const py = Math.round((y / height) * 24 * 100) / 100
          const pw = Math.round((1 / width) * 24 * 100) / 100
          const ph = Math.round((1 / height) * 24 * 100) / 100
          
          svgContent += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}"/>`
        }
      }
    }
    
    if (!svgContent) {
      console.log("No content found in PNG for SVG conversion")
      return ""
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <g fill="#000000">${svgContent}</g>
</svg>`
    
    return svg
  } catch (error) {
    console.error("PNG to SVG conversion error:", error)
    return ""
  }
}

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status:401 })
    }

    const userId = clerkUser.id
    const body: GenerateRequest = await request.json()
    const { prompt, style = "minimalist", format } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const iconCount = format?.count || 8
    const icons: Array<{
      png?: { url: string; key: string }
      svg?: { code: string; url: string; key: string }
      preview?: string
      prompt: string
    }> = []

    // Generate all icons in parallel
    const iconPrompts = Array(iconCount).fill(prompt)
    
    console.log("Generating", iconCount, "icons...")
    
    const results = await Promise.all(
      iconPrompts.map(async (iconPrompt, index) => {
        console.log("Generating icon", index + 1)
        const pngBuffer = await generateIconImage(iconPrompt, style)
        console.log("Icon", index + 1, "generated:", pngBuffer ? "yes" : "no")
        return { pngBuffer, index }
      })
    )

    // Process each result
    for (const { pngBuffer, index } of results) {
      if (!pngBuffer) {
        console.log("Skipping icon", index + 1, "- no PNG buffer")
        continue
      }

      const timestamp = Date.now()
      const iconPromptText = `${prompt}-${index + 1}`
      console.log("Processing icon", index + 1)

      let pngUrl = ""
      let pngKey = ""
      let preview = ""
      let svgCode = ""
      let svgUrl = ""
      let svgKey = ""

      // Upload PNG
      pngKey = `users/${userId}/icons/${timestamp}-${index}-${prompt.replace(/\s+/g, "-").slice(0, 20)}.png`
      pngUrl = await uploadFile(pngKey, pngBuffer, "image/png")
      preview = `data:image/png;base64,${pngBuffer.toString("base64")}`

      // Convert PNG to SVG
      console.log("Converting PNG to SVG...", index + 1)
      svgCode = await convertPngToSvg(pngBuffer)
      
      if (svgCode) {
        // Upload SVG
        svgKey = `users/${userId}/icons/${timestamp}-${index}-${prompt.replace(/\s+/g, "-").slice(0, 20)}.svg`
        const svgBuffer = Buffer.from(svgCode, "utf-8")
        svgUrl = await uploadFile(svgKey, svgBuffer, "image/svg+xml")
        console.log("SVG converted and uploaded:", index + 1, svgUrl ? "yes" : "no")
      }

      // Save to database
      const iconData = {
        user_id: userId,
        prompt: iconPromptText,
        style,
        png_url: pngUrl || null,
        png_key: pngKey || null,
        svg_url: svgUrl || null,
        svg_key: svgKey || null,
      }

      await supabaseAdmin.from("generated_icons").insert(iconData)

      icons.push({
        png: pngUrl ? { url: pngUrl, key: pngKey } : undefined,
        svg: svgUrl ? { code: svgCode, url: svgUrl, key: svgKey } : undefined,
        preview,
        prompt: iconPromptText,
      })
    }

    if (icons.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate icons. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      icons,
      prompt,
      style,
      iconCount: icons.length,
    })
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    )
  }
}
