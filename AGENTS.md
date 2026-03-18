# AI Icons - Project Guidelines

## Stack
- Next.js 16, ShadCN UI, Tailwind, GSAP, Zustand, Clerk, Supabase
- Design: Neo-Brutalist, accent `#B9FF66`, font Bricolage Grotesque

## Project Structure
```
ai-icons/
├── app/(auth)/, (main)/      # Auth & protected routes
├── components/ui/             # ShadCN components
├── components/*.tsx           # Custom components
├── hooks/*.ts                # Custom hooks
├── types/*.ts               # Shared TypeScript types
├── lib/store.ts              # Zustand stores
└── lib/utils.ts              # cn(), formatDate
```

## Mandatory Rules

### UI Components
Use ShadCN: `Button`, `Card`, `Dialog`, `Sheet`, `Badge`, `Input`, `DropdownMenu`, `Separator`, `Tabs`, `Avatar`, `Popover`, `Tooltip`

### Coding
- `"use client"` only for hooks/GSAP
- Use `cn()` for merged classes
- GSAP cleanup: `ScrollTrigger.getAll().forEach(t => t.kill())`
- Mobile-first: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Protected routes: `(main)` group

## Available Hooks

| Hook | Usage |
|------|-------|
| `useDownload()` | `download(key, prompt, "png"\|"svg")` |
| `useConfirmDialog()` | `confirmType, setConfirmType, handleConfirm` |
| `useLightbox(totalItems)` | `currentIndex, isOpen, goToPrev, goToNext, open, close` |
| `useShareIcon()` | `shareToCommunity(iconId)` |
| `usePackDownload()` | `downloadPack(icons, prompt, format)`, `downloadPackById(packId, format)` |
| `useDeletePack()` | `deletePack(packId)`, `deleteIconFromPack(packId, iconId)` |
| `useSelectMode<T>()` | `isSelectMode, selectedIds, toggleSelect, isSelected` |
| `usePacks()` | `packs, isLoading, fetchPacks, addPack, removePack, totalIcons` |
| `usePackIcons(packId)` | `icons, packPrompt, isLoading, removeIcon` |
| `useScrollAnimation()` | GSAP scroll animations |
| `useStaggerAnimation(deps, options)` | `selector, y, duration, stagger` |
| `useTabState()` | Tab state management |

## Available Components

| Component | Description |
|-----------|-------------|
| `IconCard` | Icon card (community/library/generated) |
| `IconActionBar` | Share + dropdown with confirm |
| `IconActions` | Dropdown + confirm for lightbox |
| `IconGrid` | Responsive icon grid |
| `PackCard` | Pack preview card |
| `PackAccordion` | Expandable pack |
| `PackActions` | Pack action buttons |
| `PageHeader` | Page header with stats/actions |
| `LoadingSkeleton` | Loading skeleton grid |
| `PageLoading` | Full page loading state |
| `EmptyState` | Empty state placeholder |
| `GeneratingOverlay` | Loading animation overlay |
| `ConfirmDialog` | Confirmation dialog |
| `ConfirmationModal` | Inline confirmation modal |
| `StyleSelector` | Icon style dropdown |
| `CountSelector` | Icon count dropdown |
| `BrutalistButton` | Pre-styled brutalist button (lime/dark/white/outline) |
| `FilterTabs`, `CopyLinkButton`, `QuickPromptButton`, `StatCard`, `UserCard`, `HowItWorks` |

## Shared Types (`types/icon.ts`)

```tsx
interface GeneratedIcon { preview, png, svg?, prompt, id? }
interface GeneratedPack { id, prompt, icons, created_at? }
interface HistoryPack { id, prompt, iconCount, preview, created_at }
interface PackIcon { id, prompt, png_key, svg_key, created_at }
interface HistoryIcon { id, prompt, style, png_url, png_key, svg_url, svg_key, created_at }
interface CommunityIcon { id, prompt, likes, date, src? }
```

## Zustand Stores
```tsx
useAuthStore()      // user, isAuthenticated, login, logout
useSidebarStore()   // collapsed, toggle
useDashboardStore() // pagination, searchValue
```

## Route Protection
```tsx
// (main)/layout.tsx
const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
useEffect(() => { if (!isAuthenticated) router.push("/login") }, [isAuthenticated])
```

## ShadCN Add
```bash
npx shadcn@latest add [component]
```

## Toast
```tsx
showSuccess("title", "desc")
showError("title", "desc")
showApiError(error) // auto-handles 400/401/403/404/500
```

## Scripts
```bash
npm run dev/build/start/lint
```

## MCP & Skills

### MCPs
| MCP | Purpose |
|-----|---------|
| `context7` | Query library docs |
| `21st-dev-magic` | UI component builder |
| `supabase` | Database operations |

### Skills
`shadcn`, `next-best-practices`, `frontend-design`

## Component Usage Examples

### BrutalistButton
```tsx
<BrutalistButton variant="lime" size="md" onClick={handleClick}>
  Click Me
</BrutalistButton>
```

### PageHeader
```tsx
<PageHeader
  icon={<HiFolderOpen className="h-8 w-8" />}
  title="Your Library"
  variant="lime"
  stats={[{ label: "packs", value: 5 }]}
  actions={<Button>Action</Button>}
/>
```

### useSelectMode
```tsx
const { isSelectMode, selectedIds, toggleSelect, isSelected } = useSelectMode<string>()
```

### usePacks
```tsx
const { packs, isLoading, totalIcons, removePack } = usePacks()
```

### PageLoading
```tsx
<PageLoading message="Loading..." />
```

## Refactoring Status
- ✅ All hooks implemented
- ✅ All components: BrutalistButton, ConfirmationModal, PageLoading, etc.
- ✅ All pages refactored
- ✅ Shared types extracted to `types/icon.ts`
- ✅ Unused imports cleaned up
- Pending: Supabase client export
