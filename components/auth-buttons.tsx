"use client"

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function AuthButtons() {
  return (
    <header className="flex items-center justify-end gap-4 p-4">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" className="text-sm font-medium">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="bg-[#B9FF66] text-black border-2 border-black rounded-lg btn-brutalist">
            Sign Up
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  )
}
