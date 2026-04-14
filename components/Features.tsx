"use client";

import { FaBullseye } from "react-icons/fa6";
import { BrutalistCard } from "@/components/ui/brutalist-card";
import { BrutalistBadge } from "@/components/ui/brutalist-badge";

const features = [
  {
    number: "01",
    title: "Brutalist Forge",
    description: "Generate thick-bordered, aggressive icons driven by next-gen AI models.",
    color: "zinc",
    hoverColor: "hover:bg-[#B9FF66]",
  },
  {
    number: "02",
    title: "SVG & PNG Delivery",
    description: "Instantly deploy your icons as sharp SVGs or transparent PNGs.",
    color: "lime",
    hoverColor: "hover:bg-black hover:text-white",
  },
  {
    number: "03",
    title: "Zero Soft UI",
    description: "No drop shadows, no blurs. Just hard edges and solid black borders.",
    color: "black",
    hoverColor: "hover:bg-zinc-800",
  },
  {
    number: "04",
    title: "Instant Pixels",
    description: "Get your brutalist assets ready in sub-3 seconds straight to your dashboard.",
    color: "zinc",
    hoverColor: "hover:bg-[#B9FF66]",
  },
  {
    number: "05",
    title: "Shared Packs",
    description: "Explore the community leaderboard and nab packs published by other rebel designers.",
    color: "lime",
    hoverColor: "hover:bg-black hover:text-white",
  },
  {
    number: "06",
    title: "Credits & Hustle",
    description: "Start with 2 free credits. Earn more organically with referrals or pay your share.",
    color: "black",
    hoverColor: "hover:bg-zinc-800",
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="grid lg:grid-cols-12 gap-10 items-center mb-20">
        <div className="lg:col-span-8">
          <BrutalistBadge 
            color="lime" 
            className="transform -rotate-2 mb-6 px-4 py-2 text-base text-black"
          >
            Our Features
          </BrutalistBadge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight text-foreground">
            Everything you need to create perfect icons for your projects
          </h2>
        </div>
        
        {/* Parallel Illustration */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end relative">
          <div className="w-48 h-48 bg-card dark:bg-card border-4 border-black dark:border-zinc-700 rounded-full shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#444] flex flex-col items-center justify-center relative z-10 group">
            <FaBullseye className="w-20 h-20 text-black dark:text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          {/* Decorative blob behind */}
          <div className="absolute w-48 h-48 bg-[#B9FF66] border-4 border-black rounded-full translate-x-4 translate-y-4 shadow-[4px_4px_0_0_#000]" />
          {/* Decorative string/text behind */}
          <div className="absolute -top-4 right-5 text-4xl font-black text-black z-20 shadow-[4px_4px_0_0_#000] bg-[#B9FF66] border-4 border-black px-2 py-1 rotate-12">
            WTF?
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <BrutalistCard
            key={index}
            color={feature.color as "lime" | "black" | "zinc"}
            className={`p-8 min-h-[320px] group flex flex-col justify-between ${feature.hoverColor}`}
          >
            <div>
              <div className="text-5xl font-black mb-6 tracking-tighter group-hover:rotate-6 transition-transform group-hover:scale-110 origin-left">
                {feature.number}
              </div>
              <h3 className="text-3xl font-black tracking-tighter leading-tight mb-4">
                {feature.title}
              </h3>
              <p className={`text-lg font-medium ${feature.color === 'black' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {feature.description}
              </p>
            </div>
            <div className={`flex items-center gap-4 text-xl font-bold mt-auto ${feature.color === 'black' ? 'text-[#B9FF66]' : ''}`}>
              <div className={`w-12 h-12 rounded-full border-2 border-black dark:border-zinc-700 flex items-center justify-center bg-card dark:bg-card transition-colors ${
                feature.color === 'black' 
                  ? 'group-hover:border-[#B9FF66] text-black' 
                  : 'group-hover:bg-black group-hover:text-[#B9FF66] text-black'
              }`}>
                <span className="font-black">→</span>
              </div>
              Explore
            </div>
          </BrutalistCard>
        ))}
      </div>
    </section>
  );
}
