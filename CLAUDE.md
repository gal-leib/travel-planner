# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Travel Planner application built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui components.

## Package Manager

**Always use Bun** for package management and running scripts. This project uses Bun as specified in `mise.toml`.

```bash
bun install          # Install dependencies
bun dev             # Start development server
bun run build       # Build for production
bun start           # Start production server
bun run lint        # Run ESLint
```

## Architecture

### Framework & Routing
- **Next.js 16** with App Router (`app/` directory)
- **React Server Components** enabled by default
- Pages defined in `app/` directory (e.g., `app/page.tsx` is the home page)
- Root layout in `app/layout.tsx` provides global HTML structure

### UI & Styling
- **Tailwind CSS v4** with CSS variables for theming
- **shadcn/ui** components with Radix Nova theme
- Components use `@base-ui/react` and `lucide-react` for icons
- Global styles in `app/globals.css`

### Components Structure
- **UI Components**: `components/ui/` - shadcn/ui primitives (Button, Card, Input, etc.)
- **Custom Components**: `components/` - Application-specific components
- Use the `cn()` utility from `@/lib/utils` for conditional className merging

### Path Aliases
```typescript
@/*          // Maps to project root
@/components // components/
@/lib        // lib/
@/hooks      // hooks/
@/ui         // components/ui/
```

## Mobile-First Design

Users interact with this app on their phones during trips. Always consider phone usability when building or modifying UI — layouts should be responsive, touch targets should be comfortable, and all features must be accessible on small screens. The app uses `lg:` (1024px) as the breakpoint between mobile single-panel and desktop multi-panel layouts.

## Adding shadcn/ui Components

To add new shadcn/ui components (already configured with Radix Nova theme):

```bash
bunx shadcn@latest add <component-name>
```

Components are automatically added to `components/ui/` with proper styling and configuration.

## TypeScript Configuration

- Path alias `@/*` resolves to project root
- Strict mode enabled
- React JSX transform in use
- Target: ES2017

## Development Workflow

1. Start the dev server: `bun dev` (runs on http://localhost:3000)
2. The app auto-reloads on file changes
3. Lint before committing: `bun run lint`

## Key Files

- `components.json` - shadcn/ui configuration (Radix Nova theme, icon library: Lucide)
- `mise.toml` - Tooling configuration (specifies Bun)
- `tsconfig.json` - TypeScript configuration with path aliases
- `eslint.config.mjs` - ESLint configuration using Next.js rules
