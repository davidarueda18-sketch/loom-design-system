import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export const FILE_DROPZONE_ITEM_STATES = ['idle', 'uploading', 'complete', 'error'] as const;
export type FileDropzoneItemState = typeof FILE_DROPZONE_ITEM_STATES[number];

export const FILE_DROPZONE_REJECTION_REASONS = ['size', 'type', 'count'] as const;
export type FileDropzoneRejectionReason = typeof FILE_DROPZONE_REJECTION_REASONS[number];

export interface FileDropzoneItem {
  id: string;
  file: File;
  state: FileDropzoneItemState;
  progress: number;
  remainingSeconds?: number;
  error?: string;
}

export interface FileDropzoneRejection {
  file: File;
  reason: FileDropzoneRejectionReason;
  message: string;
}

export interface FilesSelectedEventDetail {
  items: FileDropzoneItem[];
}

export interface FilesRejectedEventDetail {
  rejections: FileDropzoneRejection[];
}

export interface FileRemoveEventDetail {
  id: string;
  file: File;
}

export interface FileDropzoneOwnProps {
  /** Allow selection / drop of multiple files. */
  multiple?: boolean;
  /** Comma-separated MIME types and/or file extensions, e.g. `"image/*,.pdf"`. */
  accept?: string;
  /** Max file size in bytes. `0` (default) disables the check. */
  maxSize?: number;
  /**
   * Max number of files the dropzone will hold at once. `0` (default) means no limit
   * when `multiple` is enabled. Ignored when `multiple` is `false` (single-file mode
   * already implies a cap of 1). Excess files emit `loom-files-rejected` with
   * `reason: 'count'`.
   */
  maxFiles?: number;
  /** Main label rendered above the icon. */
  label?: string;
  /** Secondary text rendered below the label (format/size guidance). */
  description?: string;
  /** When `true`, all interactions are blocked. */
  disabled?: boolean;
  /** Override the central icon. Receives the default download icon if empty. */
  children?: ReactNode;
}

export type FileDropzoneProps =
  FileDropzoneOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof FileDropzoneOwnProps>;
