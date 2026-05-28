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

/**
 * Dash / minus icon for use in Checkbox indeterminate state.
 * 16x16 SVG with a centered horizontal bar.
 */
export const ICON_DASH =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16" aria-hidden="true">' +
  '<rect x="3" y="7" width="10" height="2" rx="1"/>' +
  '</svg>';

/**
 * Toast status icons (16x16, fill="currentColor" — glyphs only, no outer shapes).
 * Rendered inside the circular iconWrap container defined in Toast.css.ts.
 */
export const ICON_TOAST_SUCCESS =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
  '<path fill-rule="evenodd" d="M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"/>' +
  '</svg>';

export const ICON_TOAST_INFO =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
  '<path d="M8 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9 7v6H7V7h2Z"/>' +
  '</svg>';

export const ICON_TOAST_WARNING =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
  '<path d="M7 1.5h2v8H7v-8Zm1 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>' +
  '</svg>';

export const ICON_TOAST_ERROR =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
  '<path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06L6.94 8l-4.72 4.72a.75.75 0 1 0 1.06 1.06L8 9.06l4.72 4.72a.75.75 0 1 0 1.06-1.06L9.06 8l4.72-4.72a.75.75 0 0 0-1.06-1.06L8 6.94 3.28 2.22Z"/>' +
  '</svg>';

export const ICON_CLOSE =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
  '<path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
  '</svg>';
