---
name: token
description: Create a new Vanilla Extract design token group for the Loom Design System using createThemeContract and createGlobalTheme
---

# Loom Design System — Token Creator

## Canonical Contract

- Source of truth: `ai/contracts/token.contract.md`
- Wrapper role: this file orchestrates user interaction and project-specific defaults.
- Change policy: update the contract first, then reflect wrapper-specific prompts only when needed.

You are creating a new design token group for the Loom Design System using `@vanilla-extract/css`. Follow every step in order. Ask before writing any files if information is missing.

---

## Step 1 — Gather requirements

If the user did not provide all of the following, ask for them in a single message:

1. **Token group name** — camelCase/kebab-case noun, e.g. `color`, `spacing`, `typography`, `elevation`, `radius`, `motion`
2. **Token list** — the names of the individual tokens in this group (ask the user to list them, or propose a sensible default set based on the group name and ask for confirmation)

**Default token sets to propose if the user hasn't specified:**

| Group | Default tokens to propose |
|---|---|
| `color` | text, textHeading, bg, border, codeBg, accent, accentBg, accentBorder, socialBg, shadow |
| `spacing` | xs (4px), sm (8px), md (16px), lg (24px), xl (40px), xxl (64px) |
| `typography` | fontSans, fontHeading, fontMono, sizeBase, sizeSmall, sizeLarge, lineHeight, letterSpacing |
| `elevation` | none, sm, md, lg |
| `radius` | none, sm, md, lg, full |
| `motion` | durationFast, durationBase, durationSlow, easeIn, easeOut, easeInOut |

Once confirmed, echo back:

> Creating `[tokenGroup]` token group with [N] tokens: [token1], [token2], …

Then proceed to Step 2 without further confirmation.

---

## Step 2 — Resolve the target directory

All token files go under:

```
src/design-system/package/tokens/[tokenGroup]/
├── [tokenGroup].tokens.css.ts   ← createThemeContract + createGlobalTheme
├── [tokenGroup].types.ts        ← Typed token names for autocomplete
└── index.ts                     ← Re-export
```

Parent index path: `src/design-system/package/tokens/index.ts`

---

## Step 3 — Map token values to existing CSS variables

Before creating the token file, check `src/index.css` to see which CSS custom properties already exist. Map each token to its corresponding `var(--...)` when a match exists. For new tokens with no existing CSS variable, use a sensible literal value.

**Existing CSS variables in this project:**

| CSS var | Semantic meaning |
|---|---|
| `var(--text)` | Body text color |
| `var(--text-h)` | Heading/emphasis text color |
| `var(--bg)` | Background color |
| `var(--border)` | Border color |
| `var(--code-bg)` | Code block background |
| `var(--accent)` | Primary brand/interactive color |
| `var(--accent-bg)` | Accent-tinted background |
| `var(--accent-border)` | Accent-tinted border |
| `var(--social-bg)` | Social link background |
| `var(--shadow)` | Drop shadow |
| `var(--sans)` | Sans-serif font stack |
| `var(--heading)` | Heading font stack |
| `var(--mono)` | Monospace font stack |

---

## Step 4 — Create files

### Global rules

- All type-only imports/exports must use `import type` / `export type`. `verbatimModuleSyntax` is enabled.
- Never use TypeScript `enum`. Use `const` objects with `as const` and derive union types, or use plain string union literals.
- Named exports only — no default exports.
- All imports must include file extensions (`.ts`, `.css.ts`).
- Only `@vanilla-extract/css` APIs: `createThemeContract`, `createGlobalTheme`, `createVar`, `style`, `styleVariants`. No `recipe`, `atoms`, `createSprinkles`.

---

#### `src/design-system/package/tokens/[tokenGroup]/[tokenGroup].tokens.css.ts`

```typescript
import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

/**
 * [tokenGroup] token contract — defines the shape without values.
 * Import `[tokenGroup]Vars` in component `.css.ts` files for type-safe token access.
 */
export const [tokenGroup]Vars = createThemeContract({
  // One key per token. Use null as placeholder — values are set in createGlobalTheme below.
  [token1]: null,
  [token2]: null,
  // ... remaining tokens
});

/**
 * Apply [tokenGroup] token values to :root.
 * Map each key to a CSS custom property or literal value.
 */
createGlobalTheme(':root', [tokenGroup]Vars, {
  [token1]: 'var(--existing-css-var)',  // or a literal: '16px', '#aa3bff'
  [token2]: 'var(--existing-css-var)',
  // ... remaining tokens
});
```

#### `src/design-system/package/tokens/[tokenGroup]/[tokenGroup].types.ts`

```typescript
import type { [tokenGroup]Vars } from './[tokenGroup].tokens.css.ts';

/** Keys of the [tokenGroup] token contract for use in component prop types */
export type [TokenGroup]TokenKey = keyof typeof [tokenGroup]Vars;
```

Replace `[TokenGroup]` with PascalCase version of the group name (e.g., `Color`, `Spacing`).

#### `src/design-system/package/tokens/[tokenGroup]/index.ts`

```typescript
export { [tokenGroup]Vars } from './[tokenGroup].tokens.css.ts';
export type { [TokenGroup]TokenKey } from './[tokenGroup].types.ts';
```

---

## Step 5 — Update the parent tokens index

Check whether `src/design-system/package/tokens/index.ts` already exists.

**If it does not exist**, create it with:
```typescript
export { [tokenGroup]Vars } from './[tokenGroup]/index.ts';
export type { [TokenGroup]TokenKey } from './[tokenGroup]/index.ts';
```

**If it already exists**, append the appropriate lines to the end without removing existing content.

---

## Step 6 — TypeScript verification

Run:
```
npx tsc -b --noEmit
```

If errors appear, fix them before proceeding. Common errors:

| Error | Fix |
|---|---|
| `TS1484` — type exported without `type` keyword | Change `export { Foo }` to `export type { Foo }` |
| `TS2322` — type mismatch in `createGlobalTheme` | Ensure every key in the contract has a string value in the theme object |
| `TS2304` — cannot find name | Add missing import with correct file extension |
| `TS6133` — unused local | Remove or use the variable |

---

## Step 7 — Report to the user

```
[tokenGroup] token group created successfully.

Files created:
  src/design-system/package/tokens/[tokenGroup]/
  ├── [tokenGroup].tokens.css.ts   ← contract + global theme
  ├── [tokenGroup].types.ts        ← [TokenGroup]TokenKey type
  └── index.ts

Parent index updated:
  src/design-system/package/tokens/index.ts

Usage in a component .css.ts file:
  import { [tokenGroup]Vars } from '../../tokens/index.ts';

  export const root = style({
    color: [tokenGroup]Vars.[tokenKey],        // type-safe, no string literals
    background: [tokenGroup]Vars.[otherToken],
  });

Next steps:
  - Replace raw var(--...) strings in existing .css.ts files with [tokenGroup]Vars references
  - Add dark-mode override: createGlobalTheme('.dark', [tokenGroup]Vars, { ... }) if theming is needed
  - Run the dev server to verify Vanilla Extract processes the new file: npm run dev
```

---

## Token Naming Reference

Use camelCase for all token keys (Vanilla Extract generates scoped CSS custom property names from them automatically):

| Convention | Example |
|---|---|
| Color | `text`, `textHeading`, `accent`, `accentBg` |
| Spacing | `xs`, `sm`, `md`, `lg`, `xl` |
| Typography | `fontSans`, `sizeBase`, `lineHeight` |
| Elevation | `shadowSm`, `shadowMd` |
| Radius | `radiusSm`, `radiusFull` |
| Motion | `durationFast`, `easeOut` |

Avoid generic names like `color1`, `size3`. Token names should be semantic (describe intent, not value).