import { NextRequest, NextResponse } from "next/server"
import { uploadFile, getSignedDownloadUrl } from "@/lib/r2"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta"
const GEMINI_MODEL_IMAGE = "gemini-2.5-flash-image"
const GEMINI_MODEL_TEXT = "gemini-2.5-flash"

interface GenerateRequest {
  prompt: string
  style?: string
  userId?: string
}

async function generatePngImage(prompt: string): Promise<Buffer | null> {
  const fullPrompt = `Generate an icon for "${prompt}". 
Requirements:
- Simple, minimalist design
- Transparent background
- Square format
- PNG format with transparency
- Professional icon style
- White or black color on transparent background
- Size: 512x512 pixels`

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/models/${GEMINI_MODEL_IMAGE}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseModalities: "image",
            temperature: 0.4,
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    )

    const data = await response.json()

    if (data.error) {
      console.error("Gemini API error:", data.error)
      return null
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      const base64 = data.candidates[0].content.parts[0].inlineData.data
      return Buffer.from(base64, "base64")
    }

    return null
  } catch (error) {
    console.error("Gemini API error:", error)
    return null
  }
}

async function generateSvgImage(prompt: string): Promise<string | null> {
  const fullPrompt = `Generate a minimalist SVG icon for "${prompt}".
Requirements:
- Simple, clean, modern line art
- viewBox="0 0 24 24"
- stroke="currentColor" or stroke="#000000"
- stroke-width="1.5" or "2"
- fill="none"
- Only use path, circle, rect, line, polyline, polygon elements
- Black color on transparent background
- No background rectangle
- Square icon format
- Professional UI icon style

Return ONLY the SVG code, no explanation.`

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/models/${GEMINI_MODEL_TEXT}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.4,
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    )

    const data = await response.json()

    if (data.error) {
      console.error("Gemini SVG error:", data.error)
      return null
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text
      const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i)
      if (svgMatch) {
        return svgMatch[0]
      }
      return text
    }

    return null
  } catch (error) {
    console.error("Gemini SVG error:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, style = "minimalist", userId } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const pngBuffer = await generatePngImage(prompt)
    const svgCode = await generateSvgImage(prompt)

    if (!pngBuffer && !svgCode) {
      return NextResponse.json(
        { error: "Failed to generate icon" },
        { status: 500 }
      )
    }

    let pngUrl = ""
    let pngKey = ""

    if (pngBuffer) {
      pngKey = `icons/${Date.now()}-${prompt.replace(/\s+/g, "-").slice(0, 50)}.png`
      pngUrl = await uploadFile(pngKey, pngBuffer, "image/png")
    }

    const svgKey = svgCode 
      ? `icons/${Date.now()}-${prompt.replace(/\s+/g, "-").slice(0, 50)}.svg`
      : ""

    return NextResponse.json({
      success: true,
      png: pngUrl ? {
        url: pngUrl,
        key: pngKey,
      } : null,
      svg: svgCode ? {
        code: svgCode,
        key: svgKey,
      } : null,
      prompt,
      style,
    })
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    )
  }
}
