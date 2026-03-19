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
  format?: {
    iconType: string
    background?: string
    designStyle: string
    colorPalette?: string
    visualDetails?: string
  }
}

const PROMPT_TEMPLATES: Record<string, string> = {
  // E-commerce
  "minimalist_studio": "Professional high-end studio product photography, {prompt} placed on a smooth matte geometric pedestal, neutral pastel background, soft-box side lighting, crisp shadows, sharp focus on texture, 8k resolution, minimalist aesthetic.",
  "nature_organic": "Lifestyle product photography of {prompt}, nestled among organic elements like moss, wet stones, and soft ferns. Natural morning sunlight filtering through leaves (komorebi effect), realistic water droplets, macro detail, earthy tones.",
  "dark_luxury": "Commercial photography of {prompt}, placed on black polished marble with subtle gold accents in the background. Moody low-key lighting, rim lighting to highlight edges, elegant reflections, cinematic atmosphere, premium feel.",
  
  // Content Creation & Characters
  "3d_animation": "High-quality 3D character render of {prompt}, Pixar and Disney inspired style, large expressive eyes, detailed hair groom, subsurface scattering on skin, warm cinematic lighting, octane render, 4k.",
  "anime_manga": "Anime style illustration, high-detail cel-shading, {prompt}. Vibrant color palette, sharp line art, aesthetic lighting effects, Makoto Shinkai inspired background, emotional atmosphere.",
  "isometric_game": "Isometric 3D game asset of {prompt}, low-poly but high-detail texture, cute proportions, vibrant colors, isolated on plain background, soft global illumination, game-ready UI aesthetic.",
  
  // Real Estate
  "japandi": "Interior photography of a {prompt} in Japandi style. Combination of Japanese minimalism and Scandinavian functionality. Light oak wood, shoji-inspired elements, neutral linen textures, indoor bonsai. Bright natural light, airy and calm.",
  "industrial_loft": "Professional architectural shot of an industrial loft {prompt}. Exposed red brick walls, matte black metal beams, polished concrete floor, large factory windows. Sunset lighting, gritty yet sophisticated, high contrast textures.",
  "modern_bohemian": "Cozy bohemian interior of a {prompt}, filled with textured macrame, rattan furniture, and many indoor plants. Warm string lights and candlelight, eclectic patterns, soft earth tones, high detail on textile fibers.",
  
  // Professional
  "corporate_global": "Professional corporate headshot of {prompt}, wearing tailored business attire, confident and friendly expression. Blurred modern office background (bokeh), three-point studio lighting, sharp focus on eyes, realistic skin pores, 4k.",
  "tech_creative": "Casual professional portrait of {prompt} in a bright, modern co-working space. Wearing a stylish turtleneck, natural window lighting, soft shadows, approachable vibe, clean and minimalist aesthetic, high resolution.",
  "editorial_dark": "Editorial portrait of {prompt}, dramatic Rembrandt lighting, deep shadows, wearing dark textured clothing. Moody gray concrete background, cinematic and powerful, sharp focus, photography for high-end magazine.",
  
  // Web Assets
  "3d_clay": "3D icon of {prompt} in claymorphism style, rounded and playful shapes, matte finish, soft ambient occlusion shadows, vibrant pastel colors, isolated on white background, high-quality 3D render.",
  "flat_vector": "Minimalist flat vector illustration for web design, {prompt}, clean lines, no gradients, limited professional color palette, modern corporate Memphis style, isolated on white background.",
  "mesh_gradient": "Abstract fluid mesh gradient background, {prompt}, flowing and organic shapes, ultra-smooth transitions, high resolution, futuristic and elegant, professional web hero-section aesthetic.",
  "glassmorphism": "3D glassmorphism element of {prompt}, frosted glass texture, semi-transparent with blur effect, glowing neon accents, sharp edges, high-tech premium feel, isolated on white background."
}

function buildTargetPrompt(userPrompt: string, style: string): string {
  const template = PROMPT_TEMPLATES[style] || PROMPT_TEMPLATES["minimalist_studio"]
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
    const { prompt, style = "minimalist_studio", count = 4, format } = body
    const generateType = format?.iconType?.toLowerCase() || "ecommerce"

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Only assets that are explicitly isolated on white/plain backgrounds need transparency passing
    const needsTransparency = ["3d_clay", "flat_vector", "glassmorphism", "isometric_game"].includes(style)

    const iconCount = Math.min(Math.max(count, 1), 16)
    const icons: Array<{
      png: { url: string; key: string }
      preview: string
      prompt: string
      id?: string
    }> = []

    const iconPrompts = Array(iconCount).fill(prompt)
    
    console.log("Generating", iconCount, "items...", "type:", generateType, "style:", style)
    
    const results = await Promise.all(
      iconPrompts.map(async (iconPrompt, index) => {
        console.log("Generating", generateType, index + 1)
        const pngBuffer = await generateTargetImage(iconPrompt, style)
        console.log(generateType, index + 1, "generated:", pngBuffer ? "yes" : "no")
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
