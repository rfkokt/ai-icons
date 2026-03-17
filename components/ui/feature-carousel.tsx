import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onPrev()
      } else if (e.key === 'ArrowRight') {
        onNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext, onPrev])

  return (
    <div className="relative w-full h-[280px] md:h-[320px] flex items-center justify-center [perspective:1000px]">
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
                'absolute transition-all duration-300 ease-out flex items-center justify-center'
              )}
              style={{
                width: isCenter ? '180px' : isAdjacent ? '140px' : '100px',
                height: isCenter ? '180px' : isAdjacent ? '140px' : '100px',
                transform: `
                  translateX(${(pos) * 60}%) 
                  scale(${isCenter ? 1 : isAdjacent ? 0.8 : 0.6})
                `,
                zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
              }}
              onClick={() => onIndexChange(index)}
            >
              <Card className="w-full h-full bg-white rounded-xl border-2 border-black brutalist-shadow-sm overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-contain w-full h-full p-2"
                />
              </Card>
            </div>
          );
        })}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 z-20 bg-white border-2 border-black hover:bg-[#B9FF66]"
        onClick={onPrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 z-20 bg-white border-2 border-black hover:bg-[#B9FF66]"
        onClick={onNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
