import './Modal.element.ts';
import { useEffect, useRef, type ElementType } from 'react';
import type { ModalProps, ModalCloseEventDetail } from '../Modal.types.ts';

const ModalElement = 'loom-modal' as ElementType;

export function Modal({
  open,
  title,
  size,
  onClose,
  className,
  children,
  ...props
}: ModalProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event): void => {
      const detail = (e as CustomEvent<ModalCloseEventDetail>).detail;
      onClose?.(detail);
    };
    el.addEventListener('loom-modal-close', handler);
    return () => el.removeEventListener('loom-modal-close', handler);
  }, [onClose]);

  return (
    <ModalElement
      ref={ref}
      {...(open ? { open: '' } : {})}
      title={title}
      size={size}
      className={className}
      {...(props as object)}
    >
      {children}
    </ModalElement>
  );
}
