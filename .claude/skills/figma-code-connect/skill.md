---
name: code-connect
description: Generate or fix Figma Code Connect files (.figma.tsx) for Loom Design System components. Enforces the 7 mandatory laws — correct published-package imports, loom-* canonical tags, boolean coercion, default-value omission, multi-variant splitting, kebab-case attributes, and type-first discovery.
---

# Loom Design System — Figma Code Connect Generator

## Canonical Contract

- Source of truth: `ai/contracts/figma-code-connect.contract.md`
- Wrapper role: this file adds execution workflow, rich examples, and the fix-mode procedure.
- Change policy: update the contract laws first, then keep this skill synchronized.

Generates `.figma.tsx` files that bridge Figma design nodes with `@loom-sdc/design-system`
Web Components. The snippet shown in Figma Dev Mode must be copy-ready: correct package import,
canonical `loom-*` tag, no redundant default values, and attributes in valid HTML form.

## When to Use

- User asks to create a new Figma Code Connect file for a component
- User asks to fix an existing `.figma.tsx` (wrong import path, defaults showing, etc.)
- User asks to fix all existing `.figma.tsx` files in bulk
- User asks to add a new Figma variant mapping to an existing file

---

## Modes

### Mode A — Create (default)

Invoked as `/code-connect [ComponentName]`.

If the component name is provided as the skill argument, skip Step 1 and go directly to Step 2.
If not provided, ask before proceeding.

### Mode B — Fix existing

Invoked as `/code-connect fix` or `/code-connect fix [ComponentName]`.

Read the existing file, apply all 7 laws to the current content, and write the corrected version.
For `/code-connect fix` (no name), fix ALL `.figma.tsx` files in the repo.

---

## Workflow — Create Mode

### Step 1 — Gather required data

If any of the following are missing, ask for all missing items in a **single message**:

1. **Component name** — PascalCase (e.g. `Checkbox`, `Select`, `ProgressCircular`)
2. **Figma node URL** — the full URL with `node-id` parameter from Figma Dev Mode
3. **Component type** — `primitive` | `component` | `foundation`

Confirm with one line before proceeding:

> Creating `[ComponentName].figma.tsx` ([type]) — Figma node: `[node-id]`

### Step 2 — Discover the component API (Law 6)

Read the component's `.types.ts` file:

```
src/design-system/package/ui/primitives/[Name]/[Name].types.ts   (primitive)
src/design-system/package/ui/components/[Name]/[Name].types.ts   (component)
```

Extract and note:
- All exported props/attributes and their TypeScript types
- `as const` constant objects (e.g. `BUTTON_VARIANTS`, `BUTTON_SIZES`) — these are the
  canonical value sets
- Boolean props vs string/enum props
- Which values are defaults (to apply Law 4)

### Step 3 — Detect multi-variant need (Law 5)

Ask: **"Does any Figma property change the rendered HTML structure — different child
elements or different required attributes — or only visual style?"**

- If **only style** → single `figma.connect()` call
- If **structure changes** → multiple calls with `variant` option (one per structural variant)

Examples of structural change: Fab has `Content: Icon` (needs `<svg>` child + `aria-label`)
vs `Content: Text` (uses `label` attribute, no child). These require two calls.

Examples of style-only: Button variant `primary` vs `ghost` — same element, same children.
Single call with `figma.enum('Variant', { Primary: 'primary', Ghost: 'ghost' })`.

### Step 4 — Map Figma properties

For each Figma property the component uses, confirm the mapping:

| Figma helper | Use when |
|---|---|
| `figma.enum('PropName', { FigmaLabel: codeValue })` | Figma variant/enum property |
| `figma.string('PropName')` | Figma text layer or string property |
| `figma.boolean('PropName')` | Figma boolean property |
| `figma.instance('PropName')` | Figma instance swap property |

**Naming is case-sensitive**: `'State'` ≠ `'state'`. The string must match the exact
Figma property name as it appears in the Figma file.

### Step 5 — Generate the file

Apply all 7 laws. Use the templates below. Write to the correct path:

| type | path |
|------|------|
| `primitive` | `src/design-system/apps/storybook/ui/primitives/[Name]/[Name].figma.tsx` |
| `component` | `src/design-system/apps/storybook/ui/components/[Name]/[Name].figma.tsx` |
| `foundation` | `src/design-system/apps/storybook/foundations/[Name].figma.tsx` |

### Step 6 — Verify

Run TypeScript type-check:
```bash
npx tsc -b --noEmit
```

Fix any errors before reporting the task as done.

---

## The 7 Mandatory Laws

### Law 1 — Always declare `imports`

```typescript
// ✅ Required in every figma.connect() options object
imports: ["import '@loom-sdc/design-system/custom-elements'"],
```

**Why:** Without this option, Figma derives the import statement from the first argument
(the internal component reference) and shows the monorepo-relative path
(`import { Checkbox } from "./Checkbox"`) instead of the published package path. Every
consumer sees this snippet — it must show the installable package.

### Law 2 — `example` renders `loom-*` only

```typescript
// ✅ Correct — canonical Web Component tag
example: ({ variant }) => <loom-button variant={variant}>Label</loom-button>

// ❌ Wrong — React wrapper is not the canonical runtime
example: ({ variant }) => <Button variant={variant}>Label</Button>
```

**Why:** `@loom-sdc/design-system` is a framework-agnostic library. The `loom-*`
custom element tag works in Angular, Vue, and plain HTML. Showing the React wrapper
implies the library is React-only.

### Law 3 — Boolean attributes: `true` or `undefined`, never `false`

```typescript
// ✅ Only map the truthy state
disabled: figma.enum('State', {
  Disabled: true,
  // State=Default → disabled=undefined → attribute omitted automatically
}),

// ❌ Wrong — disabled="false" in HTML still disables the element
disabled: figma.enum('State', {
  Disabled: true,
  Default:  false,
}),
```

**Why:** The HTML attribute `disabled="false"` is not `false` — the browser treats
the *presence* of `disabled` as truthy, regardless of its value. Only the *absence*
of the attribute disables nothing. JSX omits an attribute when its value is `undefined`.

Applies to: `disabled`, `checked`, `indeterminate`, `selected`, `error`, `open`,
`readonly`, and any other boolean attribute.

### Law 4 — Omit default values from the snippet

```typescript
// ✅ Default shape is 'square' — omit it from the snippet
shape: figma.enum('Shape', {
  Default:  undefined,  // → attribute absent in snippet
  Circular: 'circle',
}),

// ❌ Wrong — snippet always shows shape="square" even when the consumer doesn't need it
shape: figma.enum('Shape', {
  Default:  'square',
  Circular: 'circle',
}),
```

**Why:** A snippet that includes the default value misleads the consumer into thinking
the attribute is required. It also adds noise that makes it harder to spot the
meaningful differences between variants.

How to identify the default: read the component's `.types.ts` — default values are
documented as optional props with their default specified in the Web Component
adapter's `_sync()` method or in the types file.

### Law 5 — Multi-variant → separate `figma.connect()` per structure

```typescript
// ✅ Two structural variants — each gets its own figma.connect()
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

**Why:** A single `figma.connect()` produces one snippet. If the structure of the
rendered element differs between Figma variants, a single merged snippet with
conditionals is confusing. Separate calls generate separate, clean snippets that
show in Figma only when the corresponding variant is selected.

**Structural change signal:** different required children (slot content, SVG icon),
different required attributes (`content="icon"` vs `content="text"`), or completely
different DOM shape.

**Style-only signal:** same element, same children, only `variant="primary"` vs
`variant="ghost"`. Single `figma.connect()` is correct here.

### Law 6 — Read `.types.ts` before writing

Before writing any `figma.connect()` call, read the component's `.types.ts` file.

This is mandatory because:
- You learn which attributes are boolean (Law 3 applies)
- You learn the default values (Law 4 applies)
- You avoid attribute name mismatches between the types file and the JSX

### Law 7 — HTML attributes in kebab-case

```typescript
// ✅ Correct — kebab-case HTML attribute
<loom-select error-message={errorMessage} label-position={labelPosition} show-value={showValue} />

// ❌ Wrong — camelCase is silently ignored by the Web Component
<loom-select errorMessage={errorMessage} />
```

**Why:** Web Components observe attributes by their exact string name as registered in
`static observedAttributes`. Loom components register kebab-case names. A JSX attribute
written in camelCase is transformed by the JSX compiler to the same camelCase string —
the browser does not convert it to kebab-case, so the component never receives the value.

Map the camelCase prop name in `props` to the kebab-case attribute in the JSX:

```typescript
props: {
  errorMessage:  figma.string('Error msg'),
  labelPosition: figma.enum('Label', { None: undefined, Left: 'start', Center: 'center', Right: 'end' }),
  showValue:     figma.boolean('Show Value'),
},
example: ({ errorMessage, labelPosition, showValue }) => (
  <loom-select
    error-message={errorMessage}
    label-position={labelPosition}
    show-value={showValue}
  />
),
```

---

## Templates

### Simple component (single `figma.connect()`)

```typescript
import figma from '@figma/code-connect';
import { ComponentName } from '../../../../../package/ui/primitives/ComponentName/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  ComponentName,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=NNN-NNN',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Ghost:   'ghost',
        Outline: 'outline',
      }),
      size: figma.enum('Size', {
        SM: 'sm',
        MD: 'md',
        LG: 'lg',
      }),
      disabled: figma.enum('State', {
        Disabled: true,
      }),
    },
    example: ({ variant, size, disabled }) => (
      <loom-component-name
        variant={variant}
        size={size}
        disabled={disabled}
      >
        Label
      </loom-component-name>
    ),
  },
);
```

### Component with mutual-exclusive boolean states (e.g. Checkbox)

When a single Figma `State` property maps to multiple independent booleans, use
separate `figma.enum` calls on the same property name. Only one state can be active
at a time — this is correct behavior.

```typescript
props: {
  checked:       figma.enum('State', { Selected:     true }),
  indeterminate: figma.enum('State', { Indeterminate: true }),
  disabled:      figma.enum('State', { Disabled:      true }),
  // State=Default → all three are undefined → no attributes rendered
},
example: ({ checked, indeterminate, disabled, label }) => (
  <loom-checkbox
    checked={checked}
    indeterminate={indeterminate}
    disabled={disabled}
    label={label}
  />
),
```

### Icon-only component (requires `aria-label`)

```typescript
example: ({ variant, size, disabled }) => (
  <loom-icon-button
    variant={variant}
    size={size}
    disabled={disabled}
    aria-label="Label"
  >
    <svg>{/* icon SVG */}</svg>
  </loom-icon-button>
),
```

Always include a hardcoded `aria-label="Label"` placeholder so the consumer knows
it is required.

### Component with default-omitted enum

```typescript
// shape default is 'square'; only 'circle' appears in the snippet
shape: figma.enum('Shape', {
  Default:  undefined,
  Circular: 'circle',
}),
```

### Component with kebab-case attributes

```typescript
props: {
  errorMessage:  figma.string('Error msg'),
  showValue:     figma.boolean('Show Value'),
  labelPosition: figma.enum('LabelPos', {
    None:   undefined,
    Start:  'start',
    Center: 'center',
    End:    'end',
  }),
},
example: ({ errorMessage, showValue, labelPosition }) => (
  <loom-component
    error-message={errorMessage}
    show-value={showValue}
    label-position={labelPosition}
  />
),
```

### Multi-variant with `variant` option (structural difference)

```typescript
import figma from '@figma/code-connect';
import { Fab } from '../../../../../package/ui/primitives/Fab/index.ts';
import '../../../loom-web-components.d.ts';

// Variant A — icon content
figma.connect(
  Fab,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=17-569',
  {
    variant: { Content: 'Icon' },
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label: figma.string('Label'),
      size:  figma.enum('Size', { SM: 'sm', MD: 'md', LG: 'lg' }),
      disabled: figma.enum('State', { Disabled: true }),
    },
    example: ({ label, size, disabled }) => (
      <loom-fab content="icon" size={size} aria-label={label} disabled={disabled}>
        <svg>{/* icon SVG */}</svg>
      </loom-fab>
    ),
  },
);

// Variant B — text content
figma.connect(
  Fab,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=17-569',
  {
    variant: { Content: 'Text' },
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label:    figma.string('Label'),
      size:     figma.enum('Size', { SM: 'sm', MD: 'md', LG: 'lg' }),
      disabled: figma.enum('State', { Disabled: true }),
    },
    example: ({ label, size, disabled }) => (
      <loom-fab content="text" size={size} label={label} disabled={disabled} />
    ),
  },
);
```

### Foundation component (Typography)

```typescript
import figma from '@figma/code-connect';
import { Text } from '../../../package/ui/primitives/Text/index.ts';
import '../loom-web-components.d.ts';

figma.connect(
  Text,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=5-208',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      variant: figma.enum('Variant', {
        'body/base':   'body-md',
        'body/SM':     'body-sm',
        'body/LG':     'body-lg',
        // ... etc
      }),
      content: figma.string('content'),
    },
    example: ({ variant, content }) => (
      <loom-text variant={variant}>{content}</loom-text>
    ),
  },
);
```

Note: foundation files are one level shallower — relative import depths change.

---

## Fix Mode Procedure

When invoked as `/code-connect fix [ComponentName]` or `/code-connect fix`:

1. Read the existing `.figma.tsx` file(s)
2. Apply the validation checklist to identify violations
3. For each violation, apply the corresponding law
4. Write the corrected file
5. Run `npx tsc -b --noEmit` to verify
6. Report: list of files changed + violations fixed per file

**Common violations in existing files:**

| Violation | Fix |
|-----------|-----|
| Missing `imports` option | Add `imports: ["import '@loom-sdc/design-system/custom-elements'"]` to options object |
| Default value shown (e.g. `Default: 'square'`) | Change to `Default: undefined` |
| `determinate: undefined` as explicit entry | Remove it — unmapped keys already return `undefined` |
| camelCase attribute in JSX | Replace with kebab-case equivalent |

---

## Relative Import Depth Reference

| File location | Component import prefix | d.ts import |
|---------------|------------------------|-------------|
| `ui/primitives/[Name]/` | `'../../../../../package/...'` | `'../../../loom-web-components.d.ts'` |
| `ui/components/[Name]/` | `'../../../../../package/...'` | `'../../../loom-web-components.d.ts'` |
| `foundations/` | `'../../../package/...'` | `'../loom-web-components.d.ts'` |

---

## Checklist Before Finalizing

- [ ] `imports` option present in every `figma.connect()` call
- [ ] `example` renders `loom-*` custom element only
- [ ] No boolean attribute set to `false`
- [ ] Default enum values mapped to `undefined`
- [ ] Structural variants use separate `figma.connect()` with `variant` option
- [ ] HTML attributes use kebab-case in JSX (`error-message`, not `errorMessage`)
- [ ] `loom-web-components.d.ts` side-effect import at correct relative path
- [ ] Icon-only components include `aria-label` placeholder
- [ ] `npx tsc -b --noEmit` passes with no errors

---

## Before Writing

1. **Read `.types.ts`** — understand every prop, its type, and its default (Law 6)
2. **Read the Web Component adapter** (`adapters/[Name].element.ts`) — verify which
   attributes are in `static observedAttributes` and whether they use kebab-case (Law 7)
3. **Identify structural variants** — ask the user or infer from the Figma URL
   whether multiple `figma.connect()` calls are needed (Law 5)
4. **Confirm Figma property names** — the user must supply the exact names as they
   appear in the Figma file (they are case-sensitive)
