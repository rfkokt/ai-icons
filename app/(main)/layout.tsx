"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthSync } from "@/hooks/use-auth-sync"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Spinner } from "@/components/ui/spinner"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuthSync()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}