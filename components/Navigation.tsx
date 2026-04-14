"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { SignInButton, SignUpButton, Show, useUser } from "@clerk/nextjs";
import { useAuthSync } from "@/hooks/use-auth-sync";
import { UserArea } from "@/components/user-area";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#showcase", label: "Showcase" },
];

export default function Navigation() {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuthSync();
  const [isOpen, setIsOpen] = useState(false);

  const userName = user?.fullName || user?.username || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';
  const userCredits = 2;

  return (
    <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
      <Link href="/" className="text-4xl font-bold tracking-tighter hover:text-[#88cc33] transition-colors">
        AI Icons
      </Link>

      <div className="hidden lg:flex items-center h-10 gap-10 text-base font-bold text-zinc-800 dark:text-zinc-200 bg-card dark:bg-card px-6 rounded-full border-2 border-black dark:border-zinc-700 brutalist-shadow-sm dark:shadow-[4px_4px_0px_0px_#444]">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-[#88cc33] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-3">
        <ThemeToggle />
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost" className="text-sm font-bold text-zinc-800 hover:text-[#88cc33]">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-black font-bold text-base brutalist-shadow hover:bg-[#a8ef55] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 h-auto"
            >
              Get Started
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserArea credits={userCredits} />
        </Show>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="lg:hidden bg-card dark:bg-card p-2 border-2 border-black dark:border-zinc-700 rounded-lg brutalist-shadow-sm dark:shadow-[4px_4px_0px_0px_#444] h-auto w-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiXMark className="text-3xl" /> : <HiBars3 className="text-3xl" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-card dark:bg-card border-4 border-black dark:border-zinc-700 brutalist-shadow dark:shadow-[8px_8px_0px_0px_#444] mx-6 mt-2 p-6 lg:hidden z-50">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xl font-bold hover:text-[#88cc33] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t-2 border-black">
              <ThemeToggle />
              <span className="text-sm font-bold text-zinc-600">Toggle Theme</span>
            </div>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full py-3 text-lg font-bold border-2 border-black rounded-xl mt-4">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-black font-bold text-lg brutalist-shadow-sm hover:bg-[#a8ef55] mt-2 h-auto w-full"
                >
                  Get Started
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div onClick={() => setIsOpen(false)}>
                <UserArea credits={userCredits} />
              </div>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
}
