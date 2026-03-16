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
  pack_id: string
  name: string
  svg_content: string
  png_url?: string
  format: "svg" | "png" | "both"
  created_at: string
}

export interface IconPackWithIcons extends IconPack {
  icons: GeneratedIcon[]
}
