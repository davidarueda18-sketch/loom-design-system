// Shared Vanilla Extract stylesheet adoption for the Navbar adapter.
// Locates the constructed stylesheet that contains a known VE anchor class
// and clones it as an adoptable sheet for the shadow root.

const _sheetCache: Record<string, CSSStyleSheet | null> = {};

function cloneAsConstructedSheet(source: CSSStyleSheet): CSSStyleSheet | null {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(Array.from(source.cssRules).map((rule) => rule.cssText).join('\n'));
    return sheet;
  } catch {
    return null;
  }
}

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (anchorClass in _sheetCache) return _sheetCache[anchorClass];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((rule) => rule.cssText.includes(anchorClass))) {
        _sheetCache[anchorClass] = cloneAsConstructedSheet(sheet as CSSStyleSheet);
        return _sheetCache[anchorClass];
      }
    } catch {
      // cross-origin stylesheet — skip
    }
  }
  _sheetCache[anchorClass] = null;
  return null;
}

export function collectAdoptedStyleSheets(...anchorClasses: string[]): CSSStyleSheet[] {
  const sheets = anchorClasses
    .map(getVESheet)
    .filter((sheet): sheet is CSSStyleSheet => sheet != null);
  return Array.from(new Set(sheets));
}
