import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCarouselProps {
  images: { src: string; alt: string; }[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onIndexChange: (index: number) => void;
}

export function FeatureCarousel({
  images,
  currentIndex,
  onNext,
  onPrev,
  onIndexChange,
}: FeatureCarouselProps) {
  const latestActions = React.useRef({ onNext, onPrev });
  React.useEffect(() => {
    latestActions.current = { onNext, onPrev };
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        latestActions.current.onPrev()
      } else if (e.key === 'ArrowRight') {
        latestActions.current.onNext()
      }
    }
    // Use capture phase so Radix Dialog doesn't swallow the event
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [])

  return (
    <div className="relative w-full h-[320px] md:h-[380px] flex items-center justify-center [perspective:1000px]">
      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((image, index) => {
          const offset = index - currentIndex;
          const total = images.length;
          let pos = (offset + total) % total;
          if (pos > Math.floor(total / 2)) {
            pos = pos - total;
          }

          const isCenter = pos === 0;
          const isAdjacent = Math.abs(pos) === 1;

          return (
            <div
              key={index}
              className={cn(
                'absolute left-1/2 top-1/2 transition-all duration-300 ease-out flex items-center justify-center origin-center'
              )}
              style={{
                width: isCenter ? '280px' : isAdjacent ? '200px' : '140px',
                height: isCenter ? '280px' : isAdjacent ? '200px' : '140px',
                transform: `
                  translate(-50%, -50%)
                  translateX(${(pos) * 60}%)
                  scale(${isCenter ? 1 : isAdjacent ? 0.8 : 0.6})
                `,
                zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
              }}
              onClick={() => onIndexChange(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="object-contain w-full h-full pointer-events-none"
              />
            </div>
          );
        })}
      </div>

      <button
        className="absolute left-1/2 -translate-x-[140px] md:-translate-x-[180px] top-1/2 -translate-y-1/2 rounded-full h-12 w-12 md:h-14 md:w-14 z-50 bg-white border-2 border-black hover:bg-[#B9FF66] pointer-events-auto flex items-center justify-center transition-colors shadow-[4px_4px_0px_0px_#000000]"
        onClick={(e) => {
          e.stopPropagation()
          latestActions.current.onPrev()
        }}
      >
        <ChevronLeft className="h-6 w-6 md:h-7 md:w-7 text-black stroke-[3]" />
      </button>
      <button
        className="absolute right-1/2 translate-x-[140px] md:translate-x-[180px] top-1/2 -translate-y-1/2 rounded-full h-12 w-12 md:h-14 md:w-14 z-50 bg-white border-2 border-black hover:bg-[#B9FF66] pointer-events-auto flex items-center justify-center transition-colors shadow-[4px_4px_0px_0px_#000000]"
        onClick={(e) => {
          e.stopPropagation()
          latestActions.current.onNext()
        }}
      >
        <ChevronRight className="h-6 w-6 md:h-7 md:w-7 text-black stroke-[3]" />
      </button>
    </div>
  );
}
