# @loom-sdc/design-system

Token-driven, framework-agnostic Web Components design system. Built with Vanilla Extract, Vite, and TypeScript — zero runtime overhead, full tree-shaking, native Custom Elements.

[![npm version](https://img.shields.io/npm/v/@loom-sdc/design-system.svg)](https://www.npmjs.com/package/@loom-sdc/design-system)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-9464fd.svg)](https://vitejs.dev/)
[![Web Components](https://img.shields.io/badge/Web%20Components-native-29abe2.svg)](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
[![Vanilla Extract](https://img.shields.io/badge/Vanilla%20Extract-zero%20runtime-ff5c00.svg)](https://vanilla-extract.style/)
[![Storybook](https://img.shields.io/badge/Storybook-10.x-ff4785.svg)](https://storybook.js.org/)

---

## Overview

Loom Design System provides a single, canonical layer of UI primitives as native Custom Elements (`loom-*` tags). Framework wrappers (React) are thin adapters — all visual logic lives in the Web Component layer.

**Key principles:**

- **Token-driven** — all design decisions (color, spacing, typography) are exposed as CSS custom properties via Vanilla Extract
- **Framework-agnostic** — use in any framework, vanilla HTML, or no framework at all
- **Tree-shakeable** — import only what you use via per-component subpath exports
- **Zero runtime** — styles are compiled at build time with no JavaScript style injection

---

## Installation

```bash
npm install @loom-sdc/design-system
```

React peer dependency (optional):

```bash
npm install react react-dom
```

---

## Quick Start

### 1. Import global styles (required)

```js
import '@loom-sdc/design-system/style.css'; // design tokens + global styles
import '@loom-sdc/design-system/fonts.css'; // TWK Everett font-face (optional)
```

### 2. Register a component

```js
import { LoomButton } from '@loom-sdc/design-system/elements/button';

LoomButton.define(); // registers <loom-button> as a custom element
```

### 3. Use in your markup

```html
<loom-button variant="primary" size="md">Get started</loom-button>
```

---

## Import Strategy

### Production — subpath imports (recommended)

Import and register only the components your application needs. This enables real tree-shaking and minimal bundle size.

```js
import { LoomButton } from '@loom-sdc/design-system/elements/button';
import { LoomStack }  from '@loom-sdc/design-system/elements/stack';

LoomButton.define();
LoomStack.define();
```

### Prototyping — barrel import

Registers all components at once. Not recommended for production.

```js
import '@loom-sdc/design-system/custom-elements'; // auto-registers everything
```

### Tokens only

```js
import '@loom-sdc/design-system/core';
```

---

## Exports Reference

| Subpath | Description |
|---|---|
| `@loom-sdc/design-system` | Full barrel (all exports) |
| `@loom-sdc/design-system/core` | Design tokens only |
| `@loom-sdc/design-system/elements` | All components (tree-shakeable) |
| `@loom-sdc/design-system/custom-elements` | Auto-registers all custom elements |
| `@loom-sdc/design-system/react-jsx` | React wrappers |
| `@loom-sdc/design-system/elements/<Component>` | Per-component subpath |
| `@loom-sdc/design-system/style.css` | Global styles + tokens (mandatory) |
| `@loom-sdc/design-system/fonts.css` | Font-face declarations |

---

## Components

| Component | Subpath import | Custom element tag |
|---|---|---|
| `LoomBox` | `.../elements/box` | `<loom-box>` |
| `LoomButton` | `.../elements/button` | `<loom-button>` |
| `LoomIcon` | `.../elements/icon` | `<loom-icon>` |
| `LoomInline` | `.../elements/inline` | `<loom-inline>` |
| `LoomStack` | `.../elements/stack` | `<loom-stack>` |

> Additional primitives (Divider, Fab, Link, Progress, Tag) are available in source and will be published in upcoming releases.

---

## Framework Usage

### Vanilla HTML / Web Components

```html
<script type="module">
  import '@loom-sdc/design-system/style.css';
  import { LoomButton, LoomStack } from '@loom-sdc/design-system/elements';

  LoomButton.define();
  LoomStack.define();
</script>

<loom-stack gap="md">
  <h1 class="loom-heading-1">Hello, Loom</h1>
  <loom-button variant="primary">Get started</loom-button>
</loom-stack>
```

### React

```tsx
import '@loom-sdc/design-system/style.css';
import { Button, Stack } from '@loom-sdc/design-system/react-jsx';

export function App() {
  return (
    <Stack gap="md">
      <h1 className="loom-heading-1">Hello, Loom</h1>
      <Button variant="primary" onClick={() => console.log('clicked')}>
        Get started
      </Button>
    </Stack>
  );
}
```

### Angular (Custom Elements)

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideExperimentalZonelessChangeDetection()],
};
```

```ts
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoomButton } from '@loom-sdc/design-system/elements/button';

LoomButton.define();

@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
export class AppModule {}
```

```html
<loom-button variant="primary">Submit</loom-button>
```

---

## Design Tokens

All tokens are exposed as CSS custom properties. Override them in your theme or consume them directly in CSS.

### Token groups

| Group | Description |
|---|---|
| `color` | Semantic color aliases |
| `palette` | Raw color scale (50–950) |
| `spacing` | 4px base grid (xs → 3xl) |
| `typography` | Font size, weight, line height, letter spacing |
| `fontFamily` | Brand and monospace font stacks |
| `radius` | Border radius scale |
| `shadow` | Elevation shadows |
| `motion` | Duration and easing tokens |
| `zIndex` | Layer stack |
| `iconSize` | Icon size scale |

### Example — custom theme override

```css
:root {
  --loom-color-brand-primary: #your-brand-color;
  --loom-spacing-md: 1rem;
}
```

---

## TypeScript Configuration

Ensure your `tsconfig.json` uses `bundler` module resolution to resolve subpath exports correctly:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

---

## Development

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Setup

```bash
git clone <repo-url>
cd loom-design-system
npm install
```

### Commands

| Command | Description |
|---|---|
| `npm run storybook` | Start Storybook dev server on port 6007 |
| `npm run build:lib` | Build the library to `dist/` |
| `npm run build-storybook` | Build static Storybook |
| `npm run test-storybook` | Run Vitest browser tests (Playwright) |
| `npm run lint` | Run ESLint |
| `npx tsc -b --noEmit` | Type-check without emitting |
| `npm run release` | Build and publish to npm |

### Project structure

```
src/design-system/
├── package/
│   ├── tokens/           # Vanilla Extract token groups
│   ├── ui/primitives/    # Component implementations
│   ├── elements/         # Per-component subpath re-exports
│   └── styles/           # Global shared CSS
└── apps/storybook/
    ├── foundations/      # Token documentation stories
    └── ui/primitives/    # Component stories + interaction tests
```

### Component anatomy

Every primitive under `ui/primitives/<Name>/` follows this structure:

```
Name.css.ts           # Vanilla Extract styles
Name.types.ts         # TypeScript interfaces
index.ts              # Public re-export
adapters/
  Name.element.ts     # Web Component (canonical)
  Name.react.tsx      # React wrapper — renders <loom-name>, no logic
```

---

## Contributing

1. Follow the existing component anatomy strictly.
2. Run `npx tsc -b --noEmit` before submitting any change.
3. Add or update Storybook stories for any new component or token.
4. Use named exports only — no default exports.
5. Use type unions or `as const` objects — no TypeScript `enum`.
6. All internal imports must include file extensions (`.ts`, `.tsx`, `.css.ts`).

---

## License

Private — © Kyndryl. All rights reserved.
