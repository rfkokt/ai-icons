"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  HiSparkles,
  HiPhoto,
  HiHome,
  HiGift,
  HiTrophy,
  HiCreditCard,
  HiCog,
  HiArrowRightOnRectangle,
  HiClipboard,
  HiTrash,
  HiChevronDown,
  HiBars3,
  HiXMark,
  HiClock,
} from "react-icons/hi2"
import { cn } from "@/lib/utils"
import { useState } from "react"

const menuItems = [
  { icon: HiSparkles, label: "Generate", href: "/generate" },
  { icon: HiPhoto, label: "Community", href: "/community" },
  { icon: HiHome, label: "Library", href: "/library" },
  { icon: HiGift, label: "Referral", href: "/referral" },
  { icon: HiTrophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: HiCreditCard, label: "Pricing", href: "/pricing" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentItem = menuItems.find((item) => item.href === pathname)
  const currentLabel = currentItem?.label || "Generate"
  const isGeneratePage = pathname === "/generate"

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-zinc-100 overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden h-14 bg-white border-b border-zinc-200 px-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100"
        >
          {mobileMenuOpen ? <HiXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
        </button>
        <span className="font-semibold text-zinc-900">{currentLabel}</span>
        <div className="flex items-center gap-2">
          {isGeneratePage && (
            <Sheet>
              <SheetTrigger className="w-11 h-11 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100">
                <HiClock className="h-5 w-5 text-zinc-500" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="h-14 px-4 flex items-center border-b border-zinc-200">
                  <SheetTitle className="text-left">History</SheetTitle>
                  <span className="ml-2 px-2 py-0.5 bg-zinc-100 rounded-full text-xs text-zinc-500">
                    {recentIcons.length}
                  </span>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {recentIcons.map((icon) => (
                    <div
                      key={icon.id}
                      className="group p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-zinc-200 flex items-center justify-center shrink-0">
                          <HiPhoto className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">
                            {icon.prompt}
                          </p>
                          <p className="text-xs text-zinc-500">{icon.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-zinc-200 rounded">
                            <HiClipboard className="h-3.5 w-3.5 text-zinc-500" />
                          </button>
                          <button className="p-1 hover:bg-zinc-200 rounded">
                            <HiTrash className="h-3.5 w-3.5 text-zinc-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-[#B9FF66] text-black text-sm">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200">
              <span className="text-xl font-bold text-[#B9FF66]">AI Icons</span>
            </div>
            <nav className="p-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#B9FF66] text-black"
                        : "text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <Separator className="my-2" />
            <div className="p-2">
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === "/settings"
                    ? "bg-[#B9FF66] text-black"
                    : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <HiCog className="h-5 w-5" />
                Settings
              </Link>
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <HiArrowRightOnRectangle className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-16 bg-white border-r border-zinc-200 flex-col items-center py-4 shrink-0">
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
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
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
              "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
              pathname === "/settings"
                ? "bg-[#B9FF66] text-black"
                : "text-zinc-500 hover:bg-zinc-100"
            )}
            title="Settings"
          >
            <HiCog className="h-5 w-5" />
          </Link>
          <button
            onClick={logout}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors"
            title="Logout"
          >
            <HiArrowRightOnRectangle className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Top Bar */}
        <header className="hidden lg:flex h-14 bg-white border-b border-zinc-200 px-6 items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Home</span>
            <span className="text-zinc-300">/</span>
            <span className="font-medium text-zinc-900">{currentLabel}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg">
              <HiSparkles className="h-4 w-4 text-[#B9FF66]" />
              <span className="text-sm font-medium">48 credits</span>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#B9FF66] text-black text-sm">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <HiChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </main>

      {/* Desktop Right Sidebar - History Panel (only on /generate) */}
      {pathname === "/generate" && (
      <aside className="hidden xl:flex w-72 bg-white border-l border-zinc-200 flex-col shrink-0">
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
                  <HiPhoto className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {icon.prompt}
                  </p>
                  <p className="text-xs text-zinc-500">{icon.date}</p>
                </div>
                <div className="hidden group-hover:flex items-center gap-1 transition-opacity">
                  <button className="p-1 hover:bg-zinc-200 rounded">
                    <HiClipboard className="h-3.5 w-3.5 text-zinc-500" />
                  </button>
                  <button className="p-1 hover:bg-zinc-200 rounded">
                    <HiTrash className="h-3.5 w-3.5 text-zinc-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
      )}

      {/* Mobile Bottom Dock */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-2 py-2">
          <div className="flex items-center justify-around">
            {menuItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px]",
                    isActive
                      ? "bg-[#B9FF66] text-black"
                      : "text-zinc-500 hover:bg-zinc-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Padding for Dock */}
      <div className="lg:hidden h-24" />
    </div>
  )
}