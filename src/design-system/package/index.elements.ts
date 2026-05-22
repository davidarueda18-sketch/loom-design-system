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
export { LoomText } from './ui/primitives/Text/adapters/Text.element.ts';
export { LoomButton } from './ui/primitives/Button/adapters/Button.element.ts';
export { LoomIcon }    from './ui/primitives/Icon/adapters/Icon.element.ts';
export { LoomDivider } from './ui/primitives/Divider/adapters/Divider.element.ts';
