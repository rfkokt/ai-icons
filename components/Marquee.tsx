"use client";

import { Star, Zap, Palette, Code, Sparkles, Layers } from "lucide-react";

const marqueeItems = [
  { text: "AI Generation", icon: Sparkles },
  { text: "SVG Export", icon: Code },
  { text: "React Components", icon: Layers },
  { text: "Custom Styles", icon: Palette },
  { text: "Fast Delivery", icon: Zap },
  { text: "High Quality", icon: Star },
];

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden bg-[#B9FF66] border-y-4 border-black py-4 mt-12 transform -rotate-1 relative z-20 shadow-[0_8px_0_0_rgba(0,0,0,1)]">
      <div className="flex whitespace-nowrap w-[200%]">
        {/* First set */}
        <div className="animate-marquee flex gap-10 text-3xl md:text-5xl font-black tracking-tighter uppercase items-center text-black w-1/2 justify-around">
          {marqueeItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <span>{item.text}</span>
              <item.icon className="w-8 h-8 md:w-12 md:h-12" />
            </div>
          ))}
        </div>
        {/* Second set (Duplicate for seamless scroll) */}
        <div className="animate-marquee flex gap-10 text-3xl md:text-5xl font-black tracking-tighter uppercase items-center text-black w-1/2 justify-around">
          {marqueeItems.map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center gap-4">
              <span>{item.text}</span>
              <item.icon className="w-8 h-8 md:w-12 md:h-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
