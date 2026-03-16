"use client";

import Link from "next/link";
import { ArrowUpRight, Github, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10" id="footer">
      <div className="max-w-7xl mx-auto px-6">
        {/* Branding Header */}
        <div className="flex flex-wrap gap-3 md:gap-5 items-baseline pb-4 mb-8">
          <h1 className="text-6xl md:text-9xl lg:text-[10rem] leading-[0.8] tracking-tighter font-black text-white select-none">
            AI Icons
          </h1>
          <span className="text-xl md:text-3xl font-bold text-[#B9FF66] tracking-tighter relative -top-1 md:-top-3 border-2 border-[#B9FF66] px-3 py-1 rounded-full transform rotate-3">
            GENERATOR
          </span>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-4 border-zinc-800 pt-16">
          {/* CTA Section */}
          <div className="lg:col-span-5 flex flex-col items-start justify-between gap-10">
            <p className="text-2xl text-zinc-400 font-bold tracking-tight leading-relaxed max-w-md">
              Create stunning icons with AI. Perfect for developers, designers, and creators.
            </p>

            <div className="flex items-center gap-4">
              <Button
                className="bg-[#B9FF66] hover:bg-white text-black px-8 py-4 rounded-xl text-lg font-black transition-colors duration-300 border-4 border-[#B9FF66] hover:border-white tracking-tighter h-auto"
              >
                Start Creating
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-16 h-16 rounded-xl bg-zinc-800 hover:bg-[#B9FF66] text-white hover:text-black flex items-center justify-center transition-colors duration-300 group border-4 border-zinc-800 hover:border-[#B9FF66]"
              >
                <ArrowUpRight className="w-8 h-8 group-hover:rotate-45 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-10 lg:pl-10">
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                Product
              </span>
              <ul className="flex flex-col gap-4">
                <li><Link href="#features" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Features</Link></li>
                <li><Link href="#pricing" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Pricing</Link></li>
                <li><Link href="#showcase" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Showcase</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                Resources
              </span>
              <ul className="flex flex-col gap-4">
                <li><Link href="#" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Documentation</Link></li>
                <li><Link href="#" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">API</Link></li>
                <li><Link href="#" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Community</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                Company
              </span>
              <ul className="flex flex-col gap-4">
                <li><Link href="#" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">About</Link></li>
                <li><Link href="#" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Blog</Link></li>
                <li><Link href="#" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Contact</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-6">
              <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                Legal
              </span>
              <ul className="flex flex-col gap-4">
                <li><Link href="#" className="text-lg text-zinc-500 hover:text-white transition-colors font-bold tracking-tight">Privacy Policy</Link></li>
                <li><Link href="#" className="text-lg text-zinc-500 hover:text-white transition-colors font-bold tracking-tight">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row border-t-4 border-zinc-900 pt-8 mt-16 gap-4 items-center justify-between">
          <p className="text-base text-zinc-500 font-bold tracking-tight">
            © 2024 AI Icons. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-white hover:text-[#B9FF66] transition-transform hover:scale-110">
              <Twitter className="w-8 h-8" />
            </Link>
            <Link href="#" className="text-white hover:text-[#B9FF66] transition-transform hover:scale-110">
              <Github className="w-8 h-8" />
            </Link>
            <Link href="#" className="text-white hover:text-[#B9FF66] transition-transform hover:scale-110">
              <MessageCircle className="w-8 h-8" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
