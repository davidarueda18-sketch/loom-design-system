import * as styles from '../Button.css.ts';
import * as textStyles from '../../Text/Text.css.ts';
import type { ButtonVariant, ButtonSize } from '../Button.types.ts';
import type { TypographyTokenKey } from '../../../../tokens/index.ts';

const labelVariant: Record<ButtonSize, TypographyTokenKey> = {
  sm: 'labelSm',
  md: 'labelBase',
  lg: 'labelLg',
};

class LoomButton extends HTMLElement {
  private _button: HTMLButtonElement | null = null;
  private _label: HTMLSpanElement | null = null;

  // ─── Observed attributes (drives HTML / Vue reactivity) ──────────────────
  static observedAttributes = ['variant', 'size', 'disabled'] as const;

  // ─── Getters / Setters (drives Angular / JS property reactivity) ─────────
  get variant(): ButtonVariant {
    return (this.getAttribute('variant') as ButtonVariant) ?? 'primary';
  }
  set variant(val: ButtonVariant) {
    this.setAttribute('variant', val);
  }

  get size(): ButtonSize {
    return (this.getAttribute('size') as ButtonSize) ?? 'md';
  }
  set size(val: ButtonSize) {
    this.setAttribute('size', val);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  connectedCallback() {
    if (!this._button) {
      this._label = document.createElement('span');
      while (this.firstChild) this._label.appendChild(this.firstChild);

      this._button = document.createElement('button');
      this._button.type = 'button';
      this._button.appendChild(this._label);
      this.appendChild(this._button);

      // Host is transparent; inner <button> carries all visual classes
      this.classList.add(styles.host);
      this._button.classList.add(styles.root);
    }
    this._sync();
  }

  attributeChangedCallback() {
    this._sync();
  }

  // ─── State tracking (idempotent _sync) ───────────────────────────────────
  private _prev: Record<string, string | null> = {
    variant: null,
    size: null,
  };

  // ─── Sync logic ───────────────────────────────────────────────────────────
  private _sync(): void {
    if (!this._button || !this._label) return;

    const variantKey = this.getAttribute('variant') ?? 'primary';
    const sizeKey    = this.getAttribute('size')    ?? 'md';

    this._apply(this._button, 'variant', variantKey, styles.variant as Record<string, string>);
    this._apply(this._button, 'size',    sizeKey,    styles.size    as Record<string, string>);

    this._button.disabled = this.hasAttribute('disabled');

    // Typography class on label mirrors the button size
    const typographyKey: TypographyTokenKey = sizeKey in labelVariant
      ? labelVariant[sizeKey as ButtonSize]
      : labelVariant.md;
    this._label.className = textStyles.variants[typographyKey];
  }

  // _apply targets the inner <button>, not the host element
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

customElements.define('loom-button', LoomButton);

declare global {
  interface HTMLElementTagNameMap {
    'loom-button': LoomButton;
  }
}

export { LoomButton };
