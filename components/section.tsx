import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "large" | "small";
  border?: boolean;
}

export function Section({
  children,
  className,
  size = "default",
  border = false,
}: SectionProps) {
  const sizeClasses = {
    default: "py-24",
    large: "py-32",
    small: "py-16",
  };

  return (
    <section
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
