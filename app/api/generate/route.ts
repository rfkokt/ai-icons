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
  minimalist: "Clean, minimalist design with simple geometric shapes, black strokes, transparent background",
  outline: "Outline/stroke style icon, clean line art, black lines, no border/box around the icon",
  filled: "Filled solid icon, black fill, transparent background",
  duotone: "Duotone two-tone icon, two contrasting colors, transparent background",
  "3d": "3D dimensional icon, depth and perspective, transparent background",
  flat: "Flat design icon, simple 2D shapes, solid colors, transparent background",
  "hand-drawn": "Hand-drawn sketch style, organic imperfect lines, transparent background",
  neon: "Neon glowing icon, bright colors with glow effect, transparent background",
}

function buildIconPrompt(userPrompt: string, style: string): string {
  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.minimalist
  
  return `Create a professional UI icon for "${userPrompt}". 

Style: ${stylePrompt}

Requirements:
- Professional icon design
- Transparent background
- NO square border, NO box, NO frame around the icon
- Icon should be floating, just the shape/symbol itself
- High quality
- No text, no labels, no borders`
}

function simplifyPrompt(prompt: string): string {
  if (!prompt) return "Untitled"
  
  // Remove common filler words at the start
  let clean = prompt
    .trim()
    .replace(/^(a|an|the|create|generate|icon|of|for|illustration|simple|minimalist|professional)\s+/i, '')
    .split(',')[0] // Take only the part before first comma if present
  
  // Take first 4 words
  const words = clean.split(/\s+/).slice(0, 4)
  
  // Capitalize each word
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || "Untitled"
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

async function processPngForPreview(pngBuffer: Buffer): Promise<{ buffer: Buffer; preview: string }> {
  try {
    // Step 1: Resize with transparent background
    let processed = await sharp(pngBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    // Step 2: Get raw pixel data with alpha channel
    const { data, info } = await sharp(processed)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Step 3: Make light gray/white pixels transparent (RGB >= 230 = light gray)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Remove light gray to white (icon backgrounds typically in this range)
      if (r >= 230 && g >= 230 && b >= 230) {
        data[i + 3] = 0
      }
    }

    // Step 4: Convert back to PNG
    const result = await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      }
    }).png().toBuffer()

    // Step 5: Generate base64 preview
    const preview = `data:image/png;base64,${result.toString("base64")}`

    return { buffer: result, preview }
  } catch (error) {
    console.error("Error processing PNG:", error)
    // Fallback
    const fallback = await sharp(pngBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .png()
      .toBuffer()

    const preview = `data:image/png;base64,${fallback.toString("base64")}`
    return { buffer: fallback, preview }
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
      png: { url: string; key: string }
      preview: string
      prompt: string
      id?: string
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

      // Process PNG (make transparent) and get preview
      const { buffer: processedPng, preview } = await processPngForPreview(pngBuffer)

      // Upload PNG
      const pngKey = `users/${userId}/icons/${timestamp}-${index}-${prompt.replace(/\s+/g, "-").slice(0, 20)}.png`
      const pngUrl = await uploadFile(pngKey, processedPng, "image/png")

      // Save to database (SVG will be generated on-demand)
      const simplifiedName = simplifyPrompt(prompt)
      
      const iconData = {
        user_id: userId,
        name: `${simplifiedName}-${index + 1}`,
        prompt: iconPromptText,
        style,
        png_url: pngUrl || null,
        png_key: pngKey || null,
        svg_url: null,
        svg_key: null,
      }

      console.log("Saving icon to database:", JSON.stringify(iconData))

      const { data: insertedIcon, error: dbError } = await supabaseAdmin
        .from("generated_icons")
        .insert(iconData)
        .select("id")
        .single()

      if (dbError) {
        console.error("Failed to save icon to database:", dbError)
      } else {
        console.log("Icon saved successfully to database, ID:", insertedIcon?.id)
      }

      icons.push({
        png: { url: pngUrl, key: pngKey },
        preview,
        prompt: iconPromptText,
        id: insertedIcon?.id,
      })
    }

    if (icons.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate icons. Please try again." },
        { status: 500 }
      )
    }

    const simplifiedPackName = simplifyPrompt(prompt)

    return NextResponse.json({
      success: true,
      icons,
      prompt,
      displayName: simplifiedPackName,
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
