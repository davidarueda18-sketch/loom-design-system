---
name: story
description: Generate Storybook documentation files for Foundations (tokens) and UI components in the Loom Design System. Enforces single-source-of-truth, no mirror values, layout abstraction, context-aware previews, and complete Web Component coverage including JSX typing, argTypes, custom events, and ::part() patterns.
---

# Loom Design System — Storybook Story Generator

## Canonical Contract

- Source of truth: `ai/contracts/story.contract.md`
- Wrapper role: this file contains Storybook-specific execution guidance and rich examples.
- Change policy: update contract laws first and keep this skill synchronized.

Generates autonomous, dynamic Storybook stories for Foundations and UI components. All token data flows from imported vars objects — nothing is hardcoded.

## When to Use

- User asks to create a Foundation story (colors, spacing, radius, shadow, typography, motion, z-index, etc.)
- User asks to create a React component story (Button, Input, Card, etc.)
- User asks to create a Web Component (`loom-*`) story
- User asks to update/refactor an existing story to comply with the four laws

---

## Four Mandatory Laws

### Law 1 — Single Source of Truth

**Always** import token vars and iterate with `Object.keys()` or `Object.entries()`. Never hardcode a list of token keys or option arrays. If a user asks to add a token, tell them to add it to the `.tokens.css.ts` file — the story auto-updates.

```tsx
// ✅ CORRECT
import { spacingVars } from '../../../package/tokens/spacing/index.ts';

(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((key) => (
  <TokenRow key={key} name={key} cssVar={spacingVars[key]} />
))

// ❌ WRONG — hardcoded list
[{ key: 'sm' }, { key: 'md' }, { key: 'lg' }].map(...)
```

The same law applies to `argTypes` option arrays in both React and Web Component stories — derive them from the token constant, never write them by hand:

```tsx
import { BUTTON_VARIANTS } from '../../../package/ui/primitives/Button/Button.types.ts';

argTypes: {
  variant: {
    control: 'select',
    options: Object.keys(BUTTON_VARIANTS),   // ✅ derived — auto-updates
  },
}

// ❌ WRONG
argTypes: {
  variant: { control: 'select', options: ['primary', 'outline', 'text'] },
}
```

**Nested token objects:** Before iterating, check if the token object is flat or nested. If any value is an object (not a string), use `Object.entries()` recursively and generate `SubTitle` sections per nested group. A value that renders `[object Object]` means you hit a nested level you didn't handle.

```tsx
const isNested = (val: unknown): val is Record<string, string> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

Object.entries(tokenVars).forEach(([key, val]) => {
  if (isNested(val)) {
    // render a SubTitle + inner map for this group
  } else {
    // render a TokenCard
  }
});
```

### Law 2 — No Mirror Values

Strings that duplicate a token's resolved value (e.g. `value: '8px'`) are forbidden. Use the `resolveToken` helper to extract the real CSS value at runtime.

**`resolveToken` must be resilient.** `getComputedStyle` depends on the DOM being mounted and CSS being injected. In SSR, test runners (Storybook Test Runner / Playwright), or before first paint, it may return an empty string. Always guard for this:

```tsx
// ✅ CORRECT — resilient, SSR-safe, correct capture group
const resolveToken = (cssVar: string): string => {
  if (typeof window === 'undefined') return '';
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar.replace(/^var\((.+)\)$/, '$1').trim())
    .trim();
  return value || '—';
};
```

**Always call `resolveToken` inside `useEffect`**, wrapped in the `TokenValue` component, so the value is read after the DOM is available:

```tsx
const TokenValue = ({ cssVar }: { cssVar: string }) => {
  const [value, setValue] = React.useState('');
  React.useEffect(() => { setValue(resolveToken(cssVar)); }, [cssVar]);
  return (
    <span style={{ fontSize: '11px', color: colorVars.textSecondary, fontFamily: 'monospace' }}>
      {value || '—'}
    </span>
  );
};
```

Never call `resolveToken` directly inline in JSX — it may run before CSS variables are registered.

### Law 3 — Layout Abstraction

Define local sub-components (`TokenGrid`, `TokenRow`, `TokenCard`, `SectionTitle`, `SubTitle`, and the relevant Preview component) **above** the export block. These separate layout logic from token data and keep the story body readable.

```tsx
// ✅ Sub-components ABOVE the export block
const TokenGrid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>{children}</div>
);

export const Scale: Story = {
  render: () => (
    <TokenGrid>
      {(Object.keys(myVars) as Array<keyof typeof myVars>).map((key) => (
        <TokenCard key={key} name={key} cssVar={myVars[key]} />
      ))}
    </TokenGrid>
  ),
};
```

### Law 4 — Context-Aware Previews

A generic 80×80 box does not document every token type. Choose the preview that makes the token's effect visible. Using the wrong preview produces documentation that looks complete but teaches nothing.

| Token type | Correct preview | Wrong preview |
|---|---|---|
| `shadow` | Neutral card with `boxShadow` applied | Colored flat box |
| `borderRadius` | Square with visible border + `borderRadius` | Borderless box |
| `spacing` | Horizontal bar with `width = cssVar` | Square box |
| `color / palette` | Filled swatch + resolved hex value | Square with no label |
| `opacity` | Colored box over **checkerboard** background | Solid background box |
| `zIndex` | Stacked layers with translateX offsets | Single flat box |
| `fontSize / lineHeight` | Live text sample at that size | Any box |
| `fontWeight` | Live text sample at that weight | Any box |
| `letterSpacing` | Live uppercase text at that tracking | Any box |
| `motion / duration` | Animated dot with `loom-slide` keyframe | Static box |
| `motion / easing` | Animated dot with the specific easing function | Static box |

Specific implementations are in the **Token-Specific Patterns** section below.

---

## Light / Dark Mode

The Storybook decorator automatically applies `data-theme="light"` on the wrapping `<div>`. **All colors in stories must use `colorVars.*` semantic tokens** — never hardcode hex values for text, borders, or backgrounds.

```tsx
import { colorVars } from '../../../package/tokens/color/index.ts';
import '../../../package/tokens/color/color.tokens.css.ts'; // side-effect — registers CSS vars

// ✅ Theme-aware
<div style={{ color: colorVars.textPrimary, background: colorVars.surfaceBase }}>

// ❌ Hardcoded — broken in the opposite theme
<div style={{ color: '#e2e8f0', background: '#181818' }}>
```

**Import the `.tokens.css.ts` side-effect** for any token group whose CSS variables need to be registered (color, palette, etc.).

---

## File Structure

```
src/design-system/apps/storybook/
├── foundations/
│   └── [TokenGroup].stories.tsx   ← Foundation token docs
└── ui/
    └── primitives/[Name]/
        └── [Name].stories.tsx     ← Component docs (React + CE in the same file)
```

---

## Foundation Story Template

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { myTokenVars } from '../../../package/tokens/myToken/index.ts';

const meta = { title: 'Foundations/MyToken' } satisfies Meta;
export default meta;
type Story = StoryObj;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const resolveToken = (cssVar: string): string => {
  if (typeof window === 'undefined') return '';
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar.replace(/^var\((.+)\)$/, '$1').trim())
    .trim();
  return value || '—';
};

const TokenValue = ({ cssVar }: { cssVar: string }) => {
  const [value, setValue] = React.useState('');
  React.useEffect(() => { setValue(resolveToken(cssVar)); }, [cssVar]);
  return (
    <span style={{ fontSize: '11px', color: colorVars.textSecondary, fontFamily: 'monospace' }}>
      {value || '—'}
    </span>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: string }) => (
  <h2 style={{ fontFamily: 'sans-serif', fontSize: '20px', fontWeight: 700, margin: '32px 0 16px', color: colorVars.textPrimary }}>
    {children}
  </h2>
);

const SubTitle = ({ children }: { children: string }) => (
  <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '24px 0 12px', color: colorVars.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
    {children}
  </h3>
);

const TokenGrid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '8px 0' }}>
    {children}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Scale: Story = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <SectionTitle>My Token</SectionTitle>
      <TokenGrid>
        {(Object.keys(myTokenVars) as Array<keyof typeof myTokenVars>).map((key) => (
          // Replace with the context-aware preview for this token type (see Law 4 table)
          <div key={key}>{key}</div>
        ))}
      </TokenGrid>
    </div>
  ),
};
```

---

## React Component Story Template

Use this when the component is a React component imported from the package (not a Custom Element).

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { MyComponent } from '../../../package/ui/primitives/MyComponent/index.ts';
import { MY_VARIANTS, MY_SIZES } from '../../../package/ui/primitives/MyComponent/MyComponent.types.ts';

const meta = {
  title: 'Primitives/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  argTypes: {
    // Derive options from the types constant — never hardcode the array
    variant: { control: 'select', options: Object.keys(MY_VARIANTS) },
    size:    { control: 'select', options: Object.keys(MY_SIZES) },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StorySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '40px' }}>
    <h3 style={{ fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 600, margin: '0 0 16px', color: colorVars.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {title}
    </h3>
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
    {children}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { /* default props */ },
};

export const Variants: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <StorySection title="Variants">
        <Row>
          {/* Iterate over the types constant — not a hardcoded list */}
          {(Object.keys(MY_VARIANTS) as Array<keyof typeof MY_VARIANTS>).map((variant) => (
            <MyComponent key={variant} variant={variant}>
              {variant}
            </MyComponent>
          ))}
        </Row>
      </StorySection>
    </div>
  ),
};
```

---

## Web Component (Custom Element) Story Template

### Decision: React adapter story vs Custom Element story

Write **both** in the same `.stories.tsx` file whenever a `loom-*` adapter exists for the component. Each serves a different purpose:

| Story type | Purpose | When to write |
|---|---|---|
| React stories | Document props, controls, autodocs | Always — React is the primary consumer |
| Custom Element story | Verify the adapter end-to-end, document HTML / Angular / Vue usage | Always when a `loom-*` adapter exists |

A Custom Element story that renders `<loom-button>` is NOT the same as a React story. It runs the real Custom Element lifecycle in the Storybook iframe, catching bugs that mocked React tests would miss.

### JSX Namespace — No `@ts-expect-error`

`@ts-expect-error` silences errors but removes all type safety. Instead, augment the global JSX namespace once, at the top of the story file or in a shared `custom-elements.d.ts`. The adapter's `declare global` block should already include `HTMLElementTagNameMap` — use that to derive the JSX type:

```tsx
// At the TOP of the story file, before any JSX using the custom element
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'loom-box':    React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        padding?:  string;
        paddingX?: string;
        paddingY?: string;
      }, HTMLElement>;
      'loom-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        variant?:  string;
        size?:     string;
        disabled?: boolean;
      }, HTMLElement>;
      // Add entries as adapters are created
    }
  }
}
```

Once declared, custom elements are fully type-checked in JSX — no suppressions needed.

Alternatively, keep a **shared** declaration file that covers all `loom-*` tags:

```
src/design-system/apps/storybook/
└── loom-elements.d.ts   ← one file, all loom-* JSX declarations
```

Import it in each story file that needs it: `import '../../../loom-elements.d.ts';` — or include it in `tsconfig.json` includes.

### `argTypes` for Custom Element Stories

Custom Element stories use `render()` without a typed `component` — so argTypes must be declared manually. Derive the options from the types constant, same as React stories:

```tsx
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../../../package/ui/primitives/Button/Button.types.ts';

const ceMeta = {
  title: 'Primitives/Button/Web Component',
  tags: ['autodocs'],
  argTypes: {
    variant:  { control: 'select', options: Object.keys(BUTTON_VARIANTS) },
    size:     { control: 'select', options: Object.keys(BUTTON_SIZES) },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
  },
  args: {
    variant: 'primary',
    size:    'md',
    disabled: false,
    label:   'Click me',
  },
} satisfies Meta;

export default ceMeta;
type Story = StoryObj<typeof ceMeta>;

export const Default: Story = {
  render: ({ variant, size, disabled, label }) => (
    <loom-button variant={variant} size={size} disabled={disabled || undefined}>
      {label}
    </loom-button>
  ),
};
```

**`disabled` coercion note:** `disabled` is a boolean attribute on the host element. Pass `undefined` instead of `false` to avoid `disabled="false"` in the HTML, which still disables the element. The pattern `disabled || undefined` achieves this.

### Light DOM Story (Box, Stack, Inline, Text)

```tsx
export const WebComponent: Story = {
  name: 'Web Component',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>

      <StorySection title="Padding">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((key) => (
            <loom-box
              key={key}
              padding={key}
              style={{ border: `1px dashed ${colorVars.borderDefault}`, background: colorVars.surfaceSubtle }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: colorVars.textSecondary }}>{key}</span>
            </loom-box>
          ))}
        </div>
      </StorySection>

    </div>
  ),
};
```

### Shadow DOM Story (Button, Input — components with shadow roots)

```tsx
export const WebComponent: Story = {
  name: 'Web Component',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '24px' }}>
      {(Object.keys(BUTTON_VARIANTS) as Array<keyof typeof BUTTON_VARIANTS>).map((variant) => (
        <loom-button key={variant} variant={variant} size="md">
          {variant}
        </loom-button>
      ))}
    </div>
  ),
};
```

### Interactive Story — Custom Event Pattern

When a component emits `loom-*` custom events, document them in a dedicated story with a `play` function that asserts the events fire correctly, and an event log panel so readers see the event stream live:

```tsx
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export const InteractiveEvents: Story = {
  name: 'Custom Events',
  render: () => {
    const [log, setLog] = React.useState<string[]>([]);

    // Imperative listener — event listener on the element, not React synthetic event
    const handleRef = React.useCallback((el: HTMLElement | null) => {
      if (!el) return;
      el.addEventListener('loom-click', (e) => {
        setLog((prev) => [`loom-click fired (composed=${(e as CustomEvent).composed})`, ...prev].slice(0, 8));
      });
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
        {/* ref prop is safe on any element in React — it just receives the DOM node */}
        <loom-button variant="primary" size="md" ref={handleRef as React.Ref<HTMLElement>}>
          Click me
        </loom-button>

        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: colorVars.textSecondary, minHeight: '80px' }}>
          {log.length === 0
            ? <span style={{ opacity: 0.5 }}>No events yet — click the button</span>
            : log.map((entry, i) => <div key={i}>{entry}</div>)
          }
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    // Verify the loom-click event was dispatched
    await expect(button).toBeInTheDocument();
  },
};
```

**Why imperative listeners:** Custom events with `bubbles: false` or `composed: false` do not reach React's synthetic event system. Always use `addEventListener` on the element ref for `loom-*` events.

### `::part()` Story

When a Shadow DOM adapter exposes named parts (`part="button"`, `part="label"`), document them so consumers know which internals are styleable. Create a dedicated `CSSParts` story:

```tsx
export const CSSParts: Story = {
  name: 'CSS Parts',
  decorators: [
    (Story) => (
      <>
        {/* Inject a <style> tag that overrides the exposed part */}
        <style>{`
          .parts-demo loom-button::part(button) {
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border-radius: 0;
          }
        `}</style>
        <div className="parts-demo">
          <Story />
        </div>
      </>
    ),
  ],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <div style={{ fontFamily: 'sans-serif', fontSize: '13px', color: colorVars.textSecondary, marginBottom: '8px' }}>
        Consumer applies <code>loom-button::part(button)</code> to override typography inside the shadow root:
      </div>
      <loom-button variant="primary" size="md">Customized via ::part()</loom-button>
    </div>
  ),
};
```

Document which parts are exposed in a table below the story:

```tsx
export const CSSParts: Story = {
  name: 'CSS Parts',
  parameters: {
    docs: {
      description: {
        story: `
Exposed CSS parts — customize internals without breaking shadow encapsulation:

| Part name | Element | What to style |
|---|---|---|
| \`button\` | Inner \`<button>\` | Typography, padding, border-radius, cursor |
| \`label\` | Text wrapper | Font, color, spacing |
        `,
      },
    },
  },
  // ...render
};
```

### Verify Adapter Completeness

A Web Component story is also a live integration test. Each story for a `loom-*` adapter must cover:

1. **All token-mapped attributes** — one render per variant/size/gap combination (or a grid showing all)
2. **Disabled / boolean state** — toggle `disabled` to verify `toggleAttribute` behavior
3. **Property API** — at least one `play` function that sets a property imperatively (`el.variant = 'outline'`) and asserts the class changed
4. **Custom events** — an interactive story with a `play` function that clicks and asserts the event fired

---

## Token-Specific Patterns

### Shadow — `ShadowCard`
Neutral elevated surface. No border — the shadow must be visible on its own.

```tsx
const ShadowCard = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
    <div style={{
      width: '80px', height: '80px',
      background: colorVars.surfaceRaised,
      borderRadius: '8px',
      boxShadow: cssVar,
    }} />
    <span style={{ fontSize: '12px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</span>
  </div>
);
```

### Border Radius — `RadiusCard`
Visible border so the corner curve is unambiguous.

```tsx
const RadiusCard = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
    <div style={{
      width: '80px', height: '80px',
      background: colorVars.brandPrimarySubtle,
      border: `2px solid ${colorVars.brandPrimary}`,
      borderRadius: cssVar,
    }} />
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
      <TokenValue cssVar={cssVar} />
    </div>
  </div>
);
```

### Spacing — `SpacingRow`
A horizontal bar whose width IS the spacing value. Grid layout keeps columns aligned.

```tsx
const SpacingRow = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '60px 60px 1fr', alignItems: 'center', gap: '16px', padding: '8px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <span style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</span>
    <TokenValue cssVar={cssVar} />
    <div style={{
      height: '20px',
      width: cssVar,
      minWidth: name === 'none' ? '2px' : undefined,
      background: name === 'none' ? colorVars.borderStrong : colorVars.brandAccent,
      borderRadius: '3px',
    }} />
  </div>
);
```

### Opacity — `OpacityCard`
Must sit on a checkerboard background so the opacity level is visually meaningful.

```tsx
const CHECKERBOARD = `
  repeating-conic-gradient(
    ${colorVars.borderDefault} 0% 25%,
    ${colorVars.surfaceBase} 0% 50%
  ) 0 0 / 16px 16px
`;

const OpacityCard = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
    <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: CHECKERBOARD, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: colorVars.brandPrimary,
        opacity: cssVar as unknown as number,
      }} />
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
      <TokenValue cssVar={cssVar} />
    </div>
  </div>
);
```

### Z-Index — `ZIndexStack`
Stacked layers with translateX offsets so the stacking order is self-evident.

```tsx
const ZIndexStack = ({ entries }: { entries: Array<{ name: string; cssVar: string }> }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
    {entries.map(({ name, cssVar }, i) => (
      <div key={name} style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '12px 16px',
        background: colorVars.surfaceSubtle,
        borderRadius: '6px',
        border: `1px solid ${colorVars.borderDefault}`,
        transform: `translateX(${i * 4}px)`,
        position: 'relative',
        zIndex: entries.length - i,
      }}>
        <code style={{ fontSize: '12px', color: colorVars.brandAccent, width: '64px', flexShrink: 0, fontFamily: 'monospace' }}>
          z=<TokenValue cssVar={cssVar} />
        </code>
        <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'sans-serif' }}>{name}</div>
      </div>
    ))}
  </div>
);

// Usage
<ZIndexStack
  entries={(Object.keys(zIndexVars) as Array<keyof typeof zIndexVars>).map((key) => ({
    name: key,
    cssVar: zIndexVars[key],
  }))}
/>
```

### Color Palette — `PaletteCard`
Group by hue prefix using `.filter()`. Resolved hex value displayed via `TokenValue`.

```tsx
const HUES = ['cyan', 'red', 'neutral', 'green', 'amber', 'blue'] as const;

const PaletteCard = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ width: '80px' }}>
    <div style={{
      width: '80px', height: '56px',
      background: cssVar,
      borderRadius: '6px',
      border: `1px solid ${colorVars.borderSubtle}`,
      marginBottom: '6px',
    }} />
    <div style={{ fontSize: '11px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
    <TokenValue cssVar={cssVar} />
  </div>
);

{HUES.map((hue) => (
  <div key={hue}>
    <SubTitle>{hue}</SubTitle>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {(Object.keys(paletteVars) as Array<keyof typeof paletteVars>)
        .filter((key) => key.startsWith(hue))
        .map((key) => <PaletteCard key={key} name={key} cssVar={paletteVars[key]} />)
      }
    </div>
  </div>
))}
```

### Semantic Colors — `SemanticRow`
Grouped by category prefix. Row layout keeps token name readable next to swatch.

```tsx
const GROUPS = ['surface', 'brand', 'text', 'border', 'feedback'] as const;

const SemanticRow = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div style={{
      width: '48px', height: '48px', flexShrink: 0,
      background: cssVar,
      borderRadius: '6px',
      border: `1px solid ${colorVars.borderSubtle}`,
    }} />
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: '13px', color: colorVars.textPrimary }}>{name}</div>
      <TokenValue cssVar={cssVar} />
    </div>
  </div>
);

{GROUPS.map((group) => (
  <div key={group}>
    <SubTitle>{group}</SubTitle>
    {(Object.keys(colorVars) as Array<keyof typeof colorVars>)
      .filter((key) => key.startsWith(group))
      .map((key) => <SemanticRow key={key} name={key} cssVar={colorVars[key]} />)
    }
  </div>
))}
```

### Typography (fontSize, fontWeight, lineHeight, letterSpacing)
Never use a box preview. Always render live text at the actual token value.

```tsx
// FontSize
const FontSizeRow = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'baseline', gap: '24px', padding: '12px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
      <TokenValue cssVar={cssVar} />
    </div>
    <span style={{ fontFamily: 'sans-serif', fontSize: cssVar, color: colorVars.textPrimary, lineHeight: 1.2 }}>
      Loom Design System
    </span>
  </div>
);

// FontWeight — same grid, set fontWeight: cssVar instead of fontSize
// LineHeight  — multiline paragraph, set lineHeight: cssVar
// LetterSpacing — uppercase text, set letterSpacing: cssVar
```

### Motion (duration / easing)
Animate a dot across a track. **The `@keyframes` rule must be injected as a `<style>` tag in the story** — it cannot be a Vanilla Extract style because stories are not part of the VE build:

```tsx
const MOTION_KEYFRAMES = `
  @keyframes loom-slide {
    0%   { transform: translateX(0); }
    50%  { transform: translateX(calc(100% - 12px)); }
    100% { transform: translateX(0); }
  }
`;

export const Scale: Story = {
  render: () => (
    <>
      <style>{MOTION_KEYFRAMES}</style>
      <div style={{ fontFamily: 'sans-serif', padding: '24px' }}>
        {/* Duration rows */}
        {(Object.keys(durationVars) as Array<keyof typeof durationVars>).map((key) => (
          <DurationRow key={key} name={key} cssVar={durationVars[key]} usage={DURATION_USAGE[key] ?? ''} />
        ))}
      </div>
    </>
  ),
};

// Duration row — animates at the token's speed with a fixed easing
const DurationRow = ({ name, cssVar, usage }: { name: string; cssVar: string; usage: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '180px 80px 1fr', alignItems: 'center', gap: '24px', padding: '16px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
      <div style={{ fontSize: '11px', color: colorVars.textSecondary, marginTop: '2px', fontFamily: 'sans-serif' }}>{usage}</div>
    </div>
    <TokenValue cssVar={cssVar} />
    <div style={{ position: 'relative', height: '12px', overflow: 'hidden' }}>
      <div style={{
        width: '12px', height: '12px', borderRadius: '50%',
        background: colorVars.brandAccent,
        animation: `loom-slide ${cssVar} ${motionVars.easingEaseInOut} infinite`,
      }} />
    </div>
  </div>
);

// Easing row — uses a fixed slow duration so the curve difference is visible
const EasingRow = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center', gap: '24px', padding: '16px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
    <div style={{ position: 'relative', height: '12px', overflow: 'hidden' }}>
      <div style={{
        width: '12px', height: '12px', borderRadius: '50%',
        background: colorVars.brandAccent,
        animation: `loom-slide ${motionVars.durationSlower} ${cssVar} infinite`,
      }} />
    </div>
  </div>
);
```

---

## Checklist Before Finalizing

### Always

- [ ] No hardcoded hex color values for text, border, or background — only `colorVars.*`
- [ ] No hardcoded token key arrays in `render()` or `argTypes` — only `Object.keys(tokenVars)` / `Object.keys(CONST_OBJECT)`
- [ ] No `value: 'Xpx'` mirror strings — display via `<TokenValue cssVar={...} />` instead
- [ ] `resolveToken` has the SSR guard (`typeof window === 'undefined'`) and the correct `'$1'` capture group
- [ ] `TokenValue` wraps `resolveToken` in `useEffect` + `useState` for async-safe rendering
- [ ] Nested token objects handled with sub-sections, not a flat map
- [ ] Sub-components defined above the export block
- [ ] Side-effect CSS imports present for any token group that needs CSS vars registered
- [ ] Preview component matches the token type (Law 4 table — no generic boxes for z-index, opacity, typography, or motion)
- [ ] Story renders correctly in both dark and light themes
- [ ] `.stories.tsx` file lives in the correct storybook folder

### React Component Stories

- [ ] `argTypes` options derived from types constant, not a hardcoded array
- [ ] `satisfies Meta<typeof MyComponent>` used for type safety
- [ ] `tags: ['autodocs']` present for components

### Web Component Stories

- [ ] No `@ts-expect-error` — JSX namespace augmented in the story file or shared `loom-elements.d.ts`
- [ ] `argTypes` options derived from types constant (`Object.keys(MY_VARIANTS)`)
- [ ] `disabled` passed as `disabled || undefined` (never `disabled={false}`)
- [ ] `loom-*` events listened to with `addEventListener` on the element ref (not React synthetic events)
- [ ] Motion stories include `<style>{MOTION_KEYFRAMES}</style>` in the render function
- [ ] If component exposes `::part()`, a `CSSParts` story exists with a decorator-injected `<style>` override
- [ ] At least one `play` function verifies a user interaction end-to-end

---

## Before Writing

1. **Read the component file** — `src/design-system/package/ui/primitives/[Name]/[Name].tsx` (React) or `[Name].element.ts` (CE). Note: props vs attributes, boolean vs token attributes, emitted events, and exposed `::part()` names.
2. **Read `.css.ts`** — identify which `styleVariants` class maps are exported (needed for the CE adapter story context).
3. **Read `.types.ts`** — get the exact variant/size/etc. constant objects to use in `Object.keys()`.
4. **Check for an existing CE adapter** at `adapters/[Name].element.ts` — if it exists, include a Web Component story section.
5. **Choose the correct preview** from the Law 4 table before writing any JSX.
6. **Write React stories first**, then Web Component stories in the same file.
