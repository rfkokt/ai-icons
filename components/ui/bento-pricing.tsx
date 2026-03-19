'use client';
import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, StarIcon } from 'lucide-react';

type PricingCardProps = {
  titleBadge: string;
  priceLabel: string;
  priceSuffix?: string;
  features: string[];
  cta?: string;
  className?: string;
};

function FilledCheck() {
  return (
    <div className="bg-[#B9FF66] border-2 border-black text-black rounded-full p-0.5 shadow-[2px_2px_0px_0px_#000]">
      <CheckIcon className="size-4" strokeWidth={4} />
    </div>
  );
}

function PricingCard({
  titleBadge,
  priceLabel,
  priceSuffix = '/month',
  features,
  cta = 'Subscribe',
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'bg-white border-4 border-black relative overflow-hidden rounded-[24px]',
        'shadow-[6px_6px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 transition-all duration-300',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 p-6 border-b-4 border-black bg-zinc-100">
        <Badge variant="outline" className="border-2 border-black font-black uppercase tracking-wider bg-white rounded-lg px-3 py-1 text-sm shadow-[2px_2px_0_0_#000]">{titleBadge}</Badge>
        <Button className="bg-white text-black border-2 border-black hover:bg-black hover:text-white font-bold rounded-xl shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all h-9">{cta}</Button>
      </div>

      <div className="flex items-baseline gap-2 px-6 py-6 border-b-4 border-black">
        <span className="font-black text-6xl tracking-tighter">
          {priceLabel}
        </span>
        {priceLabel.toLowerCase() !== 'free' && priceLabel !== '$0' && (
          <span className="text-zinc-500 font-bold text-lg">{priceSuffix}</span>
        )}
      </div>

      <ul className="grid gap-4 p-6 text-base font-semibold text-zinc-800">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-4">
            <FilledCheck />
            <span className="leading-tight">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BentoPricing() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-8">
      {/* Main Highlighted Card */}
      <div
        className={cn(
          'bg-[#B9FF66] border-4 border-black relative w-full overflow-hidden rounded-[30px]',
          'shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-2 transition-transform duration-300',
          'lg:col-span-5 flex flex-col',
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 border-b-4 border-black bg-white/40">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Badge variant="outline" className="border-2 border-black font-black uppercase tracking-widest bg-black text-[#B9FF66] rounded-xl px-4 py-2 text-sm shadow-[2px_2px_0_0_#000]">CREATOR</Badge>
            <Badge variant="outline" className="border-2 border-black font-bold bg-white text-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0_0_#000] hidden lg:inline-flex items-center">
              <StarIcon className="me-2 size-4 text-[#B9FF66] fill-[#B9FF66] drop-shadow-[1px_1px_0_#000]" /> Most Popular
            </Badge>
          </div>
          <Button className="w-full sm:w-auto bg-black text-white hover:bg-white hover:text-black border-2 border-black font-black text-lg rounded-xl px-8 py-6 shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">Subscribe</Button>
        </div>
        <div className="flex flex-col lg:flex-row p-6 sm:p-8 flex-1 bg-white/20">
          <div className="pb-6 lg:pb-0 lg:w-2/5 flex flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <span className="font-black text-7xl lg:text-[100px] tracking-tighter leading-none">
                $8
              </span>
              <span className="text-zinc-800 font-bold text-xl lg:text-2xl mt-4">/mo</span>
            </div>
            <p className="font-black text-2xl uppercase mt-4 tracking-tighter lg:text-3xl text-zinc-900 border-b-4 border-black pb-2 inline-block w-fit">150 Credits</p>
          </div>
          <ul className="grid gap-4 text-base lg:text-lg font-bold text-zinc-900 lg:w-3/5 my-auto lg:pl-8 lg:border-l-4 border-black pt-6 lg:pt-0">
            {[
              'Generate 150 Custom AI Icons',
              'All Export Formats (SVG, PNG, React)',
              '24/7 Priority Email Support',
              'Full API Access',
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-4">
                <FilledCheck />
                <span className="leading-tight">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
