---
name: story
description: Generate Storybook documentation files for Foundations (tokens) and UI components in the Loom Design System. Enforces single-source-of-truth, no mirror values, layout abstraction, and context-aware previews.
---

# Loom Design System — Storybook Story Generator

Generates autonomous, dynamic Storybook stories for Foundations and UI components. All token data flows from the imported vars objects — nothing is hardcoded.

## When to Use

- User asks to create a Foundation story (colors, spacing, radius, shadow, typography, motion, z-index, etc.)
- User asks to create a Component story (Button, Input, Card, etc.)
- User asks to update/refactor an existing story to comply with the four laws

## Four Mandatory Laws

### Law 1 — Single Source of Truth
**Always** import the token vars object and iterate with `Object.keys()` or `Object.entries()`. Never hardcode a list of token keys. If the user asks to add a token, tell them to add it to the `.tokens.css.ts` file — the story auto-updates.

```tsx
// ✅ CORRECT
import { spacingVars } from '../../../package/tokens/spacing/index.ts';

(Object.keys(spacingVars) as Array<keyof typeof spacingVars>).map((key) => (
  <TokenRow key={key} name={key} cssVar={spacingVars[key]} />
))

// ❌ WRONG — hardcoded list
[{ key: 'sm' }, { key: 'md' }, { key: 'lg' }].map(...)
```

**Nested token objects:** Before iterating, check if the token object is flat or nested. If any value is an object (not a string), use `Object.entries()` recursively and generate `SubTitle` sections per nested group. A value that renders `[object Object]` means you hit a nested level you didn't handle.

```tsx
// Guard for nested structure
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
// ✅ CORRECT — resilient, SSR-safe
const resolveToken = (cssVar: string): string => {
  if (typeof window === 'undefined') return '';
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar.replace(/^var\((.+)\)$/, '$1').trim())
    .trim();
  return value || '—';
};

// ❌ WRONG — crashes in SSR / returns empty string silently
const resolveToken = (cssVar: string) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar.replace(/^var\((.+)\)$/, '$1').trim())
    .trim();
```

**When `resolveToken` is called inside JSX that renders on the server or in a test environment**, wrap it in a `useEffect` + `useState` pattern to ensure the value is read after the DOM is available:

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

Use `TokenValue` anywhere you need to display the raw resolved CSS value. Do not call `resolveToken` directly inline inside JSX if the component might hydrate asynchronously.

### Law 3 — Layout Abstraction
Define local sub-components (`TokenGrid`, `TokenRow`, `TokenCard`, `SectionTitle`, `SubTitle`, and the relevant Preview component) before the export block. These separate layout logic from token data.

```tsx
// Sub-components defined ABOVE the export block
const TokenGrid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>{children}</div>
);

export const MyStory: Story = {
  render: () => (
    <TokenGrid>
      {(Object.keys(myVars) as Array<keyof typeof myVars>).map((key) => (
        <TokenCard key={key} name={key} cssVar={myVars[key]} />
      ))}
    </TokenGrid>
  )
};
```

### Law 4 — Context-Aware Previews
**A generic 80×80 box does not document every token type.** Choose the preview component that makes the token's effect visible. Using the wrong preview produces documentation that looks complete but teaches nothing.

| Token type | Correct preview | Wrong preview |
|---|---|---|
| `shadow` | Neutral card with `boxShadow` applied | Colored flat box |
| `borderRadius` | Square with `borderRadius` + visible border | Borderless box |
| `spacing` | Horizontal bar with `width = cssVar` | Square box |
| `color / palette` | Filled swatch + resolved hex value | Square with no label |
| `opacity` | Colored box over a **checkerboard** background | Solid background box |
| `zIndex` | Stacked layers with offsets (cascade layout) | Single flat box |
| `fontSize / lineHeight` | Live text sample at that size | Any box |
| `fontWeight` | Live text sample at that weight | Any box |
| `letterSpacing` | Live uppercase text at that tracking | Any box |
| `motion / duration` | Animated dot moving across a track | Static box |
| `motion / easing` | Animated dot with the specific easing function | Static box |

Specific implementations are in the **Token-Specific Patterns** section below.

---

## Light / Dark Mode

The Storybook decorator automatically applies `data-theme="light"` (or removes it for dark) on the wrapping `<div>`. **All colors in stories must use `colorVars.*` semantic tokens** — never hardcode hex values for text, borders, or backgrounds.

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
        └── [Name].stories.tsx     ← Component docs
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
          // Use the context-aware preview for this token type (see patterns below)
          <div key={key}>{key}</div>
        ))}
      </TokenGrid>
    </div>
  ),
};
```

---

## Token-Specific Patterns

### Shadow — `ShadowCard`
Neutral elevated surface where `boxShadow` is the star. No border — the shadow must be visible on its own.

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

{(Object.keys(shadowVars) as Array<keyof typeof shadowVars>).map((key) => (
  <ShadowCard key={key} name={key} cssVar={shadowVars[key]} />
))}
```

### Border Radius — `RadiusCard`
Square with a visible border so the corner curve is unambiguous.

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
The element must sit on a **checkerboard** background so opacity is visually meaningful.

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
        opacity: cssVar as unknown as number,   // cssVar resolves to the opacity number
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
Stacked layers with translateX offsets so the stacking order is self-evident. No single box communicates z-index.

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
Group by hue prefix using `.filter()` on the keys. The resolved hex is displayed via `TokenValue`.

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
Grouped by category prefix. A row layout keeps the token name readable next to the swatch.

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
**Never use a box preview.** Always render live text at the actual token value.

```tsx
// FontSize
const FontSizeRow = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'baseline', gap: '24px', padding: '12px 0', borderBottom: `1px solid ${colorVars.borderSubtle}` }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: colorVars.textPrimary, fontFamily: 'monospace' }}>{name}</div>
      <TokenValue cssVar={cssVar} />
    </div>
    <span style={{ fontFamily: fontFamilyVars.sans, fontSize: cssVar, color: colorVars.textPrimary, lineHeight: 1.2 }}>
      Loom Design System
    </span>
  </div>
);

// FontWeight — same grid, change fontWeight
// LineHeight — use a multiline paragraph, change lineHeight
// LetterSpacing — use uppercase text, change letterSpacing
```

### Motion (duration / easing)
Animate a dot across a track. Duration stories animate with `easingEaseInOut`. Easing stories use `durationSlower` as the fixed duration so the curve difference is visible.

```tsx
// Duration row
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
```

---

## Component Story Template

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../../../package/tokens/color/color.tokens.css.ts';
import { colorVars } from '../../../package/tokens/color/index.ts';
import { MyComponent } from '../../../package/ui/primitives/MyComponent/index.ts';

const meta = {
  title: 'Primitives/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select' },
    size: { control: 'select' },
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
          {/* iterate over variant const object keys, not a hardcoded list */}
        </Row>
      </StorySection>
    </div>
  ),
};
```

---

## Checklist Before Finalizing

- [ ] No hardcoded hex color values for text, border, or background — only `colorVars.*`
- [ ] No hardcoded token key arrays — only `Object.keys(tokenVars)`
- [ ] No `value: 'Xpx'` mirror strings — display via `<TokenValue cssVar={...} />` instead
- [ ] `resolveToken` has the SSR guard (`typeof window === 'undefined'`) and fallback `'—'`
- [ ] `TokenValue` wraps `resolveToken` in `useEffect` + `useState` for async-safe rendering
- [ ] Token object is flat — if nested, sub-sections are generated per group
- [ ] Sub-components defined above the export block
- [ ] Side-effect CSS imports present for any token group that needs CSS vars registered
- [ ] Preview component matches the token type (see Law 4 table — no generic boxes for z-index, opacity, typography, or motion)
- [ ] Story renders correctly in both dark (default) and light themes
- [ ] `.stories.tsx` file lives in the correct storybook folder

---

## Before Writing

1. **Read the token file** at `src/design-system/package/tokens/[group]/[group].tokens.css.ts` to see the exact keys in the `ThemeContract`.
2. Check if the object is flat or nested — if nested, plan sub-sections.
3. Choose the correct preview component from the Law 4 table before writing any JSX.
4. Use exact key names from the token file — no guessing.
