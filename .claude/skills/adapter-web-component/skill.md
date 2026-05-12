# Loom Design System — Agnostic Web Component Adapter Generator

## Canonical Contract

- Source of truth: `ai/contracts/adapter-web-component.contract.md`
- Wrapper role: this file provides implementation patterns, examples, and migration checklists.
- Change policy: update contract laws first and keep this skill aligned.

Generates professional Custom Element adapters that bridge Vanilla Extract atomic classes to framework-agnostic Web Components consumable from Angular and Vue.

## When to Use

- User asks to create a Web Component adapter for a design system primitive
- User asks to refactor an existing adapter to comply with the eight laws
- User asks to add reactivity (getters/setters) to a Custom Element

---

## Component Classification — Decide Before Writing a Single Line

| Criterion | Light DOM | Shadow DOM (`open`) |
|---|---|---|
| Wraps a native element? (`button`, `input`, `select`) | No | **Yes — required** |
| Needs `<slot>` for reactive content projection? | No | **Yes** |
| Needs native form integration? | No | **Yes** |
| Host IS the visual box? | Yes | Yes |
| External class bindings from Angular/Vue work? | ✅ | ✅ |

**Template A — Light DOM** — Box, Stack, Inline, Text: the host is the rendered element; VE classes apply directly.

**Template B — Shadow DOM (action elements)** — Button, Link: a native element lives in the shadow root; the host is the visual box; `<slot>` for content projection; no form value.

**Template C — Shadow DOM (form-associated elements)** — Input, Select, Textarea, Checkbox, Radio: Shadow DOM + `ElementInternals` for form submission, validation, and autofill. Requires `constructor()` and `static formAssociated = true`.

> **`display: contents` is forbidden in both strategies.** The host must always occupy layout space so external margin, flex-item sizing, and Angular/Vue class bindings work correctly.

---

## Eight Mandatory Laws

### Law 1 — Zero Inline Styles

`this.style.*` is **forbidden everywhere**, including `this.style.display = 'contents'`. Every visual property must come from a VE atomic class. If the `.css.ts` file does not export a `styleVariants` class map for the property being mapped, **stop and generate it first**.

```ts
// ✅ Class-based
const nextClass = key in styles.padding ? styles.padding[key as SpacingTokenKey] : null;
if (nextClass) this.classList.add(nextClass);

// ❌ Inline style — forbidden
this.style.padding = spacingVars[key];

// ❌ display: contents — forbidden even for layout
this.style.display = 'contents';
```

### Law 2 — Dual Reactivity (Attributes + Properties)

Every observed attribute must have a getter/setter so the element is reactive both to HTML/Vue attribute bindings and Angular/JS property bindings. Both paths converge on `_sync()`.

**Token attributes** (`variant`, `size`, `padding`, `color`) — string values looked up in a class map:

```ts
get padding(): SpacingTokenKey | null {
  return this.getAttribute('padding') as SpacingTokenKey | null;
}
set padding(val: SpacingTokenKey | null) {
  if (val == null) this.removeAttribute('padding');
  else this.setAttribute('padding', val);
}
```

**Boolean attributes** (`disabled`, `required`, `loading`, `checked`) — presence = `true`, absence = `false`. Use `toggleAttribute`. **Never pass a boolean through `_apply()` — it has no class map.**

```ts
get disabled(): boolean {
  return this.hasAttribute('disabled');
}
set disabled(val: boolean) {
  this.toggleAttribute('disabled', val);
}

// In _sync(): forward as a native property — never through _apply()
this._inner.disabled = this.hasAttribute('disabled');
```

### Law 3 — Token Validation

Validate with `in` before indexing. Never cast blindly.

```ts
// ✅ Validated
const next = key != null && key in classMap ? classMap[key as keyof typeof classMap] : null;

// ❌ Blind cast — throws on unknown token
const next = classMap[key as keyof typeof classMap];
```

### Law 4 — Idempotent `_sync()` + Mandatory Batching

**`_apply()` prevents class accumulation** by tracking the previously applied class per slot and doing an early-return if nothing changed:

```ts
private _prev: Record<string, string | null> = { variant: null, size: null };

private _apply(
  target: Element,
  prop: string,
  key: string | null,
  classMap: Record<string, string>,
): void {
  const next = key != null && key in classMap ? classMap[key] : null;
  const prev = this._prev[prop] ?? null;
  if (next === prev) return;
  if (prev) target.classList.remove(prev);
  if (next) target.classList.add(next);
  this._prev[prop] = next;
}
```

**`_scheduleSync()` batches simultaneous attribute changes** via `requestAnimationFrame`. Two attributes changing in the same tick without batching causes 2× DOM reflows per instance — 100 reflows on 50 instances. Batching is **mandatory for all components**:

```ts
private _syncScheduled = false;

private _scheduleSync(): void {
  if (this._syncScheduled) return;
  this._syncScheduled = true;
  requestAnimationFrame(() => {
    this._syncScheduled = false;
    this._sync();
  });
}
```

**Routing rule for `attributeChangedCallback`:**

| Attribute type | Route | Reason |
|---|---|---|
| `aria-*` | `_syncA11y()` **synchronously** | A screen reader can focus the element in the same microtask frame; a11y state cannot wait for RAF |
| All others | `_scheduleSync()` | Visual — safe to batch |

```ts
// Shadow DOM adapters (Template B / C) — always use the name-aware signature
attributeChangedCallback(name: string) {
  if (name.startsWith('aria-')) { this._syncA11y(); return; }
  this._scheduleSync();
}

// Light DOM adapters (Template A) — no aria-* in observedAttributes, no split needed
attributeChangedCallback() {
  this._scheduleSync();
}

// connectedCallback always calls _sync() directly — first paint must be synchronous
```

### Law 5 — TypeScript Integration

Always emit `declare global` with `HTMLElementTagNameMap`:

```ts
declare global {
  interface HTMLElementTagNameMap {
    'loom-button': LoomButton;
  }
}
```

### Law 6 — Shadow DOM v1 + Accessibility + Form Association

**Any component wrapping a native element must use Shadow DOM.**

```ts
// delegatesFocus: true — clicking the host forwards focus to the first focusable element inside
const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });
```

**`if (!this.shadowRoot)` guard is mandatory** — `connectedCallback` may be called multiple times (e.g. element moved in the DOM). Without the guard, the inner element is created twice.

**Accessibility — label association:** `<label for="id">` cannot cross the shadow boundary. Mirror `aria-labelledby` and `aria-label` from the host to the inner element:

```ts
private _syncA11y(): void {
  if (!this._inner) return;
  ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
    const val = this.getAttribute(attr);
    if (val) this._inner!.setAttribute(attr, val);
    else this._inner!.removeAttribute(attr);
  });
}
```

Add these to `observedAttributes`. **`_syncA11y()` must be called synchronously in `attributeChangedCallback` when `name.startsWith('aria-')`, bypassing `_scheduleSync()`.** It is also called inside `_sync()` to cover the first-connect case (see Law 4 routing table).

**Form-associated elements (Input, Select, Checkbox)** must use `ElementInternals`:

```ts
class LoomInput extends HTMLElement {
  static formAssociated = true;
  private _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals(); // must be in constructor
  }

  // Forward value and validity to the form
  private _syncForm(): void {
    if (!this._input) return;
    this._internals.setFormValue(this._input.value);
    if (!this._input.validity.valid) {
      this._internals.setValidity(this._input.validity, this._input.validationMessage, this._input);
    } else {
      this._internals.setValidity({});
    }
  }
}
```

> Button does NOT need `formAssociated` — its inner `<button>` already participates natively.

### Law 7 — Event Bridge

Inner element events do NOT cross the shadow boundary by default (`composed: false`). Re-dispatch as `CustomEvent` on the host with `bubbles: true, composed: true`. Stop the native event first so the raw event does not leak:

```ts
private readonly _handleChange = (e: Event): void => {
  e.stopPropagation();
  this.dispatchEvent(new CustomEvent('loom-change', {
    bubbles:  true,
    composed: true,
    detail:   { value: (e.target as HTMLInputElement).value },
  }));
};
```

Use `private readonly` arrow functions so the same reference can be removed in `disconnectedCallback`.

**Naming convention:** `click → loom-click`, `input → loom-input`, `change → loom-change`, `focus → loom-focus`, `blur → loom-blur`.

**`disconnectedCallback` is required** to remove these listeners and prevent memory leaks:

```ts
connectedCallback() {
  // ...
  this._inner.addEventListener('change', this._handleChange);
}

disconnectedCallback() {
  this._inner?.removeEventListener('change', this._handleChange);
}
```

### Law 8 — `adoptedStyleSheets` as Single Source of Truth (Shadow DOM only)

VE class names do not pierce the shadow boundary. The **only** accepted strategy is `adoptedStyleSheets`. Writing `:host([variant="..."])` CSS blocks inside the adapter is **forbidden** — it duplicates the `.css.ts` source of truth.

**Implementation — find the VE-injected sheet at runtime:**

```ts
// Module-level cache: one sheet reference per component class
let _sheet: CSSStyleSheet | null = null;

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (_sheet) return _sheet;
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((r) => r.cssText.includes(anchorClass))) {
        _sheet = sheet as unknown as CSSStyleSheet;
        return _sheet;
      }
    } catch { /* cross-origin sheet — skip */ }
  }
  return null;
}

// In connectedCallback, after attachShadow:
const sheet = getVESheet(styles.root);
if (sheet) shadow.adoptedStyleSheets = [sheet];
```

`styles.root` is a stable VE class that always exists. The sheet is found once per component class and cached — zero cost on subsequent instantiations.

**Timing guarantee:** With the default `@vanilla-extract/vite-plugin`, CSS is injected into `document.head` synchronously during module evaluation. Since the adapter module imports from `.css.ts` (which triggers the VE injection), `getVESheet` is guaranteed to find the sheet by the time `connectedCallback` fires in a standard Vite build.

**Microfrontend caveat:** If the VE stylesheet comes from a separately lazy-loaded bundle (e.g., shell + remote microfrontends), the sheet may not be present at adapter load time. Always include a null-guard with a `console.warn` so failures surface visibly:

```ts
const sheet = getVESheet(styles.root);
if (sheet) {
  shadow.adoptedStyleSheets = [sheet];
} else {
  // Only happens in microfrontend scenarios where the VE bundle loads after this adapter
  console.warn('[loom-[name]] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
}
```

---

## Required CSS Mapping Pattern

Before writing the adapter, the `.css.ts` file **must** export `styleVariants` class maps. If a required map is missing, **generate it first**.

```ts
// Box.css.ts
import { style, styleVariants } from '@vanilla-extract/css';
import { spacingVars } from '../../../tokens/spacing/spacing.tokens.css.ts';

export const root = style({ boxSizing: 'border-box' });
export const padding  = styleVariants(spacingVars, (val) => ({ padding:       val }));
export const paddingX = styleVariants(spacingVars, (val) => ({ paddingInline: val }));
export const paddingY = styleVariants(spacingVars, (val) => ({ paddingBlock:  val }));
```

For Shadow DOM components, the `host` class carries layout properties (the host is the visual box):

```ts
// Button.css.ts
export const host = style({
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  boxSizing: 'border-box',
  // NOT display: contents
});
```

---

## Template A — Light DOM (primitive containers)

Copy-pasteable. Replace `[Name]`, `[attr-N]`, `[prop-N]`, `[TokenKey]`, `[classMapN]`.

```ts
import * as styles from '../[Name].css.ts';
import type { [TokenKey] } from '../../../../tokens/index.ts';

class Loom[Name] extends HTMLElement {
  // ─── Observed attributes ─────────────────────────────────────────────────
  static observedAttributes = ['[attr-1]', '[attr-2]'] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────
  get [prop1](): [TokenKey] | null {
    return this.getAttribute('[attr-1]') as [TokenKey] | null;
  }
  set [prop1](val: [TokenKey] | null) {
    if (val == null) this.removeAttribute('[attr-1]');
    else this.setAttribute('[attr-1]', val);
  }

  get [prop2](): [TokenKey] | null {
    return this.getAttribute('[attr-2]') as [TokenKey] | null;
  }
  set [prop2](val: [TokenKey] | null) {
    if (val == null) this.removeAttribute('[attr-2]');
    else this.setAttribute('[attr-2]', val);
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  connectedCallback() {
    this.classList.add(styles.root);
    this._sync();
  }

  attributeChangedCallback() {
    this._scheduleSync();
  }

  // ─── Batching ─────────────────────────────────────────────────────────────
  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── State tracking ───────────────────────────────────────────────────────
  private _prev: Record<string, string | null> = {
    [prop1]: null,
    [prop2]: null,
  };

  // ─── Sync ─────────────────────────────────────────────────────────────────
  private _sync(): void {
    this._apply(this, '[prop1]', this.getAttribute('[attr-1]'), styles.[classMap1] as Record<string, string>);
    this._apply(this, '[prop2]', this.getAttribute('[attr-2]'), styles.[classMap2] as Record<string, string>);
  }

  private _apply(
    target: Element,
    prop: string,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const prev = this._prev[prop] ?? null;
    if (next === prev) return;
    if (prev) target.classList.remove(prev);
    if (next) target.classList.add(next);
    this._prev[prop] = next;
  }
}

customElements.define('loom-[name]', Loom[Name]);

declare global {
  interface HTMLElementTagNameMap {
    'loom-[name]': Loom[Name];
  }
}

export { Loom[Name] };
```

---

## Template B — Shadow DOM (native element wrappers)

Copy-pasteable. Demonstrates all 8 laws in one coherent example using a button-like component.
Replace `[Name]`, `[nativeTag]`, `[VariantKey]`, `[SizeKey]`, and class map references.

```ts
import * as styles from '../[Name].css.ts';
import type { [VariantKey], [SizeKey] } from '../[Name].types.ts';

// ─── Law 8: cache VE sheet reference at module scope ─────────────────────────
let _sheet: CSSStyleSheet | null = null;

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (_sheet) return _sheet;
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((r) => r.cssText.includes(anchorClass))) {
        _sheet = sheet as unknown as CSSStyleSheet;
        return _sheet;
      }
    } catch { /* cross-origin */ }
  }
  return null;
}

class Loom[Name] extends HTMLElement {
  private _inner: HTML[Native]Element | null = null;

  // ─── Observed attributes ─────────────────────────────────────────────────
  // Include aria-* for a11y forwarding (Law 6)
  static observedAttributes = [
    '[attr-1]', '[attr-2]', 'disabled',
    'aria-label', 'aria-labelledby', 'aria-describedby',
  ] as const;

  // ─── Getters / Setters — token attributes (Law 2) ────────────────────────
  get [prop1](): [VariantKey] {
    return (this.getAttribute('[attr-1]') as [VariantKey]) ?? '[default]';
  }
  set [prop1](val: [VariantKey]) {
    this.setAttribute('[attr-1]', val);
  }

  get [prop2](): [SizeKey] {
    return (this.getAttribute('[attr-2]') as [SizeKey]) ?? '[default]';
  }
  set [prop2](val: [SizeKey]) {
    this.setAttribute('[attr-2]', val);
  }

  // ─── Getters / Setters — boolean attribute (Law 2) ───────────────────────
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    this.toggleAttribute('disabled', val);
  }

  // ─── Event handlers — named references for cleanup (Law 7) ───────────────
  private readonly _handleClick = (e: MouseEvent): void => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('loom-click', {
      bubbles: true, composed: true, detail: {},
    }));
  };

  private readonly _handleFocus = (): void => {
    this.dispatchEvent(new CustomEvent('loom-focus', { bubbles: true, composed: true }));
  };

  private readonly _handleBlur = (): void => {
    this.dispatchEvent(new CustomEvent('loom-blur', { bubbles: true, composed: true }));
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  connectedCallback() {
    if (!this.shadowRoot) {
      // Law 6: delegatesFocus forwards host click → inner focus
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      // Law 8: adopt VE stylesheet so VE classes work inside the shadow
      const sheet = getVESheet(styles.root);
      if (sheet) {
        shadow.adoptedStyleSheets = [sheet];
      } else {
        console.warn('[loom-[name]] VE stylesheet not found — shadow styles will be missing.');
      }

      this._inner = document.createElement('[nativeTag]') as HTML[Native]Element;
      this._inner.setAttribute('part', '[name]'); // ::part([name]) hook for consumers
      this._inner.appendChild(document.createElement('slot'));
      shadow.appendChild(this._inner);

      // Law 1: host is the visual box — receives layout VE class
      this.classList.add(styles.host);
      // Inner element receives structural/root VE class
      this._inner.classList.add(styles.root);

      // Law 7: attach event bridge listeners
      this._inner.addEventListener('click',  this._handleClick);
      this._inner.addEventListener('focus',  this._handleFocus);
      this._inner.addEventListener('blur',   this._handleBlur);
    }
    this._sync();
  }

  // Law 7: remove listeners to prevent memory leaks
  disconnectedCallback() {
    this._inner?.removeEventListener('click',  this._handleClick);
    this._inner?.removeEventListener('focus',  this._handleFocus);
    this._inner?.removeEventListener('blur',   this._handleBlur);
  }

  // Law 4: aria-* must bypass RAF — a11y cannot wait for the next frame
  attributeChangedCallback(name: string) {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
    this._scheduleSync();
  }

  // ─── Batching (Law 4) ─────────────────────────────────────────────────────
  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── State tracking (Law 4) ───────────────────────────────────────────────
  private _prev: Record<string, string | null> = {
    [prop1]: null,
    [prop2]: null,
  };

  // ─── Sync (Laws 3, 4, 6) ─────────────────────────────────────────────────
  private _sync(): void {
    if (!this._inner) return; // guard: attributeChangedCallback before connectedCallback

    // Token attributes → class map lookup via _apply
    this._apply(this._inner, '[prop1]', this.getAttribute('[attr-1]') ?? '[default]', styles.[classMap1] as Record<string, string>);
    this._apply(this._inner, '[prop2]', this.getAttribute('[attr-2]') ?? '[default]', styles.[classMap2] as Record<string, string>);

    // Boolean attribute → native property forwarding (Law 2)
    (this._inner as HTMLButtonElement).disabled = this.hasAttribute('disabled');

    // Accessibility forwarding (Law 6)
    this._syncA11y();
  }

  // Law 6: forward a11y attributes from host to inner element
  private _syncA11y(): void {
    if (!this._inner) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._inner!.setAttribute(attr, val);
      else this._inner!.removeAttribute(attr);
    });
  }

  // Law 4: idempotent class swap
  private _apply(
    target: Element,
    prop: string,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const prev = this._prev[prop] ?? null;
    if (next === prev) return;
    if (prev) target.classList.remove(prev);
    if (next) target.classList.add(next);
    this._prev[prop] = next;
  }
}

customElements.define('loom-[name]', Loom[Name]);

declare global {
  interface HTMLElementTagNameMap {
    'loom-[name]': Loom[Name];
  }
}

export { Loom[Name] };
```

---

## Template C — Form-Associated Element (Input, Select, Checkbox, Radio)

Copy-pasteable. For any component that holds a **value** and must participate in native `<form>` submission and validation. Replace `[Name]`, `[nativeTag]`, `[VariantKey]`, `[SizeKey]`, and class map references.

Key differences from Template B:
- **`constructor()` is required** — `attachInternals()` must be called there, not in `connectedCallback`
- **`static formAssociated = true`** — opts the element into the ElementInternals form API
- **`value` property** — the form-submittable value, synced to `_internals.setFormValue()`
- **`formResetCallback()`** — browser calls this when the parent `<form>` resets
- **`formStateRestoreCallback()`** — browser calls this for autofill/session restore
- **Delegation of `checkValidity()` / `reportValidity()`** — so form validation works from the host

```ts
import * as styles from '../[Name].css.ts';
import type { [VariantKey], [SizeKey] } from '../[Name].types.ts';

// ─── Law 8: cache VE sheet reference at module scope ─────────────────────────
let _sheet: CSSStyleSheet | null = null;

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (_sheet) return _sheet;
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((r) => r.cssText.includes(anchorClass))) {
        _sheet = sheet as unknown as CSSStyleSheet;
        return _sheet;
      }
    } catch { /* cross-origin */ }
  }
  return null;
}

class Loom[Name] extends HTMLElement {
  // ─── Form association (Law 6) ─────────────────────────────────────────────
  static formAssociated = true;
  private _internals: ElementInternals;
  private _inner: HTML[Native]Element | null = null;

  // constructor is REQUIRED for form-associated elements
  constructor() {
    super();
    // attachInternals must be called in constructor — not in connectedCallback
    this._internals = this.attachInternals();
  }

  // ─── Observed attributes ─────────────────────────────────────────────────
  static observedAttributes = [
    '[attr-1]', '[attr-2]', 'disabled', 'required', 'readonly',
    'aria-label', 'aria-labelledby', 'aria-describedby',
  ] as const;

  // ─── Getters / Setters — token attributes (Law 2) ────────────────────────
  get [prop1](): [VariantKey] {
    return (this.getAttribute('[attr-1]') as [VariantKey]) ?? '[default]';
  }
  set [prop1](val: [VariantKey]) {
    this.setAttribute('[attr-1]', val);
  }

  // ─── Getters / Setters — boolean attributes (Law 2) ─────────────────────
  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { this.toggleAttribute('disabled', val); }

  get required(): boolean { return this.hasAttribute('required'); }
  set required(val: boolean) { this.toggleAttribute('required', val); }

  // ─── Value property ───────────────────────────────────────────────────────
  get value(): string {
    return (this._inner as HTMLInputElement | null)?.value ?? '';
  }
  set value(val: string) {
    if (this._inner) (this._inner as HTMLInputElement).value = val;
    this._internals.setFormValue(val);
  }

  // ─── Event handlers — named references for cleanup (Law 7) ───────────────
  private readonly _handleInput = (e: Event): void => {
    e.stopPropagation();
    const val = (e.target as HTMLInputElement).value;
    this._internals.setFormValue(val);
    this._syncValidity();
    this.dispatchEvent(new CustomEvent('loom-input', {
      bubbles: true, composed: true, detail: { value: val },
    }));
  };

  private readonly _handleChange = (e: Event): void => {
    e.stopPropagation();
    const val = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('loom-change', {
      bubbles: true, composed: true, detail: { value: val },
    }));
  };

  private readonly _handleFocus = (): void => {
    this.dispatchEvent(new CustomEvent('loom-focus', { bubbles: true, composed: true }));
  };

  private readonly _handleBlur = (): void => {
    this._syncValidity();
    this.dispatchEvent(new CustomEvent('loom-blur', { bubbles: true, composed: true }));
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  connectedCallback() {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      const sheet = getVESheet(styles.root);
      if (sheet) {
        shadow.adoptedStyleSheets = [sheet];
      } else {
        console.warn('[loom-[name]] VE stylesheet not found — shadow styles will be missing.');
      }

      this._inner = document.createElement('[nativeTag]') as HTML[Native]Element;
      this._inner.setAttribute('part', '[name]');
      shadow.appendChild(this._inner);

      this.classList.add(styles.host);
      this._inner.classList.add(styles.root);

      this._inner.addEventListener('input',  this._handleInput);
      this._inner.addEventListener('change', this._handleChange);
      this._inner.addEventListener('focus',  this._handleFocus);
      this._inner.addEventListener('blur',   this._handleBlur);
    }
    this._sync();
  }

  disconnectedCallback() {
    this._inner?.removeEventListener('input',  this._handleInput);
    this._inner?.removeEventListener('change', this._handleChange);
    this._inner?.removeEventListener('focus',  this._handleFocus);
    this._inner?.removeEventListener('blur',   this._handleBlur);
  }

  // Law 4: aria-* sync is synchronous — a11y cannot wait for RAF
  attributeChangedCallback(name: string) {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
    this._scheduleSync();
  }

  // ─── Form lifecycle callbacks ─────────────────────────────────────────────
  // Called by the browser when the parent <form> is reset
  formResetCallback() {
    if (this._inner) (this._inner as HTMLInputElement).value = '';
    this._internals.setFormValue('');
    this._internals.setValidity({});
  }

  // Called by the browser for autofill / session restore
  formStateRestoreCallback(state: string) {
    if (this._inner) (this._inner as HTMLInputElement).value = state;
    this._internals.setFormValue(state);
  }

  // ─── Public validation delegation ─────────────────────────────────────────
  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    return this._internals.reportValidity();
  }

  // ─── Batching (Law 4) ─────────────────────────────────────────────────────
  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── State tracking (Law 4) ───────────────────────────────────────────────
  private _prev: Record<string, string | null> = {
    [prop1]: null,
  };

  // ─── Sync (Laws 3, 4, 6) ─────────────────────────────────────────────────
  private _sync(): void {
    if (!this._inner) return;

    this._apply(this._inner, '[prop1]', this.getAttribute('[attr-1]') ?? '[default]', styles.[classMap1] as Record<string, string>);

    // Boolean attributes → native properties
    (this._inner as HTMLInputElement).disabled = this.hasAttribute('disabled');
    (this._inner as HTMLInputElement).required = this.hasAttribute('required');

    this._syncA11y();
  }

  // Law 6: forward a11y attributes synchronously from host to inner element
  private _syncA11y(): void {
    if (!this._inner) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._inner!.setAttribute(attr, val);
      else this._inner!.removeAttribute(attr);
    });
  }

  // Sync native validity state into ElementInternals so the form sees it
  private _syncValidity(): void {
    if (!this._inner) return;
    const input = this._inner as HTMLInputElement;
    if (!input.validity.valid) {
      this._internals.setValidity(input.validity, input.validationMessage, input);
    } else {
      this._internals.setValidity({});
    }
  }

  // Law 4: idempotent class swap
  private _apply(
    target: Element,
    prop: string,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const prev = this._prev[prop] ?? null;
    if (next === prev) return;
    if (prev) target.classList.remove(prev);
    if (next) target.classList.add(next);
    this._prev[prop] = next;
  }
}

customElements.define('loom-[name]', Loom[Name]);

declare global {
  interface HTMLElementTagNameMap {
    'loom-[name]': Loom[Name];
  }
}

export { Loom[Name] };
```

---

## Workflow

1. **Classify** — Template A, B, or C? (classification table above)
2. **Read `.css.ts`** — are the required `styleVariants` maps exported? If not, generate them first.
3. **Read `.types.ts`** — identify token key types for getters/setters.
4. **Write the adapter** — Template A (light DOM), B (Shadow DOM action), or C (Shadow DOM form-associated).
5. **Verify exports** — `index.ts` and `index.elements.ts`.
6. **Invoke `story` skill** for Storybook documentation.

---

## Checklist Before Finalizing

**General (all components)**
- [ ] No `this.style.*` anywhere — including `display: contents`
- [ ] Host element has a VE layout class (`root` or `host`) — never `display: contents`
- [ ] `observedAttributes` lists every reactive attribute
- [ ] Every observed attribute has a getter + setter
- [ ] `connectedCallback` calls `_sync()` directly
- [ ] `attributeChangedCallback` calls `_scheduleSync()`, never `_sync()`
- [ ] `_prev` tracks one entry per token attribute
- [ ] `_apply()` does `next === prev` early-return before any DOM mutation
- [ ] Token keys validated with `key in classMap` before indexing
- [ ] Boolean attributes use `toggleAttribute` in setter and `hasAttribute` in getter
- [ ] Boolean attributes forwarded as native properties in `_sync()` — never through `_apply()`
- [ ] `declare global` + `HTMLElementTagNameMap` present
- [ ] `.css.ts` exports `styleVariants` maps for every token used
- [ ] Adapter exported from `index.ts` / `index.elements.ts`

**Shadow DOM only**
- [ ] `attributeChangedCallback(name: string)` uses the name-aware signature — aria-* calls `_syncA11y()` synchronously; all others call `_scheduleSync()`
- [ ] `attachShadow({ mode: 'open', delegatesFocus: true })`
- [ ] `attachShadow` guarded with `if (!this.shadowRoot)`
- [ ] `_sync()` has `if (!this._inner) return` guard
- [ ] `<slot>` used for content projection — no `while (this.firstChild)` pattern
- [ ] Inner element has `part="[name]"` for consumer `::part()` hooks
- [ ] `getVESheet(styles.root)` called after `attachShadow` + assigned to `adoptedStyleSheets`
- [ ] Event listeners use `private readonly` arrow functions for identity stability
- [ ] `disconnectedCallback` removes all event listeners added in `connectedCallback`
- [ ] Inner events re-dispatched as `loom-[event]` with `bubbles: true, composed: true`
- [ ] `e.stopPropagation()` called before dispatching the `CustomEvent`
- [ ] `aria-label`, `aria-labelledby`, `aria-describedby` in `observedAttributes`
- [ ] `_syncA11y()` called inside `_sync()`

**Form-associated elements only (Input, Select, Checkbox, Radio) — Template C**
- [ ] `static formAssociated = true`
- [ ] `constructor()` present with `this._internals = this.attachInternals()` — cannot be in `connectedCallback`
- [ ] `value` getter reads from `this._inner.value`; setter writes to both `this._inner.value` and `_internals.setFormValue()`
- [ ] `_internals.setFormValue()` called on every `loom-input` event
- [ ] `_syncValidity()` calls `_internals.setValidity(input.validity, ...)` when invalid and `_internals.setValidity({})` when valid
- [ ] `_syncValidity()` called from both `_handleInput` and `_handleBlur`
- [ ] `formResetCallback()` resets `this._inner.value`, `setFormValue('')`, and `setValidity({})`
- [ ] `formStateRestoreCallback(state)` restores value and calls `setFormValue(state)`
- [ ] `checkValidity()` and `reportValidity()` delegate to `this._internals`
- [ ] `disabled` and `required` are in `observedAttributes` and forwarded as native properties in `_sync()`
- [ ] `loom-input` and `loom-change` events dispatched with `detail: { value }`
