import * as styles from '../Toast.css.ts';
import type { ToastType, ToastPosition, ToastDismissEventDetail, ToastActionEventDetail } from '../Toast.types.ts';
import { TOAST_TYPES, TOAST_POSITIONS } from '../Toast.types.ts';
import '../../../primitives/Link/adapters/Link.element.ts';
import {
  ICON_CLOSE,
  ICON_TOAST_ERROR,
  ICON_TOAST_INFO,
  ICON_TOAST_SUCCESS,
  ICON_TOAST_WARNING,
} from '../../../../icons/index.ts';

// ─── VE stylesheet adoption ───────────────────────────────────────────────────

const _sheetCache: Record<string, CSSStyleSheet | null> = {};

function cloneAsConstructedSheet(source: CSSStyleSheet): CSSStyleSheet | null {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(Array.from(source.cssRules).map((r) => r.cssText).join('\n'));
    return sheet;
  } catch {
    return null;
  }
}

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (anchorClass in _sheetCache) return _sheetCache[anchorClass];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((r) => r.cssText.includes(anchorClass))) {
        _sheetCache[anchorClass] = cloneAsConstructedSheet(sheet as CSSStyleSheet);
        return _sheetCache[anchorClass];
      }
    } catch {
      // cross-origin stylesheet — skip
    }
  }
  _sheetCache[anchorClass] = null;
  return null;
}

function getAdoptedStyleSheets(): CSSStyleSheet[] {
  return [getVESheet(styles.root)].filter((s): s is CSSStyleSheet => s != null);
}

// ─── Icons from central catalog ───────────────────────────────────────────────

const ICON_SVG: Record<ToastType, string> = {
  success: ICON_TOAST_SUCCESS,
  info:    ICON_TOAST_INFO,
  warning: ICON_TOAST_WARNING,
  error:   ICON_TOAST_ERROR,
};

const CLOSE_SVG = ICON_CLOSE;

const VALID_TYPES     = new Set<ToastType>(TOAST_TYPES);
const VALID_POSITIONS = new Set<ToastPosition>(TOAST_POSITIONS);

// ─── LoomToast ────────────────────────────────────────────────────────────────

class LoomToast extends HTMLElement {
  static observedAttributes = [
    'type',
    'title',
    'description',
    'dismissible',
    'action-label',
    'duration',
    'position',
  ] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get type(): ToastType {
    const val = this.getAttribute('type') as ToastType;
    return VALID_TYPES.has(val) ? val : 'info';
  }
  set type(val: ToastType) { this.setAttribute('type', val); }

  get title(): string {
    return this.getAttribute('title') ?? '';
  }
  set title(val: string) { this.setAttribute('title', val); }

  get description(): string | null {
    return this.getAttribute('description');
  }
  set description(val: string | null) {
    if (val == null) this.removeAttribute('description');
    else this.setAttribute('description', val);
  }

  get dismissible(): boolean {
    return this.getAttribute('dismissible') !== 'false';
  }
  set dismissible(val: boolean) {
    this.setAttribute('dismissible', String(val));
  }

  get actionLabel(): string | null {
    return this.getAttribute('action-label');
  }
  set actionLabel(val: string | null) {
    if (val == null) this.removeAttribute('action-label');
    else this.setAttribute('action-label', val);
  }

  get duration(): number {
    const val = parseInt(this.getAttribute('duration') ?? '0', 10);
    return isNaN(val) ? 0 : val;
  }
  set duration(val: number) { this.setAttribute('duration', String(val)); }

  get position(): ToastPosition | null {
    const val = this.getAttribute('position') as ToastPosition;
    return VALID_POSITIONS.has(val) ? val : null;
  }
  set position(val: ToastPosition | null) {
    if (val == null) this.removeAttribute('position');
    else this.setAttribute('position', val);
  }

  // ─── Shadow DOM elements ─────────────────────────────────────────────────

  private _headerEl:       HTMLDivElement | null    = null;
  private _iconWrapEl:     HTMLDivElement | null    = null;
  private _titleEl:        HTMLParagraphElement | null = null;
  private _descriptionEl:  HTMLParagraphElement | null = null;
  private _dismissBtnEl:   HTMLButtonElement | null = null;
  private _actionLinkEl:    HTMLElement | null = null;
  private _progressBarEl:  HTMLDivElement | null    = null;

  // ─── State ───────────────────────────────────────────────────────────────

  private _prev: Record<string, string | null> = { type: null, position: null };
  private _dismissTimer: ReturnType<typeof setTimeout> | null = null;
  private _dismissRemainingMs = 0;
  private _dismissStartedAtMs = 0;
  private _dismissListenersBound = false;
  private _isExiting = false;

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-toast] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      const inner = document.createElement('div');
      inner.classList.add(styles.inner);

      this._headerEl = document.createElement('div');
      const headerEl = this._headerEl;
      headerEl.classList.add(styles.header);

      this._iconWrapEl = document.createElement('div');
      this._iconWrapEl.classList.add(styles.iconWrap, styles.iconWrapColored);
      this._iconWrapEl.setAttribute('part', 'icon');
      this._iconWrapEl.setAttribute('aria-hidden', 'true');

      const contentEl = document.createElement('div');
      contentEl.classList.add(styles.content);
      contentEl.setAttribute('part', 'content');

      this._titleEl = document.createElement('p');
      this._titleEl.classList.add(styles.title);
      this._titleEl.setAttribute('part', 'title');

      this._descriptionEl = document.createElement('p');
      this._descriptionEl.classList.add(styles.description);
      this._descriptionEl.setAttribute('part', 'description');
      this._descriptionEl.hidden = true;

      contentEl.appendChild(this._titleEl);
      contentEl.appendChild(this._descriptionEl);

      this._dismissBtnEl = document.createElement('button');
      this._dismissBtnEl.classList.add(styles.dismissBtn);
      this._dismissBtnEl.setAttribute('part', 'dismiss');
      this._dismissBtnEl.setAttribute('type', 'button');
      this._dismissBtnEl.innerHTML = CLOSE_SVG;

      headerEl.appendChild(this._iconWrapEl);
      headerEl.appendChild(contentEl);
      headerEl.appendChild(this._dismissBtnEl);

      this._actionLinkEl = document.createElement('loom-link');
      this._actionLinkEl.classList.add(styles.actionLink);
      this._actionLinkEl.setAttribute('part', 'action');
      this._actionLinkEl.setAttribute('underline', 'hover');
      this._actionLinkEl.hidden = true;

      inner.appendChild(headerEl);
      inner.appendChild(this._actionLinkEl);

      const progressTrackEl = document.createElement('div');
      progressTrackEl.classList.add(styles.progressTrack);
      progressTrackEl.setAttribute('aria-hidden', 'true');

      this._progressBarEl = document.createElement('div');
      this._progressBarEl.classList.add(styles.progressBar);
      progressTrackEl.appendChild(this._progressBarEl);

      shadow.appendChild(inner);
      shadow.appendChild(progressTrackEl);

      this._dismissBtnEl.addEventListener('click', this._handleDismissClick);
      this._actionLinkEl.addEventListener('loom-click', this._handleActionClick);
    }

    this.classList.add(styles.root);
    this._sync();
    this._restartDismissTimer();
  }

  disconnectedCallback(): void {
    this._clearDismissTimer();
    this._unbindDismissInteractionListeners();
  }

  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
    if (name === 'duration') this._restartDismissTimer();
    this._scheduleSync();
  }

  // ─── Batching ─────────────────────────────────────────────────────────────

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    // Batch visual updates from rapid attribute/property changes before touching classes.
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Sync ─────────────────────────────────────────────────────────────────

  private _sync(): void {
    if (!this._iconWrapEl || !this._titleEl || !this._descriptionEl ||
        !this._dismissBtnEl || !this._actionLinkEl || !this._progressBarEl) return;

    const toastType   = this.type;
    const toastTitle  = this.title;
    const desc        = this.description;
    const isDismissible = this.dismissible;
    const actionLbl   = this.actionLabel;
    const pos         = this.position;

    // Type accent is set on the host so VE variables cascade into shadow DOM children.
    this._applyTo(this, this._prev, 'type', toastType, styles.rootTypeVariant as Record<string, string>);

    const expectedSvg = ICON_SVG[toastType];
    if (this._iconWrapEl.innerHTML.trim() !== expectedSvg.trim()) {
      this._iconWrapEl.innerHTML = expectedSvg;
    }

    this._titleEl.textContent = toastTitle;

    const hasDesc = desc != null && desc.length > 0;
    this._descriptionEl.hidden = !hasDesc;
    this._descriptionEl.textContent = hasDesc ? desc : '';
    this._headerEl!.classList.toggle(styles.headerCompact, !hasDesc);

    this._dismissBtnEl.hidden = !isDismissible;
    this._dismissBtnEl.setAttribute(
      'aria-label',
      this.getAttribute('aria-dismiss-label') ?? 'Cerrar notificación',
    );

    const hasAction = actionLbl != null && actionLbl.length > 0;
    this._actionLinkEl.hidden = !hasAction;
    this._actionLinkEl.textContent = hasAction ? actionLbl : '';

    if (pos != null) {
      this.classList.add(styles.positioned);
      this._applyTo(this, this._prev, 'position', pos, styles.positionVariant as Record<string, string>);
    } else {
      this.classList.remove(styles.positioned);
      this._applyTo(this, this._prev, 'position', null, styles.positionVariant as Record<string, string>);
    }

    // Error and warning are urgent announcements; success/info remain polite status updates.
    const isUrgent = toastType === 'error' || toastType === 'warning';
    this.setAttribute('role', isUrgent ? 'alert' : 'status');
    this.setAttribute('aria-live', isUrgent ? 'assertive' : 'polite');
    this.setAttribute('aria-atomic', 'true');

    this._syncA11y();
  }

  private _syncA11y(): void {
    if (!this._titleEl) return;
    // Public ARIA labels live on the host but the announced text node is inside shadow DOM.
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._titleEl!.setAttribute(attr, val);
      else this._titleEl!.removeAttribute(attr);
    });
  }

  // ─── Dismiss logic ────────────────────────────────────────────────────────

  private _handleDismissClick = (): void => {
    this._dismiss('user');
  };

  private _handleActionClick = (): void => {
    const label = this.actionLabel ?? '';
    const event = new CustomEvent<ToastActionEventDetail>('loom-toast-action', {
      bubbles: true,
      composed: true,
      detail: { label },
    });
    this.dispatchEvent(event);
    this._dismiss('action');
  };

  private _dismiss(reason: ToastDismissEventDetail['reason']): void {
    if (this._isExiting) return;
    this._isExiting = true;
    this._clearDismissTimer();
    this._unbindDismissInteractionListeners();

    this.classList.add(styles.exiting);

    const onEnd = (): void => {
      this.removeEventListener('animationend', onEnd);
      const event = new CustomEvent<ToastDismissEventDetail>('loom-toast-dismiss', {
        bubbles: true,
        composed: true,
        detail: { reason },
      });
      this.dispatchEvent(event);
    };

    // Dispatch after exit animation; fallback covers reduced motion or skipped animationend.
    this.addEventListener('animationend', onEnd, { once: true });
    setTimeout(onEnd, 400);
  }

  private _restartDismissTimer(): void {
    this._clearDismissTimer();

    const dur = this.duration;
    this._dismissRemainingMs = dur;
    this._dismissStartedAtMs = 0;

    if (dur <= 0 || this._isExiting) {
      this._unbindDismissInteractionListeners();
      if (this._progressBarEl) {
        this._progressBarEl.classList.remove(styles.progressBarAnimating);
        this._progressBarEl.style.animationDuration = '';
        this._progressBarEl.style.animationPlayState = '';
      }
      return;
    }

    // Start visual animation once, then only pause/resume play state with the timer.
    if (this._progressBarEl) {
      this._progressBarEl.classList.remove(styles.progressBarAnimating);
      // Force reflow so restarting the same animation class always takes effect.
      void this._progressBarEl.offsetWidth;
      this._progressBarEl.classList.add(styles.progressBarAnimating);
      this._progressBarEl.style.animationDuration = `${dur}ms`;
      this._progressBarEl.style.animationPlayState = 'running';
    }

    this._bindDismissInteractionListeners();
    this._scheduleDismissTimeout(this._dismissRemainingMs);
  }

  private _scheduleDismissTimeout(ms: number): void {
    if (ms <= 0) {
      this._dismiss('timeout');
      return;
    }
    this._dismissStartedAtMs = performance.now();
    this._dismissTimer = setTimeout(() => {
      this._dismiss('timeout');
    }, ms);
  }

  private _bindDismissInteractionListeners(): void {
    if (this._dismissListenersBound) return;
    this.addEventListener('mouseenter', this._pauseTimer);
    this.addEventListener('mouseleave', this._resumeTimer);
    this.addEventListener('focusin', this._pauseTimer);
    this.addEventListener('focusout', this._resumeTimer);
    this._dismissListenersBound = true;
  }

  private _unbindDismissInteractionListeners(): void {
    if (!this._dismissListenersBound) return;
    this.removeEventListener('mouseenter', this._pauseTimer);
    this.removeEventListener('mouseleave', this._resumeTimer);
    this.removeEventListener('focusin', this._pauseTimer);
    this.removeEventListener('focusout', this._resumeTimer);
    this._dismissListenersBound = false;
  }

  private _pauseTimer = (): void => {
    if (this._dismissTimer == null) return;

    const elapsedMs = Math.max(0, performance.now() - this._dismissStartedAtMs);
    this._dismissRemainingMs = Math.max(0, this._dismissRemainingMs - elapsedMs);
    this._clearDismissTimer();

    if (this._progressBarEl) {
      this._progressBarEl.style.animationPlayState = 'paused';
    }
  };

  private _resumeTimer = (): void => {
    if (this._isExiting || this.duration <= 0) return;
    if (this._dismissTimer != null) return;

    if (this._progressBarEl) {
      this._progressBarEl.style.animationPlayState = 'running';
    }

    this._scheduleDismissTimeout(this._dismissRemainingMs);
  };

  private _clearDismissTimer(): void {
    if (this._dismissTimer != null) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  dismiss(): void {
    this._dismiss('user');
  }

  // ─── Utility ─────────────────────────────────────────────────────────────

  private _applyTo(
    el: Element,
    prev: Record<string, string | null>,
    prop: string,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const old  = prev[prop] ?? null;
    if (next === old) return;
    if (old)  el.classList.remove(...old.split(/\s+/).filter(Boolean));
    if (next) el.classList.add(...next.split(/\s+/).filter(Boolean));
    prev[prop] = next;
  }
}

customElements.define('loom-toast', LoomToast);

declare global {
  interface HTMLElementTagNameMap {
    'loom-toast': LoomToast;
  }
}

export { LoomToast };
