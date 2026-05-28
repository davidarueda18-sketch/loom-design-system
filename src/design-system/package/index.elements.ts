// Registers all Loom custom elements as a side effect.
// Import this file once in your app entry to enable all loom-* elements:
//
//   import '@loom-sdc/design-system/elements';
//   import '@loom-sdc/design-system/style.css';
//
// Angular: add CUSTOM_ELEMENTS_SCHEMA to your module or standalone component.
// Vue:     set compilerOptions.isCustomElement = (tag) => tag.startsWith('loom-')
// React:   add the JSX namespace (see @loom-sdc/design-system types)

export { LoomBox } from './ui/primitives/Box/adapters/Box.element.ts';
export { LoomStack } from './ui/primitives/Stack/adapters/Stack.element.ts';
export { LoomInline } from './ui/primitives/Inline/adapters/Inline.element.ts';
export { LoomButton } from './ui/primitives/Button/adapters/Button.element.ts';
export { LoomLink } from './ui/primitives/Link/adapters/Link.element.ts';
export { LoomIcon }    from './ui/primitives/Icon/adapters/Icon.element.ts';
export { LoomDivider } from './ui/primitives/Divider/adapters/Divider.element.ts';
export { LoomProgressLinear } from './ui/primitives/Progress/adapters/ProgressLinear.element.ts';
export { LoomProgressCircular } from './ui/primitives/Progress/adapters/ProgressCircular.element.ts';
export { LoomTag } from './ui/primitives/Tag/adapters/Tag.element.ts';
export { LoomFab } from './ui/primitives/Fab/adapters/Fab.element.ts';
export { LoomBadge } from './ui/primitives/Badge/adapters/Badge.element.ts';
export { LoomStepperStep } from './ui/primitives/StepperStep/adapters/StepperStep.element.ts';
export { LoomStepper } from './ui/components/Stepper/adapters/Stepper.element.ts';
export { LoomSelect } from './ui/components/Select/adapters/Select.element.ts';
export { LoomSelectMenu, LoomSelectOption } from './ui/components/Select/menu/adapters/SelectMenu.element.ts';
export { LoomIconButton } from './ui/primitives/IconButton/adapters/IconButton.element.ts';
export { LoomCheckbox } from './ui/primitives/Checkbox/adapters/Checkbox.element.ts';
export { LoomToggle } from './ui/primitives/Toggle/adapters/Toggle.element.ts';
export { LoomToast } from './ui/components/Toast/adapters/Toast.element.ts';
export { LoomTabItem } from './ui/primitives/TabItem/adapters/TabItem.element.ts';
export { LoomTabGroup } from './ui/components/TabGroup/adapters/TabGroup.element.ts';
export { LoomModal } from './ui/components/Modal/adapters/Modal.element.ts';
