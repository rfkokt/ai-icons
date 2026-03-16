# Project Standards & Guidelines

## 1. Core Architecture

### UI Components
- **MANDATORY**: Dilarang native HTML jika sudah ada komponen ShadCN. Mapping wajib:
  | Native | ShadCN | Import |
  |--------|--------|--------|
  | `<button>` | `<Button>` | `@/components/ui/button` |
  | `<input>` | `<Input>` | `@/components/ui/input` |
  | `<div> card` | `<Card>` | `@/components/ui/card` |
  | `<span> badge` | `<Badge>` | `@/components/ui/badge` |
  | Dialog/Modal | `<Dialog>` | `@/components/ui/dialog` |
  | Drawer/Sidebar | `<Sheet>` | `@/components/ui/sheet` |
  | `<hr>` | `<Separator>` | `@/components/ui/separator` |
  
  > **Catatan**: Native HTML hanya untuk layout wrapper (`<div>`, `<section>`, `<main>`, `<nav>`, `<footer>`).

- **Styling**: Tailwind utility classes + custom classes di `globals.css`
- **Animations**: GSAP + ScrollTrigger untuk scroll animations
- **Icons**: Lucide React (`import { IconName } from "lucide-react"`)

### Project Structure
```
ai-icons/
├── app/
│   ├── globals.css     # Design tokens, utility classes
│   ├── layout.tsx      # Root layout + font
│   └── page.tsx        # Landing page
├── components/
│   ├── ui/              # ShadCN components (EDIT WITH CAUTION)
│   ├── Navigation.tsx   # Main navigation
│   ├── Hero.tsx         # Hero section
│   ├── Features.tsx     # Features grid
│   ├── Stats.tsx        # Stats + case studies
│   ├── CTA.tsx          # Call-to-action
│   ├── Footer.tsx       # Footer
│   └── Marquee.tsx      # Marquee animation
├── lib/
│   └── utils.ts         # cn() helper
└── components.json      # ShadCN config
```

## 2. Coding Standards

### Import Order
1. React/Next.js imports
2. Third-party (GSAP, etc.)
3. `@/components/ui/*`
4. `@/components/*`
5. `@/lib/*`

### Component Pattern
```tsx
"use client"; // Hanya jika ada hooks/GSAP

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { IconName } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DATA = [...] ;

export default function Component() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animation logic
  }, []);
  
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* Content */}
    </section>
  );
}
```

### GSAP + ScrollTrigger
**MANDATORY** untuk scroll animations:
```tsx
useEffect(() => {
  if (!ref.current) return;
  
  gsap.from(ref.current.children, {
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

### className dengan cn()
**MANDATORY** untuk conditional/merged classes:
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-styles"
)} />
```

## 3. Design System

### Color Palette
| Variable | Value | Usage |
|----------|-------|-------|
| `--color-lime` | `#B9FF66` | Primary accent |
| `--color-lime-dark` | `#88cc33` | Hover state |
| `--background` | `#f3f4f6` | Page background |
| `--foreground` | `#18181b` | Text color |
| `--primary` | `#B9FF66` | Accent color |
| `--border` | `#000000` | Borders |

### Utility Classes (globals.css)
| Class | Description |
|-------|-------------|
| `.brutalist-shadow` | 8px offset shadow |
| `.brutalist-shadow-sm` | 4px offset shadow |
| `.brutalist-border` | 4px black border |
| `.brutalist-border-2` | 2px black border |
| `.animate-marquee` | 20s horizontal scroll |
| `.animate-float` | Floating animation |

### Typography
- **Font**: Bricolage Grotesque (Google Fonts)
- **Weights**: `font-bold`, `font-black`
- **Tracking**: `tracking-tighter`

### Spacing Pattern
| Usage | Class |
|-------|-------|
| Container | `max-w-7xl mx-auto` |
| Horizontal | `px-6` |
| Vertical (section) | `py-24` or `py-20` |
| Grid gap | `gap-8`, `gap-12`, `gap-16` |

## 4. Component Guidelines

### Page Sections
| Component | Animations | Props |
|-----------|------------|-------|
| Navigation | None | - |
| Hero | GSAP + floating icons | - |
| Features | ScrollTrigger | - |
| Stats | ScrollTrigger | - |
| CTA | None | - |
| Footer | None | - |
| Marquee | CSS animation | - |

### Button Variants
```tsx
// Primary CTA
<Button className="bg-[#B9FF66] border-2 border-black rounded-xl px-8 py-4 text-black font-bold brutalist-shadow">
  Get Started
</Button>

// Secondary/Outline
<Button variant="outline" className="bg-white border-2 border-black brutalist-shadow-sm">
  Learn More
</Button>

// Dark variant
<Button className="bg-black text-[#B9FF66] border-2 border-black brutalist-shadow">
  Dark Button
</Button>
```

### Card Pattern
```tsx
<Card className="bg-zinc-100 p-8 rounded-[30px] border-4 border-black brutalist-shadow hover:bg-[#B9FF66] transition-all duration-300 cursor-pointer">
  <Icon className="w-14 h-14 mb-6 group-hover:rotate-12 transition-transform" />
  <h3 className="text-3xl font-black tracking-tighter mb-4">{title}</h3>
  <p className="text-lg font-medium text-zinc-700">{description}</p>
</Card>
```

### Badge Usage
```tsx
<Badge className="bg-[#B9FF66] text-black font-bold px-4 py-2 border-2 border-black rounded-lg">
  Section Badge
</Badge>
```

## 5. ShadCN Components

### Available Components
| Component | Import |
|-----------|--------|
| Button | `import { Button } from "@/components/ui/button"` |
| Card | `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"` |
| Badge | `import { Badge } from "@/components/ui/badge"` |
| Input | `import { Input } from "@/components/ui/input"` |
| Dialog | `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"` |
| Sheet | `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"` |
| Separator | `import { Separator } from "@/components/ui/separator"` |

### Add New Components
```bash
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add toast
```

## 6. MCP & Skills

### Available MCPs
| MCP | Purpose | When to Use |
|-----|---------|-------------|
| `context7` | Query documentation | Butuh informasi library/framework terbaru |
| `21st-dev-magic` | UI component builder | Buat komponen UI baru dari deskripsi |

### Available Skills
| Skill | Purpose | Trigger |
|-------|---------|---------|
| `shadcn` | ShadCN component management | Add/fix/debug shadcn components |
| `next-best-practices` | Next.js best practices | RSC, data patterns, metadata, error handling |

### Usage Examples
```bash
# Query documentation
context7_resolve-library-id: { libraryName: "gsap", query: "ScrollTrigger" }
context7_query-docs: { libraryId: "/greensock/GSAP", query: "ScrollTrigger pin" }

# Buat UI component dari deskripsi
21st_magic_component_builder: { 
  searchQuery: "pricing table", 
  message: "create pricing table with 3 tiers",
  absolutePathToCurrentFile: "/app/page.tsx",
  absolutePathToProjectDirectory: "/ai-icons"
}

# Load skill untuk troubleshooting
skill: { name: "shadcn" }  # Bantu add/fix ShadCN components
skill: { name: "next-best-practices" }  # Next.js patterns & best practices
```

## 7. Best Practices

### MANDATORY
- Gunakan `cn()` untuk merge className
- Cleanup `ScrollTrigger` di useEffect return
- `"use client"` hanya jika ada hooks/GSAP
- Gunakan komponen ShadCN untuk UI elements

### DILARANG
- Jangan pakai native HTML jika ada ShadCN equivalent
- Jangan buat inline styles (`style={{}}`)
- Jangan hardcoded colors, gunakan CSS variables
- Jangan lupa cleanup GSAP animations

## 8. Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 9. Notes

- Project: Landing page (bukan full web app)
- Design: Neo-Brutalist dengan primary accent `#B9FF66`
- Animations: GSAP + ScrollTrigger untuk entrance effects
- Client-side: Hanya komponen yang butuh animasi/GSAP