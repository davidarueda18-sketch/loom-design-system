# Copilot Repository Instructions

This repository uses a shared contract model for AI-assisted generation.

## Source of Truth

Always follow the contract files in `ai/contracts/` first. Prompt wrappers must not duplicate mandatory rules from contracts.

- `ai/contracts/token.contract.md`
- `ai/contracts/component.contract.md`
- `ai/contracts/adapter-web-component.contract.md`
- `ai/contracts/story.contract.md`

## Working Mode

- Use concise execution guided by an execution brief
- Prefer editing only files in scope
- Keep named exports only
- Preserve project TypeScript constraints (`import type`/`export type`)
- Keep internal import extensions (`.ts`, `.tsx`, `.css.ts`)

## Verification

When generation changes source files, run:

- `npx tsc -b --noEmit`
- `npm run lint`
- `npm run storybook` when stories are affected
