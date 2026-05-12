# Token Contract

Version: 1.0.0
Domain: token

## Purpose

Generate a token group under `src/design-system/package/tokens/[group]/` using Vanilla Extract theme contract + global theme + typed key exports.

## Required Inputs

- tokenGroup (camelCase)
- tokenList (semantic keys)

## Required Outputs

- `[group].tokens.css.ts`
- `[group].types.ts`
- `index.ts` inside the group
- append exports in `src/design-system/package/tokens/index.ts`

## Mandatory Rules

- Use `createThemeContract` and `createGlobalTheme`
- Use `import type` and `export type` for type-only symbols
- No enums, no default exports
- Validate contract/theme key parity
- Keep named exports only

## Validation Checklist

- files created in expected directory
- parent tokens index updated
- no type-only export violations
- token keys are semantic and stable

## Verification Command

- `npx tsc -b --noEmit`
