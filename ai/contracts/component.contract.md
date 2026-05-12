# Component Contract

Version: 1.0.0
Domain: component

## Purpose

Generate a new design-system component with structure, types, styles, adapters, and exports aligned to Loom conventions.

## Required Inputs

- componentName (PascalCase)
- componentType (`primitive` | `component` | `pattern`)
- description (one sentence)

## Required Outputs

- component directory with types/css/(context when compound)/adapters/index
- export wired in parent index by type

## Mandatory Rules

- Named exports only
- No enums
- File extensions in internal imports (`.ts`, `.tsx`, `.css.ts`)
- Use type-only imports/exports when applicable
- Use token-driven values in styles

## Compound Detection

For `component` type, classify as compound when known compound names or description indicates trigger/panel/root/subparts.

## Validation Checklist

- correct target directory by type
- compound subparts present when applicable
- adapters folder exists
- parent index updated

## Verification Command

- `npx tsc -b --noEmit`
