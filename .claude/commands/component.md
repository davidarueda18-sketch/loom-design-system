---
name: component
description: Create a new Loom Design System component with proper structure, types, Vanilla Extract styles, adapters folder, and public API exports
---

# Loom Design System — Component Creator

## Canonical Contract

- Source of truth: `ai/contracts/component.contract.md`
- Wrapper role: this file orchestrates requirement gathering and repo-specific file placement.
- Change policy: update the contract first, then refine wrapper flow if required.

You are creating a new component for the Loom Design System. Follow every step in order without skipping. When information is missing, ask before writing any files. `loom-*` Web Components are the canonical cross-framework runtime; React adapters are thin wrappers over those custom elements.

---

## Step 1 — Gather requirements

If the user's invocation did not supply all three of the following, ask for them now in a single message:

1. **Component name** — PascalCase, e.g. `Button`, `Tabs`, `FormField`
2. **Component type** — one of:
   - `primitive` — single-element, polymorphic `as` prop (e.g. Button, Text, Icon, Badge, Link)
   - `component` — composite, stateful, may have subparts (e.g. Dialog, Tabs, Accordion, Card)
   - `pattern` — layout-level, composes primitives and components (e.g. FormField, PageLayout, DataTable)
3. **Brief description** — one sentence describing what this component does

Once you have all three, confirm with a single line:

> Creating `[ComponentName]` ([type]) — [description]

Then proceed to Step 2 without further confirmation prompts.

---

## Step 2 — Resolve the target directory

Map the type to a directory:

| type        | directory                                                        |
|-------------|------------------------------------------------------------------|
| `primitive` | `src/design-system/package/ui/primitives/[ComponentName]/`      |
| `component` | `src/design-system/package/ui/components/[ComponentName]/`      |
| `pattern`   | `src/design-system/package/ui/patterns/[ComponentName]/`        |

Set `COMPONENT_DIR` to the resolved path. All component files go inside this directory.

Parent index paths:

| type        | parent index                                                      |
|-------------|-------------------------------------------------------------------|
| `primitive` | `src/design-system/package/ui/primitives/index.ts`               |
| `component` | `src/design-system/package/ui/components/index.ts`               |
| `pattern`   | `src/design-system/package/ui/patterns/index.ts`                 |

---

## Step 3 — Detect compound vs simple

A `component` type is **compound** (multiple coordinated subparts) when:
- Its name is one of: Tabs, Dialog, Accordion, Popover, Tooltip, Select, DropdownMenu, NavigationMenu, Collapsible, Sheet, AlertDialog, HoverCard, ContextMenu, Command, Combobox
- OR the user's description mentions "trigger", "panel", "root", "nested parts", or "subcomponents"

`primitive` and `pattern` are always **simple**.

---

## Step 4 — Enumerate subparts (compound only)

Use these canonical subpart lists:

| Component     | Subparts                                               |
|---------------|--------------------------------------------------------|
| Tabs          | Root, List, Trigger, Content                           |
| Dialog        | Root, Trigger, Portal, Overlay, Content, Title, Description, Close |
| Accordion     | Root, Item, Trigger, Content                           |
| Popover       | Root, Trigger, Anchor, Content, Arrow, Close           |
| Tooltip       | Root, Trigger, Content, Arrow                          |
| Select        | Root, Trigger, Value, Content, Item, ItemText, Separator |
| Generic       | Root, Trigger, Content                                 |

---

## Step 5 — Create files

### Global rules for all generated files

- All type-only imports/exports must use `import type` / `export type`. `verbatimModuleSyntax` is enabled — never `export { SomeType }` for a type-only symbol.
- Never hardcode hex colors or pixel values. Reference only these tokens: `var(--text)`, `var(--text-h)`, `var(--bg)`, `var(--border)`, `var(--code-bg)`, `var(--accent)`, `var(--accent-bg)`, `var(--accent-border)`, `var(--social-bg)`, `var(--shadow)`, `var(--sans)`, `var(--heading)`, `var(--mono)`.
- Dark mode is handled by CSS custom properties automatically — never add `@media (prefers-color-scheme: dark)` inside `.css.ts` files.
- Never use TypeScript `enum`. Use `const` objects with `as const` and derive union types from `typeof obj[keyof typeof obj]`, or use plain string union literals.
- Never use default exports anywhere. Named exports only.
- All imports within the component directory must include the file extension (`.ts`, `.tsx`, `.css.ts`).
- Only `@vanilla-extract/css` APIs are available: `style`, `styleVariants`, `globalStyle`, `createVar`, `fallbackVar`, `keyframes`. Do not use `recipe`, `atoms`, or `createSprinkles`.

---

### 5A — Simple component (primitive or pattern, or non-compound component)

Create these files and adapters. The Web Component adapter is the runtime source of truth; the React adapter is a wrapper over the `loom-*` element.

#### `[COMPONENT_DIR]/[ComponentName].types.ts`

For `primitive` (polymorphic):
```typescript
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type [ComponentName]Variant = 'primary' | 'secondary' | 'ghost';
export type [ComponentName]Size = 'sm' | 'md' | 'lg';

export interface [ComponentName]OwnProps<T extends ElementType = '[default_tag]'> {
  /** Render as a different HTML element or component */
  as?: T;
  variant?: [ComponentName]Variant;
  size?: [ComponentName]Size;
  children: ReactNode;
}

export type [ComponentName]Props<T extends ElementType = '[default_tag]'> =
  [ComponentName]OwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof [ComponentName]OwnProps>;
```

For `pattern` (no polymorphism):
```typescript
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface [ComponentName]Props extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}
```

Adapt:
- Replace `[default_tag]` with the most appropriate HTML element (`button`, `span`, `div`, `p`, `a`).
- Remove `variant` and `size` if the component has no visual variants — do not leave unused exports.
- Remove `children` if the component renders no children.

#### `[COMPONENT_DIR]/[ComponentName].css.ts`

```typescript
import { style, styleVariants } from '@vanilla-extract/css';

export const root = style({
  fontFamily: 'var(--sans)',
  transition: 'all 0.15s ease',
  ':focus-visible': {
    outline: '2px solid var(--accent)',
    outlineOffset: '2px',
  },
});

export const variant = styleVariants({
  primary: {
    background: 'var(--accent)',
    color: 'var(--bg)',
  },
  secondary: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text)',
  },
});

export const size = styleVariants({
  sm: { padding: '4px 12px', fontSize: '14px' },
  md: { padding: '8px 16px', fontSize: '16px' },
  lg: { padding: '12px 24px', fontSize: '18px' },
});
```

Adapt: omit `variant` and/or `size` styleVariants if the types file does not define them.

#### `[COMPONENT_DIR]/adapters/[ComponentName].element.ts`

Create a custom element named `loom-[kebab-component-name]`. It must own the runtime behavior, accessibility, Shadow DOM/slots when needed, custom events, and `::part()` exposure. Follow `ai/contracts/adapter-web-component.contract.md`.

Minimum shape for a simple shadow/action component:

```typescript
import * as styles from '../[ComponentName].css.ts';
import type { [ComponentName]Size, [ComponentName]Variant } from '../[ComponentName].types.ts';

class Loom[ComponentName] extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'disabled'] as const;

  private _inner: HTMLElement | null = null;

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      this._inner = document.createElement('[default_tag]');
      this._inner.setAttribute('part', '[default_tag]');
      this._inner.appendChild(document.createElement('slot'));
      shadow.appendChild(this._inner);
    }
    this._sync();
  }

  attributeChangedCallback() {
    this._sync();
  }

  private _sync(): void {
    if (!this._inner) return;
    // Apply validated style variant classes and native state forwarding here.
  }
}

customElements.define('loom-[kebab-component-name]', Loom[ComponentName]);

declare global {
  interface HTMLElementTagNameMap {
    'loom-[kebab-component-name]': Loom[ComponentName];
  }
}

export { Loom[ComponentName] };
```

Adapt this skeleton to the component classification. Use light DOM only for layout primitives where the existing adapter pattern does so. Use Shadow DOM when wrapping native controls or exposing styleable internals.

#### `[COMPONENT_DIR]/adapters/[ComponentName].react.tsx`

```typescript
import './[ComponentName].element.ts';
import type { ElementType } from 'react';
import type { [ComponentName]Props } from '../[ComponentName].types.ts';

export function [ComponentName]<T extends ElementType = '[default_tag]'>({
  as,
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: [ComponentName]Props<T>) {
  const Tag = (as ?? 'loom-[kebab-component-name]') as ElementType;
  return (
    <Tag
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
}
```

For `pattern`, replace the generic function with a concrete element (no `as` prop):
```typescript
import './[ComponentName].element.ts';
import type { [ComponentName]Props } from '../[ComponentName].types.ts';

export function [ComponentName]({ children, className, ...props }: [ComponentName]Props) {
  return (
    <loom-[kebab-component-name] className={className} {...props}>
      {children}
    </loom-[kebab-component-name]>
  );
}
```

#### `[COMPONENT_DIR]/adapters/.gitkeep`

Do not create this file when `.element.ts` and `.react.tsx` are present. Use `.gitkeep` only if an adapter directory would otherwise be empty.

#### `[COMPONENT_DIR]/index.ts`

```typescript
export { [ComponentName] } from './adapters/[ComponentName].react.tsx';
export type { [ComponentName]Props, [ComponentName]Variant, [ComponentName]Size } from './[ComponentName].types.ts';
```

Remove `[ComponentName]Variant` and `[ComponentName]Size` from the export if they were omitted from the types file.

---

### 5B — Compound component

Create these files (example: `Tabs` with subparts `Root`, `List`, `Trigger`, `Content`):

Compound components follow the same canonical rule as simple components: generate the `loom-*` Web Component runtime first, then expose React subparts as wrappers over the custom-element contract. Do not scaffold compound React subparts that implement final visual behavior directly with Vanilla Extract classes unless there is not yet a Web Component contract for the compound primitive; in that case, mark the component as transitional and create the Web Component adapter before publishing it.

#### `[COMPONENT_DIR]/[ComponentName].context.ts`

```typescript
import { createContext, useContext } from 'react';

interface [ComponentName]ContextValue {
  // Define shared state here. Example:
  // activeId: string | null;
  // setActiveId: (id: string) => void;
}

const [ComponentName]Context = createContext<[ComponentName]ContextValue | null>(null);

export function use[ComponentName]Context(): [ComponentName]ContextValue {
  const ctx = useContext([ComponentName]Context);
  if (ctx === null) {
    throw new Error('`use[ComponentName]Context` must be used within `[ComponentName].Root`.');
  }
  return ctx;
}

export { [ComponentName]Context };
```

#### `[COMPONENT_DIR]/[ComponentName].types.ts`

```typescript
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Props for [ComponentName].Root — owns shared state */
export interface [ComponentName]RootProps {
  children: ReactNode;
  // Add controlled/uncontrolled props here, e.g.:
  // defaultValue?: string;
  // value?: string;
  // onValueChange?: (value: string) => void;
}

/** Props for [ComponentName].Trigger */
export interface [ComponentName]TriggerProps extends ComponentPropsWithoutRef<'button'> {
  /** Identifier matching a [ComponentName].Content panel */
  value: string;
}

/** Props for [ComponentName].Content */
export interface [ComponentName]ContentProps extends ComponentPropsWithoutRef<'div'> {
  /** Identifier matching the [ComponentName].Trigger that controls this panel */
  value: string;
}

// Add additional subpart prop interfaces following the same pattern
```

#### `[COMPONENT_DIR]/[ComponentName].css.ts`

```typescript
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--sans)',
});

export const trigger = style({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text)',
  fontFamily: 'var(--sans)',
  ':hover': { color: 'var(--text-h)' },
  ':focus-visible': {
    outline: '2px solid var(--accent)',
    outlineOffset: '2px',
  },
  selectors: {
    '&[data-active]': {
      color: 'var(--accent)',
      borderBottom: '2px solid var(--accent)',
    },
  },
});

export const content = style({
  color: 'var(--text)',
  padding: '16px 0',
});
```

#### `[COMPONENT_DIR]/adapters/[ComponentName]Root.react.tsx`

```typescript
import { [ComponentName]Context } from '../[ComponentName].context.ts';
import type { [ComponentName]RootProps } from '../[ComponentName].types.ts';
import * as styles from '../[ComponentName].css.ts';

export function [ComponentName]Root({ children }: [ComponentName]RootProps) {
  // Initialize shared state here. Example:
  // const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <[ComponentName]Context.Provider value={{}}>
      <div className={styles.root}>{children}</div>
    </[ComponentName]Context.Provider>
  );
}
```

#### `[COMPONENT_DIR]/adapters/[ComponentName]Trigger.react.tsx`

```typescript
import { use[ComponentName]Context } from '../[ComponentName].context.ts';
import type { [ComponentName]TriggerProps } from '../[ComponentName].types.ts';
import * as styles from '../[ComponentName].css.ts';

export function [ComponentName]Trigger({ value, children, ...props }: [ComponentName]TriggerProps) {
  const _ctx = use[ComponentName]Context();
  // Wire active state: const isActive = ctx.activeId === value;
  return (
    <button type="button" className={styles.trigger} {...props}>
      {children}
    </button>
  );
}
```

#### `[COMPONENT_DIR]/adapters/[ComponentName]Content.react.tsx`

```typescript
import { use[ComponentName]Context } from '../[ComponentName].context.ts';
import type { [ComponentName]ContentProps } from '../[ComponentName].types.ts';
import * as styles from '../[ComponentName].css.ts';

export function [ComponentName]Content({ value, children, ...props }: [ComponentName]ContentProps) {
  const _ctx = use[ComponentName]Context();
  // Conditionally render: if (ctx.activeId !== value) return null;
  return (
    <div className={styles.content} {...props}>
      {children}
    </div>
  );
}
```

The `_ctx` prefix tells TypeScript the variable is intentionally unused at scaffold stage. Do not remove the context call — it ensures correct nesting at runtime.

Add one file per additional subpart following the same pattern.

#### `[COMPONENT_DIR]/adapters/.gitkeep`

Do not create this file when adapter files are present. Use `.gitkeep` only if an adapter directory would otherwise be empty.

#### `[COMPONENT_DIR]/index.ts` (compound)

```typescript
import { [ComponentName]Root } from './adapters/[ComponentName]Root.react.tsx';
import { [ComponentName]Trigger } from './adapters/[ComponentName]Trigger.react.tsx';
import { [ComponentName]Content } from './adapters/[ComponentName]Content.react.tsx';
// Import additional subparts here

export type {
  [ComponentName]RootProps,
  [ComponentName]TriggerProps,
  [ComponentName]ContentProps,
} from './[ComponentName].types.ts';

/**
 * [ComponentName] compound component.
 *
 * @example
 * <[ComponentName].Root>
 *   <[ComponentName].Trigger value="a">Label</[ComponentName].Trigger>
 *   <[ComponentName].Content value="a">Content</[ComponentName].Content>
 * </[ComponentName].Root>
 */
export const [ComponentName] = {
  Root: [ComponentName]Root,
  Trigger: [ComponentName]Trigger,
  Content: [ComponentName]Content,
  // Add additional subparts here
} as const;
```

---

## Step 6 — Update the parent index file

Check whether the parent index file already exists.

**If it does not exist**, create it with:
```typescript
// Simple component
export { [ComponentName] } from './[ComponentName]/index.ts';
export type { [ComponentName]Props } from './[ComponentName]/index.ts';

// Compound component
export { [ComponentName] } from './[ComponentName]/index.ts';
export type { [ComponentName]RootProps, [ComponentName]TriggerProps, [ComponentName]ContentProps } from './[ComponentName]/index.ts';
```

**If it already exists**, append the appropriate lines to the end of the file without removing existing content.

---

## Step 7 — TypeScript verification

Run:
```
npx tsc -b --noEmit
```

If errors appear:
1. Read each error carefully.
2. Fix the specific file — do not regenerate all files.
3. Re-run until exit code 0.

Common errors in this project:

| Error | Fix |
|---|---|
| `TS1484` — type exported without `type` keyword | Change `export { Foo }` to `export type { Foo }` |
| `TS6133` — unused local | Remove the variable or prefix with `_` if needed for context wiring |
| `TS2304` — cannot find name | Add the missing import with correct `.ts`/`.tsx` extension |
| `TS2339` — property does not exist | Check the context interface has the field being accessed |
| `TS4082` — default export | Use named export only |

---

## Step 8 — Report to the user

When all files pass TypeScript, output this summary:

```
[ComponentName] ([type]) created successfully.

Files created:
  src/design-system/package/ui/[folder]/[ComponentName]/
  ├── [ComponentName].types.ts
  ├── [ComponentName].css.ts
  ├── [ComponentName].context.ts    (compound only)
  ├── adapters/
  │   ├── [ComponentName].element.ts    (canonical runtime)
  │   ├── [ComponentName].react.tsx     (React wrapper, simple)
  │   ├── [ComponentName]Root.react.tsx  (compound)
  │   ├── [ComponentName]Trigger.react.tsx
  │   ├── [ComponentName]Content.react.tsx
  │   └── .gitkeep                      (only if needed)
  └── index.ts

Parent index updated:
  src/design-system/package/ui/[folder]/index.ts

Next steps:
  - Wire context state in [ComponentName].context.ts and connect it in Root/Trigger/Content
  - Add stories in src/design-system/apps/storybook/
  - Test dark mode: CSS tokens switch automatically via @media (prefers-color-scheme: dark)
```

---

## Design Token Reference

Only these CSS custom properties exist in this project. Never substitute with hardcoded values.

| Token | Use for |
|---|---|
| `var(--text)` | Body text, secondary labels |
| `var(--text-h)` | Headings, emphasized text |
| `var(--bg)` | Page/component backgrounds |
| `var(--border)` | Borders, dividers |
| `var(--code-bg)` | Code block backgrounds |
| `var(--accent)` | Primary interactive color, focus rings |
| `var(--accent-bg)` | Accent-tinted backgrounds |
| `var(--accent-border)` | Accent-tinted borders on hover |
| `var(--social-bg)` | Social link backgrounds |
| `var(--shadow)` | Elevation/drop shadows |
| `var(--sans)` | Body text, UI labels |
| `var(--heading)` | Headings |
| `var(--mono)` | Code, counters |

---

## Polymorphic Pattern Reference (primitives only)

The `as` prop lets consumers change the rendered element while keeping the component's styles:

```tsx
<Button variant="primary">Save</Button>               // → <button>
<Button as="a" href="/docs" variant="ghost">Docs</Button>  // → <a>
<Button as={Link} to="/about" variant="secondary">About</Button>  // → React Router Link
```

Type pattern:
```typescript
interface ButtonOwnProps<T extends ElementType = 'button'> { as?: T; ... }
type ButtonProps<T extends ElementType = 'button'> =
  ButtonOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps>;
```

Use this pattern for all `primitive` types. Do NOT use it for `component` or `pattern` types.

---

## File Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Types file | `[PascalCase].types.ts` | `Button.types.ts` |
| Styles file | `[PascalCase].css.ts` | `Button.css.ts` |
| Context file | `[PascalCase].context.ts` | `Tabs.context.ts` |
| Web Component adapter | `adapters/[PascalCase].element.ts` | `adapters/Button.element.ts` |
| React wrapper (simple) | `adapters/[PascalCase].react.tsx` | `adapters/Button.react.tsx` |
| React adapter (subpart) | `adapters/[PascalCase][Subpart].react.tsx` | `adapters/TabsRoot.react.tsx` |
| Index | `index.ts` | always lowercase |
| Exported function | Named, PascalCase | `export function Button` |
| Exported namespace | Named `const`, PascalCase | `export const Tabs = { Root, Trigger, Content } as const` |