"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HiGift, HiShare, HiUsers, HiClock, HiCheckCircle, HiBanknotes } from "react-icons/hi2"
import { StatCard } from "@/components/stat-card"
import { UserArea } from "@/components/user-area"
import { EmptyState } from "@/components/empty-state"
import { HowItWorks } from "@/components/how-it-works"
import { CopyLinkButton } from "@/components/copy-link-button"

const stats = [
  { label: "Total Referrals", value: "0", icon: HiUsers },
  { label: "Pending", value: "0", icon: HiClock },
  { label: "Completed", value: "0", icon: HiCheckCircle },
  { label: "Credits Earned", value: "0", icon: HiBanknotes },
]

const steps = [
  { step: 1, title: "Share Your Link", description: "Send your unique referral link to friends" },
  { step: 2, title: "Friend Signs Up", description: "They create an account using your link" },
  { step: 3, title: "Both Get Credits", description: "You both receive bonus credits" },
]

export default function ReferralPage() {
  const referralLink = "https://aiicons.app/ref/demo-user-123"
  const userCredits = 48

  return (
    <div className="flex-1 overflow-auto py-8 px-6 bg-[#f3f4f6] dark:bg-[#0a0a0a] bg-grid-pattern min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">


        <div className="text-center">
          <div className="w-10 h-10 bg-[#B9FF66] rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-black brutalist-shadow-sm">
            <HiGift className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Refer & Earn</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Invite friends to AI Icons and earn free credits when they sign up
          </p>
          <Button variant="outline" className="mt-4 brutalist-border-2 rounded-xl">
            View Leaderboard
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        <Card className="p-6 rounded-2xl border-[3px] border-black shadow-[8px_8px_0_0_#000000] bg-white dark:bg-[#141414]">
          <h2 className="font-black text-xl text-zinc-900 dark:text-white mb-3 tracking-tight">Your Referral Link</h2>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-[#1a1a1a] rounded-xl border-2 border-black text-base font-bold text-zinc-800 dark:text-zinc-200 truncate">
              {referralLink}
            </div>
            <CopyLinkButton 
              text={referralLink}
              className="bg-[#B9FF66] text-black border-2 border-black brutalist-shadow-sm hover:bg-[#a8ef55] px-4"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-200">
            <p className="text-sm text-zinc-500 mb-3">Share on social media</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="brutalist-border-2 rounded-lg">
                <HiShare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="font-black text-2xl text-zinc-900 dark:text-white mb-6 text-center tracking-tighter uppercase">How It Works</h2>
          <HowItWorks steps={steps} />
        </div>

        <EmptyState
          variant="minimal"
          icon={<HiShare className="h-10 w-10 text-zinc-300" />}
          title="No Referrals Yet"
          description="Start sharing your referral link to earn credits when friends sign up"
        />
      </div>
    </div>
  )
}
