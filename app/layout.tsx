import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeInitializer } from "@/components/theme-initializer";
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
    <ClerkProvider>
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
          <body
            className={`${bricolage.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden selection:bg-[#B9FF66] selection:text-black`}
            style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
          >
            <ThemeInitializer />
            <TooltipProvider>
              {children}
              <Toaster position="top-right" />
            </TooltipProvider>
          </body>
        </html>
      </ClerkProvider>
  );
}
