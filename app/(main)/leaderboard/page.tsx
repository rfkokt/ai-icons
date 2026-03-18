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
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="h-auto bg-white border-b border-zinc-200 px-6 py-4 shrink-0">
        <h1 className="text-2xl font-bold text-zinc-900 mb-3">Leaderboard</h1>
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

      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-end justify-center gap-4 mb-8">
          <UserCard {...topUsers[1]} variant="regular" />
          <UserCard {...topUsers[0]} variant="top" />
          <UserCard {...topUsers[2]} variant="regular" />
        </div>

        <Card className="rounded-2xl border-2 border-zinc-200 bg-white">
          <div className="p-4 border-b border-zinc-200">
            <h2 className="font-semibold text-zinc-900">Community Champions</h2>
          </div>
          <div className="divide-y divide-zinc-200">
            {leaderboardData.map((user) => (
              <UserCard key={user.rank} {...user} variant="regular" />
            ))}
          </div>
        </Card>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <UserCard {...myRank} variant="my" />
      </div>
    </div>
  )
}
