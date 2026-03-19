import { BentoPricing } from "@/components/ui/bento-pricing";
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
 return (
		<div className="flex-1 overflow-auto bg-[#f3f4f6] bg-grid-pattern min-h-[calc(100vh-64px)] flex flex-col pt-12">

			<section className="mx-auto w-full max-w-6xl p-6 lg:p-8">
				{/* Heading */}
				<div className="mx-auto mb-16 max-w-2xl text-center flex flex-col items-center">
                    <Badge 
                        variant="outline" 
                        className="bg-[#B9FF66] text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform -rotate-2 brutalist-shadow-sm text-base uppercase"
                    >
                        Pricing Plans
                    </Badge>
					<h1 className="text-5xl font-black tracking-tighter lg:text-[80px] leading-none uppercase mb-6 max-w-[800px] w-full text-zinc-900 mx-auto">
						Simple <span className="text-[#B9FF66]" style={{ WebkitTextStroke: '2px black' }}>Pricing</span>
					</h1>
					<p className="text-zinc-700 font-semibold mt-6 text-lg md:text-xl">
						No hidden fees. No subscriptions. Pay once, use forever. Generate brutalist icons without boundaries.
					</p>
				</div>
				<BentoPricing />
			</section>
		</div>
	);
}