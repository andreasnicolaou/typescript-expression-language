import { array_intersect } from 'locutus/php/array/array_intersect';
import { array_keys } from 'locutus/php/array/array_keys';
import { array_merge } from 'locutus/php/array/array_merge';
import { array_reverse } from 'locutus/php/array/array_reverse';
import { array_slice } from 'locutus/php/array/array_slice';
import { array_sum } from 'locutus/php/array/array_sum';
import { array_unique } from 'locutus/php/array/array_unique';
import { array_values } from 'locutus/php/array/array_values';
import { count } from 'locutus/php/array/count';
import { in_array } from 'locutus/php/array/in_array';
import { implode } from 'locutus/php/strings/implode';
import { ExpressionFunction } from '../expression-function';
import type { ExpressionFunctionProvider } from '../expression-language';

/** Locutus PHP array and collection functions. */
export class ArrayProvider implements ExpressionFunctionProvider {
  public getFunctions(): ExpressionFunction[] {
    return [
      new ExpressionFunction(
        'count',
        (...args) => `count(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(count, undefined, args)
      ),
      new ExpressionFunction(
        'implode',
        (...args) => `implode(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(implode, undefined, args)
      ),
      new ExpressionFunction(
        'array_keys',
        (...args) => `array_keys(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(array_keys, undefined, args)
      ),
      new ExpressionFunction(
        'array_values',
        (...args) => `array_values(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(array_values, undefined, args)
      ),
      new ExpressionFunction(
        'array_merge',
        (...args) => `array_merge(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(array_merge, undefined, args)
      ),
      new ExpressionFunction(
        'array_reverse',
        (...args) => `array_reverse(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(array_reverse, undefined, args)
      ),
      new ExpressionFunction(
        'array_unique',
        (...args) => `array_unique(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(array_unique, undefined, args)
      ),
      new ExpressionFunction(
        'array_sum',
        (...args) => `array_sum(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(array_sum, undefined, args)
      ),
      new ExpressionFunction(
        'in_array',
        (...args) => `in_array(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(in_array, undefined, args)
      ),
      new ExpressionFunction(
        'array_intersect',
        (...args) => `array_intersect(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(array_intersect, undefined, args)
      ),
      new ExpressionFunction(
        'array_slice',
        (...args) => `array_slice(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(array_slice, undefined, args)
      ),
    ];
  }
}
