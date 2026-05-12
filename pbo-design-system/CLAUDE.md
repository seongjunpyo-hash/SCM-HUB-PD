# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MUSINSA PBO Design System — a multi-platform design system monorepo providing tokens, components, and assets for internal MUSINSA products. Published to GitHub Packages Registry (`npm.pkg.github.com`).

## Toolchain

- **Package manager**: pnpm 10.12.4 (strict — use `pnpm` only, not npm/yarn)
- **Workspaces**: pnpm workspaces (`packages/` and `apps/`)
- **Node**: v20 LTS
- **Language**: TypeScript 5.8 (strict mode, `noUncheckedIndexedAccess` enabled)
- **Build**: Vite 7 (components, assets), tsup (tokens), style-dictionary (token generation)
- **Styling**: vanilla-extract (zero-runtime CSS-in-JS)
- **Components**: React 18 + Radix UI primitives
- **Testing**: Vitest + @testing-library/react + jest-axe
- **Docs**: Storybook 9 (React Vite)

## Common Commands

```bash
# Root-level
pnpm install                              # Install all dependencies
pnpm lint:fix                             # ESLint fix across workspace
pnpm format                               # Prettier format all files

# Component packages (layer-components-desktop, layer-components-pda)
pnpm layer-components-desktop dev         # Vite dev server
pnpm layer-components-desktop build       # Library build
pnpm layer-components-desktop test        # Run all tests (Vitest)
pnpm layer-components-desktop test:ui     # Vitest UI dashboard
pnpm layer-components-desktop test:coverage

# Token packages (layer-tokens, phase-tokens)
pnpm layer-tokens figma-json:build        # Generate tokens from Figma JSON
pnpm layer-tokens build                   # Full build (generate + tsup + CSS copy)

# Assets
pnpm pbo-assets build                     # Generate React icon components from Figma SVGs

# Storybook
pnpm storybook start                      # Dev server on port 6006
pnpm storybook build-storybook            # Build static Storybook

# Versioning & Publishing
pnpm changeset                            # Create changeset
pnpm changeset:version                    # Apply version bumps
pnpm changeset:release                    # Publish to registry
```

To run a single test file:

```bash
cd packages/layer-components-desktop && pnpm vitest run src/components/Button/button.test.tsx
```

## Monorepo Structure

| Package                             | Description                                                     |
| ----------------------------------- | --------------------------------------------------------------- |
| `@musinsa/layer-tokens`             | Design tokens for Layer (desktop, pda, pos)                     |
| `@musinsa/phase-tokens`             | Design tokens for Phase (desktop, mobile)                       |
| `@musinsa/layer-components-desktop` | React components for desktop                                    |
| `@musinsa/layer-components-pda`     | React components for PDA/mobile                                 |
| `@musinsa/pbo-assets`               | SVG icon/graphic React components (mwms, moms, scmHub, selfPos) |
| `packages/_shared/tokens`           | Raw Figma token JSON (auto-synced from Figma plugin)            |
| `apps/storybook`                    | Storybook documentation app                                     |

## Architecture

### Token Pipeline

Figma plugin → JSON in `packages/_shared/tokens/figma-json/` → `generate.ts` (style-dictionary) → TypeScript token objects + CSS custom properties + type definitions. Tokens are consumed via sub-path exports per platform (e.g., `@musinsa/layer-tokens/desktop`).

### Asset Pipeline

Figma SVGs in `packages/pbo-assets/src/figma-asset/` → `generate.ts` → React TypeScript icon components with full type inference for icon names and color tokens.

### Platform & Theme System

Platforms are switched via data attributes on HTML elements:

- `data-layer-theme="light|dark"` / `data-layer-platform="desktop|pda|pos"`
- `data-phase-theme="light|dark"` / `data-phase-platform="desktop|mobile"`

Each platform generates its own CSS variables and token set.

### Component Conventions

File structure per component:

```
ComponentName/
├── component-name.tsx            # Implementation
├── component-name.css.ts         # vanilla-extract styles (recipes)
├── component-name.types.ts       # Props/types
├── component-name.constants.ts   # Constants
├── component-name.figma.tsx      # Figma Code Connect mapping
├── component-name.test.tsx       # Tests
└── index.ts                      # Public exports
```

- Components use Radix UI for accessibility primitives
- Polymorphic `as` prop pattern for element type flexibility
- Prefix/suffix icon props with type-safe icon name inference
- vanilla-extract `recipe()` for variant-based styling

### Figma Code Connect

Each component package has a `figma.config.json` and `*.figma.tsx` files mapping Figma component properties to React props. Publish mappings with `pnpm code-connect:publish`.

## Code Style

- **ESLint**: Flat config (v9). Import ordering enforced: `react` first, then `@musinsa/*`, then other externals.
- **Prettier**: 120 char width, single quotes, trailing commas.
- **TypeScript**: No `any` (enforced by ESLint). Consistent type imports (`import type`).
- **Pre-commit**: Husky + lint-staged runs formatting/linting on staged files.

## CI/CD

- **Token/Asset auto-PRs**: Pushes to `pbo-tokens` branch trigger automatic token builds and PR creation with change analysis. Asset changes on `main` trigger similar auto-PRs.
- **Release**: Manual `workflow_dispatch` — select package, version type, summary → changeset → publish to GitHub Packages.
- **Storybook**: Auto-deployed to GitHub Pages on `main` changes to `apps/storybook/`.
- **SonarQube**: Code quality analysis on PRs.
