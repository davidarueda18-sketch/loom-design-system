# Figma Code Connect Contract

Version: 1.0.0
Domain: figma-code-connect

## Purpose

Generate `.figma.tsx` files that bridge Figma design nodes with `@loom-sdc/design-system`
Web Components, ensuring correct, copy-ready snippets appear in Figma Dev Mode.

## Required Inputs

- `componentName` — PascalCase (e.g. `Button`, `Checkbox`, `ProgressCircular`)
- `figmaNodeUrl` — URL completa del nodo de Figma con `node-id` (e.g. `...?node-id=84-2636`)
- `componentType` — `primitive` | `component` | `foundation`

## Required Outputs

One `.figma.tsx` file at the path matching the component type:

| type        | path                                                                                       |
|-------------|--------------------------------------------------------------------------------------------|
| `primitive` | `src/design-system/apps/storybook/ui/primitives/[Name]/[Name].figma.tsx`                  |
| `component` | `src/design-system/apps/storybook/ui/components/[Name]/[Name].figma.tsx`                  |
| `foundation`| `src/design-system/apps/storybook/foundations/[Name].figma.tsx`                            |

## Mandatory Laws

### Law 1 — Always declare `imports`

Every `figma.connect()` call must include the `imports` option pointing to the
published package. Without it, Figma derives the import from the first argument
(the internal component reference) and shows a monorepo-relative path in Dev Mode
instead of the installable package path.

```typescript
imports: ["import '@loom-sdc/design-system/custom-elements'"],
```

### Law 2 — `example` renders `loom-*` custom elements only

The first argument of `figma.connect()` links the Figma node to the component;
it is not rendered. The `example` function must always output the canonical
`loom-*` custom element tag — never the React wrapper.

```typescript
// ✅ Correct
example: ({ variant }) => <loom-button variant={variant}>Label</loom-button>

// ❌ Wrong — React wrapper, not the canonical runtime
example: ({ variant }) => <Button variant={variant}>Label</Button>
```

### Law 3 — Boolean attributes: `true` or `undefined`, never `false`

In HTML, `disabled="false"` still disables the element. Only omitting the attribute
(i.e. `undefined`) means "not disabled". Map only the truthy state in the enum;
when the Figma state is not selected, the value is `undefined` and the JSX attribute
is omitted automatically.

```typescript
// ✅ Correct
disabled: figma.enum('State', { Disabled: true }),
// → State=Disabled  → disabled={true}  → <loom-foo disabled />
// → State=Default   → disabled=undefined → attribute absent

// ❌ Wrong
disabled: figma.enum('State', { Disabled: true, Default: false }),
// → State=Default → disabled={false} → <loom-foo disabled="false"> ← still disabled!
```

The same rule applies to `checked`, `indeterminate`, `selected`, `error`, `open`,
and any other boolean attribute.

### Law 4 — Omit default values from the snippet

Map the Figma default variant to `undefined` so the attribute is absent in the
generated snippet. A consumer should not need to specify the default value.

```typescript
// ✅ Correct — 'square' is the default; only 'circle' appears in the snippet
shape: figma.enum('Shape', {
  Default:  undefined,  // square is the default → omit attribute
  Circular: 'circle',
}),

// ❌ Wrong — snippet always shows shape="square" even when unnecessary
shape: figma.enum('Shape', {
  Default:  'square',
  Circular: 'circle',
}),
```

Apply this rule to any enum value that maps to the component's default prop value.

### Law 5 — Multi-variant → separate `figma.connect()` per structural variant

When a Figma property changes the **rendered structure** (different child elements,
different required attributes), create one `figma.connect()` per variant using the
`variant` option. Do not try to merge them into conditional JSX in a single call.

```typescript
// ✅ Correct — two structural variants
figma.connect(Fab, URL, {
  variant: { Content: 'Icon' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: { size: figma.enum('Size', { SM: 'sm', MD: 'md', LG: 'lg' }) },
  example: ({ size }) => (
    <loom-fab content="icon" size={size} aria-label="Label">
      <svg>{/* icon SVG */}</svg>
    </loom-fab>
  ),
});

figma.connect(Fab, URL, {
  variant: { Content: 'Text' },
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: {
    label: figma.string('Label'),
    size:  figma.enum('Size', { SM: 'sm', MD: 'md', LG: 'lg' }),
  },
  example: ({ label, size }) => (
    <loom-fab content="text" size={size} label={label} />
  ),
});
```

Stylistic variants (e.g. `variant="filled"` vs `variant="ghost"`) do **not** require
separate calls — a single `figma.enum` mapping covers them.

### Law 6 — Read `.types.ts` before writing

Before generating the file, read `[Component].types.ts` to:
- Know every available attribute/property and its type
- Identify which values are defaults (to apply Law 4)
- Identify boolean attributes (to apply Law 3)
- Use the correct attribute names including correct casing

### Law 7 — HTML attributes in kebab-case

Custom element attributes are HTML attributes; camelCase names are not reflected
automatically by the browser's attribute API. Use kebab-case in JSX.

```typescript
// ✅ Correct
<loom-select error-message={errorMessage} label-position={labelPosition} show-value={showValue} />

// ❌ Wrong — camelCase is not observed by the Web Component
<loom-select errorMessage={errorMessage} />
```

Map the camelCase prop name to the kebab-case attribute explicitly:

```typescript
props: {
  errorMessage: figma.string('Error msg'),
},
example: ({ errorMessage }) => (
  <loom-select error-message={errorMessage} />
),
```

## File Template

```typescript
import figma from '@figma/code-connect';
import { ComponentName } from '../../../package/ui/primitives/ComponentName/index.ts';
import '../../loom-web-components.d.ts';

figma.connect(
  ComponentName,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=NNN-NNN',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      // ─── Enum props ───────────────────────────────────────────────────────
      variant: figma.enum('Variant', {
        Primary: 'primary',    // Figma label → code value
        Ghost:   'ghost',
        Default: undefined,    // default value → omit attribute (Law 4)
      }),
      // ─── Boolean states ───────────────────────────────────────────────────
      disabled: figma.enum('State', {
        Disabled: true,        // only map the truthy state (Law 3)
      }),
      // ─── String props ─────────────────────────────────────────────────────
      label: figma.string('Label'),
    },
    example: ({ variant, disabled, label }) => (
      <loom-component-name
        variant={variant}
        disabled={disabled}
        label={label}
      />
    ),
  },
);
```

## Relative Import Depths

The relative path from the `.figma.tsx` file to the package depends on the component type:

| file location | import path prefix |
|---------------|--------------------|
| `apps/storybook/ui/primitives/[Name]/` | `'../../../../../package/...'` |
| `apps/storybook/ui/components/[Name]/` | `'../../../../../package/...'` |
| `apps/storybook/foundations/`          | `'../../../package/...'` |

The `loom-web-components.d.ts` side-effect import depth:

| file location | import path |
|---------------|-------------|
| `apps/storybook/ui/primitives/[Name]/` | `'../../../loom-web-components.d.ts'` |
| `apps/storybook/ui/components/[Name]/` | `'../../../loom-web-components.d.ts'` |
| `apps/storybook/foundations/`          | `'../loom-web-components.d.ts'` |

## Validation Checklist

- [ ] `imports` option present with `'@loom-sdc/design-system/custom-elements'`
- [ ] `example` renders `loom-*` custom element, not the React wrapper
- [ ] No boolean attribute set to `false` — only `true` or `undefined`
- [ ] Default enum values mapped to `undefined`, not to the default string
- [ ] Multi-variant structural differences use separate `figma.connect()` calls with `variant`
- [ ] HTML attributes use kebab-case (`error-message`, `label-position`, `show-value`)
- [ ] `loom-web-components.d.ts` side-effect import present with correct relative path
- [ ] Components that require `aria-label` (icon-only buttons, icon FABs) include it

## Verification Command

```
npx tsc -b --noEmit
```
