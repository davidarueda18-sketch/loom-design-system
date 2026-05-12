# AI Contracts (Single Source of Truth)

This directory defines the canonical generation contracts used by both Claude and Copilot wrappers.

## Goals

- Keep implementation rules in one place
- Let wrappers focus on orchestration only
- Reduce prompt size and drift between tools

## Contract Index

- `token.contract.md`: token groups with Vanilla Extract contracts and type exports
- `component.contract.md`: primitive/component/pattern generation rules
- `adapter-web-component.contract.md`: framework-agnostic custom element adapter rules
- `story.contract.md`: Storybook foundation and UI story rules

## Wrapper Rule

Any wrapper under `.claude/` or `.github/` must reference these contract files and must not duplicate mandatory laws.

## Versioning

Use per-contract version headers. Increment:

- patch for wording/clarifications
- minor for additive behavior
- major for breaking behavior or output shape changes
