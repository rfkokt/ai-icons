"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sparkles,
  Image,
  Home,
  Gift,
  Trophy,
  CreditCard,
  Settings,
  LogOut,
  Copy,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: Sparkles, label: "Generate", href: "/generate" },
  { icon: Image, label: "Community", href: "/community" },
  { icon: Home, label: "Library", href: "/library" },
  { icon: Gift, label: "Referral", href: "/referral" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: CreditCard, label: "Pricing", href: "/pricing" },
]

const recentIcons = [
  { id: 1, prompt: "Shopping cart icon", date: "2 hours ago" },
  { id: 2, prompt: "Notification bell", date: "5 hours ago" },
  { id: 3, prompt: "Settings gear", date: "1 day ago" },
  { id: 4, prompt: "User profile avatar", date: "2 days ago" },
  { id: 5, prompt: "Message bubble", date: "3 days ago" },
  { id: 6, prompt: "Chart dashboard", date: "4 days ago" },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const currentItem = menuItems.find((item) => item.href === pathname)
  const currentLabel = currentItem?.label || "Generate"

  return (
    <div className="h-screen flex bg-zinc-100 overflow-hidden">
      {/* Left Sidebar - Slim Icon Navigation */}
      <aside className="w-16 bg-white border-r border-zinc-200 flex flex-col items-center py-4 shrink-0">
        <Link href="/dashboard" className="text-xl font-bold text-[#B9FF66] mb-8 hover:opacity-80 transition-opacity">
          AI
        </Link>

        <nav className="flex-1 flex flex-col items-center gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-[#B9FF66] text-black"
                    : "text-zinc-500 hover:bg-zinc-100"
                )}
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            )
          })}
        </nav>

        <Separator className="w-8 my-4" />

        <div className="flex flex-col items-center gap-2">
          <Link
            href="/settings"
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              pathname === "/settings"
                ? "bg-[#B9FF66] text-black"
                : "text-zinc-500 hover:bg-zinc-100"
            )}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <button
            onClick={logout}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Home</span>
            <span className="text-zinc-300">/</span>
            <span className="font-medium text-zinc-900">{currentLabel}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg">
              <Sparkles className="h-4 w-4 text-[#B9FF66]" />
              <span className="text-sm font-medium">48 credits</span>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#B9FF66] text-black text-sm">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </main>

      {/* Right Sidebar - History Panel */}
      <aside className="w-72 bg-white border-l border-zinc-200 flex flex-col shrink-0">
        <div className="h-14 px-4 flex items-center border-b border-zinc-200">
          <h2 className="font-semibold text-zinc-900">History</h2>
          <span className="ml-2 px-2 py-0.5 bg-zinc-100 rounded-full text-xs text-zinc-500">
            {recentIcons.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {recentIcons.map((icon) => (
            <div
              key={icon.id}
              className="group p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border border-zinc-200 flex items-center justify-center shrink-0">
                  <Image className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {icon.prompt}
                  </p>
                  <p className="text-xs text-zinc-500">{icon.date}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-zinc-200 rounded">
                    <Copy className="h-3.5 w-3.5 text-zinc-500" />
                  </button>
                  <button className="p-1 hover:bg-zinc-200 rounded">
                    <Trash2 className="h-3.5 w-3.5 text-zinc-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}