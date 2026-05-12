# Story Contract

Version: 1.0.0
Domain: story

## Purpose

Generate Storybook docs for foundations and UI components with dynamic token-derived data and context-appropriate previews.

## Required Inputs

- storyDomain (`foundation` | `ui-react` | `ui-web-component`)
- target token group or component

## Required Outputs

- story file in the matching Storybook folder
- dynamic controls/options derived from source constants

## Mandatory Laws

- Single source of truth: iterate imported token/constants, no hardcoded option lists
- No mirror values: resolve runtime token values in effect-safe helpers
- Layout abstraction: helper subcomponents above export block
- Context-aware previews by token type

## Validation Checklist

- no hardcoded token arrays
- argTypes options derived from constants
- nested token objects rendered correctly
- theme-aware color usage from semantic vars

## Verification Command

- `npm run storybook` (manual check)
- `npx tsc -b --noEmit`
