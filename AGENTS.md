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
```tsx
useDownload()           // download(key, prompt, "png"|"svg")
useConfirmDialog()     // confirmType, setConfirmType, handleConfirm
useScrollAnimation()   // GSAP scroll animations
useLightbox()          // lightbox state management
useShareIcon()         // shareToCommunity(iconId)
usePackDownload()      // downloadPack(icons, prompt, format), downloadPackById(packId, format)
useTabState()
useStaggerAnimation()
```

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
| `EmptyState` | Empty state placeholder |
| `GeneratingOverlay` | Loading animation overlay |
| `ConfirmDialog` | Confirmation dialog |
| `StyleSelector` | Icon style dropdown |
| `CountSelector` | Icon count dropdown |
| `FilterTabs`, `CopyLinkButton`, `QuickPromptButton`, `StatCard`, `UserCard` |

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

### Supabase MCP Tools
`supabase_list_tables`, `supabase_execute_sql`, `supabase_apply_migration`, `supabase_get_logs`

### Skills
`shadcn`, `next-best-practices`, `frontend-design`

## Component Usage Examples

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

### IconGrid + LoadingSkeleton
```tsx
<IconGrid>
  {items.map(item => <IconCard key={item.id} {...item} />)}
</IconGrid>

// or loading state
<LoadingSkeleton count={12} />
```

### StyleSelector + CountSelector
```tsx
<CountSelector count={8} onCountChange={setCount} />
<StyleSelector selectedStyle={style} onStyleChange={setStyle} />
```

### PackActions
```tsx
<PackActions
  packId="123"
  showShare
  onDelete={() => handleDelete()}
/>
```

## Refactoring Status
- ✅ use-download, use-confirm-dialog, use-stagger-animation, use-lightbox, use-share-icon
- ✅ use-pack-download (NEW)
- ✅ PageHeader, LoadingSkeleton, IconGrid, StyleSelector, CountSelector, PackActions
- ✅ EmptyState, FilterTabs, CopyLinkButton consistency
- Pending: Supabase client export
