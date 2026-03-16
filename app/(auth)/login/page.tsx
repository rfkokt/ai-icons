"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/lib/store"
import { loginSchema, type LoginFormValues } from "@/lib/validations"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      login(
        {
          id: "1",
          email: data.email,
          name: "Demo User",
          role: "user",
        },
        "demo-token"
      )
      
      router.push("/dashboard")
    } catch {
      setError("Email atau password salah")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] bg-grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-4 border-black brutalist-shadow rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold tracking-tighter">AI Icons</h1>
            </Link>
            <p className="text-zinc-500 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="brutalist-border-2 rounded-xl"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="brutalist-border-2 rounded-xl"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#B9FF66] text-black border-2 border-black rounded-xl py-3 font-bold text-lg brutalist-shadow hover:bg-[#a8ef55] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 h-auto"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            <p>Demo: any email & password (min 6 chars)</p>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-200 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}