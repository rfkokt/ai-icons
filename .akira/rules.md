# Workspace Standards

## Overview
AI-powered icon generation platform that uses Gemini API to create custom icons based on text prompts, with features for generating, organizing, sharing, and downloading icon packs in various styles.

## Tech Stack
- **Runtime**: Node.js with TypeScript 5.x
- **Framework**: Next.js 16 App Router with Turbopack
- **Ui**: Base UI React primitives + Radix UI components + Tailwind CSS 4 with Neo-Brutalist design system
- **State**: Zustand with persist middleware (auth, sidebar, dashboard stores)
- **Api**: Axios with Bearer token interceptors
- **Database**: Supabase PostgreSQL (generated_icons table)
- **Auth**: Clerk authentication with sync to Zustand store
- **Build**: Next.js with Turbopack, images unoptimized

## Architecture
- **Pattern**: Route-based grouping with (auth) and (main) route groups, feature-based component organization
- **Data Flow**: Zustand stores ← Clerk auth sync → API routes (Axios) → Supabase/R2
- **Key Directories**:
  - app — Next.js App Router with route groups for auth/main, API routes under /api
  - components — Feature components and reusable UI primitives under ui/
  - hooks — Custom React hooks for domain logic (auth, packs, downloads, etc.)
  - lib — Shared utilities (API client, store, validators, Supabase, R2 storage)
  - types — TypeScript interfaces for icons, packs, community data

## Component Patterns
- **Reusability**: UI components in components/ui/ use Base UI primitives with class-variance-authority for variants, feature components in components/ are domain-specific
- **Naming**: kebab-case for all files (e.g., brutalist-button.tsx, icon-card.tsx, use-packs.ts)
- **State Management**: Zustand stores for global state, local useState for component state, custom hooks encapsulate domain logic
- **Forms**: react-hook-form with Zod validation schemas (validations.ts), error handling via sonner toasts
- **Styling**: Tailwind CSS 4 with cn() utility for class merging, Neo-Brutalist design system (border-3, shadow-[8px_8px_0px_0px_#000000]), custom CSS animations

## Code Rules

### DO
- Use 'use client' directive for components with hooks or event handlers
- Organize UI components in components/ui/ using Base UI primitives
- Use Zustand with persist middleware for global state management
- Implement custom hooks in hooks/ for reusable domain logic
- Use cn() from lib/utils.ts to merge Tailwind classes conditionally
- Define Zod schemas in lib/validations.ts for form validation
- Use Clerk's currentUser() in API routes for authentication

### DON'T
- Don't mix UI primitives and feature components—keep ui/ for Base UI wrappers only
- Don't bypass Zustand stores for auth state—use useAuthStore
- Don't use inline styles—use Tailwind classes with cva variants instead
- Don't put API calls directly in components—wrap in custom hooks
- Don't forget 'use client' directive when using hooks like useState, useEffect
- Don't use class names directly without cn() for conditional merging
- Don't hardcode API URLs—use process.env.NEXT_PUBLIC_API_URL

## Security
- **Auth Pattern**: Clerk authentication with @clerk/nextjs, sync to Zustand store via useAuthSync hook, API routes use currentUser() for validation
- **Role Check**: Clerk manages user roles via user.role property in auth store, no server-side role-based access control implemented
- **Data Sanitization**: Zod schemas validate login/register forms, API input validation on required fields, axios interceptors handle 401 redirects to /login