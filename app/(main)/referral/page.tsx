"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HiGift, HiUsers, HiClock, HiCheckCircle, HiSparkles, HiClipboard, HiShare, HiLink } from "react-icons/hi2"
import { StatCard } from "@/components/stat-card"

const stats = [
  { label: "Total Referrals", value: "0", icon: HiUsers },
  { label: "Pending", value: "0", icon: HiClock },
  { label: "Completed", value: "0", icon: HiCheckCircle },
  { label: "Credits Earned", value: "0", icon: HiSparkles },
]

const steps = [
  { step: 1, title: "Share Your Link", description: "Send your unique referral link to friends" },
  { step: 2, title: "Friend Signs Up", description: "They create an account using your link" },
  { step: 3, title: "Both Get Credits", description: "You both receive bonus credits" },
]

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://aiicons.app/ref/demo-user-123"

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 overflow-auto py-8 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="w-16 h-16 bg-[#B9FF66] rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-black brutalist-shadow-sm">
            <HiGift className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Refer & Earn</h1>
          <p className="text-zinc-500 max-w-md mx-auto">
            Invite friends to AI Icons and earn free credits when they sign up
          </p>
          <Button variant="outline" className="mt-4 brutalist-border-2 rounded-xl">
            View Leaderboard
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        {/* Referral Link Box */}
        <Card className="p-6 rounded-2xl border-2 border-black brutalist-shadow">
          <h2 className="font-semibold text-zinc-900 mb-3">Your Referral Link</h2>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-200 text-sm text-zinc-600 truncate">
              {referralLink}
            </div>
            <Button
              onClick={handleCopy}
              className="bg-[#B9FF66] text-black border-2 border-black brutalist-shadow-sm hover:bg-[#a8ef55] px-4"
            >
              {copied ? <HiCheckCircle className="h-4 w-4" /> : <HiClipboard className="h-4 w-4" />}
              <span className="ml-2">{copied ? "Copied" : "Copy Link"}</span>
            </Button>
          </div>

          {/* Social Share */}
          <div className="mt-4 pt-4 border-t border-zinc-200">
            <p className="text-sm text-zinc-500 mb-3">Share on social media</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="brutalist-border-2 rounded-lg">
                <HiShare className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="brutalist-border-2 rounded-lg">
                <HiLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <div>
          <h2 className="font-semibold text-zinc-900 mb-4 text-center">How It Works</h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#B9FF66] rounded-full flex items-center justify-center text-black font-bold text-sm shrink-0 border-2 border-black">
                  {step.step}
                </div>
                <div>
                  <p className="font-medium text-zinc-900">{step.title}</p>
                  <p className="text-sm text-zinc-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        <Card className="p-8 rounded-2xl border-2 border-zinc-200 bg-zinc-50 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-zinc-200">
            <HiShare className="h-10 w-10 text-zinc-300" />
          </div>
          <h3 className="font-semibold text-zinc-900 mb-2">No Referrals Yet</h3>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            Start sharing your referral link to earn credits when friends sign up
          </p>
        </Card>
      </div>
    </div>
  )
}