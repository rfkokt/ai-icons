import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface BrutalistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'white' | 'black' | 'lime' | 'zinc';
  interactive?: boolean;
}

export function BrutalistCard({
  className,
  color = 'white',
  interactive = true,
  ...props
}: BrutalistCardProps) {
  const colorClasses = {
    white: 'bg-white text-black',
    black: 'bg-black text-white',
    lime: 'bg-[#B9FF66] text-black',
    zinc: 'bg-zinc-100 text-black',
  };

  const interactiveClasses = interactive 
    ? 'hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 hover:-rotate-1 transition-all duration-300 cursor-pointer' 
    : '';

  return (
    <Card
      className={cn(
        'border-4 border-black border-solid overflow-hidden rounded-[24px]',
        'shadow-[4px_4px_0_0_#000000] sm:shadow-[6px_6px_0px_0px_#000000]',
        colorClasses[color],
        interactiveClasses,
        className
      )}
      {...props}
    />
  );
}
