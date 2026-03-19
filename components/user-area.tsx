import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { CreditBadge } from "@/components/credit-badge"

interface UserAreaProps {
  credits: number
  href?: string
}

export function UserArea({ credits, href = "/generate" }: UserAreaProps) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <CreditBadge credits={credits} />
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black bg-white flex items-center justify-center">
        <UserButton />
      </div>
    </Link>
  )
}
