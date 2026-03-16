"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 pb-24">
      <div className="bg-zinc-100 p-10 lg:p-16 rounded-[40px] border-4 border-black brutalist-shadow flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#B9FF66] border-4 border-black rounded-full opacity-50 z-0" />
        
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-[#B9FF66]" />
            <span className="font-bold text-zinc-600">Start for free</span>
          </div>
          <h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6">
            Ready to create your perfect icon?
          </h3>
          <p className="text-xl text-zinc-700 font-medium">
            Get 2 free credits when you sign up. No credit card required. Start generating custom icons in seconds.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Button
            className="bg-black text-white text-xl font-bold px-10 py-5 rounded-2xl brutalist-shadow border-4 border-black whitespace-nowrap hover:bg-zinc-800 transition-colors h-auto"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
