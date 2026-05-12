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
      }, HTMLElement>;
      'loom-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        variant?: string;
        size?: string;
        disabled?: boolean;
      }, HTMLElement>;
    }
  }
}
