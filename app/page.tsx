import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f4f6] bg-grid-pattern">
      <Navigation />
      <Hero />
      <Marquee />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </main>
  );
}
