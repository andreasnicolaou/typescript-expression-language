import { checkdate } from 'locutus/php/datetime/checkdate';
import { date } from 'locutus/php/datetime/date';
import { date_parse } from 'locutus/php/datetime/date_parse';
import { gmdate } from 'locutus/php/datetime/gmdate';
import { gmmktime } from 'locutus/php/datetime/gmmktime';
import { mktime } from 'locutus/php/datetime/mktime';
import { strtotime } from 'locutus/php/datetime/strtotime';
import { time } from 'locutus/php/datetime/time';
import { ExpressionFunction } from '../expression-function';
import type { ExpressionFunctionProvider } from '../expression-language';

/**
 * Locutus PHP date functions.
 *
 * Timestamps use PHP seconds: `strtotime()` returns seconds and `date()`
 * accepts seconds.
 */
export class DateProvider implements ExpressionFunctionProvider {
  public getFunctions(): ExpressionFunction[] {
    return [
      new ExpressionFunction(
        'checkdate',
        (...args) => `checkdate(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(checkdate, undefined, args)
      ),
      new ExpressionFunction(
        'date',
        (...args) => `date(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(date, undefined, args)
      ),
      new ExpressionFunction(
        'date_parse',
        (...args) => `date_parse(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(date_parse, undefined, args)
      ),
      new ExpressionFunction(
        'gmdate',
        (...args) => `gmdate(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(gmdate, undefined, args)
      ),
      new ExpressionFunction(
        'gmmktime',
        (...args) => `gmmktime(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(gmmktime, undefined, args)
      ),
      new ExpressionFunction(
        'mktime',
        (...args) => `mktime(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(mktime, undefined, args)
      ),
      new ExpressionFunction(
        'strtotime',
        (...args) => `strtotime(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(strtotime, undefined, args)
      ),
      new ExpressionFunction(
        'time',
        (...args) => `time(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(time, undefined, args)
      ),
    ];
  }
}
