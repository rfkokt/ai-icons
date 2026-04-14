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
        return "w-full p-6 sm:p-8 rounded-[24px] border-[4px] border-black bg-[#B9FF66] text-center shadow-[6px_6px_0px_0px_#000000]"
      case "my":
        return "p-4 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] bg-[#B9FF66]"
      default:
        return "w-full p-5 rounded-[20px] border-[3px] border-black dark:border-zinc-600 shadow-[4px_4px_0px_0px_#000000] dark:shadow-none bg-white dark:bg-[#141414] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] dark:hover:shadow-none"
    }
  }

  const getRankDisplay = () => {
    if (variant === "top") {
      return (
      <div className="w-14 h-14 mx-auto mb-2 bg-white rounded-full flex items-center justify-center border-[3px] border-black shadow-[2px_2px_0_0_#000]">
        <FaCrown className="h-7 w-7 text-black" />
      </div>
      )
    }
    return (
      <div className={`w-8 h-8 ${variant === "my" ? "bg-white dark:bg-[#1a1a1a]" : "bg-zinc-100 dark:bg-[#1a1a1a]"} rounded-lg flex items-center justify-center text-sm font-medium ${variant === "my" ? "text-black dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}>
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
            <p className={`font-medium truncate ${variant === "my" ? "text-black dark:text-zinc-100" : "text-zinc-900 dark:text-zinc-100"}`}>
              {name}
            </p>
            <p className={`text-xs ${variant === "my" ? "text-black dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
              {referrals} referrals
            </p>
          </div>
          {variant === "my" ? (
            <div className="text-right">
              <p className="font-semibold text-black dark:text-zinc-100">{credits}</p>
              <p className="text-xs text-black dark:text-zinc-400">credits</p>
            </div>
          ) : (
            <div className="text-right">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{credits}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">credits</p>
            </div>
          )}
        </div>
      )}
      {variant === "top" && (
        <>
          <p className="font-bold text-black truncate">{name}</p>
          <p className="text-sm text-black/80 dark:text-black/70">{referrals} referrals</p>
          <p className="text-xs font-medium text-black/60 dark:text-black/50 mt-1">{credits} credits</p>
        </>
      )}
    </Card>
  )
}

import { FaCrown } from "react-icons/fa6"
