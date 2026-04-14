import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background bg-grid-pattern dark:bg-[#0a0a0a]">
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
