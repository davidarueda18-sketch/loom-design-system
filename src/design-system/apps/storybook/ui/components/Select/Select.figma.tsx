import figma from '@figma/code-connect';
import { Select } from '../../../../../package/ui/components/Select/index.ts';
import '../../../loom-web-components.d.ts';

figma.connect(
  Select,
  'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System?node-id=84-2680',
  {
    imports: ["import '@loom-sdc/design-system/custom-elements'"],
    props: {
      label: figma.string('Label'),
      placeholder: figma.string('Option placeholder'),
      errorMessage: figma.string('Error msg'),
      disabled: figma.enum('Select/State', {
        Disabled: true,
      }),
      error: figma.enum('Select/State', {
        Error: true,
      }),
      open: figma.enum('Select/State', {
        Open: true,
      }),
    },
    example: ({ label, placeholder, errorMessage, disabled, error, open }) => (
      <loom-select
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        error-message={errorMessage}
        open={open}
      >
        <loom-select-option value="option1" label="Option 1" />
        <loom-select-option value="option2" label="Option 2" />
        <loom-select-option value="option3" label="Option 3" />
      </loom-select>
    ),
  },
);
