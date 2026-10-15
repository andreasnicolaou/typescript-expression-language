/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressionFunction } from './expression-function';
import type { ExpressionFunctionProvider } from './expression-language';

/**
 * Provides the constant() and enum() functions, restricted to a list of allowed constants.
 *
 * Each entry is a constant name, such as `"Math.PI"` or `"Roles::ROLE_ADMIN"`, in which `*` matches one segment of
 * the name: any sequence of characters except `.` and `:`. For example, `"Status.*"` allows every case of the `Status`
 * enum but not the properties nested in them (`"Status.*.*"` does), and `"Roles::ROLE_*"` allows the constants of
 * `Roles` whose name starts with `ROLE_`. Names are matched case-sensitively, and the segments `__proto__`,
 * `constructor` and `prototype` are never allowed, since every object has them.
 *
 * Like Symfony rejects a class name, an entry that names a class or an object, such as `"Roles"` or `"Config"`,
 * throws: list `"Roles::*"` or `"Config.*"` instead.
 * @class ConstantFunctionProvider
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class ConstantFunctionProvider implements ExpressionFunctionProvider {
  private static readonly PROTOTYPE_SEGMENTS = /(?:^|[.:])(?:__proto__|constructor|prototype)(?:$|[.:])/;

  private readonly regexp: RegExp;

  constructor(allowedConstants: Iterable<string>) {
    const patterns: string[] = [];
    for (const constant of allowedConstants) {
      if (typeof constant !== 'string' || constant === '') {
        throw new TypeError('An allowed constant must be a non-empty string.');
      }
      ConstantFunctionProvider.assertNamesConstant(constant);
      patterns.push(constant.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&').replace(/\\\*/g, '[^.:]*'));
    }
    this.regexp = patterns.length ? new RegExp(`^(?:${patterns.join('|')})$`) : /(?!)/;
  }

  /**
   * Rejects an entry that names a class or an object, since allowing it hands an expression every property of it.
   *
   * Arrays, enum cases (objects with a `name` property), names that are not defined yet and entries with a `*` are
   * accepted.
   * @param constant
   * @throws TypeError
   * @memberof ConstantFunctionProvider
   */
  private static assertNamesConstant(constant: string): void {
    if (constant.includes('*')) {
      return;
    }
    let value: unknown;
    try {
      value = resolveConstant(constant);
    } catch {
      return;
    }
    // "A::B" resolves like "A.B", the form the hints use since a name is not resolved any further after its "::"
    const path = constant.replace('::', '.');
    if (typeof value === 'function') {
      throw new TypeError(`"${constant}" is a class name, use "${path}::*" to allow its constants.`);
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && !('name' in value)) {
      throw new TypeError(`"${constant}" is an object, use "${path}.*" to allow its properties.`);
    }
  }

  /**
   * Determines whether the allowed constants include a name
   * @param name
   * @returns true if allowed
   * @memberof ConstantFunctionProvider
   */
  public isAllowed(name: string): boolean {
    return this.regexp.test(name) && !ConstantFunctionProvider.PROTOTYPE_SEGMENTS.test(name);
  }

  /**
   * Gets the constant() and enum() functions
   * @returns functions
   * @memberof ConstantFunctionProvider
   */
  public getFunctions(): ExpressionFunction[] {
    return [
      new ExpressionFunction(
        'constant',
        (name: string): string => this.compile('Constant', name, (str) => `constant(${str})`),
        (_values: unknown, name: unknown): any => this.evaluate('Constant', name, resolveConstant)
      ),
      new ExpressionFunction(
        'enum',
        (name: string): string => this.compile('Enum case', name, compileEnumCase),
        (_values: unknown, name: unknown): any => this.evaluate('Enum case', name, evaluateEnumCase)
      ),
    ];
  }

  /**
   * Compiles a call that the allowed names restrict: a string literal is checked now, any other argument at runtime.
   * @param kind
   * @param name - the compiled argument
   * @param compileCall - compiles the unrestricted call
   * @returns compiled code
   * @memberof ConstantFunctionProvider
   */
  private compile(kind: string, name: string, compileCall: (str: string) => string): string {
    const literal = /^"([^"\\]*)"$/.exec(name)?.[1];
    if (literal !== undefined) {
      return this.isAllowed(literal)
        ? compileCall(name)
        : `(function(){throw new Error(${toCodeString(`${kind} "${literal}" is not allowed.`)})})()`;
    }
    return (
      `(function(v){if(!${this.regexp}.test(v)||${ConstantFunctionProvider.PROTOTYPE_SEGMENTS}.test(v))` +
      `{throw new Error('${kind} "'+v+'" is not allowed.')}return ${compileCall('v')}})(${name})`
    );
  }

  private evaluate(kind: string, name: unknown, resolve: (name: unknown) => any): any {
    if (typeof name === 'string' && !this.isAllowed(name)) {
      throw new Error(`${kind} "${name}" is not allowed.`);
    }
    return resolve(name);
  }
}

/**
 * Encodes a string as a JavaScript string literal that is also safe to embed in an HTML script element.
 * @param value
 * @returns the string literal
 */
const toCodeString = (value: string): string =>
  JSON.stringify(value).replace(
    /[<>/\u2028\u2029]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
  );

/**
 * Resolves a constant from the global object, without any restriction.
 * @param name
 * @returns the constant value
 */
export const resolveConstant = (name: unknown): any => {
  return ExpressionFunction.fromJs('constant').getEvaluator()(Object.create(null), name);
};

/**
 * Compiles the enum() function for the given compiled argument.
 * @param str - the compiled argument
 * @returns compiled code
 */
export const compileEnumCase = (str: string): string => {
  return (
    `(function(v){return constant(v)` +
    `&&typeof constant(v)==='object'&&'name'` +
    `in constant(v)?constant(v):(function(){` +
    `throw new TypeError('The string "'+v+'" is not ` +
    `the name of a valid enum case.')})()})(${str})`
  );
};

/**
 * Evaluates the enum() function.
 * @param val - the enum case name
 * @returns the enum case
 */
export const evaluateEnumCase = (val: unknown): any => {
  if (typeof val !== 'string' || !val) {
    throw new TypeError('enum() expects parameter 1 to be string');
  }
  const typeErrorMessage = `The string "${val}" is not the name of a valid enum case.`;
  let value!: any;
  try {
    value = resolveConstant(val);
  } catch {
    throw new TypeError(typeErrorMessage);
  }

  // Support both PHP-style enums (objects with 'name' property) and TypeScript-style enums (simple values)
  if (value === null || value === undefined) {
    throw new TypeError(typeErrorMessage);
  }

  // Valid enum: either PHP-style (object with 'name' property) or TypeScript-style (primitive values)
  if (
    (typeof value === 'object' && 'name' in value) ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  // If it's an object without 'name' property or other invalid type, it's not a valid enum
  throw new TypeError(typeErrorMessage);
};
