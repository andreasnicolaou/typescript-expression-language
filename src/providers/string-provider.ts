import { explode } from 'locutus/php/strings/explode';
import { lcfirst } from 'locutus/php/strings/lcfirst';
import { ltrim } from 'locutus/php/strings/ltrim';
import { rtrim } from 'locutus/php/strings/rtrim';
import { str_replace } from 'locutus/php/strings/str_replace';
import { strlen } from 'locutus/php/strings/strlen';
import { strrev } from 'locutus/php/strings/strrev';
import { strtolower } from 'locutus/php/strings/strtolower';
import { strtoupper } from 'locutus/php/strings/strtoupper';
import { substr } from 'locutus/php/strings/substr';
import { trim } from 'locutus/php/strings/trim';
import { ucfirst } from 'locutus/php/strings/ucfirst';
import { ucwords } from 'locutus/php/strings/ucwords';
import { ExpressionFunction } from '../expression-function';
import type { ExpressionFunctionProvider } from '../expression-language';

/** Locutus PHP string functions. */
export class StringProvider implements ExpressionFunctionProvider {
  public getFunctions(): ExpressionFunction[] {
    return [
      new ExpressionFunction(
        'strtolower',
        (...args) => `strtolower(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(strtolower, undefined, args)
      ),
      new ExpressionFunction(
        'strtoupper',
        (...args) => `strtoupper(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(strtoupper, undefined, args)
      ),
      new ExpressionFunction(
        'strlen',
        (...args) => `strlen(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(strlen, undefined, args)
      ),
      new ExpressionFunction(
        'trim',
        (...args) => `trim(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(trim, undefined, args)
      ),
      new ExpressionFunction(
        'ltrim',
        (...args) => `ltrim(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(ltrim, undefined, args)
      ),
      new ExpressionFunction(
        'rtrim',
        (...args) => `rtrim(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(rtrim, undefined, args)
      ),
      new ExpressionFunction(
        'ucfirst',
        (...args) => `ucfirst(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(ucfirst, undefined, args)
      ),
      new ExpressionFunction(
        'lcfirst',
        (...args) => `lcfirst(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(lcfirst, undefined, args)
      ),
      new ExpressionFunction(
        'ucwords',
        (...args) => `ucwords(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(ucwords, undefined, args)
      ),
      new ExpressionFunction(
        'strrev',
        (...args) => `strrev(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(strrev, undefined, args)
      ),
      new ExpressionFunction(
        'explode',
        (...args) => `explode(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(explode, undefined, args)
      ),
      new ExpressionFunction(
        'str_replace',
        (...args) => `str_replace(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(str_replace, undefined, args)
      ),
      new ExpressionFunction(
        'substr',
        (...args) => `substr(${args.join(', ')})`,
        (_context, ...args) => Reflect.apply(substr, undefined, args)
      ),
    ];
  }
}
