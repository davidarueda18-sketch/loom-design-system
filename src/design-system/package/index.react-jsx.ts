import type * as React from 'react';

type LoomElementProps<T extends HTMLElement = HTMLElement> = React.DetailedHTMLProps<
  React.HTMLAttributes<T>,
  T
>;

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'loom-box': LoomElementProps<HTMLElementTagNameMap['loom-box']> & {
        padding?: string;
        'padding-x'?: string;
        'padding-y'?: string;
      };
      'loom-stack': LoomElementProps<HTMLElementTagNameMap['loom-stack']> & {
        gap?: string;
        align?: string;
        justify?: string;
      };
      'loom-inline': LoomElementProps<HTMLElementTagNameMap['loom-inline']> & {
        gap?: string;
        align?: string;
        justify?: string;
        wrap?: boolean;
      };
      'loom-text': LoomElementProps<HTMLElementTagNameMap['loom-text']> & {
        variant?: string;
        align?: string;
      };
      'loom-button': LoomElementProps<HTMLElementTagNameMap['loom-button']> & {
        variant?: string;
        size?: string;
        disabled?: boolean;
      };
      'loom-icon': LoomElementProps<HTMLElementTagNameMap['loom-icon']> & {
        size?: string;
        color?: string;
        label?: string;
      };
      'loom-link': LoomElementProps<HTMLElementTagNameMap['loom-link']> & {
        color?: string;
        underline?: string;
        href?: string;
        target?: string;
        rel?: string;
        download?: string;
        'aria-disabled'?: boolean | 'true' | 'false';
      };
      'loom-divider': LoomElementProps<HTMLElementTagNameMap['loom-divider']> & {
        orientation?: string;
        label?: string;
        'label-position'?: string;
        color?: string;
        thickness?: string;
        'line-style'?: string;
      };
      'loom-progress-linear': LoomElementProps<HTMLElementTagNameMap['loom-progress-linear']> & {
        value?: number | string;
        max?: number | string;
        indeterminate?: boolean;
        thickness?: string;
        color?: string;
        shape?: string;
        label?: string;
        'show-value'?: boolean;
      };
      'loom-progress-circular': LoomElementProps<HTMLElementTagNameMap['loom-progress-circular']> & {
        value?: number | string;
        max?: number | string;
        indeterminate?: boolean;
        thickness?: string;
        size?: string;
        color?: string;
        label?: string;
        'show-value'?: boolean;
      };
      'loom-tag': LoomElementProps<HTMLElementTagNameMap['loom-tag']> & {
        value?: string;
        label?: string;
        'show-icon'?: string;
      };
      'loom-fab': LoomElementProps<HTMLElementTagNameMap['loom-fab']> & {
        size?: string;
        content?: string;
        label?: string;
        disabled?: boolean;
      };
      'loom-badge': LoomElementProps<HTMLElementTagNameMap['loom-badge']> & {
        state?: string;
        label?: string;
      };
      'loom-stepper-step': LoomElementProps<HTMLElementTagNameMap['loom-stepper-step']> & {
        step?: string;
        label?: string;
        state?: string;
      };
      'loom-stepper': LoomElementProps<HTMLElementTagNameMap['loom-stepper']> & {
        steps?: string;
        current?: string | number;
      };
    }
  }
}

export type {};
