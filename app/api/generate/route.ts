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
  count?: number
}

const PROMPT_TEMPLATES: Record<string, string> = {
  "outline": "Clean minimalist outline icon of {prompt}, single consistent stroke weight, 2px stroke, transparent background, simple geometric shapes, centered, no fill, pure black strokes only, no shadows or gradients, UI icon style like Lucide icons or Heroicons, square canvas, balanced white space, professional icon design",
  "filled": "Solid filled icon of {prompt}, pure black fill, transparent background, simple geometric shapes, no outlines, clean edges, no shadows, UI icon style like Lucide icons or Heroicons, square canvas, centered, minimalist icon design",
  "duotone": "Modern duotone icon of {prompt}, black primary shape with secondary accent layer creating depth, transparent background, simple clean shapes, two color only (black and gray), no outlines, minimalist style like Lucide duotone icons, square canvas, balanced composition",
  "colored": "Vibrant colored flat icon of {prompt}, single solid color fill (blue, purple, or green), transparent background, simple geometric shapes, no outlines, no gradients, modern app icon style, clean minimal design, square canvas, centered",
  "3d": "Modern 3D rendered icon of {prompt}, solid color with subtle shading and depth, slight 3D effect, transparent background, simple rounded shapes, clean modern 3D icon style, cube or isometric feel, square canvas, professional icon design"
}

function buildTargetPrompt(userPrompt: string, style: string): string {
  const template = PROMPT_TEMPLATES[style] || PROMPT_TEMPLATES["outline"]
  return template.replace(/\{prompt\}/g, userPrompt)
}

function simplifyPrompt(prompt: string): string {
  if (!prompt) return "Untitled"
  
  let clean = prompt
    .trim()
    .replace(/^(a|an|the|create|generate|icon|of|for|illustration|simple|minimalist|professional)\s+/i, '')
    .split(',')[0]
  
  const words = clean.split(/\s+/).slice(0, 4)
  
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || "Untitled"
}

async function generateTargetImage(prompt: string, style: string): Promise<Buffer | null> {
  const fullPrompt = buildTargetPrompt(prompt, style)
  console.log("Calling Gemini API with prompt:", fullPrompt.slice(0, 50))

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

async function processPngForPreview(pngBuffer: Buffer, transparent: boolean = true): Promise<{ buffer: Buffer; preview: string }> {
  try {
    if (transparent) {
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

      // Step 3: Make light gray/white pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
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

      const preview = `data:image/png;base64,${result.toString("base64")}`
      return { buffer: result, preview }
    } else {
      // For illustrations/characters - just resize, keep original colors
      const result = await sharp(pngBuffer)
        .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toBuffer()

      const preview = `data:image/png;base64,${result.toString("base64")}`
      return { buffer: result, preview }
    }
  } catch (error) {
    console.error("Error processing PNG:", error)
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
    const { prompt, style = "outline", count = 4 } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // All icon styles need transparency processing
    const needsTransparency = true

    const iconCount = Math.min(Math.max(count, 1), 16)
    const icons: Array<{
      png: { url: string; key: string }
      preview: string
      prompt: string
      id?: string
    }> = []

    const iconPrompts = Array(iconCount).fill(prompt)
    
    console.log("Generating", iconCount, "icons with style:", style)
    
    const results = await Promise.all(
      iconPrompts.map(async (iconPrompt, index) => {
        console.log("Generating icon", index + 1)
        const pngBuffer = await generateTargetImage(iconPrompt, style)
        console.log("Icon", index + 1, "generated:", pngBuffer ? "yes" : "no")
        return { pngBuffer, index }
      })
    )

    for (const { pngBuffer, index } of results) {
      if (!pngBuffer) {
        console.log("Skipping item", index + 1, "- no PNG buffer")
        continue
      }

      const timestamp = Date.now()
      const iconPromptText = `${prompt}-${index + 1}`
      console.log("Processing item", index + 1)

      const { buffer: processedPng, preview } = await processPngForPreview(pngBuffer, needsTransparency)

      const pngKey = `users/${userId}/icons/${timestamp}-${index}-${prompt.replace(/\s+/g, "-").slice(0, 20)}.png`
      const pngUrl = await uploadFile(pngKey, processedPng, "image/png")

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
        { error: "Failed to generate images. Please try again." },
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
