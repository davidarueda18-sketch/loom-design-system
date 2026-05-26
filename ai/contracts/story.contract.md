# Story Contract

Version: 1.0.0
Domain: story

## Purpose

Generate Storybook docs for foundations and UI components with dynamic token-derived data, context-appropriate previews, and `loom-*` as the canonical UI documentation surface.

## Required Inputs

- storyDomain (`foundation` | `ui-web-component` | `ui-react`)
- target token group or component

## Required Outputs

- story file in the matching Storybook folder
- UI component stories where the default/canonical examples render `loom-*`
- optional React wrapper stories only as framework-integration examples
- dynamic controls/options derived from source constants

## Mandatory Laws

- Single source of truth: iterate imported token/constants, no hardcoded option lists
- No mirror values: resolve runtime token values in effect-safe helpers
- Layout abstraction: helper subcomponents above export block
- Context-aware previews by token type
- Web Component first: for UI components with a `loom-*` adapter, the primary docs, snippets, controls, play tests, events, and `::part()` examples must target the custom element
- React wrapper secondary: React stories may exist only to document wrapper ergonomics and must not imply React is the canonical runtime
- Loom composition first: UI implementation snippets and canonical demos must compose with existing Loom primitives (`loom-box`, `loom-stack`, `loom-inline`, etc.) before falling back to raw `div`/`span` scaffolding. For text content, use semantic HTML elements (`<p>`, `<h1>`–`<h6>`, `<span>`) with `loom-*` typography classes (e.g. `class="loom-body-md"`). Raw HTML wrappers are allowed only as Storybook-only measurement/debug scaffolds.

## Validation Checklist

- no hardcoded token arrays
- argTypes options derived from constants
- nested token objects rendered correctly
- theme-aware color usage from semantic vars
- canonical snippets use `loom-*`, attributes/slots, `@loom-sdc/design-system/elements`, and custom events where relevant
- implementation snippets avoid raw `div`/`span` layout when a Loom primitive covers the need
- React wrapper snippets are clearly labeled as wrappers over `loom-*`

## Typing Requirements

- Stories with `args`, `argTypes`, or render props must define an explicit file-level `StoryArgs` interface or type.
- Meta objects for stories with custom args must use `satisfies Meta<StoryArgs>`, not bare `satisfies Meta`.
- Story aliases for stories with custom args must use `StoryObj<StoryArgs>` so render args are checked directly.
- Bare `StoryObj` is acceptable only for stories without custom args or argTypes.
- `StoryObj<typeof meta>` is acceptable only when Storybook component props are the intended args shape and no custom control-only args are introduced.
- Custom element refs must use `HTMLElementTagNameMap['loom-*']`; do not cast refs to `React.Ref<HTMLElement>`, `Ref<HTMLElement>`, or `any`.
- Helper functions that query custom elements must return `HTMLElementTagNameMap['loom-*']` after checking the queried host exists.

## Verification Command

- `npm run storybook` (manual check)
- `npx tsc -b --noEmit`
