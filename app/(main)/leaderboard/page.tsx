"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HiTrophy } from "react-icons/hi2"
import { FaCrown, FaMedal } from "react-icons/fa6"
import { cn } from "@/lib/utils"

type FilterType = "weekly" | "monthly" | "allTime"

const topUsers = [
  { rank: 1, name: "Sarah Chen", referrals: 234, credits: 2340 },
  { rank: 2, name: "Alex Johnson", referrals: 198, credits: 1980 },
  { rank: 3, name: "Mike Wilson", referrals: 156, credits: 1560 },
]

const leaderboardData = [
  { rank: 4, name: "Emily Davis", referrals: 142, credits: 1420 },
  { rank: 5, name: "James Brown", referrals: 128, credits: 1280 },
  { rank: 6, name: "Lisa Anderson", referrals: 115, credits: 1150 },
  { rank: 7, name: "David Lee", referrals: 98, credits: 980 },
  { rank: 8, name: "Anna Kim", referrals: 87, credits: 870 },
  { rank: 9, name: "Chris Taylor", referrals: 76, credits: 760 },
  { rank: 10, name: "Emma White", referrals: 65, credits: 650 },
]

const myRank = { rank: 24, name: "You", referrals: 12, credits: 120 }

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<FilterType>("weekly")

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-auto bg-white border-b border-zinc-200 px-6 py-4 shrink-0">
        <h1 className="text-2xl font-bold text-zinc-900 mb-3">Leaderboard</h1>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
          {[
            { key: "weekly", label: "Weekly" },
            { key: "monthly", label: "Monthly" },
            { key: "allTime", label: "All Time" },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(tab.key as FilterType)}
              className={cn(
                "h-8 px-4 rounded-md text-sm font-medium transition-colors",
                filter === tab.key
                  ? "bg-zinc-900 text-white hover:bg-zinc-800"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-transparent"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* Rank 2 */}
          <div className="flex flex-col items-center">
            <Card className="w-28 p-4 rounded-2xl border-2 border-zinc-200 bg-white text-center active:scale-[0.98] transition-all duration-200 cursor-pointer">
              <Avatar className="w-12 h-12 mx-auto mb-2 bg-zinc-100">
                <AvatarFallback className="bg-zinc-200 text-zinc-600">AJ</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-sm text-zinc-900 truncate">{topUsers[1].name}</p>
              <p className="text-xs text-zinc-500">{topUsers[1].referrals} referrals</p>
            </Card>
            <div className="w-16 h-16 bg-zinc-300 rounded-t-lg mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-zinc-600">2</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center">
            <Card className="w-32 p-5 rounded-2xl border-2 border-black bg-gradient-to-b from-[#B9FF66] to-[#a8ed55] text-center brutalist-shadow active:scale-[0.98] transition-all duration-200 cursor-pointer">
              <div className="w-14 h-14 mx-auto mb-2 bg-white rounded-full flex items-center justify-center border-2 border-black">
                <FaCrown className="h-7 w-7 text-black" />
              </div>
              <p className="font-bold text-black truncate">{topUsers[0].name}</p>
              <p className="text-sm text-black/80">{topUsers[0].referrals} referrals</p>
              <p className="text-xs font-medium text-black/60 mt-1">{topUsers[0].credits} credits</p>
            </Card>
            <div className="w-20 h-24 bg-[#B9FF66] rounded-t-lg mt-2 flex items-center justify-center border-2 border-black border-b-0">
              <span className="text-3xl font-bold text-black">1</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center">
            <Card className="w-28 p-4 rounded-2xl border-2 border-zinc-200 bg-white text-center active:scale-[0.98] transition-all duration-200 cursor-pointer">
              <Avatar className="w-12 h-12 mx-auto mb-2 bg-zinc-100">
                <AvatarFallback className="bg-zinc-200 text-zinc-600">MW</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-sm text-zinc-900 truncate">{topUsers[2].name}</p>
              <p className="text-xs text-zinc-500">{topUsers[2].referrals} referrals</p>
            </Card>
            <div className="w-16 h-12 bg-amber-600 rounded-t-lg mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
          </div>
        </div>

        {/* Community Champions */}
        <Card className="rounded-2xl border-2 border-zinc-200 bg-white active:scale-[0.98] transition-all duration-200">
          <div className="p-4 border-b border-zinc-200">
            <h2 className="font-semibold text-zinc-900">Community Champions</h2>
          </div>
          <div className="divide-y divide-zinc-200">
            {leaderboardData.map((user) => (
              <div key={user.rank} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-sm font-medium text-zinc-600">
                  {user.rank}
                </div>
                <Avatar className="w-10 h-10 bg-zinc-100">
                  <AvatarFallback className="bg-zinc-200 text-zinc-600">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 truncate">{user.name}</p>
                  <p className="text-xs text-zinc-500">{user.referrals} referrals</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-zinc-900">{user.credits}</p>
                  <p className="text-xs text-zinc-500">credits</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* My Rank Floating Card */}
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="p-4 rounded-2xl border-2 border-black brutalist-shadow bg-[#B9FF66] active:scale-[0.98] transition-all duration-200 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-black">
              <span className="font-bold text-black">#{myRank.rank}</span>
            </div>
            <div>
              <p className="font-semibold text-black">Your Rank</p>
              <p className="text-sm text-black/70">{myRank.referrals} referrals</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}