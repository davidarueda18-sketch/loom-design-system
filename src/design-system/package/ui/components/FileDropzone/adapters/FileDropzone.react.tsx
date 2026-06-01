import './FileDropzone.element.ts';
import type { ElementType } from 'react';
import type { FileDropzoneProps } from '../FileDropzone.types.ts';

export function FileDropzone({
  multiple,
  accept,
  maxSize,
  maxFiles,
  label,
  description,
  disabled,
  className,
  children,
  ...rest
}: FileDropzoneProps) {
  const FileDropzoneElement = 'loom-file-dropzone' as ElementType;
  return (
    <FileDropzoneElement
      multiple={multiple || undefined}
      accept={accept}
      max-size={maxSize && maxSize > 0 ? maxSize : undefined}
      max-files={maxFiles && maxFiles > 0 ? maxFiles : undefined}
      label={label}
      description={description}
      disabled={disabled || undefined}
      className={className}
      {...(rest as object)}
    >
      {children}
    </FileDropzoneElement>
  );
}
