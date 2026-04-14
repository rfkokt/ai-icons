"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { HiArrowTopRightOnSquare, HiBolt } from "react-icons/hi2";
import gsap from "gsap";

export default function Hero() {
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroIllustrationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animations
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(heroContentRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
      })
      .from(heroIllustrationRef.current, {
        scale: 0.9,
        rotation: 5,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6");

      // Floating icon animation
      gsap.to(".hero-icon-float", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
      <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content */}
        <div ref={heroContentRef} className="max-w-xl">
          <div className="inline-block bg-card dark:bg-card border-2 border-black dark:border-zinc-700 px-4 py-2 rounded-full font-bold mb-6 transform -rotate-2 brutalist-shadow-sm dark:shadow-[4px_4px_0px_0px_#444]">
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-[#B9FF66] border-2 border-black rotate-45 transform" />
              AI-Powered Icon Generation
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-8 uppercase">
             The <br />
            <span className="text-[#B9FF66]" style={{ WebkitTextStroke: '2px black' }}>
              Brutalist
            </span>
            <br />
            Icon Forge
          </h1>
          
          <p className="text-2xl text-zinc-800 dark:text-zinc-200 mb-10 leading-snug font-medium">
            Stop using boring, generic SVG libraries. Generate bold, high-contrast assets directly from your text prompts. Say goodbye to soft UI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 font-bold">
            <Button
              className="bg-black text-[#B9FF66] text-xl px-10 py-5 rounded-2xl brutalist-shadow border-2 border-black flex justify-center items-center gap-3 group h-auto hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1"
            >
              Start Creating
              <span className="text-2xl font-black group-hover:rotate-12 transition-transform">→</span>
            </Button>
            
            <Button
              variant="outline"
              className="bg-card dark:bg-card text-black dark:text-white text-xl px-10 py-5 rounded-2xl brutalist-shadow dark:shadow-[4px_4px_0px_0px_#444] border-2 border-black dark:border-zinc-700 flex justify-center items-center gap-3 h-auto hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1"
            >
              View Examples
            </Button>
          </div>
        </div>

        {/* Right Illustration */}
        <div
          ref={heroIllustrationRef}
          className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center hidden md:flex"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Background Accent */}
            <div className="absolute w-[85%] h-[75%] bg-[#B9FF66] border-4 border-black rounded-[30px] transform rotate-6 brutalist-shadow translate-x-4 translate-y-4" />
            
            {/* Main Dashboard Card */}
            <div className="absolute w-[85%] h-[75%] bg-card dark:bg-card border-4 border-black dark:border-zinc-700 rounded-[30px] p-8 flex flex-col z-10 brutalist-shadow dark:shadow-[8px_8px_0px_0px_#444]">
              {/* Window Header */}
              <div className="flex justify-between items-center border-b-4 border-black dark:border-zinc-700 pb-4 mb-6">
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-zinc-200 border-2 border-black" />
                  <div className="w-4 h-4 rounded-full bg-zinc-200 border-2 border-black" />
                  <div className="w-4 h-4 rounded-full bg-zinc-200 border-2 border-black" />
                </div>
                <div className="text-xl font-bold tracking-tighter uppercase">Icon Preview</div>
              </div>

              {/* Icon Preview Area */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                  {/* Sample Icons */}
                  <div className="w-20 h-20 bg-card dark:bg-card border-4 border-black dark:border-zinc-700 rounded-2xl flex items-center justify-center font-black text-4xl text-foreground">
                    Aa
                  </div>
                  <div className="w-20 h-20 bg-[#B9FF66] border-4 border-black rounded-2xl flex items-center justify-center relative font-black text-5xl">
                    <span className="hero-icon-float">*</span>
                  </div>
                  <div className="w-20 h-20 bg-card dark:bg-card border-4 border-black dark:border-zinc-700 rounded-2xl flex items-center justify-center font-black text-4xl text-foreground">
                    {'</>'}
                  </div>
                  <div className="w-20 h-20 bg-black border-4 border-black rounded-2xl flex items-center justify-center font-black text-4xl text-[#B9FF66]">
                    #
                  </div>
                  <div className="w-20 h-20 bg-card dark:bg-card border-4 border-black dark:border-zinc-700 rounded-2xl flex items-center justify-center font-black text-4xl text-foreground">
                    X
                  </div>
                  <div className="w-20 h-20 bg-card dark:bg-card border-4 border-black dark:border-zinc-700 rounded-2xl flex items-center justify-center relative font-black text-4xl text-foreground">
                    <div className="absolute -top-8 -right-8 bg-card dark:bg-card border-4 border-black dark:border-zinc-700 px-3 py-1 rounded-full font-black text-lg brutalist-shadow-sm dark:shadow-[4px_4px_0px_0px_#444] rotate-12">
                      +428%
                    </div>
                    {':)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
