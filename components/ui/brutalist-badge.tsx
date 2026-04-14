import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface BrutalistBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'white' | 'black' | 'lime' | 'zinc';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
}

export function BrutalistBadge({ 
  className, 
  variant = 'outline', 
  color = 'white', 
  ...props 
}: BrutalistBadgeProps) {
  const colorClasses = {
    white: 'bg-white dark:bg-card text-black dark:text-white',
    black: 'bg-black dark:bg-card text-white dark:text-white hover:bg-black/90 dark:hover:bg-card hover:text-white',
    lime: 'bg-[#B9FF66] text-black',
    zinc: 'bg-zinc-100 dark:bg-muted text-black dark:text-white',
  };

  return (
    <Badge
      variant={variant}
      className={cn(
        'border-2 border-black dark:border-zinc-700 font-black uppercase tracking-wider rounded-lg px-3 py-1 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#444]',
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
}
