import { describe, expect, test } from 'vitest';
import './FileDropzone.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function toFileList(files: File[]): FileList {
  const dt = new DataTransfer();
  files.forEach((file) => dt.items.add(file));
  return dt.files;
}

describe('LoomFileDropzone', () => {
  test('renders dropzone button semantics and fallback aria label', async () => {
    const dropzone = document.createElement('loom-file-dropzone');
    dropzone.setAttribute('label', 'Upload docs');
    dropzone.setAttribute('description', 'PDF only');
    document.body.appendChild(dropzone);
    await waitForFrame();

    const root = dropzone.shadowRoot?.querySelector('[part="dropzone"]') as HTMLDivElement;
    expect(root.getAttribute('role')).toBe('button');
    expect(root.getAttribute('aria-label')).toContain('Upload docs');
    expect(root.getAttribute('aria-label')).toContain('Drop files');
  });

  test('ingests accepted files and emits selected event', async () => {
    const dropzone = document.createElement('loom-file-dropzone');
    dropzone.setAttribute('multiple', '');
    document.body.appendChild(dropzone);
    await waitForFrame();

    const selected: Array<{ items: Array<{ id: string }> }> = [];
    dropzone.addEventListener('loom-files-selected', (event) => {
      selected.push((event as CustomEvent<{ items: Array<{ id: string }> }>).detail);
    });

    const input = dropzone.shadowRoot?.querySelector('[part="file-input"]') as HTMLInputElement;
    const fileA = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const fileB = new File(['world'], 'world.txt', { type: 'text/plain' });

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: toFileList([fileA, fileB]),
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));
    await waitForFrame();

    const filesList = dropzone.shadowRoot?.querySelector('[part="files"]') as HTMLUListElement;
    expect(filesList.hidden).toBe(false);
    expect(filesList.querySelectorAll('[part="file"]').length).toBe(2);
    expect(selected).toHaveLength(1);
    expect(selected[0]?.items.length).toBe(2);
  });

  test('rejects files by type and size', async () => {
    const dropzone = document.createElement('loom-file-dropzone');
    dropzone.setAttribute('accept', '.pdf');
    dropzone.setAttribute('max-size', '3');
    document.body.appendChild(dropzone);
    await waitForFrame();

    const rejected: Array<{ rejections: Array<{ reason: string }> }> = [];
    dropzone.addEventListener('loom-files-rejected', (event) => {
      rejected.push((event as CustomEvent<{ rejections: Array<{ reason: string }> }>).detail);
    });

    const input = dropzone.shadowRoot?.querySelector('[part="file-input"]') as HTMLInputElement;
    const txt = new File(['abcde'], 'sample.txt', { type: 'text/plain' });

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: toFileList([txt]),
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));
    await waitForFrame();

    expect(rejected).toHaveLength(1);
    expect(rejected[0]?.rejections[0]?.reason).toBe('size');
  });

  test('supports imperative progress lifecycle', async () => {
    const dropzone = document.createElement('loom-file-dropzone');
    document.body.appendChild(dropzone);
    await waitForFrame();

    const input = dropzone.shadowRoot?.querySelector('[part="file-input"]') as HTMLInputElement;
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: toFileList([file]),
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));
    await waitForFrame();

    const firstItem = dropzone.files[0];
    expect(firstItem).toBeDefined();

    dropzone.updateProgress(firstItem.id, 30, 20);
    await waitForFrame();
    expect(dropzone.files[0]?.progress).toBe(30);

    dropzone.completeFile(firstItem.id);
    await waitForFrame();
    expect(dropzone.files[0]?.state).toBe('complete');

    dropzone.clear();
    await waitForFrame();
    expect(dropzone.files).toHaveLength(0);
  });
});
