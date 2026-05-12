# Adapter Web Component Contract

Version: 1.0.0
Domain: adapter

## Purpose

Generate framework-agnostic custom element adapters that map Vanilla Extract class variants to reactive Web Components consumable from Angular and Vue.

## Required Inputs

- primitiveName
- classification (`light-dom` | `shadow-action` | `shadow-form-associated`)
- mapped token attributes
- mapped boolean attributes

## Required Outputs

- adapter implementation under the primitive folder adapters
- updated exports in `index.ts` and `index.elements.ts` when needed

## Mandatory Laws

- No inline styles (`this.style.*` forbidden)
- Dual reactivity (attribute + property setters)
- Token validation before class map indexing
- Idempotent `_sync()` + RAF batching for non-aria attributes
- `HTMLElementTagNameMap` declaration required
- Shadow DOM when wrapping native elements
- Event bridge with `loom-*` custom events
- `adoptedStyleSheets` for shadow style source of truth

## Validation Checklist

- observed attributes aligned with getters/setters
- boolean attrs forwarded as native properties
- `_syncA11y()` synchronous route for `aria-*` in shadow adapters
- listeners removed in `disconnectedCallback`
- no class accumulation across sync runs

## Verification Command

- `npx tsc -b --noEmit`
