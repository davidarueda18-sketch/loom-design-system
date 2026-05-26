import './SelectMenu.element.ts';
import type { ElementType } from 'react';
import type { SelectOptionProps, SelectMenuProps } from '../SelectMenu.types.ts';

const SelectOptionElement = 'loom-select-option' as ElementType;
const SelectMenuElement = 'loom-select-menu' as ElementType;

export function SelectOption({
  value,
  label,
  disabled = false,
  description,
  leadingIcon,
  selected = false,
  className,
  ...props
}: SelectOptionProps) {
  return (
    <SelectOptionElement
      value={value}
      label={label}
      {...(disabled ? { disabled: '' } : {})}
      description={description}
      leading-icon={leadingIcon}
      {...(selected ? { selected: '' } : {})}
      className={className}
      {...(props as object)}
    />
  );
}

export function SelectMenu({ children, className, ...props }: SelectMenuProps) {
  return (
    <SelectMenuElement className={className} {...(props as object)}>
      {children}
    </SelectMenuElement>
  );
}
