import type * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'loom-box': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        padding?: string;
        'padding-x'?: string;
        'padding-y'?: string;
      }, HTMLElement>;
      'loom-stack': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        gap?: string;
        align?: string;
        justify?: string;
      }, HTMLElement>;
      'loom-inline': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        gap?: string;
        align?: string;
        justify?: string;
        wrap?: boolean;
      }, HTMLElement>;
      'loom-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        variant?: string;
        align?: string;
      }, HTMLElement>;
      'loom-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        variant?: string;
        size?: string;
        disabled?: boolean;
      }, HTMLElement>;
      'loom-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        size?: string;
        color?: string;
        label?: string;
      }, HTMLElement>;
      'loom-divider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        orientation?:      string;
        label?:            string;
        'label-position'?: string;
        color?:            string;
        thickness?:        string;
        'line-style'?:     string;
      }, HTMLElement>;
      'loom-progress-linear': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        value?:         number | string;
        max?:           number | string;
        indeterminate?: boolean;
        thickness?:     string;
        color?:         string;
        shape?:         string;
        label?:         string;
        'show-value'?:  boolean;
      }, HTMLElement>;
      'loom-progress-circular': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        value?:         number | string;
        max?:           number | string;
        indeterminate?: boolean;
        thickness?:     string;
        size?:          string;
        color?:         string;
        label?:         string;
        'show-value'?:  boolean;
      }, HTMLElement>;
    }
  }
}
