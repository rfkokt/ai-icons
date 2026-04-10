# Workspace Standards

## Overview
AI Icons - a web platform for generating custom icons using AI, featuring user authentication, icon history, community packs, and download functionality with a Neo-Brutalist design system.

## Tech Stack
- **Runtime**: Node.js with TypeScript 5.x
- **Framework**: Next.js 16 App Router with Turbopack
- **Ui**: Radix UI primitives + custom Neo-Brutalist components + Tailwind CSS v4
- **State**: Zustand with persist middleware for auth, sidebar, and dashboard state
- **Api**: Axios client with interceptors + Next.js route handlers
- **Database**: Supabase PostgreSQL with admin client for server operations
- **Auth**: Clerk with currentUser() server-side validation
- **Testing**: N/A - no test files detected
- **Build**: Next.js 16 with Turbopack bundler

## Architecture
- **Pattern**: Route groups with (auth) and (main) for organization, API routes in app/api/
- **Data Flow**: Zustand stores persist auth state → Axios interceptors inject Bearer token → API routes validate Clerk user → Supabase admin client performs DB operations
- **Key Directories**:
  - app/(main) — Main application routes (dashboard, generate, history, library, etc.)
  - app/api — Next.js route handlers for backend operations
  - components/ui — Reusable UI components following shadcn/ui pattern
  - components — Feature-specific components
  - hooks — Custom React hooks for data fetching and UI interactions
  - lib — Utility functions, API clients, store, and validation schemas

## Component Patterns
- **Reusability**: UI components in components/ui/ use class-variance-authority for variants, export interfaces extending React.HTMLAttributes
- **Naming**: kebab-case for files (e.g., brutalist-card.tsx, user-card.tsx), PascalCase for components
- **State Management**: Global auth/dashboard state in Zustand stores, feature-specific state in custom hooks (use-packs.ts, use-prompt-suggestions.ts)
- **Forms**: Uses react-hook-form with @hookform/resolvers and Zod schemas defined in lib/validations.ts
- **Styling**: Tailwind CSS v4 with @theme inline, custom Neo-Brutalist utilities (brutalist-shadow, btn-brutalist), cn() helper for class merging

## Code Rules

### DO
- Mark client components with 'use client' directive at top of file
- Use Clerk's currentUser() for server-side authentication in API routes
- Use Supabase admin client (supabaseAdmin) for privileged database operations
- Apply Neo-Brutalist design tokens: border-4 border-black, shadow-[4px_4px_0_0_#000000]
- Use Indonesian language for error messages and date formatting (DAYS, MONTHS constants)
- Export interfaces for component props extending React.HTMLAttributes
- Use cn() utility from lib/utils.ts for conditional class merging

### DON'T
- Do not use localStorage directly on server — always check typeof window !== 'undefined'
- Do not bypass Clerk authentication in API routes — always validate with currentUser()
- Do not use Supabase anon client for privileged operations — use supabaseAdmin
- Do not hardcode colors — use CSS custom properties defined in globals.css
- Do not mix English and Indonesian — consistent Indonesian for user-facing messages
- Do not skip error handling in hooks — always include error state and onError callback
- Do not use default exports in API routes — always use named export POST/GET/etc

## Security
- **Auth Pattern**: Clerk authentication with ClerkProvider wrapper, server-side validation via currentUser() in API routes, token stored in localStorage and injected via Axios interceptor
- **Role Check**: Basic role field in User type but no granular permission system detected
- **Data Sanitization**: Zod schemas in lib/validations.ts for form validation, server-side validation in API routes (e.g., prompt required check in generate route)