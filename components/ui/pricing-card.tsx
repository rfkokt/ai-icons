import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { BrutalistBadge } from './brutalist-badge';
import { BrutalistCard } from './brutalist-card';

export interface PricingCardProps {
  titleBadge: string;
  priceLabel: string;
  priceSuffix?: string;
  features: string[];
  cta?: string;
  className?: string;
  isPopular?: boolean;
  onCtaClick?: () => void;
}

export function BrutalistCheck({ className }: { className?: string }) {
  return (
    <div className={cn("bg-[#B9FF66] border-2 border-black dark:border-zinc-600 text-black rounded-full p-0.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#666]", className)}>
      <CheckIcon className="size-4" strokeWidth={4} />
    </div>
  );
}

export function PricingCard({
  titleBadge,
  priceLabel,
  priceSuffix = '/month',
  features,
  cta = 'Subscribe',
  className,
  isPopular = false,
  onCtaClick,
}: PricingCardProps) {
  return (
    <BrutalistCard
      color={isPopular ? 'lime' : 'white'}
      className={cn("flex flex-col", className)}
    >
      <div className={cn(
        "flex items-center justify-between gap-3 p-6 border-b-4 border-black dark:border-zinc-600",
        isPopular ? "bg-white/40 dark:bg-zinc-800/40" : "bg-zinc-100 dark:bg-zinc-800"
      )}>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <BrutalistBadge color={isPopular ? 'black' : 'white'}>
            {titleBadge}
          </BrutalistBadge>
          {isPopular && (
            <BrutalistBadge color="white" className="hidden lg:inline-flex shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#666]">
              Most Popular
            </BrutalistBadge>
          )}
        </div>
        <Button
          onClick={onCtaClick}
          className={cn(
            "border-2 border-black dark:border-zinc-600 font-bold rounded-xl shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#666] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#666] hover:translate-x-0.5 hover:translate-y-0.5 transition-all h-9",
            isPopular ? "bg-black text-white hover:bg-white hover:text-black" : "bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          )}
        >
          {cta}
        </Button>
      </div>

      <div className={cn(
        "flex items-baseline gap-2 px-6 py-6 border-b-4 border-black dark:border-zinc-600",
        isPopular ? "bg-white/20 dark:bg-zinc-800/20" : ""
      )}>
        <span className="font-black text-6xl tracking-tighter">
          {priceLabel}
        </span>
        {priceLabel.toLowerCase() !== 'free' && priceLabel !== '$0' && (
          <span className={cn("font-bold text-lg", isPopular ? "text-zinc-800 dark:text-zinc-300" : "text-zinc-500 dark:text-zinc-400")}>
            {priceSuffix}
          </span>
        )}
      </div>

      <ul className={cn(
        "grid gap-4 p-6 text-base font-semibold flex-1",
        isPopular ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-800 dark:text-zinc-200"
      )}>
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-4">
            <BrutalistCheck />
            <span className="leading-tight">{f}</span>
          </li>
        ))}
      </ul>
    </BrutalistCard>
  );
}
