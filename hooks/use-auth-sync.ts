"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useAuthStore } from "@/lib/store"

export function useAuthSync() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { syncFromClerk, logout } = useAuthStore()

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userData = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User",
        imageUrl: user.imageUrl,
      }
      
      syncFromClerk(userData)

      fetch("/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          email: userData.email,
          name: userData.name,
          imageUrl: userData.imageUrl,
        }),
      }).catch(console.error)
    } else if (isLoaded && !isSignedIn) {
      logout()
    }
  }, [isLoaded, isSignedIn, user, syncFromClerk, logout])

  return { user, isLoaded, isSignedIn }
}
