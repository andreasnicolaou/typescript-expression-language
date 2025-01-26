/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Represents an expression function in an expression language.
 * @class ExpressionFunction
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class ExpressionFunction {
  private readonly compiler: any;
  private readonly evaluator: any;

  constructor(
    private readonly name: string,
    compiler: any,
    evaluator: any
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
    customFunction?: (...args: any[]) => any,
    expressionFunctionName?: string
  ): ExpressionFunction {
    const func = customFunction || ExpressionFunction.resolveJsFunction(jsFunctionName);
    if (typeof func !== 'function') {
      throw new Error(`JavaScript function "${jsFunctionName}" does not exist.`);
    }
    const compiler = (...args: any[]): any => {
      const formattedArgs = args.map((arg) => {
        if (typeof arg === 'object' && arg !== null) {
          return JSON.stringify(arg);
        }
        return String(arg);
      });
      return `${expressionFunctionName ?? jsFunctionName}(${formattedArgs.join(', ')})`;
    };
    const evaluator = (_context: any, ...args: any[]): any => func(...args);
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
  public getCompiler(): any {
    return this.compiler;
  }

  /**
   * Gets evaluator
   * @returns evaluator
   * @memberof ExpressionFunction
   */
  public getEvaluator(): any {
    return this.evaluator;
  }

  /**
   * Resolves js function
   * @param jsFunctionName
   * @returns js function
   * @memberof ExpressionFunction
   */
  protected static resolveJsFunction(jsFunctionName: string): unknown {
    const jsFunctionMap: Record<string, unknown> = {
      keys: Object.keys,
      values: Object.values,
      isArray: Array.isArray,
      stringify: JSON.stringify,
      parse: JSON.parse,
      concat: (...arrays: any[]) => arrays.flat(),
      from: Array.from,
      of: Array.of,
      charAt: (str: string, index: number) => str.charAt(index),
      charCodeAt: (str: string, index: number) => str.charCodeAt(index),
      includes: (str: string, substr: string) => str.includes(substr),
      indexOf: (str: string, search: string) => str.indexOf(search),
      split: (str: string, separator: string) => str.split(separator),
      trim: (str: string) => str.trim(),
      toUpperCase: (str: string) => str.toUpperCase(),
      toLowerCase: (str: string) => str.toLowerCase(),
      isFinite: Number.isFinite,
      isInteger: Number.isInteger,
      isNaN: Number.isNaN,
      toFixed: (num: number, decimals: number) => num.toFixed(decimals),
      now: Date.now,
      toISOString: (date: Date) => date.toISOString(),
      toDateString: (date: Date) => date.toDateString(),
      getTime: (date: Date) => date.getTime(),
      getFullYear: (date: Date) => date.getFullYear(),
      getMonth: (date: Date) => date.getMonth(),
      getDay: (date: Date) => date.getDay(),
      getMinutes: (date: Date) => date.getMinutes(),
      test: (pattern: RegExp, str: string) => pattern.test(str),
      exec: (pattern: RegExp, str: string) => pattern.exec(str),
      decodeURI: decodeURI,
      encodeURI: encodeURI,
      decodeURIComponent: decodeURIComponent,
      encodeURIComponent: encodeURIComponent,
    };
    Object.getOwnPropertyNames(Math).forEach((key) => {
      if (typeof Math[key as keyof Math] === 'function') {
        jsFunctionMap[key] = Math[key as keyof Math];
      }
    });
    return jsFunctionMap[jsFunctionName] || (globalThis as Record<string, unknown>)[jsFunctionName];
  }
}
