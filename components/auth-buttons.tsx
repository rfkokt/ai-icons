"use client"

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"

export function AuthButtons() {
  return (
    <header className="flex items-center justify-end gap-4 p-4">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="px-4 py-2 text-sm font-medium text-zinc-900 hover:text-zinc-700">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-4 py-2 text-sm font-medium bg-[#B9FF66] text-black border-2 border-black rounded-lg btn-brutalist">
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  )
}
