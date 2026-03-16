import { supabaseAdmin } from "./supabase"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta"

interface GenerateIconParams {
  theme: string
  iconNames: string[]
}

interface GeneratedIcon {
  name: string
  svg_content: string
  format: "both"
}

export async function generateIconPack(
  userId: string,
  name: string,
  theme: string
): Promise<{ packId: string; icons: GeneratedIcon[] }> {
  const iconNames = generateIconNames(theme)
  
  const svgContents = await Promise.all(
    iconNames.map((iconName) => generateSingleIcon(theme, iconName))
  )

  const icons: GeneratedIcon[] = iconNames.map((iconName, index) => ({
    name: iconName,
    svg_content: svgContents[index],
    format: "both",
  }))

  const { data: pack, error: packError } = await supabaseAdmin
    .from("icon_packs")
    .insert({ user_id: userId, name, theme, is_public: false })
    .select()
    .single()

  if (packError) throw packError

  const iconsWithPackId = icons.map((icon) => ({
    pack_id: pack.id,
    name: icon.name,
    svg_content: icon.svg_content,
    format: icon.format,
  }))

  const { error: iconsError } = await supabaseAdmin
    .from("generated_icons")
    .insert(iconsWithPackId)

  if (iconsError) throw iconsError

  return { packId: pack.id, icons }
}

function generateIconNames(theme: string): string[] {
  const commonIcons = [
    "home", "user", "settings", "search", "bell", "mail",
    "cart", "heart", "star", "bookmark", "share", "download",
    "upload", "plus", "minus", "check", "close", "menu",
    "filter", "sort", "grid", "list", "camera", "image",
    "play", "pause", "forward", "back", "volume", "mic",
  ]

  const count = Math.floor(Math.random() * 8) + 8
  const shuffled = commonIcons.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

async function generateSingleIcon(theme: string, iconName: string): Promise<string> {
  const prompt = `Generate a minimalist icon for "${iconName}" in ${theme} style. 
The icon should be:
- Simple, clean, and modern
- Line art style (outline)
- Black color on transparent background
- Square viewBox (24x24)
- No background
- SVG format only

SVG requirements:
- viewBox="0 0 24 24"
- stroke-width="1.5" or "2"
- stroke="currentColor"
- fill="none"
- Only use path, circle, rect, line, polyline, polygon elements`

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: "image" as const,
            temperature: 0.4,
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    )

    const data = await response.json()

    if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      const base64 = data.candidates[0].content.parts[0].inlineData.data
      const svgContent = Buffer.from(base64, "base64").toString("utf-8")
      return cleanSvg(svgContent)
    }

    return generateFallbackIcon(iconName)
  } catch (error) {
    console.error("Gemini API error:", error)
    return generateFallbackIcon(iconName)
  }
}

function cleanSvg(svg: string): string {
  let cleaned = svg.replace(/<\?xml[^>]*\?>/, "")
  cleaned = cleaned.replace(/<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"')
  
  if (!cleaned.includes('stroke="currentColor"')) {
    cleaned = cleaned.replace(/<svg/, '<svg stroke="currentColor"')
  }
  if (!cleaned.includes('fill="none"')) {
    cleaned = cleaned.replace(/<svg/, '<svg fill="none"')
  }
  if (!cleaned.includes('stroke-width')) {
    cleaned = cleaned.replace(/<svg/, '<svg stroke-width="1.5"')
  }

  return cleaned
}

function generateFallbackIcon(iconName: string): string {
  const fallbackSvgs: Record<string, string> = {
    home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    cart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  }

  return fallbackSvgs[iconName] || fallbackSvgs.home
}
