# @loom-sdc/design-system

A framework-agnostic, token-driven component library built with React 19, TypeScript 6, Vite 8, and Vanilla Extract. It ships as a dual-format package (ESM + CJS) with full TypeScript declarations.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Design Tokens](#design-tokens)
- [UI Primitives](#ui-primitives)
- [Architecture](#architecture)
- [Build & Distribution](#build--distribution)
- [Contributing](#contributing)

---

## Installation

```bash
npm install @loom-sdc/design-system
```

**Peer dependencies** (must be installed by the consumer):

```bash
npm install react@>=19 react-dom@>=19
```

---

## Quick Start

Import the global stylesheet once at the entry point of your application. Then import components and tokens as needed.

```tsx
// main.tsx
import '@loom-sdc/design-system/style.css';
import '@loom-sdc/design-system/fonts.css'; // optional: includes TWK Everett font

import { Box, Stack, Inline } from '@loom-sdc/design-system';

export default function App() {
  return (
    <Stack gap="md">
      <Box padding="lg">
        <Inline gap="sm" align="center">
          <span>Hello</span>
          <span>World</span>
        </Inline>
      </Box>
    </Stack>
  );
}
```

### CSS Exports

| Import path | Description |
|---|---|
| `@loom-sdc/design-system/style.css` | Base styles and CSS custom properties |
| `@loom-sdc/design-system/fonts.css` | TWK Everett font-face declarations |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot module replacement |
| `npm run build` | Full TypeScript check + Vite app build |
| `npm run build:lib` | Build the distributable library package |
| `npm run release` | Build the library and publish to npm |
| `npm run lint` | Run ESLint across the entire project |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build the static Storybook site |

---

## Design Tokens

All tokens are generated with Vanilla Extract's `createThemeContract` + `createGlobalTheme`. They resolve to CSS custom properties at runtime and are fully typed via their respective `*TokenKey` union types.

### Color Palette (`PaletteTokenKey`)

Raw color scales. Prefer semantic color tokens for styling components.

| Scale | Tones |
|---|---|
| `cyan` | `cyan100` – `cyan900` |
| `red` | `red100` – `red900` |
| `neutral` | `neutral100` – `neutral900` |
| `green` | `green100` – `green900` |
| `amber` | `amber100` – `amber900` |

### Semantic Colors (`ColorTokenKey`)

| Group | Tokens |
|---|---|
| **Surface** | `surfaceRaised`, `surfaceBase`, `surfaceSubtle`, `surfaceNeutral` |
| **Brand** | `brandPrimary`, `brandPrimarySubtle`, `brandAccent`, `brandAccentSubtle` |
| **Border** | `borderDefault`, `borderStrong`, `borderSubtle` |
| **Text** | `textPrimary`, `textSecondary`, `textDisabled`, `textInverse`, `textOnBrand` |
| **Feedback** | `feedbackSuccess`, `feedbackSuccessSubtle`, `feedbackWarning`, `feedbackWarningStrong`, `feedbackWarningSubtle`, `feedbackDanger`, `feedbackDangerSubtle` |

### Spacing (`SpacingTokenKey`)

| Token | Value |
|---|---|
| `none` | 0px |
| `px` | 1px |
| `xxs` | 2px |
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `xl2` | 48px |
| `xl3` | 64px |
| `xl4` | 96px |
| `xl5` | 128px |
| `xl6` | 192px |
| `xl7` | 256px |
| `xl8` | 384px |

### Font Size (`FontSizeTokenKey`)

`xxs` (10px) → `xl8` (96px), 13-step progressive scale.

### Font Family (`FontFamilyTokenKey`)

| Token | Stack |
|---|---|
| `sans` | TWK Everett, system-ui |
| `mono` | ui-monospace, Consolas |

### Font Weight (`FontWeightTokenKey`)

`thin` (100), `extralight` (200), `light` (300), `normal` (400), `medium` (500), `semibold` (600), `bold` (700), `extrabold` (800), `black` (900).

### Line Height (`LineHeightTokenKey`)

`none` (1), `tight` (1.25), `snug` (1.375), `normal` (1.5), `relaxed` (1.625), `loose` (2).

### Height (`HeightTokenKey`)

`xxs` (20px), `xs` (24px), `sm` (32px), `md` (48px), `lg` (56px), `xl` (72px).

### Icon Size (`IconSizeTokenKey`)

`xxs` (12px), `xs` (14px), `sm` (16px), `md` (24px), `lg` (32px).

### Border Radius (`RadiusTokenKey`)

`xxs` (2px), `xs` (4px), `sm` (6px), `md` (8px), `lg` (16px).

### Shadow (`ShadowTokenKey`)

`none`, `sm`, `base`, `md`, `lg`, `xl`, `xl2`, `inner`.

### Z-Index (`ZIndexTokenKey`)

`hide` (-1), `base` (0), `raised` (10), `dropdown` (20), `sticky` (30), `overlay` (40), `modal` (50).

---

## UI Primitives

Primitives are single-element polymorphic components. All of them support the `as` prop to render as any HTML element while preserving their typed props.

### `Box`

A generic container that applies spacing tokens via padding props.

```tsx
import { Box } from '@loom-sdc/design-system';

<Box padding="lg" paddingX="xl" as="section">
  content
</Box>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `'div'` | HTML element or component to render as |
| `padding` | `SpacingTokenKey` | — | Uniform padding on all sides |
| `paddingX` | `SpacingTokenKey` | — | Horizontal padding (left + right) |
| `paddingY` | `SpacingTokenKey` | — | Vertical padding (top + bottom) |
| `children` | `ReactNode` | — | |
| `...rest` | HTML attributes | — | Forwarded to the underlying element |

### `Inline`

A flex-row container for horizontally arranged items.

```tsx
import { Inline } from '@loom-sdc/design-system';

<Inline gap="sm" align="center" justify="between">
  <span>Left</span>
  <span>Right</span>
</Inline>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `'div'` | HTML element or component to render as |
| `gap` | `SpacingTokenKey` | — | Gap between children |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'center'` | Cross-axis alignment (`align-items`) |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'` | Main-axis distribution (`justify-content`) |
| `wrap` | `boolean` | `false` | Allow children to wrap |
| `className` | `string` | — | Additional class names |
| `...rest` | HTML attributes | — | Forwarded to the underlying element |

### `Stack`

A flex-column container for vertically stacked items.

```tsx
import { Stack } from '@loom-sdc/design-system';

<Stack gap="md" align="start">
  <p>First</p>
  <p>Second</p>
</Stack>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `'div'` | HTML element or component to render as |
| `gap` | `SpacingTokenKey` | — | Gap between children |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'stretch'` | Cross-axis alignment (`align-items`) |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'` | Main-axis distribution (`justify-content`) |
| `className` | `string` | — | Additional class names |
| `...rest` | HTML attributes | — | Forwarded to the underlying element |

---

## Architecture

```
src/design-system/package/
├── index.ts              ← public API entry (re-exports tokens + primitives)
├── fonts/
│   └── fonts.css         ← TWK Everett @font-face declarations
├── tokens/               ← Vanilla Extract theme contracts
│   ├── color/
│   ├── palette/
│   ├── spacing/
│   ├── fontSize/
│   ├── fontFamily/
│   ├── fontWeight/
│   ├── lineHeight/
│   ├── height/
│   ├── iconSize/
│   ├── radius/
│   ├── shadow/
│   └── zIndex/
└── ui/
    ├── primitives/       ← polymorphic single-element components
    ├── components/       ← composite / compound components
    └── patterns/         ← layout-level compositions
```

### Component File Convention

Every component folder follows this structure:

```
[ComponentName]/
├── [ComponentName].types.ts        ← framework-agnostic prop interfaces
├── [ComponentName].css.ts          ← Vanilla Extract styles
├── [ComponentName].context.ts      ← compound components only
├── adapters/
│   ├── [ComponentName].react.tsx   ← React implementation
│   └── .gitkeep                    ← placeholder for Angular / Vue adapters
└── index.ts                        ← public API re-exports only
```

### Key Conventions

- **Named exports only** — no default exports anywhere in the package.
- **Type-only re-exports** use `export type { ... }` syntax.
- **No `enum`** — use `const` objects with `as const` and derive the union type from them.
- **No hardcoded CSS values** — always reference a token CSS custom property.
- **Imports inside the package include file extensions** (`.ts`, `.tsx`, `.css.ts`).
- **TypeScript verification**: `npx tsc -b --noEmit`

---

## Build & Distribution

The library is built with `vite build --config vite.lib.config.ts`.

| Output | Path |
|---|---|
| ES module | `dist/index.mjs` |
| CommonJS | `dist/index.cjs` |
| Type declarations | `dist/index.d.ts` |
| Base styles | `dist/style.css` |
| Font declarations | `dist/fonts.css` |
| Font assets | `dist/fonts/*.woff2` |

External dependencies excluded from the bundle: `react`, `react-dom`, `@vanilla-extract/css`.

---

## Contributing

### Prerequisites

- Node.js 22+
- npm 10+

### Local Setup

```bash
git clone <repo-url>
cd loom-design-system
npm install
```

### Development Workflow

```bash
npm run dev          # preview the sandbox app
npm run storybook    # browse components in Storybook
npm run lint         # check for linting errors
npx tsc -b --noEmit  # type check without emitting files
```

### Publishing

```bash
npm run release
```

This runs `build:lib` followed by `npm publish --access public`.

---

## AI Workflow (Claude + Copilot)

This repository uses a shared-contract model so Claude and Copilot behave consistently.

### Canonical Contracts

All generation laws live in `ai/contracts/`:

- `ai/contracts/token.contract.md`
- `ai/contracts/component.contract.md`
- `ai/contracts/adapter-web-component.contract.md`
- `ai/contracts/story.contract.md`

### Wrappers

- Claude wrappers live under `.claude/commands/` and `.claude/skills/`
- Copilot wrappers live under `.github/prompts/`
- Repo-level Copilot defaults are in `.github/copilot-instructions.md`

Wrappers should orchestrate flow only. Mandatory behavior changes must be done in contracts first.

### Execution Brief

Use `ai/templates/execution-brief.md` as the standard handoff format from planning to implementation. This reduces repeated context and keeps output stable across tools.
