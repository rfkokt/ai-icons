"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HiCheck, HiArrowRight, HiBolt, HiBuildingOffice2, HiSparkles } from "react-icons/hi2"
import { FaCrown } from "react-icons/fa6"
import { cn } from "@/lib/utils"

type BillingPeriod = "monthly" | "yearly"

interface Feature {
  name: string
  description: string
  included: boolean
}

interface PricingTier {
  name: string
  price: {
    idr: { monthly: number; yearly: number }
    usd: { monthly: number; yearly: number }
  }
  credits: number
  description: string
  highlight?: boolean
  badge?: string
  icon: React.ReactNode
  features: Feature[]
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: {
      idr: { monthly: 49000, yearly: 470000 },
      usd: { monthly: 3, yearly: 29 },
    },
    credits: 50,
    description: "Perfect for trying out AI Icons",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-400/30 to-zinc-500/30 blur-xl rounded-full" />
        <HiBolt className="w-6 h-6 relative z-10 text-zinc-600" />
      </div>
    ),
    features: [
      { name: "50 AI Icons", description: "Generate custom icons from text", included: true },
      { name: "SVG & PNG", description: "Export in multiple formats", included: true },
      { name: "Basic Support", description: "Email support with 48h response", included: true },
      { name: "API Access", description: "Limited API calls", included: false },
    ],
  },
  {
    name: "Creator",
    price: {
      idr: { monthly: 129000, yearly: 1230000 },
      usd: { monthly: 8, yearly: 77 },
    },
    credits: 150,
    description: "Best for creators and freelancers",
    highlight: true,
    badge: "Most Popular",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#B9FF66]/50 to-[#88cc33]/50 blur-xl rounded-full" />
        <FaCrown className="w-6 h-6 relative z-10 text-black" />
      </div>
    ),
    features: [
      { name: "150 AI Icons", description: "Generate more icons", included: true },
      { name: "All Formats", description: "SVG, PNG, React components", included: true },
      { name: "Priority Support", description: "24/7 priority email support", included: true },
      { name: "API Access", description: "Full API access", included: true },
    ],
  },
  {
    name: "Pro",
    price: {
      idr: { monthly: 349000, yearly: 3340000 },
      usd: { monthly: 22, yearly: 210 },
    },
    credits: 500,
    description: "For power users and teams",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-400/30 to-zinc-500/30 blur-xl rounded-full" />
        <HiBuildingOffice2 className="w-6 h-6 relative z-10 text-zinc-600" />
      </div>
    ),
    features: [
      { name: "500 AI Icons", description: "Massive icon generation", included: true },
      { name: "All Formats", description: "Every export format available", included: true },
      { name: "Priority Support", description: "Dedicated support team", included: true },
      { name: "API Access", description: "Higher rate limits", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: {
      idr: { monthly: 999000, yearly: 9590000 },
      usd: { monthly: 63, yearly: 600 },
    },
    credits: 2000,
    description: "For teams and agencies",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-400/30 to-zinc-500/30 blur-xl rounded-full" />
        <HiSparkles className="w-6 h-6 relative z-10 text-zinc-600" />
      </div>
    ),
    features: [
      { name: "2000 AI Icons", description: "Unlimited creativity", included: true },
      { name: "Custom Training", description: "Train custom models", included: true },
      { name: "Dedicated Support", description: "Personal account manager", included: true },
      { name: "SLA Guarantee", description: "99.9% uptime guarantee", included: true },
    ],
  },
]

function PricingSection({ className }: { className?: string }) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly")
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR")

  const formatPrice = (tier: PricingTier) => {
    const price = currency === "IDR" 
      ? tier.price.idr[billingPeriod] 
      : tier.price.usd[billingPeriod]
    
    if (currency === "IDR") {
      return `Rp ${price.toLocaleString("id-ID")}`
    }
    return `$${price}`
  }

  const buttonStyles = {
    default: cn(
      "h-12 bg-white",
      "hover:bg-zinc-50",
      "text-zinc-900",
      "border-2 border-black",
      "hover:shadow-[4px_4px_0px_0px_#000000]",
      "text-sm font-medium",
    ),
    highlight: cn(
      "h-12 bg-black",
      "hover:bg-zinc-800",
      "text-white",
      "shadow-[4px_4px_0px_0px_#B9FF66]",
      "font-semibold text-base",
    ),
  }

  return (
    <section
      className={cn(
        "relative bg-[#f3f4f6] bg-grid-pattern",
        "py-12 px-4",
        "overflow-hidden flex-1",
        className,
      )}
    >
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl font-bold text-zinc-900">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-500 text-center max-w-md">
            No hidden fees. No subscriptions. Pay once, use forever.
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-full border-2 border-black brutalist-shadow-sm">
            {["IDR", "USD"].map((curr) => (
              <Button
                key={curr}
                variant={currency === curr ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrency(curr as "IDR" | "USD")}
                className={cn(
                  "px-6 py-2 text-sm font-medium rounded-full transition-all",
                  currency === curr
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                {curr}
              </Button>
            ))}
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-3xl transition-all duration-300",
                "flex flex-col p-1",
                tier.highlight
                  ? "bg-[#B9FF66] border-[3px] border-black shadow-[8px_8px_0px_0px_#000000] -translate-y-1 sm:-translate-y-2"
                  : "bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1"
              )}
            >
              {/* Badge */}
              {tier.badge && tier.highlight && (
                <div className="absolute -top-3 left-6">
                  <Badge className="px-4 py-1.5 text-sm font-bold bg-black text-white border-none shadow-lg">
                    {tier.badge}
                  </Badge>
                </div>
              )}

              {/* Card Content */}
              <div className="p-6 flex-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000]",
                      tier.highlight
                        ? "bg-white text-black"
                        : "bg-zinc-100 text-zinc-900"
                    )}
                  >
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900">
                    {tier.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-zinc-900">
                      {formatPrice(tier)}
                    </span>
                    <span className="text-sm text-zinc-500">
                      /{billingPeriod === "yearly" ? "year" : "month"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{tier.credits} credits</p>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-600 mb-6">{tier.description}</p>

                {/* Features */}
                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                      <div
                        className={cn(
                          "mt-1 p-0.5 rounded-full",
                          feature.included
                            ? "text-[#B9FF66]"
                            : "text-zinc-300"
                        )}
                      >
                        <HiCheck className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-zinc-900">
                          {feature.name}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="p-6 pt-0 mt-auto">
                <Button
                  className={cn(
                    "w-full relative transition-all duration-300",
                    tier.highlight
                      ? buttonStyles.highlight
                      : buttonStyles.default
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {tier.highlight ? (
                      <>
                        Buy Now
                        <HiArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Get Started
                        <HiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          Credits never expire. Use them whenever you need to generate icons.
        </p>
      </div>
    </section>
  )
}

export default function PricingPage() {
  return (
    <div className="flex-1 overflow-auto">
      <PricingSection />
    </div>
  )
}