import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Lifecycle states for each tracked file item. */
export const FILE_DROPZONE_ITEM_STATES = ['idle', 'uploading', 'complete', 'error'] as const;
/** Union of supported file item states. */
export type FileDropzoneItemState = typeof FILE_DROPZONE_ITEM_STATES[number];

/** Reasons used when a file is rejected by local validation. */
export const FILE_DROPZONE_REJECTION_REASONS = ['size', 'type', 'count'] as const;
/** Union of supported rejection reasons. */
export type FileDropzoneRejectionReason = typeof FILE_DROPZONE_REJECTION_REASONS[number];

/** Internal/public representation for each file rendered in the list. */
export interface FileDropzoneItem {
  /** Stable identifier used by imperative methods (`updateProgress`, `removeFile`, ...). */
  id: string;
  /** Original `File` object selected by the user. */
  file: File;
  /** Current visual/upload state. */
  state: FileDropzoneItemState;
  /** Upload progress percentage in the `[0, 100]` range. */
  progress: number;
  /** Optional ETA in seconds while uploading. */
  remainingSeconds?: number;
  /** Optional error message when state is `error`. */
  error?: string;
}

/** Details for files rejected during validation. */
export interface FileDropzoneRejection {
  /** Rejected source file. */
  file: File;
  /** Normalized rejection reason (`size`, `type`, `count`). */
  reason: FileDropzoneRejectionReason;
  /** Human-readable reason shown to consumers. */
  message: string;
}

/** Payload emitted by `loom-files-selected`. */
export interface FilesSelectedEventDetail {
  /** Accepted files mapped to item descriptors. */
  items: FileDropzoneItem[];
}

/** Payload emitted by `loom-files-rejected`. */
export interface FilesRejectedEventDetail {
  /** Rejected files with reason + message. */
  rejections: FileDropzoneRejection[];
}

/** Payload emitted by `loom-file-remove`. */
export interface FileRemoveEventDetail {
  /** Identifier of the removed file item. */
  id: string;
  /** Original file associated to the removed item. */
  file: File;
}

/** Public props specific to FileDropzone behavior. */
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
  /**
   * Combines the dropzone API with native `div` attributes.
   * Host-level event handlers and ARIA attributes are forwarded through this shape.
   */
  FileDropzoneOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof FileDropzoneOwnProps>;
