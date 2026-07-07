import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css';

// Filled-variant colors are captured directly from the current Figma file (component set
// "Badge", Variant=filled) and inlined as literal hex. Several values intentionally diverge
// from the existing global color tokens (e.g. dark feedbackSuccessSubtle, feedbackWarningStrong)
// — this keeps the filled badge pixel-faithful to Figma without mutating shared semantic
// tokens used elsewhere. Alpha-blended borders are expressed as 8-digit hex since CSS custom
// properties can't be alpha-blended at the value level.
export const badgeVars = createThemeContract({
  default:  { background: null, border: null, foreground: null },
  progress: { background: null, border: null, foreground: null },
  success:  { background: null, border: null, foreground: null },
  warning:  { background: null, border: null, foreground: null },
  danger:   { background: null, border: null, foreground: null },
  info:     { background: null, border: null, foreground: null },
});

const darkValues = {
  default:  { background: '#3D3D3D66', border: '#2F3031',   foreground: '#848484' },
  progress: { background: '#283739',   border: '#3A5053',   foreground: '#42D8EC' },
  success:  { background: '#1B3320',   border: '#2BB30933', foreground: '#2BB309' },
  warning:  { background: '#2D2010',   border: '#FFB2374D', foreground: '#FFB237' },
  // Mirrors Figma's current "Error" filled binding, which reuses the warning-subtle
  // background and feedback/warning-strong foreground rather than a dedicated danger-subtle.
  danger:   { background: '#2D2010',   border: '#FF462D4D', foreground: '#FF5537' },
  info:     { background: '#071650',   border: '#1A46C4',   foreground: '#3B82F6' },
} satisfies Record<keyof typeof badgeVars, { background: string; border: string; foreground: string }>;

createGlobalTheme(':root', badgeVars, darkValues);
createGlobalTheme('[data-theme="dark"]', badgeVars, darkValues);

createGlobalTheme('[data-theme="light"]', badgeVars, {
  default:  { background: '#3D3D3D66', border: '#E8E8E8',   foreground: '#848484' },
  progress: { background: '#E0F9FC',   border: '#0A4E5E',   foreground: '#117287' },
  success:  { background: '#E5F8E2',   border: '#1E8C0633', foreground: '#1E8C06' },
  warning:  { background: '#FFF3E0',   border: '#CC7A004D', foreground: '#CC7A00' },
  danger:   { background: '#FFF3E0',   border: '#E830154D', foreground: '#E83015' },
  info:     { background: '#DDEEFF',   border: '#112F8A',   foreground: '#2563EB' },
});
