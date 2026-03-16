import { supabase, supabaseAdmin } from "./supabase"
import type { IconPack, GeneratedIcon, IconPackWithIcons } from "@/types/database"

export async function createIconPack(
  userId: string,
  name: string,
  theme: string
): Promise<IconPack> {
  const { data, error } = await supabaseAdmin
    .from("icon_packs")
    .insert({ user_id: userId, name, theme })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserIconPacks(userId: string): Promise<IconPack[]> {
  const { data, error } = await supabase
    .from("icon_packs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getPublicIconPacks(): Promise<IconPack[]> {
  const { data, error } = await supabase
    .from("icon_packs")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getIconPackWithIcons(packId: string): Promise<IconPackWithIcons | null> {
  const { data: pack, error: packError } = await supabase
    .from("icon_packs")
    .select("*")
    .eq("id", packId)
    .single()

  if (packError) throw packError

  const { data: icons, error: iconsError } = await supabase
    .from("generated_icons")
    .select("*")
    .eq("pack_id", packId)
    .order("created_at", { ascending: true })

  if (iconsError) throw iconsError

  return { ...pack, icons: icons || [] }
}

export async function addIconsToPack(
  packId: string,
  icons: { name: string; svg_content: string; png_url?: string; format: string }[]
): Promise<GeneratedIcon[]> {
  const iconsWithPackId = icons.map((icon) => ({
    ...icon,
    pack_id: packId,
  }))

  const { data, error } = await supabaseAdmin
    .from("generated_icons")
    .insert(iconsWithPackId)
    .select()

  if (error) throw error
  return data || []
}

export async function updateIconPack(
  packId: string,
  updates: { name?: string; theme?: string; is_public?: boolean }
): Promise<IconPack> {
  const { data, error } = await supabaseAdmin
    .from("icon_packs")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", packId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteIconPack(packId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("icon_packs")
    .delete()
    .eq("id", packId)

  if (error) throw error
}

export async function togglePackVisibility(packId: string): Promise<IconPack> {
  const { data: pack, error: fetchError } = await supabase
    .from("icon_packs")
    .select("is_public")
    .eq("id", packId)
    .single()

  if (fetchError) throw fetchError

  return updateIconPack(packId, { is_public: !pack.is_public })
}
