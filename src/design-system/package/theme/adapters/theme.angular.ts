// Angular adapter — re-exports the framework-agnostic theme primitives.
// Wire into DI in your app:
//
//   @Injectable({ providedIn: 'root' })
//   export class ThemeService {
//     apply = applyTheme;
//     get   = getTheme;
//   }

export { applyTheme, getTheme } from '../theme.ts';
export type { Theme } from '../theme.ts';
