import type { LoomBox }     from './ui/primitives/Box/adapters/Box.element.ts';
import type { LoomButton }  from './ui/primitives/Button/adapters/Button.element.ts';
import type { LoomDivider } from './ui/primitives/Divider/adapters/Divider.element.ts';
import type { LoomFab }     from './ui/primitives/Fab/adapters/Fab.element.ts';
import type { LoomIcon }    from './ui/primitives/Icon/adapters/Icon.element.ts';
import type { LoomInline }  from './ui/primitives/Inline/adapters/Inline.element.ts';
import type { LoomLink }    from './ui/primitives/Link/adapters/Link.element.ts';
import type { LoomProgressCircular } from './ui/primitives/Progress/adapters/ProgressCircular.element.ts';
import type { LoomProgressLinear }   from './ui/primitives/Progress/adapters/ProgressLinear.element.ts';
import type { LoomStack }   from './ui/primitives/Stack/adapters/Stack.element.ts';
import type { LoomBadge }   from './ui/primitives/Badge/adapters/Badge.element.ts';
import type { LoomTag }     from './ui/primitives/Tag/adapters/Tag.element.ts';
import type { LoomStepperStep } from './ui/primitives/StepperStep/adapters/StepperStep.element.ts';
import type { LoomStepper }     from './ui/components/Stepper/adapters/Stepper.element.ts';

declare global {
  interface HTMLElementTagNameMap {
    'loom-box':     LoomBox;
    'loom-button':  LoomButton;
    'loom-divider': LoomDivider;
    'loom-fab':     LoomFab;
    'loom-icon':    LoomIcon;
    'loom-inline':  LoomInline;
    'loom-link':    LoomLink;
    'loom-progress-circular': LoomProgressCircular;
    'loom-progress-linear':   LoomProgressLinear;
    'loom-stack':   LoomStack;
    'loom-badge':   LoomBadge;
    'loom-tag':     LoomTag;
    'loom-stepper-step': LoomStepperStep;
    'loom-stepper':      LoomStepper;
  }
}

export type {};
