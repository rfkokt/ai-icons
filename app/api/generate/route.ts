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
    iconType: string
    background?: string
    designStyle: string
    colorPalette?: string
    visualDetails?: string
  }
}

const ICON_STYLE_PROMPTS: Record<string, string> = {
  minimalist: "minimalist icon, clean geometric shapes, simple lines, transparent background, professional quality",
  outline: "outline icon, stroke style, clean line art, black strokes on transparent background, no fill",
  filled: "solid filled icon, black fill only, transparent background, bold and clean",
  duotone: "duotone icon, two-tone design with primary and secondary colors, transparent background",
  "3d": "3D dimensional icon, depth and perspective, subtle shadows, transparent background, volumetric look",
  flat: "flat design icon, simple 2D shapes, solid colors, transparent background, clean composition",
  "hand-drawn": "hand-drawn icon, sketchy organic lines, imperfect strokes, transparent background, casual feel",
  neon: "neon icon, glowing bright colors, dark background with glow effect, cyberpunk style",
}

const IMAGE_STYLE_PROMPTS: Record<string, string> = {
  flat: "flat design illustration, bold solid colors, clean shapes, no outlines, modern style",
  minimalist: "minimalist illustration, limited color palette, simple composition, clean and elegant",
  outline: "line art illustration, clean continuous strokes, no fill, elegant and refined",
  "3d": "3D rendered illustration, volumetric shapes, realistic lighting and shadows, dimensional depth",
  illustrative: "detailed illustrative style, artistic hand-drawn quality, rich colors, expressive",
  watercolor: "watercolor illustration, soft painterly strokes, gentle color bleeding, artistic paper texture",
  geometric: "geometric illustration, sharp angular shapes, pattern-based design, modern abstract",
  retro: "retro vintage illustration style, warm nostalgic colors, classic design elements",
}

const CHARACTER_STYLE_PROMPTS: Record<string, string> = {
  flat: "flat design character illustration, bold 2D vector style, solid colors, transparent background, modern vector art",
  "3d": "3D rendered character, volumetric shapes, realistic lighting, transparent background, professional quality render",
  chibi: "chibi anime character, cute exaggerated proportions, big head small body, kawaii style, transparent background",
  anime: "anime character illustration, Japanese animation style, detailed eyes, dynamic pose, vibrant colors, transparent background",
  cartoon: "cartoon character, fun exaggerated features, bold outlines, bright playful colors, transparent background",
  realistic: "realistic character illustration, photorealistic quality, detailed human features, transparent background",
  pixel: "pixel art character, retro 8-bit video game style, limited colors, nostalgic sprite, transparent background",
  sketch: "sketch style character, hand-drawn pencil strokes, rough organic lines, transparent background, artistic look",
}

function buildIconPrompt(userPrompt: string, style: string): string {
  const stylePrompt = ICON_STYLE_PROMPTS[style] || ICON_STYLE_PROMPTS.flat
  
  return `Design a professional UI icon for: ${userPrompt}

Style specifications:
- ${stylePrompt}

Technical requirements:
- Square aspect ratio
- Transparent background (no background color)
- No text, labels, or numbers
- No borders, frames, or containers
- Floating design, centered composition
- High contrast for visibility at small sizes
- Clean, crisp edges`
}

function buildImagePrompt(userPrompt: string, style: string): string {
  const stylePrompt = IMAGE_STYLE_PROMPTS[style] || IMAGE_STYLE_PROMPTS.flat
  
  return `Create a beautiful illustration depicting: ${userPrompt}

Style specifications:
- ${stylePrompt}

Design requirements:
- Square or 4:3 aspect ratio
- Professional illustration quality
- No text or written words
- Engaging scene composition
- Vibrant colors and clear visual hierarchy
- Suitable for web and print use`
}

function buildCharacterPrompt(userPrompt: string, style: string): string {
  const stylePrompt = CHARACTER_STYLE_PROMPTS[style] || CHARACTER_STYLE_PROMPTS.flat
  
  return `Design a character illustration based on: ${userPrompt}

Style specifications:
- ${stylePrompt}

Technical requirements:
- Transparent background (PNG with no background color)
- No text, speech bubbles, or written words
- Centered character composition
- Full body or upper body visible
- Isolated figure, no props or scene elements
- High quality, clean edges
- Suitable for web overlay use`
}

function buildPrompt(userPrompt: string, style: string, generateType: string): string {
  switch (generateType) {
    case "image":
      return buildImagePrompt(userPrompt, style)
    case "character":
      return buildCharacterPrompt(userPrompt, style)
    default:
      return buildIconPrompt(userPrompt, style)
  }
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


async function generateIconImage(prompt: string, style: string, generateType: string = "icon"): Promise<Buffer | null> {
  const fullPrompt = buildPrompt(prompt, style, generateType)
  console.log("Calling Gemini API with prompt:", prompt.slice(0, 50), "type:", generateType)

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
    const { prompt, style = "minimalist", format } = body
    const generateType = format?.iconType?.toLowerCase() || "icon"
    const isIconOrCharacter = generateType === "icon" || generateType === "character"

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const iconCount = 8
    const icons: Array<{
      png: { url: string; key: string }
      preview: string
      prompt: string
      id?: string
    }> = []

    // Generate all icons in parallel
    const iconPrompts = Array(iconCount).fill(prompt)
    
    console.log("Generating", iconCount, "items...", "type:", generateType)
    
    const results = await Promise.all(
      iconPrompts.map(async (iconPrompt, index) => {
        console.log("Generating", generateType, index + 1)
        const pngBuffer = await generateIconImage(iconPrompt, style, generateType)
        console.log(generateType, index + 1, "generated:", pngBuffer ? "yes" : "no")
        return { pngBuffer, index }
      })
    )

    // Process each result
    for (const { pngBuffer, index } of results) {
      if (!pngBuffer) {
        console.log("Skipping item", index + 1, "- no PNG buffer")
        continue
      }

      const timestamp = Date.now()
      const iconPromptText = `${prompt}-${index + 1}`
      console.log("Processing item", index + 1)

      // Process PNG - icons and characters get transparent bg, illustrations keep colors
      const { buffer: processedPng, preview } = await processPngForPreview(pngBuffer, isIconOrCharacter)

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
