import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getActiveFilterCount(
  filters: Record<string, unknown>,
  excludeKeys: string[] = []
): number {
  return Object.entries(filters).reduce((count, [key, value]) => {
    if (excludeKeys.includes(key)) return count
    if (value === null || value === undefined || value === "") return count
    if (Array.isArray(value) && value.length === 0) return count
    return count + 1
  }, 0)
}

export function formatDateStandard(date: Date | string): string {
  const d = new Date(date)
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  
  const dayName = days[d.getDay()]
  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")
  
  return `${dayName},\n${day} ${month} ${year},\n${hours}:${minutes}`
}

export function formatDateSingleLine(date: Date | string): string {
  const d = new Date(date)
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  
  const dayName = days[d.getDay()]
  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")
  
  return `${dayName}, ${day} ${month} ${year}, ${hours}:${minutes}`
}

export function formatDateNoTime(date: Date | string): string {
  const d = new Date(date)
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  
  const dayName = days[d.getDay()]
  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  
  return `${dayName}, ${day} ${month} ${year}`
}