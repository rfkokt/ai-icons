export interface IconPack {
  id: string
  user_id: string
  name: string
  theme: string
  is_public: boolean
  created_at: string
  updated_at?: string
}

export interface GeneratedIcon {
  id: string
  user_id: string
  pack_id?: string
  name: string
  prompt?: string
  style?: string
  svg_content?: string
  svg_url?: string | null
  svg_key?: string | null
  png_url?: string | null
  png_key?: string | null
  format: "svg" | "png" | "both"
  is_public: boolean
  shared_at?: string | null
  created_at: string
}

export interface IconPackWithIcons extends IconPack {
  icons: GeneratedIcon[]
}
