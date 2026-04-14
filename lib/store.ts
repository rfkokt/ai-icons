import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
  syncFromClerk: (clerkUser: { id: string; email: string; name: string; imageUrl?: string }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token)
        }
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
      setUser: (user) => set({ user }),
      syncFromClerk: (clerkUser) => {
        const user: User = {
          id: clerkUser.id,
          email: clerkUser.email,
          name: clerkUser.name,
          avatar: clerkUser.imageUrl,
          role: "user",
        }
        set({ user, isAuthenticated: true })
      },
    }),
    {
      name: "auth-storage",
    }
  )
)

interface SidebarState {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: "sidebar:collapsed",
    }
  )
)

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    {
      name: "theme-preference",
      onRehydrateStorage: () => (state) => {
        // Use system preference if no saved theme
        if (typeof window !== "undefined" && state && !state.theme) {
          const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          state.theme = systemPrefersDark ? "dark" : "light"
        }
      },
    }
  )
)

interface PaginationState {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

interface DashboardStore {
  pagination: PaginationState
  setPagination: (pagination: Partial<PaginationState>) => void
  searchValue: string
  setSearchValue: (value: string) => void
  filters: Record<string, unknown>
  setFilters: (filters: Record<string, unknown>) => void
  resetFilters: () => void
}

const defaultPagination: PaginationState = {
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
}

const defaultFilters = {}

export const useDashboardStore = create<DashboardStore>((set) => ({
  pagination: defaultPagination,
  setPagination: (pagination) =>
    set((state) => ({ pagination: { ...state.pagination, ...pagination } })),
  searchValue: "",
  setSearchValue: (value) => set({ searchValue: value }),
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: defaultFilters, searchValue: "" }),
}))
