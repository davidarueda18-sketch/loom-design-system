import * as styles from '../FileDropzone.css.ts';
import type {
  FileDropzoneItem,
  FileDropzoneItemState,
  FileDropzoneRejection,
  FilesSelectedEventDetail,
  FilesRejectedEventDetail,
  FileRemoveEventDetail,
} from '../FileDropzone.types.ts';

const _sheetCache: Record<string, CSSStyleSheet | null> = {};

function cloneAsConstructedSheet(source: CSSStyleSheet): CSSStyleSheet | null {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(Array.from(source.cssRules).map((rule) => rule.cssText).join('\n'));
    return sheet;
  } catch {
    return null;
  }
}

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (anchorClass in _sheetCache) return _sheetCache[anchorClass];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((rule) => rule.cssText.includes(anchorClass))) {
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
  return [getVESheet(styles.root)].filter((sheet): sheet is CSSStyleSheet => sheet != null);
}

const DEFAULT_DOWNLOAD_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <path d="M12 3v12"/>
  <path d="M7 10l5 5 5-5"/>
  <path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
</svg>`;

const REMOVE_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <path d="M6 6l12 12"/>
  <path d="M6 18L18 6"/>
</svg>`;

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  const rounded = value < 10 ? value.toFixed(1) : Math.round(value).toString();
  return `${rounded.replace('.0', '')}${units[i]}`;
}

function matchesAccept(file: File, accept: string): boolean {
  if (!accept) return true;
  const tokens = accept.split(',').map((t) => t.trim()).filter(Boolean);
  if (tokens.length === 0) return true;
  const fileType = file.type || '';
  const fileName = file.name.toLowerCase();
  return tokens.some((token) => {
    const lower = token.toLowerCase();
    if (lower.startsWith('.')) return fileName.endsWith(lower);
    if (lower.endsWith('/*')) {
      const prefix = lower.slice(0, lower.length - 1);
      return fileType.toLowerCase().startsWith(prefix);
    }
    return fileType.toLowerCase() === lower;
  });
}

class LoomFileDropzone extends HTMLElement {
  static observedAttributes = [
    'multiple',
    'auto-complete',
    'accept',
    'max-size',
    'max-files',
    'label',
    'description',
    'disabled',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
  ] as const;

  get multiple(): boolean {
    return this.hasAttribute('multiple');
  }
  set multiple(value: boolean) {
    this.toggleAttribute('multiple', value);
  }

  get autoComplete(): boolean {
    return this.hasAttribute('auto-complete');
  }
  set autoComplete(value: boolean) {
    this.toggleAttribute('auto-complete', value);
  }

  get accept(): string {
    return this.getAttribute('accept') ?? '';
  }
  set accept(value: string) {
    if (value) this.setAttribute('accept', value);
    else this.removeAttribute('accept');
  }

  get maxSize(): number {
    const attr = this.getAttribute('max-size');
    if (!attr) return 0;
    const n = Number(attr);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  set maxSize(value: number) {
    if (value > 0) this.setAttribute('max-size', String(value));
    else this.removeAttribute('max-size');
  }

  get maxFiles(): number {
    const attr = this.getAttribute('max-files');
    if (!attr) return 0;
    const n = Number(attr);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }
  set maxFiles(value: number) {
    if (value > 0) this.setAttribute('max-files', String(Math.floor(value)));
    else this.removeAttribute('max-files');
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }
  set label(value: string) {
    if (value) this.setAttribute('label', value);
    else this.removeAttribute('label');
  }

  get description(): string {
    return this.getAttribute('description') ?? '';
  }
  set description(value: string) {
    if (value) this.setAttribute('description', value);
    else this.removeAttribute('description');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  private _items: FileDropzoneItem[] = [];
  private _dragCounter = 0;

  get files(): ReadonlyArray<FileDropzoneItem> {
    return this._items.slice();
  }

  private _dropzoneEl: HTMLDivElement | null = null;
  private _labelEl: HTMLParagraphElement | null = null;
  private _descriptionEl: HTMLParagraphElement | null = null;
  private _filesEl: HTMLUListElement | null = null;
  private _inputEl: HTMLInputElement | null = null;

  private readonly _handleDropzoneClick = (event: MouseEvent): void => {
    if (this.disabled) return;
    if (event.target instanceof HTMLElement && event.target.closest('loom-icon-button')) return;
    this._openPicker();
  };

  private readonly _handleDropzoneKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._openPicker();
    }
  };

  private readonly _handleDragEnter = (event: DragEvent): void => {
    if (this.disabled) return;
    event.preventDefault();
    this._dragCounter += 1;
    this._dropzoneEl?.classList.add(styles.dropzoneDragOver);
  };

  private readonly _handleDragOver = (event: DragEvent): void => {
    if (this.disabled) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  };

  private readonly _handleDragLeave = (event: DragEvent): void => {
    if (this.disabled) return;
    event.preventDefault();
    this._dragCounter = Math.max(0, this._dragCounter - 1);
    if (this._dragCounter === 0) {
      this._dropzoneEl?.classList.remove(styles.dropzoneDragOver);
    }
  };

  private readonly _handleDrop = (event: DragEvent): void => {
    if (this.disabled) return;
    event.preventDefault();
    this._dragCounter = 0;
    this._dropzoneEl?.classList.remove(styles.dropzoneDragOver);
    const list = event.dataTransfer?.files;
    if (list && list.length > 0) this._ingestFiles(list);
  };

  private readonly _handleInputChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) this._ingestFiles(target.files);
    target.value = '';
  };

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-file-dropzone] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      this._inputEl = document.createElement('input');
      this._inputEl.type = 'file';
      this._inputEl.classList.add(styles.fileInput);
      this._inputEl.setAttribute('part', 'file-input');
      this._inputEl.setAttribute('aria-hidden', 'true');
      this._inputEl.tabIndex = -1;
      this._inputEl.addEventListener('change', this._handleInputChange);

      this._dropzoneEl = document.createElement('div');
      this._dropzoneEl.classList.add(styles.dropzone);
      this._dropzoneEl.setAttribute('part', 'dropzone');
      this._dropzoneEl.setAttribute('role', 'button');
      this._dropzoneEl.tabIndex = 0;

      const iconWrapper = document.createElement('div');
      iconWrapper.classList.add(styles.icon);
      iconWrapper.setAttribute('part', 'icon');
      const iconSlot = document.createElement('slot');
      iconSlot.name = 'icon';
      const defaultIcon = document.createElement('span');
      defaultIcon.setAttribute('aria-hidden', 'true');
      defaultIcon.innerHTML = DEFAULT_DOWNLOAD_ICON_SVG;
      iconSlot.appendChild(defaultIcon);
      iconWrapper.appendChild(iconSlot);

      this._labelEl = document.createElement('p');
      this._labelEl.classList.add(styles.label);
      this._labelEl.setAttribute('part', 'label');

      this._descriptionEl = document.createElement('p');
      this._descriptionEl.classList.add(styles.description);
      this._descriptionEl.setAttribute('part', 'description');

      this._dropzoneEl.appendChild(iconWrapper);
      this._dropzoneEl.appendChild(this._labelEl);
      this._dropzoneEl.appendChild(this._descriptionEl);

      this._dropzoneEl.addEventListener('click', this._handleDropzoneClick);
      this._dropzoneEl.addEventListener('keydown', this._handleDropzoneKeydown);
      this._dropzoneEl.addEventListener('dragenter', this._handleDragEnter);
      this._dropzoneEl.addEventListener('dragover', this._handleDragOver);
      this._dropzoneEl.addEventListener('dragleave', this._handleDragLeave);
      this._dropzoneEl.addEventListener('drop', this._handleDrop);

      this._filesEl = document.createElement('ul');
      this._filesEl.classList.add(styles.files);
      this._filesEl.setAttribute('part', 'files');
      this._filesEl.hidden = true;

      shadow.appendChild(this._inputEl);
      shadow.appendChild(this._dropzoneEl);
      shadow.appendChild(this._filesEl);
    }

    this.classList.add(styles.root);
    this._sync();
  }

  disconnectedCallback(): void {
    this._dropzoneEl?.removeEventListener('click', this._handleDropzoneClick);
    this._dropzoneEl?.removeEventListener('keydown', this._handleDropzoneKeydown);
    this._dropzoneEl?.removeEventListener('dragenter', this._handleDragEnter);
    this._dropzoneEl?.removeEventListener('dragover', this._handleDragOver);
    this._dropzoneEl?.removeEventListener('dragleave', this._handleDragLeave);
    this._dropzoneEl?.removeEventListener('drop', this._handleDrop);
    this._inputEl?.removeEventListener('change', this._handleInputChange);
  }

  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) {
      // ARIA updates should bypass RAF so assistive metadata remains up-to-date.
      this._syncA11y();
      return;
    }
    this._scheduleSync();
  }

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  private _sync(): void {
    if (!this._dropzoneEl || !this._labelEl || !this._descriptionEl || !this._inputEl) return;

    if (this.multiple) this._inputEl.setAttribute('multiple', '');
    else this._inputEl.removeAttribute('multiple');

    if (this.accept) this._inputEl.setAttribute('accept', this.accept);
    else this._inputEl.removeAttribute('accept');

    this._inputEl.disabled = this.disabled;

    const isDisabled = this.disabled;
    this._dropzoneEl.classList.toggle(styles.dropzoneDisabled, isDisabled);
    this._dropzoneEl.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
    this._dropzoneEl.tabIndex = isDisabled ? -1 : 0;

    const labelText = this.label;
    this._labelEl.textContent = labelText;
    this._labelEl.hidden = labelText.length === 0;

    const descriptionText = this.description;
    this._descriptionEl.textContent = descriptionText;
    this._descriptionEl.hidden = descriptionText.length === 0;

    this._syncA11y();
  }

  private _syncA11y(): void {
    if (!this._dropzoneEl) return;
    const explicitLabel = this.getAttribute('aria-label');
    const labelledBy = this.getAttribute('aria-labelledby');
    const describedBy = this.getAttribute('aria-describedby');

    if (labelledBy) {
      this._dropzoneEl.setAttribute('aria-labelledby', labelledBy);
    } else {
      this._dropzoneEl.removeAttribute('aria-labelledby');
    }

    if (describedBy) {
      this._dropzoneEl.setAttribute('aria-describedby', describedBy);
    } else {
      this._dropzoneEl.removeAttribute('aria-describedby');
    }

    if (explicitLabel) {
      this._dropzoneEl.setAttribute('aria-label', explicitLabel);
    } else if (!labelledBy) {
      // Fallback keeps the control announced even when no explicit ARIA wiring is provided.
      const labelText = this.label || 'File upload';
      const descriptionText = this.description;
      const fallback = descriptionText
        ? `${labelText}. ${descriptionText}. Drop files or press Enter to browse.`
        : `${labelText}. Drop files or press Enter to browse.`;
      this._dropzoneEl.setAttribute('aria-label', fallback);
    } else {
      this._dropzoneEl.removeAttribute('aria-label');
    }
  }

  private _openPicker(): void {
    if (!this._inputEl) return;
    this._inputEl.click();
  }

  private _ingestFiles(list: FileList): void {
    const incoming = Array.from(list);
    const accepted: FileDropzoneItem[] = [];
    const rejected: FileDropzoneRejection[] = [];

    const cap = this.maxFiles;
    const capacityLeft = this.multiple && cap > 0
      ? Math.max(0, cap - this._items.length)
      : Number.POSITIVE_INFINITY;
    let acceptedCount = 0;
    const initial: Pick<FileDropzoneItem, 'state' | 'progress'> = this.autoComplete
      ? { state: 'complete', progress: 100 }
      : { state: 'uploading', progress: 0 };

    for (const file of incoming) {
      if (this.maxSize > 0 && file.size > this.maxSize) {
        rejected.push({
          file,
          reason: 'size',
          message: `File exceeds the maximum size of ${formatBytes(this.maxSize)}.`,
        });
        continue;
      }
      if (this.accept && !matchesAccept(file, this.accept)) {
        rejected.push({
          file,
          reason: 'type',
          message: `File type does not match accepted formats (${this.accept}).`,
        });
        continue;
      }
      if (acceptedCount >= capacityLeft) {
        rejected.push({
          file,
          reason: 'count',
          message: `Maximum ${cap} files allowed.`,
        });
        continue;
      }
      accepted.push({
        id: generateId(),
        file,
        ...initial,
      });
      acceptedCount += 1;
    }

    if (rejected.length > 0) {
      const detail: FilesRejectedEventDetail = { rejections: rejected };
      this.dispatchEvent(new CustomEvent('loom-files-rejected', {
        bubbles: true,
        composed: true,
        detail,
      }));
    }

    if (accepted.length === 0) return;

    if (this.multiple) {
      this._items = this._items.concat(accepted);
    } else {
      this._items = accepted.slice(0, 1);
    }

    this._renderFiles();

    const detail: FilesSelectedEventDetail = { items: accepted.map((item) => ({ ...item })) };
    this.dispatchEvent(new CustomEvent('loom-files-selected', {
      bubbles: true,
      composed: true,
      detail,
    }));
  }

  private _renderFiles(): void {
    if (!this._filesEl) return;
    this._filesEl.replaceChildren();

    if (this._items.length === 0) {
      this._filesEl.hidden = true;
      return;
    }

    for (const item of this._items) {
      this._filesEl.appendChild(this._createRow(item));
    }
    this._filesEl.hidden = false;
  }

  private _createRow(item: FileDropzoneItem): HTMLLIElement {
    const row = document.createElement('li');
    row.classList.add(styles.fileRow);
    row.setAttribute('part', 'file');
    row.dataset.id = item.id;
    row.dataset.state = item.state;

    const header = document.createElement('div');
    header.classList.add(styles.fileHeader);

    const name = document.createElement('span');
    name.classList.add(styles.fileName);
    name.setAttribute('part', 'file-name');
    name.textContent = item.file.name;
    name.title = item.file.name;

    const removeBtn = document.createElement('loom-icon-button');
    removeBtn.classList.add(styles.removeButton);
    removeBtn.setAttribute('part', 'remove-button');
    removeBtn.setAttribute('variant', 'ghost');
    removeBtn.setAttribute('size', 'sm');
    removeBtn.setAttribute('aria-label', `Remove ${item.file.name}`);
    removeBtn.innerHTML = REMOVE_ICON_SVG;
    removeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      this._emitRemove(item.id);
      this.removeFile(item.id);
    });

    header.appendChild(name);
    header.appendChild(removeBtn);

    const meta = document.createElement('div');
    meta.classList.add(styles.fileMeta);
    meta.setAttribute('part', 'file-meta');
    meta.appendChild(this._createMetaSecondary(item));
    meta.appendChild(this._createMetaPrimary(item));

    const progress = document.createElement('loom-progress-linear');
    progress.classList.add(styles.fileProgress);
    progress.setAttribute('part', 'file-progress');
    progress.setAttribute('max', '100');
    progress.setAttribute('value', String(Math.round(item.progress)));
    progress.setAttribute('color', this._progressColorFor(item.state));
    progress.setAttribute('thickness', 'sm');

    row.appendChild(header);
    row.appendChild(meta);
    row.appendChild(progress);
    return row;
  }

  private _createMetaSecondary(item: FileDropzoneItem): HTMLSpanElement {
    const el = document.createElement('span');
    el.classList.add(styles.fileMetaSecondary);
    const parts = [formatBytes(item.file.size)];
    if (item.state === 'uploading' && typeof item.remainingSeconds === 'number') {
      parts.push(`${Math.max(0, Math.round(item.remainingSeconds))}s remaining`);
    }
    if (item.state === 'error' && item.error) {
      parts.push(item.error);
    }
    el.textContent = parts.join(' · ');
    return el;
  }

  private _createMetaPrimary(item: FileDropzoneItem): HTMLSpanElement {
    const el = document.createElement('span');
    el.classList.add(item.state === 'error' ? styles.fileMetaError : styles.fileMetaPrimary);
    if (item.state === 'error') el.textContent = 'Error';
    else el.textContent = `${Math.round(item.progress)}%`;
    return el;
  }

  private _progressColorFor(state: FileDropzoneItemState): string {
    if (state === 'error') return 'feedbackDanger';
    if (state === 'complete') return 'feedbackSuccess';
    return 'brandAccent';
  }

  private _emitRemove(id: string): void {
    const item = this._items.find((it) => it.id === id);
    if (!item) return;
    const detail: FileRemoveEventDetail = { id, file: item.file };
    this.dispatchEvent(new CustomEvent('loom-file-remove', {
      bubbles: true,
      composed: true,
      detail,
    }));
  }

  updateProgress(id: string, progress: number, remainingSeconds?: number): void {
    const item = this._items.find((it) => it.id === id);
    if (!item) return;
    const clamped = Math.max(0, Math.min(100, progress));
    item.progress = clamped;
    if (typeof remainingSeconds === 'number') item.remainingSeconds = remainingSeconds;
    if (item.state === 'idle') item.state = 'uploading';
    this._renderFiles();
  }

  completeFile(id: string): void {
    const item = this._items.find((it) => it.id === id);
    if (!item) return;
    item.state = 'complete';
    item.progress = 100;
    item.remainingSeconds = undefined;
    this._renderFiles();
  }

  failFile(id: string, message?: string): void {
    const item = this._items.find((it) => it.id === id);
    if (!item) return;
    item.state = 'error';
    item.error = message;
    item.remainingSeconds = undefined;
    this._renderFiles();
  }

  removeFile(id: string): void {
    const before = this._items.length;
    this._items = this._items.filter((it) => it.id !== id);
    if (this._items.length !== before) this._renderFiles();
  }

  clear(): void {
    if (this._items.length === 0) return;
    this._items = [];
    this._renderFiles();
  }
}

customElements.define('loom-file-dropzone', LoomFileDropzone);

declare global {
  interface HTMLElementTagNameMap {
    'loom-file-dropzone': LoomFileDropzone;
  }
}

export { LoomFileDropzone };
