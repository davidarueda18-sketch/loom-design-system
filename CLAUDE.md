# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build:lib        # Build the library to dist/
npm run storybook        # Dev server on port 6007
npm run build-storybook  # Build static Storybook
npm run test-storybook   # Run Vitest browser tests (Playwright)
npm run lint             # ESLint
npx tsc -b --noEmit      # Type-check without emitting (preferred validation)
npm run release          # build:lib + npm publish
```

## Architecture

**Loom Design System** is a token-driven, framework-agnostic Web Components library published as `@loom-sdc/design-system`. The canonical runtime is Custom Elements (`loom-*` tags); framework wrappers (React) are thin adapters on top.

### Export strategy

```
@loom-sdc/design-system             # barrel (all exports)
@loom-sdc/design-system/core        # tokens only
@loom-sdc/design-system/elements    # all components (tree-shakeable)
@loom-sdc/design-system/custom-elements  # auto-registers all custom elements
@loom-sdc/design-system/react-jsx   # React wrappers
@loom-sdc/design-system/elements/<Component>  # per-component (production)
@loom-sdc/design-system/style.css   # global styles + tokens (mandatory)
@loom-sdc/design-system/fonts.css   # font-face declarations
```

### Source layout

```
src/design-system/
├── package/                     # Library source
│   ├── tokens/                  # Vanilla Extract token groups
│   ├── ui/primitives/           # Component implementations
│   ├── elements/                # One-liner re-exports per component
│   ├── theme/                   # Theme contract + Angular adapter
│   └── styles/                  # Global shared CSS
└── apps/storybook/
    ├── foundations/             # Token documentation stories
    └── ui/primitives/           # Component stories + interaction tests
ai/contracts/                    # AI generation contracts (single source of truth)
```

### Component anatomy

Every primitive under `ui/primitives/<ComponentName>/` has this exact structure:

```
ComponentName.css.ts        # Vanilla Extract styles (createThemeContract + createGlobalTheme)
ComponentName.types.ts      # TypeScript interfaces
index.ts                    # Public re-export
adapters/
  ComponentName.element.ts  # Web Component (CANONICAL) — Shadow DOM, slots, ::part(), a11y
  ComponentName.react.tsx   # React wrapper — renders <loom-component> tag, no logic
```

The React adapter imports the Web Component adapter (which auto-registers `loom-component`) and renders the custom element tag directly. It never reimplements visual logic with Vanilla Extract classes.

### Token anatomy

Token groups under `tokens/<group>/` follow this pattern:

```
<group>.tokens.css.ts       # createThemeContract + createGlobalTheme
<group>.types.ts            # TypeScript types (no enums)
index.ts                    # Named re-exports
```

Parent `tokens/index.ts` re-exports all groups.

### Storybook stories

Stories live in `apps/storybook/ui/primitives/<ComponentName>/`. They must:
- Use `loom-*` custom elements as primary code snippets (not React wrappers)
- Derive argTypes dynamically from imported constants (no hardcoded option lists)
- Resolve token values at runtime — no mirror/duplicate values

## AI contracts

The `ai/contracts/` directory contains machine-readable generation contracts that are the single source of truth for generating components, tokens, adapters, and stories. Always consult the relevant contract before creating or modifying these artifacts:

- `token.contract.md` — token group generation
- `component.contract.md` — full component scaffold
- `adapter-web-component.contract.md` — Web Component adapter rules
- `story.contract.md` — Storybook story rules

## Key constraints

- **Named exports only** — no default exports anywhere
- **No enums** — use type unions or `as const` objects
- **File extensions required** in all internal imports (`.ts`, `.tsx`, `.css.ts`)
- **`import type` / `export type`** for type-only symbols — preserve these, don't collapse
- **Web Component is canonical** — `loom-*` is the cross-framework public API
- **TypeScript strict** — validate with `npx tsc -b --noEmit` before considering a change done

## Tech stack

| Concern | Tool |
|---------|------|
| Styling | Vanilla Extract (CSS-in-TypeScript, zero-runtime) |
| Bundler | Vite (library mode, dual ESM + CJS output) |
| Testing | Vitest + Playwright (browser-based Storybook tests) |
| Docs | Storybook 10 |
| Linting | ESLint flat config (v10) + TypeScript ESLint |
| Framework peer | React 19 (optional) |
| Design sync | Figma Code Connect |
