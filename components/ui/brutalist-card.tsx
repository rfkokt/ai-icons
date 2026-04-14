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
    white: 'bg-white dark:bg-card text-black dark:text-white',
    black: 'bg-black dark:bg-card text-white dark:text-white',
    lime: 'bg-[#B9FF66] text-black',
    zinc: 'bg-zinc-100 dark:bg-muted text-black dark:text-white',
  };

  const interactiveClasses = interactive 
    ? 'hover:shadow-[8px_8px_0px_0px_#000000] dark:hover:shadow-[8px_8px_0px_0px_#444] hover:-translate-y-1 hover:-rotate-1 transition-all duration-300 cursor-pointer' 
    : '';

  return (
    <Card
      className={cn(
        'border-4 border-black dark:border-zinc-700 border-solid overflow-hidden rounded-[24px]',
        'shadow-[4px_4px_0_0_#000000] dark:shadow-[4px_4px_0_0_#444] sm:shadow-[6px_6px_0px_0px_#000000] dark:sm:shadow-[6px_6px_0px_0px_#444]',
        colorClasses[color],
        interactiveClasses,
        className
      )}
      {...props}
    />
  );
}
