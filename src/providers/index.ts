/**
 * Optional, opt-in function providers.
 *
 * These live behind the `/providers` entry point so the core bundle stays
 * lean. They are backed by the project's existing Locutus dependency.
 *
 * ```ts
 * import { ExpressionLanguage } from '@andreasnicolaou/typescript-expression-language';
 * import { StringProvider, ArrayProvider } from '@andreasnicolaou/typescript-expression-language/providers';
 *
 * const el = new ExpressionLanguage(undefined, [new StringProvider(), new ArrayProvider()]);
 * ```
 */
export { ArrayProvider } from './array-provider';
export { DateProvider } from './date-provider';
export { MathProvider } from './math-provider';
export { StringProvider } from './string-provider';
