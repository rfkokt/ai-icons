import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const
export const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"] as const

function parseDate(date: Date | string): Date {
  return new Date(date)
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
  const d = parseDate(date)
  const dayName = DAYS[d.getDay()]
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")
  
  return `${dayName},\n${day} ${month} ${year},\n${hours}:${minutes}`
}

export function formatDateSingleLine(date: Date | string): string {
  const d = parseDate(date)
  const dayName = DAYS[d.getDay()]
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")
  
  return `${dayName}, ${day} ${month} ${year}, ${hours}:${minutes}`
}

export function formatDateNoTime(date: Date | string): string {
  const d = parseDate(date)
  const dayName = DAYS[d.getDay()]
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()

  return `${dayName}, ${day} ${month} ${year}`
}

/**
 * Safely retrieves an item from localStorage with SSR fallback.
 * Returns null if localStorage is unavailable or an error occurs.
 *
 * @param key - The localStorage key to retrieve
 * @returns The stored value as a string, or null if not found/unavailable
 *
 * @example
 * ```ts
 * const theme = getStorageItem("theme-preference")
 * ```
 */
export function getStorageItem(key: string): string | null {
  try {
    return typeof window !== "undefined" ? localStorage.getItem(key) : null
  } catch {
    return null
  }
}

/**
 * Safely stores an item in localStorage with SSR fallback.
 * Silently fails if localStorage is unavailable or an error occurs.
 *
 * @param key - The localStorage key to set
 * @param value - The value to store (will be converted to string)
 *
 * @example
 * ```ts
 * setStorageItem("theme-preference", "dark")
 * ```
 */
export function setStorageItem(key: string, value: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value)
    }
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Safely removes an item from localStorage with SSR fallback.
 * Silently fails if localStorage is unavailable or an error occurs.
 *
 * @param key - The localStorage key to remove
 *
 * @example
 * ```ts
 * removeStorageItem("theme-preference")
 * ```
 */
export function removeStorageItem(key: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Theme type for dark mode utilities.
 */
export type Theme = "light" | "dark"

/**
 * Detects the system's preferred color scheme.
 * Returns "dark" if the user prefers dark mode, otherwise "light".
 *
 * @returns The system theme preference
 *
 * @example
 * ```ts
 * const systemTheme = getSystemThemePreference()
 * if (systemTheme === "dark") {
 *   // Apply dark theme
 * }
 * ```
 */
export function getSystemThemePreference(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}