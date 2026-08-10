import { abs } from 'locutus/php/math/abs';
import { ceil } from 'locutus/php/math/ceil';
import { floor } from 'locutus/php/math/floor';
import { pow } from 'locutus/php/math/pow';
import { round } from 'locutus/php/math/round';
import { sqrt } from 'locutus/php/math/sqrt';
import { ExpressionFunction } from '../expression-function';
import type { ExpressionFunctionProvider } from '../expression-language';

/**
 * Bundles Locutus PHP math functions so they can be registered in one call.
 * `min` and `max` are already registered by ExpressionLanguage by default,
 * so they are intentionally omitted here.
 */
export class MathProvider implements ExpressionFunctionProvider {
  public getFunctions(): ExpressionFunction[] {
    return [
      new ExpressionFunction(
        'abs',
        (...args) => `abs(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(abs, undefined, args)
      ),
      new ExpressionFunction(
        'ceil',
        (...args) => `ceil(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(ceil, undefined, args)
      ),
      new ExpressionFunction(
        'floor',
        (...args) => `floor(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(floor, undefined, args)
      ),
      new ExpressionFunction(
        'round',
        (...args) => `round(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(round, undefined, args)
      ),
      new ExpressionFunction(
        'sqrt',
        (...args) => `sqrt(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(sqrt, undefined, args)
      ),
      new ExpressionFunction(
        'pow',
        (...args) => `pow(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(pow, undefined, args)
      ),
    ];
  }
}
