# AI Icons - Project Standards & Guidelines

## Table of Contents
1. [Core Architecture](#1-core-architecture)
2. [Coding Standards](#2-coding-standards)
3. [Design System](#3-design-system)
4. [Component Guidelines](#4-component-guidelines)
5. [Refactoring & Clean Code](#6-refactoring--clean-code)
6. [Best Practices](#7-best-practices)
7. [Responsive Design](#8-responsive-design-mobile-first)
8. [Scripts](#10-scripts)

---

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
│   ├── icon-card.tsx        # Reusable icon card (community/library/generated)
│   ├── icon-action-bar.tsx  # Icon actions with share + confirm
│   ├── pack-card.tsx       # Pack preview card
│   ├── pack-accordion.tsx  # Expandable pack with header
│   ├── action-confirm.tsx   # Dropdown + confirm for lightbox
│   ├── generating-overlay.tsx # Loading animation overlay
│   ├── stat-card.tsx        # Reusable stat card (referral)
│   ├── user-card.tsx        # Reusable user card (leaderboard)
│   ├── quick-prompt-button.tsx  # Quick prompt button (generate)
│   ├── section.tsx          # Section wrapper component
│   ├── section-badge.tsx    # Section badge component
│   ├── filter-tabs.tsx     # Filter tabs component
│   ├── icon-grid.tsx       # Responsive icon grid
│   ├── copy-link-button.tsx    # Copy link with feedback
│   ├── empty-state.tsx     # Empty state placeholder
│   ├── how-it-works.tsx    # Step-by-step display
│   ├── brutalist-icon-box.tsx  # Icon container
│   ├── page-hero.tsx       # Page hero component
│   ├── prompt-input.tsx    # AI prompt input
│   ├── Navigation.tsx      # Landing page nav
│   ├── Hero.tsx            # Hero section
│   ├── Features.tsx        # Features grid
│   ├── Stats.tsx           # Stats + case studies
│   ├── CTA.tsx             # Call-to-action
│   ├── Footer.tsx          # Footer
│   └── Marquee.tsx         # Marquee animation
├── hooks/
│   ├── use-tab-state.ts    # Tab state hook
│   └── use-scroll-animation.ts  # GSAP ScrollTrigger hook
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

### Date Formatting
```tsx
import { formatDateStandard, formatDateSingleLine, formatDateNoTime, DAYS, MONTHS } from "@/lib/utils"
```
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
| `.brutalist-shadow` | 8px offset shadow (static, no hover animation) |
| `.brutalist-shadow-sm` | 4px offset shadow (static, no hover animation) |
| `.btn-brutalist` | Button with hover/active animation |
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
| `SidebarLayout` | Main layout with sidebar navigation (include user dropdown) |
| `PageHeader` | Page title + description + action buttons |
| `PageTabs` | Tab navigation synced with URL |
| `Section` | Wrapper section with consistent padding/sizing |
| `IconGrid` | Responsive grid for icon cards |

### Auth Components
| Component | Description |
|-----------|-------------|
| `LoginForm` Zod validation + React Hook Form | |

### Reusable Components
| Component | Description | Usage |
|-----------|-------------|-------|
| `IconCard` | Icon card for community/library grid | Community, Library pages |
| `IconActionBar` | Icon actions with share + confirm dialog | Icon cards, packs |
| `PackCard` | Pack preview card with count badge | Library page |
| `PackAccordion` | Expandable pack with header actions | Generate page |
| `ActionConfirm` | Dropdown + confirm for lightbox | Library lightbox |
| `GeneratingOverlay` | Loading animation overlay | Generate page |
| `StatCard` | Stats card with icon, value, label | Referral page |
| `UserCard` | User card for leaderboard | Leaderboard page |
| `QuickPromptButton` | Quick suggestion button for prompts | Generate page |
| `Section` | Wrapper section with consistent padding/sizing | All page sections |
| `SectionBadge` | Badge for section headers | Features, Stats, etc. |
| `FilterTabs` | Filter tab buttons | Community, Leaderboard pages |
| `IconGrid` | Responsive icon grid layout | Library, Community pages |
| `CopyLinkButton` | Copy to clipboard with feedback | Referral page |
| `EmptyState` | Empty state placeholder | Various pages |
| `HowItWorks` | Step-by-step process display | Referral page |
| `BrutalistIconBox` | Icon container with brutalist style | Page heroes, stats |
| `PageHero` | Page title + icon + description | Generate, Pricing pages |
| `PromptInput` | AI prompt input with options | Generate page |

### Hooks
| Hook | Description | Usage |
|------|-------------|-------|
| `useScrollAnimation` | GSAP ScrollTrigger animation | Animate elements on scroll |
| `useTabState` | Tab state management | Tab navigation |

### IconCard Usage
```tsx
import { IconCard } from "@/components/icon-card"

// Community variant
<IconCard id={1} prompt="Shopping cart" likes={128} date="2 hours ago" variant="community" />

// Library variant with actions
<IconCard 
  id={1} 
  prompt="Shopping cart" 
  variant="library"
  src={iconUrl}
  onShare={() => handleShare()}
  onDelete={() => handleDelete()}
/>

// Generated variant
<IconCard 
  id={1} 
  src={previewUrl}
  alt="Shopping cart"
  variant="generated"
  onShare={() => handleShare()}
  onDownloadPng={() => download("png")}
  onDownloadSvg={() => download("svg")}
/>
```

### IconActionBar Usage
```tsx
import { IconActionBar } from "@/components/icon-action-bar"

<IconActionBar
  onShare={() => handleShare()}
  onDownloadPng={() => download("png")}
  onDownloadSvg={() => download("svg")}
  onDelete={() => handleDelete()}
  showShare={true}
  showDelete={true}
/>
```

### PackCard Usage
```tsx
import { PackCard } from "@/components/pack-card"

<PackCard
  id="pack-1"
  prompt="Shopping icons"
  iconCount={8}
  preview={previewUrl}
  onClick={() => router.push(`/library?pack=${id}`)}
  onDelete={() => handleDelete()}
/>
```

### PackAccordion Usage
```tsx
import { PackAccordion } from "@/components/pack-accordion"

<PackAccordion
  id="pack-1"
  prompt="Shopping icons"
  iconCount={8}
  defaultExpanded
  onDelete={() => handleDelete()}
  onDownloadPng={() => downloadPack("png")}
  onDownloadSvg={() => downloadPack("svg")}
>
  <div className="grid ...">...</div>
</PackAccordion>
```

### ActionConfirm Usage (Lightbox)
```tsx
import { ActionConfirm } from "@/components/action-confirm"

<ActionConfirm
  iconKey={icon.png_key}
  prompt={icon.prompt}
  onShare={() => handleShare(icon.id)}
  onDelete={() => handleDelete(icon.id)}
/>
```

### GeneratingOverlay Usage
```tsx
import { GeneratingOverlay } from "@/components/generating-overlay"

// Show overlay when generating
{isGenerating && <GeneratingOverlay iconCount={8} />}
```

### StatCard Usage
```tsx
import { StatCard } from "@/components/stat-card"
import { HiUsers } from "react-icons/hi2"

<StatCard label="Total Users" value="1,234" icon={HiUsers} />
```

### QuickPromptButton Usage
```tsx
import { QuickPromptButton } from "@/components/quick-prompt-button"

<QuickPromptButton 
  suggestion="Shopping cart" 
  onClick={(s) => setPrompt(s)} 
  // Optional: custom className
  className="bg-white"
/>
```

### Section Usage
```tsx
import { Section } from "@/components/section"

<Section size="default" border>Content</Section>
```

### SectionBadge Usage
```tsx
import { SectionBadge } from "@/components/section-badge"

<SectionBadge variant="primary" rotate={-2}>Label</SectionBadge>
```

### useScrollAnimation Usage
```tsx
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const ref = useScrollAnimation({ y: 60, duration: 0.8, stagger: 0.15 })

return (
  <section ref={ref}>
    {children}
  </section>
)
```

### FilterTabs Usage
```tsx
import { FilterTabs } from "@/components/filter-tabs"
import { HiClock, HiHeart } from "react-icons/hi2"

<FilterTabs
  tabs={[
    { key: "latest", label: "Latest", icon: <HiClock /> },
    { key: "mostLoved", label: "Most Loved", icon: <HiHeart /> }
  ]}
  activeTab={filter}
  onTabChange={setFilter}
/>
```

### IconGrid Usage
```tsx
import { IconGrid } from "@/components/icon-grid"

<IconGrid>
  {items.map(item => <IconCard key={item.id} {...item} />)}
</IconGrid>
```

### CopyLinkButton Usage
```tsx
import { CopyLinkButton } from "@/components/copy-link-button"

<CopyLinkButton text="https://example.com/link" className="bg-[#B9FF66]" />
```

### EmptyState Usage
```tsx
import { EmptyState } from "@/components/empty-state"
import { HiShare } from "react-icons/hi2"

<EmptyState
  icon={<HiShare className="h-10 w-10 text-zinc-300" />}
  title="No Items Yet"
  description="Start adding items to see them here"
/>
```

### HowItWorks Usage
```tsx
import { HowItWorks } from "@/components/how-it-works"

<HowItWorks
  steps={[
    { step: 1, title: "Share", description: "Share your link" },
    { step: 2, title: "Sign Up", description: "Friend signs up" },
    { step: 3, title: "Earn", description: "Both get credits" }
  ]}
/>
```

### BrutalistIconBox Usage
```tsx
import { BrutalistIconBox } from "@/components/brutalist-icon-box"
import { HiSparkles } from "react-icons/hi2"

<BrutalistIconBox icon={HiSparkles} size="md" variant="primary" />
```

### PageHero Usage
```tsx
import { PageHero } from "@/components/page-hero"
import { HiSparkles } from "react-icons/hi2"

<PageHero
  icon={HiSparkles}
  title="Create Your Icon"
  description="Describe the icon you want"
/>
```

### PromptInput Usage
```tsx
import { PromptInput } from "@/components/prompt-input"

<PromptInput
  value={prompt}
  onChange={setPrompt}
  onGenerate={() => generate()}
  onOptionsClick={() => setShowOptions(true)}
  onStyleClick={() => setShowStyles(true)}
/>
```

### Button Variants
```tsx
// Primary CTA (with animation)
<Button className="bg-[#B9FF66] border-2 border-black rounded-xl px-8 py-4 text-black font-bold btn-brutalist">
  Get Started
</Button>

// Secondary/Outline
<Button variant="outline" className="bg-white border-2 border-black brutalist-shadow-sm">
  Learn More
</Button>

// Dark variant (with animation)
<Button className="bg-black text-[#B9FF66] border-2 border-black btn-brutalist">
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
| Sonner (Toast) | `import { Toaster } from "@/components/ui/sonner"` |

### Add New Components
```bash
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add toast
```

## 5.2 Toast Notifications

### Setup
Add `<Toaster />` to root layout inside `TooltipProvider`:
```tsx
import { Toaster } from "@/components/ui/sonner"

<TooltipProvider>
  {children}
  <Toaster position="top-right" />
</TooltipProvider>
```

### Usage
```tsx
import { showApiError, showSuccess, showInfo, showWarning } from "@/lib/toast"

// Auto-triggered on API errors (configured in api.ts)
showApiError(error)

// Manual usage
showSuccess("Success!", "Operation completed")
showInfo("Info", "Some information")
showWarning("Warning", "Be careful")
```

### Error Codes (Auto-handled by api.ts)
| Code | Message |
|------|---------|
| 400 | Invalid request |
| 401 | Session expired |
| 403 | Access denied |
| 404 | Not found |
| 500 | Server error |

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
| `supabase` | Database operations | CRUD, migrations, queries langsung ke Supabase |

### Setup Supabase MCP
1. Add token di `opencode.json`:
```json
"supabase": {
  "type": "remote",
  "url": "https://mcp.supabase.com/mcp",
  "headers": {
    "Authorization": "Bearer YOUR_SUPABASE_ACCESS_TOKEN"
  }
}
```
2. Get token from: https://supabase.com/dashboard/account/tokens

### Available Tools (Supabase MCP)
```bash
# List tables
supabase_list_tables: { schemas: ["public"], verbose: true }

# Execute SQL
supabase_execute_sql: { query: "SELECT * FROM users" }

# Apply migration
supabase_apply_migration: { name: "migration_name", query: "CREATE TABLE..." }

# List migrations
supabase_list_migrations: {}

# Get logs
supabase_get_logs: { service: "postgres" }
```

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

## 11. Refactoring & Clean Code

### Overview
This project follows a continuous refactoring approach to maintain clean, reusable, and maintainable code.

### Priority Issues (High → Low)

| Issue | Priority | Files | Solution | Status |
|-------|----------|-------|----------|--------|
| Download function duplication | HIGH | 5 files | Create `use-download` hook | ✅ DONE |
| Confirmation dialog logic duplication | HIGH | 2 files | Create `use-confirm-dialog` hook | ✅ DONE |
| Supabase client recreation | HIGH | 7+ routes | Export from `lib/supabase.ts` | Pending |
| Inline fetch functions | HIGH | 3 pages | Create `useHistory`, `useUserPacks` hooks | Pending |
| Filter tabs duplication | MEDIUM | 3 files | Use existing `FilterTabs` component | ✅ DONE |
| EmptyState component inconsistency | MEDIUM | 3 pages | Use existing component everywhere | ✅ DONE |
| GSAP animation patterns | MEDIUM | 2 pages | Create `use-stagger-animation` hook | ✅ DONE |
| Copy link duplication | MEDIUM | 2 files | Use existing `CopyLinkButton` | ✅ DONE |

### Refactoring Progress (2024-03-19)

#### Completed Refactoring Tasks:
1. **icon-action-bar.tsx** - Refactored to use `use-download` and `use-confirm-dialog` hooks
2. **icon-card.tsx** - Updated to pass `iconKey` and `prompt` to `IconActionBar` internally
3. **generate/page.tsx** - Removed inline download handlers, now uses `use-download` hook
4. **library/page.tsx** - Removed inline download handlers, now uses `use-download` hook
5. **dashboard-layout.tsx** - Fixed mobile sidebar close animation with delayed visibility change

#### Key Changes:
- `IconCard` now accepts `format` and `prompt` props instead of `onDownloadPng`/`onDownloadSvg` callbacks
- `IconActionBar` handles downloads internally using `use-download` hook
- Mobile sidebar overlay visibility now uses delayed transition (300ms) for smooth animation

### Required Hooks to Create

#### 1. use-download.ts (HIGH PRIORITY)
```tsx
// hooks/use-download.ts
"use client"

import { toast } from "sonner"

interface UseDownloadOptions {
  onSuccess?: (format: string) => void
}

export function useDownload(options?: UseDownloadOptions) {
  const download = async (key: string, prompt: string, format: "png" | "svg") => {
    const a = document.createElement("a")
    a.href = `/api/download/${encodeURIComponent(key)}?format=${format}`
    a.download = `${prompt.replace(/\s+/g, "-")}.${format}`
    a.click()
    toast.success(`${format.toUpperCase()} downloading...`)
    options?.onSuccess?.(format)
  }
  return { download }
}
```

#### 2. use-confirm-dialog.ts (HIGH PRIORITY)
```tsx
// hooks/use-confirm-dialog.ts
"use client"

import { useState } from "react"
import { toast } from "sonner"

interface UseConfirmDialogOptions {
  onConfirm: () => void
  type: "share" | "delete"
}

export function useConfirmDialog() {
  const [confirmType, setConfirmType] = useState<"share" | "delete" | null>(null)

  const handleConfirm = (onShare?: () => void, onDelete?: () => void) => {
    if (confirmType === "share" && onShare) {
      onShare()
      toast.success("Shared to community!")
    } else if (confirmType === "delete" && onDelete) {
      onDelete()
      toast.success("Deleted")
    }
    setConfirmType(null)
  }

  return { confirmType, setConfirmType, handleConfirm }
}
```

#### 3. use-stagger-animation.ts (MEDIUM PRIORITY)
```tsx
// hooks/use-stagger-animation.ts
"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface UseStaggerAnimationOptions {
  selector: string
  y?: number
  duration?: number
  stagger?: number
  ease?: string
}

export function useStaggerAnimation(
  deps: unknown[],
  options: UseStaggerAnimationOptions
) {
  const { selector, y = 40, duration = 0.5, stagger = 0.1, ease = "back.out(1.7)" } = options
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.from(ref.current.querySelectorAll(selector), {
      y,
      opacity: 0,
      duration,
      stagger,
      ease,
    })
  }, deps)

  return ref
}
```

#### 4. use-lightbox.ts (MEDIUM PRIORITY)
```tsx
// hooks/use-lightbox.ts
"use client"

import { useState } from "react"

export function useLightbox(totalItems: number) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const goToPrev = () => setCurrentIndex(prev => prev === 0 ? totalItems - 1 : prev - 1)
  const goToNext = () => setCurrentIndex(prev => prev === totalItems - 1 ? 0 : prev + 1)
  const open = (index: number) => { setCurrentIndex(index); setIsOpen(true) }
  const close = () => setIsOpen(false)

  return { currentIndex, isOpen, goToPrev, goToNext, open, close, setCurrentIndex }
}
```

#### 5. use-share-icon.ts (MEDIUM PRIORITY)
```tsx
// hooks/use-share-icon.ts
"use client"

import { toast } from "sonner"

export function useShareIcon() {
  const shareToCommunity = async (iconId: string) => {
    try {
      const response = await fetch(`/api/icon/${iconId}/share`, { method: "POST" })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.error || "Failed to share")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }
  return { shareToCommunity }
}
```

### Code Patterns to Avoid (DUPLICATE CODE)

#### ❌ BAD: Repeated download logic
```tsx
// In every page - DON'T DO THIS
const handleDownloadPng = (key: string, prompt: string) => {
  const a = document.createElement("a")
  a.href = `/api/download/${encodeURIComponent(key)}?format=png`
  a.download = `${prompt.replace(/\s+/g, "-")}.png`
  a.click()
  toast.success("PNG downloading...")
}
```

#### ✅ GOOD: Use use-download hook
```tsx
import { useDownload } from "@/hooks/use-download"

export function MyPage() {
  const { download } = useDownload()
  
  return <button onClick={() => download(key, prompt, "png")}>Download</button>
}
```

### Component Consistency Checklist

- [x] All pages use `EmptyState` component (not inline implementations)
- [x] All filter tabs use `FilterTabs` component
- [x] All copy buttons use `CopyLinkButton` component
- [ ] All icon grids use consistent breakpoints via `IconGrid`
- [x] All destructive actions have confirmation dialogs
- [x] All download actions use `use-download` hook

### File Organization

```
components/
├── ui/                  # ShadCN components (EDIT WITH CAUTION)
├── layout/              # Layout components
│   ├── sidebar-layout.tsx
│   ├── mobile-menu.tsx  # NEW: Extract mobile menu
│   └── page-header.tsx
├── icons/               # Icon-related components
│   ├── icon-card.tsx
│   ├── icon-action-bar.tsx
│   ├── icon-grid.tsx
│   └── icon-lightbox.tsx  # NEW: Extract lightbox
├── packs/               # Pack-related components
│   ├── pack-card.tsx
│   ├── pack-accordion.tsx
│   └── pack-download.tsx  # NEW: Extract pack download
└── shared/              # Shared UI components
    ├── empty-state.tsx
    ├── generating-overlay.tsx
    ├── action-confirm.tsx
    └── confirm-dialog.tsx

hooks/
├── use-download.ts      # ✅ DONE
├── use-confirm-dialog.ts # ✅ DONE
├── use-stagger-animation.ts # ✅ DONE
├── use-lightbox.ts      # ✅ DONE
├── use-share-icon.ts    # ✅ DONE
├── use-tab-state.ts
├── use-scroll-animation.ts
└── use-auth-sync.ts
```

---

## 12. Notes

- Project: Landing page + Dashboard (protected routes)
- Design: Neo-Brutalist dengan primary accent `#B9FF66`
- Animations: GSAP + ScrollTrigger untuk entrance effects
- Client-side: Hanya komponen yang butuh animasi/GSAP
- Auth: Zustand store dengan localStorage persistence
- Routes: `(auth)` untuk login, `(main)` untuk protected pages