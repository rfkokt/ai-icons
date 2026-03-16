import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  rotate?: number;
}

export function SectionBadge({
  children,
  className,
  variant = "primary",
  rotate = 0,
}: SectionBadgeProps) {
  const variantClasses = {
    primary: "bg-[#B9FF66] text-black",
    secondary: "bg-white text-black",
    outline: "bg-white text-black",
  };

  return (
    <span
      className={cn(
        "inline-block font-bold px-4 py-2 border-2 border-black rounded-lg brutalist-shadow-sm text-base",
        variantClasses[variant],
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
