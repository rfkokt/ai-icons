"use client"

import { forwardRef } from "react"
import { HiSparkles } from "react-icons/hi2"

interface GeneratingOverlayProps {
  iconCount?: number
  className?: string
}

export const GeneratingOverlay = forwardRef<HTMLDivElement, GeneratingOverlayProps>(
  function GeneratingOverlay({ iconCount = 8, className = "" }, ref) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden ${className}`}>
        
        {/* Top Marquee */}
        <div className="absolute top-8 left-0 w-full h-14 bg-[#B9FF66] border-y-4 border-black flex items-center overflow-hidden rotate-[-2deg] scale-110">
          <div className="animate-marquee whitespace-nowrap flex gap-12 items-center font-black text-black text-2xl uppercase tracking-widest">
            <span>Creating Magic</span> <HiSparkles className="w-6 h-6"/>
            <span>Generating {iconCount} Icons</span> <HiSparkles className="w-6 h-6"/>
            <span>AI At Work</span> <HiSparkles className="w-6 h-6"/>
            <span>Creating Magic</span> <HiSparkles className="w-6 h-6"/>
            <span>Generating {iconCount} Icons</span> <HiSparkles className="w-6 h-6"/>
            <span>AI At Work</span> <HiSparkles className="w-6 h-6"/>
            <span>Creating Magic</span> <HiSparkles className="w-6 h-6"/>
            <span>Generating {iconCount} Icons</span> <HiSparkles className="w-6 h-6"/>
            <span>AI At Work</span> <HiSparkles className="w-6 h-6"/>
          </div>
        </div>

        {/* Bottom Marquee */}
        <div className="absolute bottom-10 left-0 w-full h-14 bg-white border-y-4 border-black flex items-center overflow-hidden rotate-[3deg] scale-110">
          <div className="animate-marquee-reverse whitespace-nowrap flex gap-12 items-center font-black text-black text-2xl uppercase tracking-widest">
            <span>Stand By</span> <HiSparkles className="w-6 h-6"/>
            <span>Cooking Pixels</span> <HiSparkles className="w-6 h-6"/>
            <span>Machine Learning</span> <HiSparkles className="w-6 h-6"/>
            <span>Stand By</span> <HiSparkles className="w-6 h-6"/>
            <span>Cooking Pixels</span> <HiSparkles className="w-6 h-6"/>
            <span>Machine Learning</span> <HiSparkles className="w-6 h-6"/>
            <span>Stand By</span> <HiSparkles className="w-6 h-6"/>
            <span>Cooking Pixels</span> <HiSparkles className="w-6 h-6"/>
            <span>Machine Learning</span> <HiSparkles className="w-6 h-6"/>
          </div>
        </div>

        {/* Main Box Area */}
        <div ref={ref} className="relative z-10 w-[90%] max-w-md bg-white border-4 border-black rounded-xl shadow-[16px_16px_0px_0px_#B9FF66]">
          {/* OS Window Header */}
          <div className="w-full border-b-4 border-black bg-zinc-100 p-3 sm:p-4 flex justify-between items-center rounded-t-lg">
            <div className="flex gap-2.5">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[3px] border-black bg-red-400"></div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[3px] border-black bg-yellow-400"></div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[3px] border-black bg-[#B9FF66]"></div>
            </div>
            <span className="font-bold font-mono text-xs sm:text-sm uppercase tracking-widest text-zinc-600 bg-white px-3 py-1 border-2 border-black rounded-full">Processing</span>
          </div>

          <div className="p-8 sm:p-12 flex flex-col items-center w-full max-w-md">
            
            <div className="w-full mb-8 relative">
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-center mb-6 text-black">
                Generating<span className="animate-pulse">...</span>
              </h2>

              {/* Giant Brutalist Progress Bar */}
              <div className="w-full h-16 border-4 border-black bg-white shadow-[8px_8px_0_0_#B9FF66] rounded-xl overflow-hidden relative">
                
                {/* Green Fill */}
                <div className="absolute top-0 left-0 h-full bg-[#B9FF66] border-r-[3px] border-black animate-progress-fill z-10"></div>
                
                {/* Moving Diagonal Stripes Overlay */}
                <div className="absolute inset-0 opacity-[0.15] bg-stripes animate-stripes-move z-20"></div>
              </div>
              
              <div className="mt-5 font-bold text-center uppercase tracking-widest text-sm text-zinc-600 animate-pulse">
                Cooking pixels
              </div>
            </div>
            <p className="font-bold text-zinc-500 mb-8 text-center tracking-wide uppercase">{iconCount} High-Quality Assets</p>

            {/* Blocky Progress Bar */}
            <div className="w-full flex gap-1.5 h-8 border-[3px] border-black p-1 shadow-[4px_4px_0px_0px_#000000] bg-zinc-100">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 border-2 border-black animate-pulse-block rounded-sm"
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 10s linear infinite;
            width: max-content;
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 10s linear infinite;
            width: max-content;
          }
          @keyframes progress-fill {
            0% { width: 0%; }
            40% { width: 60%; }
            70% { width: 85%; }
            100% { width: 100%; }
          }
          .animate-progress-fill {
            animation: progress-fill 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          .bg-stripes {
            background-image: repeating-linear-gradient(
              -45deg,
              #000,
              #000 12px,
              transparent 12px,
              transparent 24px
            );
            background-size: 34px 34px;
          }
          @keyframes stripes-move {
            0% { background-position: 0 0; }
            100% { background-position: 34px 0; }
          }
          .animate-stripes-move {
            animation: stripes-move 1s linear infinite;
          }
          @keyframes pulse-block {
            0%, 100% { background-color: #f4f4f5; opacity: 0.5; }
            50% { background-color: #B9FF66; opacity: 1; }
          }
          .animate-pulse-block {
            animation: pulse-block 1.2s ease-in-out infinite;
          }
        `}} />
      </div>
    )
  }
)
