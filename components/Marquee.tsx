"use client";

import { HiStar, HiBolt, HiPaintBrush, HiCodeBracket, HiRectangleStack } from "react-icons/hi2";
import { cn } from "@/lib/utils";

export interface MarqueeItem {
  text: string;
  icon?: React.ElementType;
}

const defaultMarqueeItems: MarqueeItem[] = [
  { text: "AI Generation", icon: HiStar },
  { text: "SVG Export", icon: HiCodeBracket },
  { text: "React Components", icon: HiRectangleStack },
  { text: "Custom Styles", icon: HiPaintBrush },
  { text: "Fast Delivery", icon: HiBolt },
  { text: "High Quality", icon: HiStar },
];

export interface MarqueeProps {
  items?: MarqueeItem[];
  className?: string;
}

export default function Marquee({ items = defaultMarqueeItems, className }: MarqueeProps) {
  return (
    <div className={cn("w-full overflow-hidden bg-[#B9FF66] border-y-4 border-black py-4 mt-12 transform -rotate-1 relative z-20 shadow-[0_8px_0_0_rgba(0,0,0,1)]", className)}>
      <div className="flex">
        {/* First set */}
        <div className="animate-marquee flex gap-16 text-3xl md:text-5xl font-black tracking-tighter uppercase items-center text-black shrink-0">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 shrink-0">
              <span>{item.text}</span>
              {item.icon && <item.icon className="w-8 h-8 md:w-12 md:h-12 shrink-0" />}
            </div>
          ))}
        </div>
        {/* Second set (Duplicate for seamless scroll) */}
        <div className="animate-marquee flex gap-16 text-3xl md:text-5xl font-black tracking-tighter uppercase items-center text-black shrink-0" aria-hidden="true">
          {items.map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center gap-4 shrink-0">
              <span>{item.text}</span>
              {item.icon && <item.icon className="w-8 h-8 md:w-12 md:h-12 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
