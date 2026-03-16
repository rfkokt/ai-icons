"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HiBars3, HiXMark } from "react-icons/hi2";
import Link from "next/link";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#showcase", label: "Showcase" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
      <Link href="/" className="text-4xl font-bold tracking-tighter hover:text-[#88cc33] transition-colors">
        AI Icons
      </Link>

      <div className="hidden lg:flex items-center gap-10 text-lg font-bold text-zinc-800 bg-white px-8 py-3 rounded-full border-2 border-black brutalist-shadow-sm">
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

      <div className="hidden lg:block">
        <Button
          className="bg-[#B9FF66] border-2 border-black rounded-xl px-8 py-4 text-black font-bold text-lg brutalist-shadow hover:bg-[#a8ef55] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 h-auto"
        >
          Get Started
        </Button>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="lg:hidden bg-white p-2 border-2 border-black rounded-lg brutalist-shadow-sm h-auto w-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiXMark className="text-3xl" /> : <HiBars3 className="text-3xl" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-4 border-black brutalist-shadow mx-6 mt-2 p-6 lg:hidden z-50">
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
            <Button
              className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-black font-bold text-lg brutalist-shadow-sm hover:bg-[#a8ef55] mt-4 h-auto"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
