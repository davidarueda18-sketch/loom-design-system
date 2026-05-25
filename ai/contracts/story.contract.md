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

## Validation Checklist

- no hardcoded token arrays
- argTypes options derived from constants
- nested token objects rendered correctly
- theme-aware color usage from semantic vars
- canonical snippets use `loom-*`, attributes/slots, `@loom-sdc/design-system/elements`, and custom events where relevant
- React wrapper snippets are clearly labeled as wrappers over `loom-*`

## Verification Command

- `npm run storybook` (manual check)
- `npx tsc -b --noEmit`
