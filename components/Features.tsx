"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HiSparkles,
  HiArrowDownTray,
  HiPaintBrush,
  HiBolt,
  HiShare,
  HiCreditCard,
  HiArrowTopRightOnSquare,
  HiCursorArrowRays,
} from "react-icons/hi2";
import { FaBullseye } from "react-icons/fa6";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: HiSparkles,
    title: "AI Generation",
    description: "Generate custom icons from text prompts using advanced AI models",
    color: "bg-zinc-100",
    hoverColor: "hover:bg-[#B9FF66]",
  },
  {
    icon: HiArrowDownTray,
    title: "Multiple Formats",
    description: "Export icons as SVG, PNG, or React components for seamless integration",
    color: "bg-[#B9FF66]",
    hoverColor: "hover:bg-black hover:text-white",
  },
  {
    icon: HiPaintBrush,
    title: "Custom Styles",
    description: "Choose from various styles: minimalist, outlined, filled, gradient, and more",
    color: "bg-black text-white",
    hoverColor: "hover:bg-zinc-800",
  },
  {
    icon: HiBolt,
    title: "Fast Generation",
    description: "Get your icons in under 3 seconds with our optimized AI pipeline",
    color: "bg-zinc-100",
    hoverColor: "hover:bg-[#B9FF66]",
  },
  {
    icon: HiShare,
    title: "Community Library",
    description: "Share your creations and discover icons made by other designers",
    color: "bg-[#B9FF66]",
    hoverColor: "hover:bg-black hover:text-white",
  },
  {
    icon: HiCreditCard,
    title: "Flexible Pricing",
    description: "Start with 2 free credits, then purchase packages that fit your needs",
    color: "bg-black text-white",
    hoverColor: "hover:bg-zinc-800",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.from(gridRef.current.children, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.2)",
      });
    }
  }, []);

  return (
    <section id="features" ref={sectionRef} className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="grid lg:grid-cols-12 gap-10 items-center mb-20">
        <div className="lg:col-span-8">
          <Badge 
            variant="outline" 
            className="bg-[#B9FF66] text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform -rotate-2 brutalist-shadow-sm text-base"
          >
            Our Features
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight">
            Everything you need to create perfect icons for your projects
          </h2>
        </div>
        
        {/* Parallel Illustration */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end relative">
          <div className="w-48 h-48 bg-white border-4 border-black rounded-full brutalist-shadow flex flex-col items-center justify-center relative z-10 group">
            <FaBullseye className="w-20 h-20 text-black group-hover:scale-110 transition-transform duration-300" />
          </div>
          {/* Decorative blob behind */}
          <div className="absolute w-48 h-48 bg-[#B9FF66] border-4 border-black rounded-full translate-x-4 translate-y-4" />
          {/* Little sparks */}
          <HiSparkles className="absolute -top-4 right-10 w-10 h-10 text-black rotate-12 z-20 animate-pulse" />
        </div>
      </div>

      {/* Features Grid */}
      <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className={`${feature.color} p-8 rounded-[30px] border-4 border-black brutalist-shadow flex flex-col justify-between min-h-[320px] group transition-all duration-300 ${feature.hoverColor} cursor-pointer`}
          >
            <div>
              <feature.icon className="w-14 h-14 mb-6 group-hover:rotate-12 transition-transform" />
              <h3 className="text-3xl font-black tracking-tighter leading-tight mb-4">
                {feature.title}
              </h3>
              <p className={`text-lg font-medium ${feature.color.includes('bg-black') ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {feature.description}
              </p>
            </div>
            <div className={`flex items-center gap-4 text-xl font-bold mt-auto ${feature.color.includes('bg-black') ? 'text-[#B9FF66]' : ''}`}>
              <div className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center bg-white transition-colors ${
                feature.color.includes('bg-black') 
                  ? 'group-hover:border-[#B9FF66]' 
                  : 'group-hover:bg-black group-hover:text-[#B9FF66]'
              }`}>
                <HiArrowTopRightOnSquare className="w-6 h-6" />
              </div>
              Learn more
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
