# AI Icons - Project Reference

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 + React 19 |
| Styling | Tailwind CSS 4 + shadcn/ui (base-nova) |
| Animations | GSAP + ScrollTrigger |
| Icons | Lucide React |
| Font | Bricolage Grotesque |

## Project Structure

```
ai-icons/
├── app/
│   ├── globals.css    # Design tokens, CSS variables, utility classes
│   ├── layout.tsx     # Root layout with font
│   └── page.tsx       # Landing page
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main nav with mobile menu
│   ├── Hero.tsx        # Hero section with GSAP
│   ├── Features.tsx    # Features grid with ScrollTrigger
│   ├── Stats.tsx       # Stats + case studies
│   ├── CTA.tsx         # Call-to-action section
│   ├── Footer.tsx      # Footer with links
│   └── Marquee.tsx     # Marquee animation
├── lib/
│   └── utils.ts        # cn() helper
└── components.json     # shadcn/ui config
```

## UI Components (shadcn/ui)

**Available in `@/components/ui/`:**

| Component | Import |
|-----------|--------|
| Button | `import { Button } from "@/components/ui/button"` |
| Card | `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"` |
| Badge | `import { Badge } from "@/components/ui/badge"` |
| Input | `import { Input } from "@/components/ui/input"` |
| Dialog | `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"` |
| Sheet | `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"` |
| Separator | `import { Separator } from "@/components/ui/separator"` |

**Add new shadcn components:**
```bash
npx shadcn@latest add [component-name]
```

## Page Sections

| Component | Description |
|-----------|-------------|
| Navigation | Responsive nav, mobile menu with Button |
| Hero | GSAP animations, floating icons |
| Features | 6-card grid with ScrollTrigger |
| Stats | Stats + case studies with ScrollTrigger |
| CTA | Call-to-action section |
| Footer | Dark footer with links |
| Marquee | CSS marquee animation |

## Design System

### Colors
```css
--color-lime: #B9FF66;      /* Primary accent */
--color-lime-dark: #88cc33; /* Hover */
--background: #f3f4f6;      /* Page bg */
--foreground: #18181b;      /* Text */
--primary: #B9FF66;         /* Accent */
--border: #000000;          /* Borders */
```

### Utility Classes (globals.css)
```css
.brutalist-shadow      /* 8px offset shadow */
.brutalist-shadow-sm   /* 4px offset shadow */
.brutalist-border      /* 4px border */
.brutalist-border-2    /* 2px border */
.animate-marquee       /* Horizontal scroll */
.animate-float         /* Floating animation */
```

### Typography
- Font: Bricolage Grotesque
- Weights: `font-bold`, `font-black`
- Tracking: `tracking-tighter`

### Spacing
- Container: `max-w-7xl`
- Padding: `px-6`, `py-24`
- Grid gaps: `gap-8`, `gap-12`

## Coding Conventions

### Import Order
1. React/Next.js
2. Third-party (GSAP, etc.)
3. `@/components/ui/*`
4. `@/components/*`
5. `@/lib/*`

### Component Pattern
```tsx
"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { IconName } from "lucide-react";

const DATA = [...] ;

export default function Component() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // GSAP animations
  }, []);
  
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* Content */}
    </section>
  );
}
```

### GSAP Pattern
```tsx
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

useEffect(() => {
  gsap.from(ref.current?.children || [], {
    scrollTrigger: { trigger: ref.current, start: "top 80%" },
    y: 80,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "back.out(1.2)",
  });
  
  return () => ScrollTrigger.getAll().forEach(t => t.kill());
}, []);
```

### className with cn()
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-styles"
)} />
```

## Best Practices

1. **Always use shadcn/ui** from `@/components/ui/*`
2. **Use `cn()`** for merging classNames
3. **Use Tailwind utilities** first, custom CSS in globals.css
4. **Use brutalist- classes** for shadows/borders
5. **Cleanup ScrollTrigger** in useEffect return
6. **"use client"** only when needed (hooks, GSAP)

## Scripts

```bash
npm run dev      # Development
npm run build    # Production build
npm run lint     # ESLint
```

## Notes

- Landing page only (no API routes)
- Client components for GSAP animations
- Neo-Brutalist design aesthetic
- Primary color: `#B9FF66`