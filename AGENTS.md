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

### Neo-Brutalist Design Guidelines (CRITICAL)
To maintain the application's aggressive, high-contrast aesthetic, **NEVER** use soft UI patterns. Adhere strictly to the following:
1. **Backgrounds & Colors:**
   - **NO Gradients/Softness:** Avoid `bg-gradient-to-...`, `blur`, or soft colored backgrounds.
   - **Allowed Backgrounds:** Pure white `bg-white`, solid black `bg-black`, pure zinc `bg-[#f3f4f6]`, and the primary accent Lime/Yellow `bg-[#B9FF66]`.
   - Use `bg-grid-pattern` for main page backgrounds to add structured texture.
2. **Borders & Shadows:**
   - **NO Soft Shadows:** Do not use Tailwind's default `shadow-sm`, `shadow-md`, `shadow-lg`, etc.
   - **Thick Borders:** Always use `border-2`, `border-3`, or `border-4` paired with `border-black`.
   - **Hard Shadows:** Use offset, unblurred black dropshadows, e.g., `shadow-[4px_4px_0_0_#000000]` or `shadow-[8px_8px_0_0_#000000]`.
   - **Interactive States:** Buttons and cards should translate on hover. 
     - Press effect: `hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000]`.
     - Lift effect: `hover:-translate-y-1 hover:translate-x-1 group-hover:shadow-[8px_8px_0_0_#000]`.
3. **Typography:**
   - Font family: **Bricolage Grotesque**.
   - Use extremely heavy weights (`font-black`), negative tracking (`tracking-tighter`), and `uppercase` for overlines/badges. Avoid thin or subtle text.
4. **Mobile-First & Layouts:**
   - Stack grids gracefully on mobile (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
   - Touch targets must be sufficiently large on mobile (e.g., `h-10 w-10 sm:h-8 sm:w-8`).
   - **NO Hover-Only Functions on Mobile:** Do not use `opacity-0 group-hover:opacity-100` blindly. On mobile touch screens, ensure actionable items are always visible using `opacity-100 sm:opacity-0 sm:group-hover:opacity-100`.
5. **Placeholders & Empty States:**
   - **Anti-Generic:** DO NOT use generic soft icons like `HiSparkles`. Instead, employ aggressive typography or tilted geometric shapes (e.g., `<div className="w-12 h-12 border-4 border-black shadow-[4px_4px...] rotate-3 font-black">?</div>`).

### UI Components
Use ShadCN: `Button`, `Card`, `Dialog`, `Sheet`, `Badge`, `Input`, `DropdownMenu`, `Separator`, `Tabs`, `Avatar`, `Popover`, `Tooltip`

### Coding
- `"use client"` only for hooks/GSAP
- Use `cn()` for merged classes
- GSAP cleanup: `ScrollTrigger.getAll().forEach(t => t.kill())`
- Avoid GSAP ScrollTrigger opacity animations on elements mapped to Hash Links (`/#anchor`) to prevent invisible items on deep-linking.
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
| `usePromptSuggestions(input, options)` | `suggestions, isLoading` - generates dynamic prompt suggestions |
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
