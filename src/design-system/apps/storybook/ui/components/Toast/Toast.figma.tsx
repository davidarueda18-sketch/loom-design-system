import figma from '@figma/code-connect';
import { Toast } from '../../../../../package/ui/components/Toast/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Toast,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=211-2',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      // Type — 'info' is the default → omit attribute (Law 4)
      type: figma.enum('Type', {
        Info:    undefined,
        Success: 'success',
        Warning: 'warning',
        Error:   'error',
      }),
      title: figma.string('Title'),
      // Description only present when shown
      description: figma.boolean('Show description', {
        true:  figma.string('Description'),
        false: undefined,
      }),
      // Snackbar action only present when shown
      actionLabel: figma.boolean('Show action', {
        true:  figma.string('Action label'),
        false: undefined,
      }),
      // dismissible defaults to true → omit when shown; false hides it
      dismissible: figma.boolean('Show dismiss', {
        true:  undefined,
        false: false,
      }),
      // Progress bar is driven by duration (ms); shown → sample 5000ms, hidden → omit
      duration: figma.boolean('Show progress', {
        true:  5000,
        false: undefined,
      }),
    },
    example: ({ type, title, description, actionLabel, dismissible, duration }) => (
      <loom-toast
        type={type}
        title={title}
        description={description}
        dismissible={dismissible}
        action-label={actionLabel}
        duration={duration}
      />
    ),
  },
);
