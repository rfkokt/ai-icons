import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { uploadFile } from "@/lib/r2"
import { supabaseAdmin } from "@/lib/supabase"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta"
const GEMINI_MODEL_IMAGE = "gemini-2.5-flash-image"
const GEMINI_MODEL_TEXT = "gemini-2.0-flash-exp"

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

      // Upload PNG
      pngKey = `users/${userId}/icons/${timestamp}-${index}-${prompt.replace(/\s+/g, "-").slice(0, 20)}.png`
      pngUrl = await uploadFile(pngKey, pngBuffer, "image/png")
      preview = `data:image/png;base64,${pngBuffer.toString("base64")}`

      // Save to database
      const iconData = {
        user_id: userId,
        prompt: iconPromptText,
        style,
        png_url: pngUrl || null,
        png_key: pngKey || null,
      }

      await supabaseAdmin.from("generated_icons").insert(iconData)

      icons.push({
        png: pngUrl ? { url: pngUrl, key: pngKey } : undefined,
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
