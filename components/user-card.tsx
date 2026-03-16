import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserCardProps {
  rank: number
  name: string
  referrals: number
  credits: number
  variant?: "top" | "regular" | "my"
}

export function UserCard({ rank, name, referrals, credits, variant = "regular" }: UserCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "top":
        return "w-32 p-5 rounded-2xl border-2 border-black bg-gradient-to-b from-[#B9FF66] to-[#a8ed55] text-center brutalist-shadow"
      case "my":
        return "p-4 rounded-2xl border-2 border-black brutalist-shadow bg-[#B9FF66]"
      default:
        return "p-4 rounded-2xl border-2 border-zinc-200 bg-white"
    }
  }

  const getRankDisplay = () => {
    if (variant === "top") {
      return (
        <div className="w-14 h-14 mx-auto mb-2 bg-white rounded-full flex items-center justify-center border-2 border-black">
          <FaCrown className="h-7 w-7 text-black" />
        </div>
      )
    }
    return (
      <div className={`w-8 h-8 ${variant === "my" ? "bg-white" : "bg-zinc-100"} rounded-lg flex items-center justify-center text-sm font-medium ${variant === "my" ? "text-black" : "text-zinc-600"}`}>
        {rank}
      </div>
    )
  }

  return (
    <Card className={getVariantStyles()}>
      {variant === "top" && getRankDisplay()}
      {variant !== "top" && (
        <div className="flex items-center gap-3">
          {getRankDisplay()}
          <div className="flex-1 min-w-0">
            <p className={`font-medium truncate ${variant === "my" ? "text-black" : "text-zinc-900"}`}>
              {name}
            </p>
            <p className={`text-xs ${variant === "my" ? "text-black/70" : "text-zinc-500"}`}>
              {referrals} referrals
            </p>
          </div>
          {variant === "my" && (
            <div className="text-right">
              <p className="font-semibold text-black">{credits}</p>
              <p className="text-xs text-black/70">credits</p>
            </div>
          )}
        </div>
      )}
      {variant === "top" && (
        <>
          <p className="font-bold text-black truncate">{name}</p>
          <p className="text-sm text-black/80">{referrals} referrals</p>
          <p className="text-xs font-medium text-black/60 mt-1">{credits} credits</p>
        </>
      )}
    </Card>
  )
}

import { FaCrown } from "react-icons/fa6"
