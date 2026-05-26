/**
 * Centralized SVG icon constants for the Loom Design System.
 *
 * Single source of truth for inline SVG markup used across components.
 * Each icon is optimized for use with `innerHTML` in Web Components.
 *
 * @internal
 */

/**
 * Chevron down icon for use in Select trigger and expandable triggers.
 * 16x16 SVG that rotates via CSS transform.
 */
export const ICON_CHEVRON_DOWN =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16" aria-hidden="true">' +
  '<path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>' +
  '</svg>';

/**
 * Check mark icon for use in Select options and form fields.
 * 16x16 SVG with semantic checkmark glyph.
 */
export const ICON_CHECK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16" aria-hidden="true">' +
  '<path fill-rule="evenodd" d="M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"/>' +
  '</svg>';
