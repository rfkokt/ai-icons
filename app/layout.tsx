import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Icons - Generate Custom Icons with AI",
  description: "Generate custom icons from text prompts using AI. Perfect for developers, designers, and creators who need specific icons that match their design vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bricolage.variable} font-sans antialiased bg-[#f3f4f6] text-zinc-900 overflow-x-hidden selection:bg-[#B9FF66] selection:text-black`}
        style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
