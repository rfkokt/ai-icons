"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthSync } from "@/hooks/use-auth-sync"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuthSync()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/generate")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (isSignedIn) {
    return null
  }

  return <>{children}</>
}