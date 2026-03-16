"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Spinner } from "@/components/ui/spinner"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  
  // Get auth state after hydration
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    // Small delay to ensure zustand persist has hydrated
    const checkAuth = () => {
      if (!isAuthenticated) {
        router.push("/login")
      }
      setIsReady(true)
    }

    // Run after hydration
    const timeout = setTimeout(checkAuth, 50)
    return () => clearTimeout(timeout)
  }, [isAuthenticated, router])

  // Loading state while checking auth
  if (!isReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50">
        <Spinner size="lg" />
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}