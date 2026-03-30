import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
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
        <html lang="en" className="scroll-smooth">
          <body
            className={`${bricolage.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground`}
            style={{ fontFamily: 'var(--font-bricolage), system-ui, sans-serif' }}
          >
            <ThemeProvider>
              <TooltipProvider>
                {children}
                <Toaster position="top-right" />
              </TooltipProvider>
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
  );
}
