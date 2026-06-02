import figma from '@figma/code-connect';
import { Navbar } from '../../../../../package/ui/components/Navbar/index.ts';
import '../../../loom-web-components.d.ts';

const FILE = 'https://www.figma.com/design/AxsVyBx9rgoxlemUd8DjJ9/LOOM-Design-System';

const BELL_ICON_SVG = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 8a6 6 0 1 1 12 0c0 4.5 1.2 6 1.2 6H4.8S6 12.5 6 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const INBOX_ICON_SVG = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 13h4l1.5 3h7L17 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 13 5 5h14l2 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Navbar — top navigation bar (node 65:976) ─────────────────────────────── */
figma.connect(Navbar, `${FILE}?node-id=65-976`, {
  imports: ["import '@loom-sdc/design-system/custom-elements'"],
  props: {
    application: figma.string('Application'),
    section: figma.string('Section'),
  },
  example: ({ application, section }) => (
    <loom-navbar application={application} section={section}>
      <loom-icon-button variant="filled" size="md" aria-label="Label">
        <loom-icon size="md">{BELL_ICON_SVG}</loom-icon>
      </loom-icon-button>
      <loom-icon-button variant="filled" size="md" aria-label="Label">
        <loom-icon size="md">{INBOX_ICON_SVG}</loom-icon>
      </loom-icon-button>
    </loom-navbar>
  ),
});
