"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HiTrophy } from "react-icons/hi2"
import { FilterTabs } from "@/components/filter-tabs"
import { UserCard } from "@/components/user-card"

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
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f4f6] bg-grid-pattern">
      <header className="h-auto bg-white border-b-3 border-black px-4 sm:px-6 py-4 shrink-0 shadow-[0_4px_0_0_#000000] z-10">
        <h1 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">Leaderboard</h1>
        <FilterTabs
          tabs={[
            { key: "weekly", label: "Weekly" },
            { key: "monthly", label: "Monthly" },
            { key: "allTime", label: "All Time" }
          ]}
          activeTab={filter}
          onTabChange={(key) => setFilter(key as FilterType)}
          className="w-fit"
        />
      </header>

      <main className="flex-1 overflow-auto p-4 sm:p-6 relative">
        <div className="mb-10 w-full pt-4 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-5xl mx-auto">
            <div className="w-full sm:w-auto order-2 sm:order-1 flex-1 sm:max-w-[280px]">
              <UserCard {...topUsers[1]} variant="regular" />
            </div>
            <div className="w-full sm:w-[320px] order-1 sm:order-2 flex-1 sm:max-w-[320px]">
              <UserCard {...topUsers[0]} variant="top" />
            </div>
            <div className="w-full sm:w-auto order-3 sm:order-3 flex-1 sm:max-w-[280px]">
              <UserCard {...topUsers[2]} variant="regular" />
            </div>
          </div>
        </div>

        <Card className="rounded-[24px] border-[3px] border-black bg-white shadow-[8px_8px_0_0_#000000] overflow-hidden max-w-4xl mx-auto">
          <div className="p-5 border-b-3 border-black bg-zinc-50">
            <h2 className="font-black text-xl text-zinc-900 tracking-tight">Community Champions</h2>
          </div>
          <div className="divide-y-3 divide-black">
            {leaderboardData.map((user) => (
              <div key={user.rank} className="hover:bg-zinc-50 transition-colors">
                <UserCard {...user} variant="regular" />
              </div>
            ))}
          </div>
        </Card>
      </main>

      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-[340px] sm:right-8 sm:bottom-8 z-50">
        <div className="w-full">
          <UserCard {...myRank} variant="my" />
        </div>
      </div>
    </div>
  )
}
