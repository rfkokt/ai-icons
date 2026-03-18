import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "large" | "small";
  border?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className, size = "default", border = false }, ref) => {
    const sizeClasses = {
      default: "py-24",
      large: "py-32",
      small: "py-16",
    };

    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className={cn(
          "max-w-7xl mx-auto px-6",
          sizeClasses[size],
          border && "border-t-4 border-black border-dashed",
          className
        )}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
