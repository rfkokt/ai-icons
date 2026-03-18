export interface GeneratedIcon {
  preview: string
  png: { url: string; key: string }
  svg?: { url: string; key: string }
  prompt: string
  id?: string
}

export interface GeneratedPack {
  id: string
  prompt: string
  icons: GeneratedIcon[]
  created_at?: string
}

export interface HistoryPack {
  id: string
  prompt: string
  iconCount: number
  preview: string | null
  created_at: string
}

export interface PackIcon {
  id: string
  prompt: string
  png_key: string | null
  svg_key: string | null
  created_at: string
}

export interface HistoryIcon {
  id: string
  prompt: string
  style: string
  png_url: string | null
  png_key: string | null
  svg_url: string | null
  svg_key: string | null
  created_at: string
}

export interface CommunityIcon {
  id: string | number
  prompt: string
  likes: number
  date: string
  src?: string
}
