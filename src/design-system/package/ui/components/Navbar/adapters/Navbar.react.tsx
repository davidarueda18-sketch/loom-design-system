import './Navbar.element.ts';
import type { ElementType } from 'react';
import type { NavbarProps } from '../Navbar.types.ts';

const NavbarElement = 'loom-navbar' as ElementType;

export function Navbar({ application, section, className, children, ...props }: NavbarProps) {
  return (
    <NavbarElement
      {...(application ? { application } : {})}
      {...(section ? { section } : {})}
      className={className}
      {...(props as object)}
    >
      {children}
    </NavbarElement>
  );
}
