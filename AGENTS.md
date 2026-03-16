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
- **Icons**: React Icons - Heroicons v2 (`import { HiIconName } from "react-icons/hi2"`)

### Project Structure
```
ai-icons/
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── layout.tsx       # Auth layout (redirect if logged in)
│   │   └── login/
│   │       └── page.tsx     # Login page
│   ├── (main)/              # Protected route group
│   │   ├── layout.tsx       # Main layout (sidebar + auth check)
│   │   └── dashboard/
│   │       └── page.tsx     # Dashboard page
│   ├── globals.css          # Design tokens, utility classes
│   ├── layout.tsx           # Root layout + TooltipProvider
│   └── page.tsx             # Landing page (home)
├── components/
│   ├── ui/                  # ShadCN components (EDIT WITH CAUTION)
│   ├── sidebar-layout.tsx   # Main layout with sidebar
│   ├── page-header.tsx      # Page header component
│   ├── page-tabs.tsx        # Tab navigation component
│   ├── Navigation.tsx        # Landing page nav
│   ├── Hero.tsx             # Hero section
│   ├── Features.tsx         # Features grid
│   ├── Stats.tsx            # Stats + case studies
│   ├── CTA.tsx              # Call-to-action
│   ├── Footer.tsx           # Footer
│   └── Marquee.tsx          # Marquee animation
├── hooks/
│   └── use-tab-state.ts    # Tab state hook
├── lib/
│   ├── api.ts              # Axios instance
│   ├── store.ts            # Zustand store
│   ├── utils.ts            # Utility functions
│   └── validations.ts       # Zod schemas
└── components.json          # ShadCN config
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
import { HiSparkles } from "react-icons/hi2";
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

### Layout Components
| Component | Description |
|-----------|-------------|
| `SidebarLayout` | Main layout with sidebar navigation |
| `PageHeader` | Page title + description + action buttons |
| `PageTabs` | Tab navigation synced with URL |

### Auth Components
| Component | Description |
|-----------|-------------|
| `LoginForm` Zod validation + React Hook Form | |

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
| Label | `import { Label } from "@/components/ui/label"` |
| Dialog | `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"` |
| Sheet | `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"` |
| Separator | `import { Separator } from "@/components/ui/separator"` |
| Tabs | `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"` |
| Avatar | `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"` |
| DropdownMenu | `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"` |
| Popover | `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"` |
| Tooltip | `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"` |
| Spinner | `import { Spinner } from "@/components/ui/spinner"` |

### Add New Components
```bash
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add toast
```

## 5.1 Zustand Store

### Available Stores
| Store | Description | Usage |
|-------|-------------|-------|
| `useAuthStore` | Auth state (user, token, login, logout) | `const { user, isAuthenticated, login, logout } = useAuthStore()` |
| `useSidebarStore` | Sidebar state (collapsed, toggle) | `const { collapsed, toggle } = useSidebarStore()` |
| `useDashboardStore` | Dashboard state (pagination, filters, search) | `const { pagination, searchValue, setPagination } = useDashboardStore()` |

### Auth Store Pattern
```tsx
// Login
login({ id: "1", email: "user@example.com", name: "User", role: "user" }, "token")

// Logout
logout()

// Check auth
const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
const user = useAuthStore((state) => state.user)
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
| `frontend-design` | High-quality frontend UI design | Build web components, pages, or applications |

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
- **MOBILE-FIRST DESIGN**: Semua komponen harus responsif, dimulai dari mobile lalu scale up ke desktop
- Gunakan `cn()` untuk merge className
- Cleanup `ScrollTrigger` di useEffect return
- `"use client"` hanya jika ada hooks/GSAP
- Gunakan komponen ShadCN untuk UI elements
- Gunakan `useAuthStore` untuk auth state
- Protected routes: wrap dengan `(main)` route group

### DILARANG
- Jangan pakai native HTML jika ada ShadCN equivalent
- Jangan buat inline styles (`style={{}}`)
- Jangan hardcoded colors, gunakan CSS variables
- Jangan lupa cleanup GSAP animations
- Jangan taruh API calls di page components

## 8. Responsive Design (Mobile-First)

### Tailwind Breakpoints
| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| Default | 0px | Mobile-first base styles |
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

### Mobile-First Pattern
```tsx
// ✅ BENAR: Mobile-first
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// ❌ SALAH: Desktop-first
<div className="grid grid-cols-4 lg:grid-cols-2 lg:grid-cols-1 gap-4">
```

### Responsive Guidelines

#### Grid Layouts
```tsx
// Mobile: 1 kolom, Tablet: 2 kolom, Desktop: 4 kolom
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

#### Padding & Margin
```tsx
// Mobile: kecil, Desktop: besar
<section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
```

#### Typography
```tsx
// Mobile: kecil, Desktop: besar
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
```

#### Flex Direction
```tsx
// Mobile: column, Desktop: row
<div className="flex flex-col sm:flex-row gap-4">
```

#### Hide/Show Elements
```tsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">

// Show on mobile, hide on desktop
<div className="lg:hidden">
```

### Dashboard Responsive Pattern
```tsx
// Sidebar: hidden on mobile, show on desktop
<aside className="hidden lg:flex lg:w-64">

// Main content: full width on mobile
<main className="flex-1 min-w-0">

// History panel: hidden on tablet, show on desktop
<aside className="hidden xl:block w-72">
```

### Testing Checklist
- [ ] Test di 320px (mobile kecil)
- [ ] Test di 768px (tablet)
- [ ] Test di 1024px (laptop)
- [ ] Test di 1280px+ (desktop)
- [ ] Pastikan touch targets minimum 44x44px
- [ ] Pastikan text readable tanpa zoom

## 9. Route Protection Pattern
```tsx
// Protected route (main)/layout.tsx
const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
useEffect(() => {
  if (!isAuthenticated) router.push("/login")
}, [isAuthenticated])

// Auth route (auth)/layout.tsx
useEffect(() => {
  if (isAuthenticated) router.push("/dashboard")
}, [isAuthenticated])
```

## 10. Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 11. Notes

- Project: Landing page + Dashboard (protected routes)
- Design: Neo-Brutalist dengan primary accent `#B9FF66`
- Animations: GSAP + ScrollTrigger untuk entrance effects
- Client-side: Hanya komponen yang butuh animasi/GSAP
- Auth: Zustand store dengan localStorage persistence
- Routes: `(auth)` untuk login, `(main)` untuk protected pages