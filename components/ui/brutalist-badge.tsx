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
    white: 'bg-white text-black',
    black: 'bg-black text-white hover:bg-black/90 hover:text-white',
    lime: 'bg-[#B9FF66] text-black',
    zinc: 'bg-zinc-100 text-black',
  };

  return (
    <Badge
      variant={variant}
      className={cn(
        'border-2 border-black font-black uppercase tracking-wider rounded-lg px-3 py-1 shadow-[2px_2px_0_0_#000]',
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
}
