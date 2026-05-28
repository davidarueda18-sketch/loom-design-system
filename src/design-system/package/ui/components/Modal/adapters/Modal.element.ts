import * as styles from '../Modal.css.ts';
import type { ModalSize, ModalCloseEventDetail } from '../Modal.types.ts';
import { MODAL_SIZES } from '../Modal.types.ts';
import { ICON_CLOSE } from '../../../../icons/index.ts';

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

let _hostSheet: CSSStyleSheet | null = null;

function getHostSheet(): CSSStyleSheet | null {
  if (_hostSheet) return _hostSheet;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`:host { display: contents; } :host([hidden]) { display: none; }`);
    _hostSheet = sheet;
    return sheet;
  } catch {
    return null;
  }
}

function getAdoptedStyleSheets(anchorClass: string): CSSStyleSheet[] {
  return [getHostSheet(), getVESheet(anchorClass)].filter(
    (s): s is CSSStyleSheet => s != null,
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_SIZES = new Set<ModalSize>(MODAL_SIZES);

let _uidCounter = 0;

// ─── LoomModal ────────────────────────────────────────────────────────────────

class LoomModal extends HTMLElement {
  static observedAttributes = [
    'open',
    'title',
    'size',
    'aria-label',
    'aria-describedby',
  ] as const;

  // ─── Getters / Setters ────────────────────────────────────────────────────

  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(val: boolean) {
    this.toggleAttribute('open', val);
  }

  get title(): string {
    return this.getAttribute('title') ?? '';
  }
  set title(val: string) {
    this.setAttribute('title', val);
  }

  get size(): ModalSize {
    const val = this.getAttribute('size') as ModalSize;
    return VALID_SIZES.has(val) ? val : 'md';
  }
  set size(val: ModalSize) {
    this.setAttribute('size', val);
  }

  // ─── Shadow DOM elements ──────────────────────────────────────────────────

  private _backdropEl: HTMLDivElement | null = null;
  private _dialogEl: HTMLDivElement | null = null;
  private _titleEl: HTMLParagraphElement | null = null;
  private _closeBtnEl: HTMLButtonElement | null = null;
  private _contentSlotEl: HTMLSlotElement | null = null;
  private _placeholderEl: HTMLParagraphElement | null = null;
  private _footerEl: HTMLDivElement | null = null;
  private _footerSlotEl: HTMLSlotElement | null = null;

  // ─── State ────────────────────────────────────────────────────────────────

  private _prev: Record<string, string | null> = { size: null };
  private _syncScheduled = false;
  private _isExiting = false;
  private _listenersAttached = false;
  private _triggerBeforeOpen: Element | null = null;
  private _uid = `modal-title-${++_uidCounter}`;

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open', delegatesFocus: true });

      const sheets = getAdoptedStyleSheets(styles.backdrop);
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn(
          '[loom-modal] VE stylesheet not found — shadow styles will be missing. ' +
            'Ensure the VE bundle is loaded before the adapter.',
        );
      }

      // ── Backdrop ──────────────────────────────────────────────────────────

      this._backdropEl = document.createElement('div');
      this._backdropEl.classList.add(styles.backdrop);
      this._backdropEl.setAttribute('part', 'backdrop');
      this._backdropEl.hidden = true;

      // ── Dialog ────────────────────────────────────────────────────────────

      this._dialogEl = document.createElement('div');
      this._dialogEl.classList.add(styles.dialog);
      this._dialogEl.setAttribute('part', 'dialog');
      this._dialogEl.setAttribute('role', 'dialog');
      this._dialogEl.setAttribute('aria-modal', 'true');
      this._dialogEl.setAttribute('aria-labelledby', this._uid);

      // ── Header ────────────────────────────────────────────────────────────

      const headerEl = document.createElement('div');
      headerEl.classList.add(styles.header);
      headerEl.setAttribute('part', 'header');

      this._titleEl = document.createElement('p');
      this._titleEl.classList.add(styles.titleEl);
      this._titleEl.setAttribute('part', 'title');
      this._titleEl.id = this._uid;

      this._closeBtnEl = document.createElement('button');
      this._closeBtnEl.classList.add(styles.closeBtn);
      this._closeBtnEl.setAttribute('part', 'close-btn');
      this._closeBtnEl.setAttribute('type', 'button');
      this._closeBtnEl.setAttribute('aria-label', 'Cerrar');
      this._closeBtnEl.innerHTML = ICON_CLOSE;

      headerEl.appendChild(this._titleEl);
      headerEl.appendChild(this._closeBtnEl);

      // ── Content ───────────────────────────────────────────────────────────

      const contentEl = document.createElement('div');
      contentEl.classList.add(styles.content);
      contentEl.setAttribute('part', 'content');

      this._contentSlotEl = document.createElement('slot');

      this._placeholderEl = document.createElement('p');
      this._placeholderEl.classList.add(styles.emptyPlaceholder);
      this._placeholderEl.setAttribute('part', 'empty-placeholder');
      this._placeholderEl.textContent = 'Aún no hay nada';

      contentEl.appendChild(this._contentSlotEl);
      contentEl.appendChild(this._placeholderEl);

      // ── Footer ────────────────────────────────────────────────────────────

      this._footerEl = document.createElement('div');
      this._footerEl.classList.add(styles.footer);
      this._footerEl.setAttribute('part', 'footer');
      this._footerEl.hidden = true;

      this._footerSlotEl = document.createElement('slot');
      this._footerSlotEl.name = 'footer';
      this._footerSlotEl.classList.add(styles.footerSlot);
      this._footerEl.appendChild(this._footerSlotEl);

      // ── Assemble ──────────────────────────────────────────────────────────

      this._dialogEl.appendChild(headerEl);
      this._dialogEl.appendChild(contentEl);
      this._dialogEl.appendChild(this._footerEl);
      this._backdropEl.appendChild(this._dialogEl);
      shadow.appendChild(this._backdropEl);

      // ── Event listeners ───────────────────────────────────────────────────

      this._closeBtnEl.addEventListener('click', this._handleCloseClick);
      this._backdropEl.addEventListener('click', this._handleBackdropClick);
      this._footerSlotEl.addEventListener('slotchange', this._handleFooterSlotChange);
      this._contentSlotEl.addEventListener('slotchange', this._handleContentSlotChange);

      // Initialize slot-dependent visibility immediately (assignedNodes is sync)
      this._handleFooterSlotChange();
      this._handleContentSlotChange();
    }

    this._sync();
  }

  disconnectedCallback(): void {
    this._detachDocumentListeners();
  }

  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) {
      this._syncA11y();
      return;
    }
    this._scheduleSync();
  }

  // ─── Batching ─────────────────────────────────────────────────────────────

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Sync ─────────────────────────────────────────────────────────────────

  private _sync(): void {
    if (
      !this._backdropEl ||
      !this._dialogEl ||
      !this._titleEl ||
      !this._closeBtnEl ||
      !this._footerEl
    )
      return;

    const isOpen = this.hasAttribute('open');

    // Backdrop visibility
    this._backdropEl.hidden = !isOpen;

    // Size variant on dialog
    this._apply('size', this._dialogEl, this.size, styles.sizeVariant as Record<string, string>);

    // Title text
    const titleText = this.title;
    this._titleEl.textContent = titleText;
    this._titleEl.hidden = !titleText;

    // Focus management on open/close transitions
    if (isOpen && !this._listenersAttached) {
      this._triggerBeforeOpen = document.activeElement;
      this._attachDocumentListeners();
      this._listenersAttached = true;
      // Focus the close button on next frame so the dialog is visible first
      requestAnimationFrame(() => {
        this._closeBtnEl?.focus();
      });
    } else if (!isOpen && this._listenersAttached) {
      this._detachDocumentListeners();
      this._listenersAttached = false;
    }

    this._syncA11y();
  }

  private _syncA11y(): void {
    if (!this._dialogEl || !this._closeBtnEl) return;

    const describedBy = this.getAttribute('aria-describedby');
    if (describedBy) this._dialogEl.setAttribute('aria-describedby', describedBy);
    else this._dialogEl.removeAttribute('aria-describedby');

    const ariaLabel = this.getAttribute('aria-label');
    this._closeBtnEl.setAttribute('aria-label', ariaLabel ?? 'Cerrar');
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private _handleCloseClick = (): void => {
    this._closeModal('close');
  };

  private _handleBackdropClick = (e: MouseEvent): void => {
    if (e.target === this._backdropEl) {
      this._closeModal('backdrop');
    }
  };

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this._closeModal('escape');
    }
  };

  private _handleFooterSlotChange = (): void => {
    const hasContent = (this._footerSlotEl?.assignedElements({ flatten: true }).length ?? 0) > 0;
    if (this._footerEl) this._footerEl.hidden = !hasContent;
  };

  private _handleContentSlotChange = (): void => {
    const assignedNodes = this._contentSlotEl?.assignedNodes({ flatten: true }) ?? [];
    const hasContent = assignedNodes.some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() !== '';
      return node.nodeType === Node.ELEMENT_NODE;
    });
    if (this._placeholderEl) this._placeholderEl.hidden = hasContent;
  };

  // ─── Focus trap ───────────────────────────────────────────────────────────

  private _getFocusable(): HTMLElement[] {
    const shadowFocusable = this._closeBtnEl ? [this._closeBtnEl] : [];

    const slotted = this._footerSlotEl?.assignedElements() ?? [];
    const lightFocusable = slotted.flatMap((el) => {
      const inner = Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [tabindex]:not([tabindex="-1"]), a[href], input:not(:disabled)',
        ),
      );
      return inner.length > 0 ? inner : [el as HTMLElement];
    });

    return [...shadowFocusable, ...lightFocusable];
  }

  private _focusTrap = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    const focusable = this._getFocusable();
    if (focusable.length <= 1) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const shadowActive = this.shadowRoot?.activeElement;
    const lightActive = document.activeElement;

    const isOnFirst = shadowActive === first || lightActive === first;
    const isOnLast = shadowActive === last || lightActive === last;

    if (e.shiftKey && isOnFirst) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && isOnLast) {
      e.preventDefault();
      first.focus();
    }
  };

  // ─── Document listener management ─────────────────────────────────────────

  private _attachDocumentListeners(): void {
    document.addEventListener('keydown', this._handleKeydown, { capture: true });
    document.addEventListener('keydown', this._focusTrap);
  }

  private _detachDocumentListeners(): void {
    document.removeEventListener('keydown', this._handleKeydown, {
      capture: true,
    } as EventListenerOptions);
    document.removeEventListener('keydown', this._focusTrap);
  }

  // ─── Close modal ──────────────────────────────────────────────────────────

  private _closeModal(reason: ModalCloseEventDetail['reason']): void {
    if (this._isExiting) return;
    this._isExiting = true;

    this._backdropEl?.classList.add(styles.backdropExiting);
    this._dialogEl?.classList.add(styles.dialogExiting);

    this._detachDocumentListeners();
    this._listenersAttached = false;

    if (this._triggerBeforeOpen instanceof HTMLElement) {
      this._triggerBeforeOpen.focus();
    }

    let ended = false;

    const onEnd = (e?: Event): void => {
      // Ignore animationend events bubbling from children
      if (e instanceof AnimationEvent && e.target !== this._backdropEl) return;
      if (ended) return;
      ended = true;

      this._backdropEl?.removeEventListener('animationend', onEnd);
      // Hide before removing exit classes — prevents entry animation from replaying
      if (this._backdropEl) this._backdropEl.hidden = true;
      this._backdropEl?.classList.remove(styles.backdropExiting);
      this._dialogEl?.classList.remove(styles.dialogExiting);
      this._isExiting = false;

      this.removeAttribute('open');

      this.dispatchEvent(
        new CustomEvent<ModalCloseEventDetail>('loom-modal-close', {
          bubbles: true,
          composed: true,
          detail: { reason },
        }),
      );
    };

    this._backdropEl?.addEventListener('animationend', onEnd);
    setTimeout(onEnd, 350);
  }

  // ─── Utility ──────────────────────────────────────────────────────────────

  private _apply(
    prop: string,
    el: Element,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const old = this._prev[prop] ?? null;
    if (next === old) return;
    if (old) el.classList.remove(...old.split(/\s+/).filter(Boolean));
    if (next) el.classList.add(...next.split(/\s+/).filter(Boolean));
    this._prev[prop] = next;
  }
}

customElements.define('loom-modal', LoomModal);

declare global {
  interface HTMLElementTagNameMap {
    'loom-modal': LoomModal;
  }
}

export { LoomModal };
