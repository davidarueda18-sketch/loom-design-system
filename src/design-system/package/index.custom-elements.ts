import type { LoomBox }    from './ui/primitives/Box/adapters/Box.element.ts';
import type { LoomButton } from './ui/primitives/Button/adapters/Button.element.ts';
import type { LoomInline } from './ui/primitives/Inline/adapters/Inline.element.ts';
import type { LoomStack }  from './ui/primitives/Stack/adapters/Stack.element.ts';
import type { LoomText }   from './ui/primitives/Text/adapters/Text.element.ts';

declare global {
  interface HTMLElementTagNameMap {
    'loom-box':    LoomBox;
    'loom-button': LoomButton;
    'loom-inline': LoomInline;
    'loom-stack':  LoomStack;
    'loom-text':   LoomText;
  }
}

export type {};
