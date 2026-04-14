'use client';
import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import { PricingCard, BrutalistCheck } from './pricing-card';
import { BrutalistCard } from './brutalist-card';
import { BrutalistBadge } from './brutalist-badge';

export function BentoPricing() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-8">
      {/* Main Highlighted Card */}
      <BrutalistCard
        color="lime"
        className="lg:col-span-5 flex flex-col hover:-translate-y-2 hover:-rotate-1 hover:scale-[1.02]"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 border-b-4 border-black dark:border-zinc-600 bg-white/40 dark:bg-zinc-800/40">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <BrutalistBadge color="black" className="px-4 py-2 text-[#B9FF66] tracking-widest text-sm">
              CREATOR
            </BrutalistBadge>
            <BrutalistBadge color="white" className="hidden lg:inline-flex items-center px-3 py-1.5 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#666]">
              <StarIcon className="me-2 size-4 text-[#B9FF66] fill-[#B9FF66] drop-shadow-[1px_1px_0_#000]" /> Most Popular
            </BrutalistBadge>
          </div>
          <Button className="w-full sm:w-auto bg-black text-white hover:bg-white hover:text-black border-2 border-black font-black text-lg rounded-xl px-8 py-6 shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">Subscribe</Button>
        </div>
        <div className="flex flex-col lg:flex-row p-6 sm:p-8 flex-1 bg-white/20 dark:bg-zinc-800/20">
          <div className="pb-6 lg:pb-0 lg:w-2/5 flex flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <span className="font-black text-7xl lg:text-[100px] tracking-tighter leading-none">
                $8
              </span>
              <span className="text-zinc-800 dark:text-zinc-300 font-bold text-xl lg:text-2xl mt-4">/mo</span>
            </div>
            <p className="font-black text-2xl uppercase mt-4 tracking-tighter lg:text-3xl text-zinc-900 dark:text-zinc-100 border-b-4 border-black dark:border-zinc-600 pb-2 inline-block w-fit">150 Credits</p>
          </div>
          <ul className="grid gap-4 text-base lg:text-lg font-bold text-zinc-900 dark:text-zinc-100 lg:w-3/5 my-auto lg:pl-8 lg:border-l-4 border-black dark:border-zinc-600 pt-6 lg:pt-0">
            {[
              'Generate 150 Custom AI Icons',
              'All Export Formats (SVG, PNG, React)',
              '24/7 Priority Email Support',
              'Full API Access',
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-4">
                <BrutalistCheck className="shrink-0" />
                <span className="leading-tight">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </BrutalistCard>

      <PricingCard
        titleBadge="STARTER"
        priceLabel="$3"
        priceSuffix="/month"
        features={[
          'Generate 50 AI Icons',
          'Export in SVG & PNG',
          'Basic Support (48h)',
        ]}
        className="lg:col-span-3"
      />

      <PricingCard
        titleBadge="PRO"
        priceLabel="$22"
        priceSuffix="/month"
        features={[
          'Generate 500 AI Icons',
          'Higher API rate limits',
          'Dedicated Support Team',
        ]}
        className="lg:col-span-4"
      />

      <PricingCard
        titleBadge="ENTERPRISE"
        priceLabel="$63"
        priceSuffix="/month"
        features={[
          'Generate 2000 AI Icons',
          'Train Custom AI Models',
          '99.9% Uptime SLA',
        ]}
        className="lg:col-span-4"
      />
    </div>
  );
}
