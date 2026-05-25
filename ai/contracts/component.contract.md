# Component Contract

Version: 1.0.0
Domain: component

## Purpose

Generate a new design-system component with structure, types, styles, Web Component runtime, optional framework wrappers, and exports aligned to Loom conventions.

## Required Inputs

- componentName (PascalCase)
- componentType (`primitive` | `component` | `pattern`)
- description (one sentence)

## Required Outputs

- component directory with types/css/(context when compound)/adapters/index
- Web Component adapter (`adapters/[ComponentName].element.ts`) as the canonical runtime
- React adapter (`adapters/[ComponentName].react.tsx`) as a thin wrapper that renders the `loom-*` element
- export wired in parent index by type
- custom element wired in `index.elements.ts` and `index.custom-elements.ts`

## Mandatory Rules

- Named exports only
- No enums
- File extensions in internal imports (`.ts`, `.tsx`, `.css.ts`)
- Use type-only imports/exports when applicable
- Use token-driven values in styles
- `loom-*` is the canonical cross-framework API and documented public contract
- Web Component adapters are the source of truth for runtime behavior, accessibility, events, Shadow DOM, slots, and `::part()` exposure
- React adapters must not reimplement visual or behavioral logic with Vanilla Extract classes; they must import/register the element adapter and render the matching `loom-*` tag
- React wrappers may translate React ergonomics to the Web Component contract (camelCase props to kebab-case attributes, children to slots, refs/listeners to `loom-*` custom events)

## Compound Detection

For `component` type, classify as compound when known compound names or description indicates trigger/panel/root/subparts.

## Validation Checklist

- correct target directory by type
- compound subparts present when applicable
- adapters folder exists
- Web Component adapter exists and self-registers exactly one `loom-*` tag
- React adapter renders the `loom-*` tag instead of a native implementation with style classes
- element entry points and tag maps include the new custom element
- parent index updated

## Verification Command

- `npx tsc -b --noEmit`
