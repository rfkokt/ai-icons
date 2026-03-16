"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/generate")
  }, [router])

  return null
}