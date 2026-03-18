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
├── hooks/*.ts                 # Custom hooks
├── lib/store.ts              # Zustand stores
└── lib/utils.ts              # cn(), formatDate
```

## Mandatory Rules

### UI Components
Use ShadCN: `Button`, `Card`, `Dialog`, `Sheet`, `Badge`, `Input`, `DropdownMenu`, `Separator`, `Tabs`, `Avatar`, `Popover`, `Tooltip`

### Import Order
1. React/Next.js
2. Third-party (GSAP, etc.)
3. `@/components/ui/*`
4. `@/components/*`
5. `@/lib/*`

### Coding
- `"use client"` only for hooks/GSAP
- Use `cn()` for merged classes
- GSAP cleanup: `ScrollTrigger.getAll().forEach(t => t.kill())`
- Mobile-first: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Protected routes: `(main)` group

## Available Hooks
```tsx
useDownload()      // download(key, prompt, "png"|"svg")
useConfirmDialog() // confirmType, setConfirmType, handleConfirm
useScrollAnimation({ y, duration, stagger })
useLightbox(totalItems)
useShareIcon()     // shareToCommunity(iconId)
useTabState()
useStaggerAnimation(deps, { selector, y, duration, stagger })
```

## Available Components
`IconCard`, `IconActionBar`, `PackCard`, `PackAccordion`, `EmptyState`, `GeneratingOverlay`, `ConfirmDialog`, `ActionConfirm`, `FilterTabs`, `IconGrid`, `CopyLinkButton`, `QuickPromptButton`, `StatCard`, `UserCard`, `PageHero`, `BrutalistIconBox`, `HowItWorks`

## Zustand Stores
```tsx
useAuthStore()      // user, isAuthenticated, login, logout
useSidebarStore()   // collapsed, toggle
useDashboardStore() // pagination, searchValue
```

## Auth Store Pattern
```tsx
login({ id, email, name, role }, "token")
logout()
const user = useAuthStore((state) => state.user)
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
- `supabase_list_tables`, `supabase_execute_sql`, `supabase_apply_migration`, `supabase_get_logs`

### Available Skills
| Skill | Purpose |
|-------|---------|
| `shadcn` | ShadCN component management |
| `next-best-practices` | Next.js patterns & RSC |
| `frontend-design` | High-quality UI design |

## Refactoring Status
- ✅ use-download, use-confirm-dialog, use-stagger-animation, use-lightbox, use-share-icon
- ✅ EmptyState, FilterTabs, CopyLinkButton consistency
- Pending: Supabase client export, useHistory/useUserPacks hooks
