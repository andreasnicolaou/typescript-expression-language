/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Represents an expression function in an expression language.
 * @class ExpressionFunction
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */

type Callable = (...args: any[]) => any;

export class ExpressionFunction {
  private readonly compiler: Callable;
  private readonly evaluator: Callable;

  // Static function map - computed once at class load time
  private static readonly JS_FUNCTION_MAP = ExpressionFunction.createJsFunctionMap();

  constructor(
    private readonly name: string,
    compiler: Callable,
    evaluator: Callable
  ) {
    this.compiler = compiler;
    this.evaluator = evaluator;
  }

  /**
   * Creates an ExpressionFunction from a JavaScript function name.
   * @param jsFunctionName The JavaScript function name
   * @param expressionFunctionName The expression function name (optional)
   * @throws Error if the JavaScript function does not exist.
   * @memberof ExpressionFunction
   */
  public static fromJs(
    jsFunctionName: string,
    customFunction?: Callable,
    expressionFunctionName?: string
  ): ExpressionFunction {
    const func = customFunction || ExpressionFunction.resolveJsFunction(jsFunctionName);
    if (typeof func !== 'function') {
      throw new Error(`JavaScript function "${jsFunctionName}" does not exist.`);
    }
    const compiler: Callable = (...args: any[]): any => {
      const formattedArgs = args.map((arg) => {
        if (arg instanceof RegExp) {
          return arg.toString();
        }
        if (typeof arg === 'object' && arg !== null) {
          return JSON.stringify(arg);
        }
        return String(arg);
      });
      return `${expressionFunctionName ?? jsFunctionName}(${formattedArgs.join(', ')})`;
    };
    const evaluator: Callable = (_context: any, ...args: any[]): any => func(...args);
    return new ExpressionFunction(expressionFunctionName ?? jsFunctionName, compiler, evaluator);
  }

  /**
   * Gets name
   * @returns name
   * @memberof ExpressionFunction
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Gets compiler
   * @returns compiler
   * @memberof ExpressionFunction
   */
  public getCompiler(): Callable {
    return this.compiler;
  }

  /**
   * Gets evaluator
   * @returns evaluator
   * @memberof ExpressionFunction
   */
  public getEvaluator(): Callable {
    return this.evaluator;
  }

  /**
   * Creates the JavaScript function mapping
   * @private
   * @returns The complete function mapping
   * @memberof ExpressionFunction
   */
  private static createJsFunctionMap(): Record<string, unknown> {
    const functionMap: Record<string, unknown> = {
      // Object functions
      keys: Object.keys,
      values: Object.values,

      // Array functions
      isArray: Array.isArray,
      concat: (...arrays: any[]) => arrays.flat(),
      from: Array.from,
      of: Array.of,

      // String functions
      charAt: (str: string, index: number) => str.charAt(index),
      charCodeAt: (str: string, index: number) => str.charCodeAt(index),
      includes: (str: string, substr: string) => str.includes(substr),
      indexOf: (str: string, search: string) => str.indexOf(search),
      split: (str: string, separator: string) => str.split(separator),
      trim: (str: string) => str.trim(),
      toUpperCase: (str: string) => str.toUpperCase(),
      toLowerCase: (str: string) => str.toLowerCase(),

      // Number functions
      isFinite: Number.isFinite,
      isInteger: Number.isInteger,
      isNaN: Number.isNaN,
      toFixed: (num: number, decimals: number) => num.toFixed(decimals),

      // Date functions
      now: Date.now,
      toISOString: (date: Date) => date.toISOString(),
      toDateString: (date: Date) => date.toDateString(),
      getTime: (date: Date) => date.getTime(),
      getFullYear: (date: Date) => date.getFullYear(),
      getMonth: (date: Date) => date.getMonth(),
      getDay: (date: Date) => date.getDay(),
      getMinutes: (date: Date) => date.getMinutes(),

      // RegExp functions
      test: (pattern: RegExp, str: string) => pattern.test(str),
      exec: (pattern: RegExp, str: string) => pattern.exec(str),

      // URI functions
      decodeURI: decodeURI,
      encodeURI: encodeURI,
      decodeURIComponent: decodeURIComponent,
      encodeURIComponent: encodeURIComponent,

      // JSON functions
      stringify: JSON.stringify,
      parse: JSON.parse,

      // PHP-style constant function
      constant: (name: string) => {
        if (typeof name !== 'string') {
          throw new Error('constant() expects parameter 1 to be string');
        }

        const globalObj = ExpressionFunction.getGlobalObject();
        const errorMessage = `Constant '${name}' is not defined`;
        // Helper function to traverse object path
        const traversePath = (obj: any, parts: string[]): any => {
          let current = obj;
          for (const part of parts) {
            if (current && (typeof current === 'object' || typeof current === 'function') && part in current) {
              current = current[part];
            } else {
              throw new Error(errorMessage);
            }
          }
          return current;
        };

        // Handle PHP-style class constants with :: notation
        if (name.includes('::')) {
          const [className, constantName] = name.split('::');
          const classObj = traversePath(globalObj, className.split('.'));
          if ((typeof classObj === 'object' || typeof classObj === 'function') && constantName in classObj) {
            return classObj[constantName];
          }
          throw new Error(errorMessage);
        }

        // Handle dot notation for nested properties
        if (name.includes('.')) {
          return traversePath(globalObj, name.split('.'));
        }

        // Simple global property lookup
        if (name in globalObj) {
          return globalObj[name];
        }

        throw new Error(errorMessage);
      },
    };

    // Add Math functions dynamically
    Object.getOwnPropertyNames(Math).forEach((key) => {
      const mathProp = Math[key as keyof Math];
      if (typeof mathProp === 'function') {
        functionMap[key] = mathProp;
      }
    });

    return functionMap;
  }

  /**
   * Resolves js function
   * @param jsFunctionName
   * @returns js function
   * @memberof ExpressionFunction
   */
  protected static resolveJsFunction(jsFunctionName: string): unknown {
    if (ExpressionFunction.JS_FUNCTION_MAP[jsFunctionName]) {
      return ExpressionFunction.JS_FUNCTION_MAP[jsFunctionName];
    }
    const globalObj = ExpressionFunction.getGlobalObject();
    if (jsFunctionName in globalObj) {
      return globalObj[jsFunctionName];
    }
    return undefined;
  }

  /**
   * Gets the global object for cross-environment compatibility
   * @returns the global object (prioritizes globalThis, falls back to window or global)
   * @memberof ExpressionFunction
   */
  protected static getGlobalObject(): any {
    if (typeof globalThis !== 'undefined') return globalThis;
    /* istanbul ignore next */
    if (typeof window !== 'undefined') return window;
    /* istanbul ignore next */
    if (typeof global !== 'undefined') return global;
    /* istanbul ignore next */
    return {};
  }
}
