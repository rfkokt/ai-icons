"use client";

import { Button } from "@/components/ui/button";
import { HiArrowRight, HiBolt } from "react-icons/hi2";

export default function CTA() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 pb-24">
      <div className="bg-muted dark:bg-muted p-10 lg:p-16 rounded-[40px] border-4 border-black dark:border-zinc-700 brutalist-shadow dark:shadow-[8px_8px_0px_0px_#444] flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#B9FF66] border-4 border-black rounded-full opacity-50 z-0" />
        
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <HiBolt className="w-6 h-6 text-[#B9FF66]" />
            <span className="font-bold text-zinc-600 dark:text-zinc-400">Start for free</span>
          </div>
          <h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6 text-foreground">
            Ready to Forge Brutalist Icons?
          </h3>
          <p className="text-xl text-zinc-700 dark:text-zinc-300 font-medium">
            Get 2 free credits when you sign up. No credit card required. Start generating high-contrast custom icons in seconds.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Button
            className="bg-black text-white text-xl font-bold px-10 py-5 rounded-2xl brutalist-shadow border-4 border-black whitespace-nowrap hover:bg-zinc-800 transition-colors h-auto"
          >
            Get Started Free
            <HiArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
