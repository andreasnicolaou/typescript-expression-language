/* eslint-disable @typescript-eslint/no-explicit-any */
import addcslashes from 'locutus/php/strings/addcslashes';
import { Node } from './node/node';

/**
 * Represents a compiler for an expression language.
 * @class Compiler
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class Compiler {
  private source = '';
  constructor(private readonly functions: Record<string, any>) {}

  /**
   * Gets function
   * @param name
   * @returns function
   * @memberof Compiler
   */
  public getFunction(name: string): any {
    return this.functions[name];
  }

  /**
   * Gets the current source code after compilation.
   * @returns string
   * @memberof Compiler
   */
  public getSource(): string {
    return this.source;
  }

  /**
   * Resets the state of the compiler.
   * @returns this
   * @memberof Compiler
   */
  public reset(): this {
    this.source = '';
    return this;
  }

  /**
   * Compiles a node.
   * @returns this
   * @memberof Compiler
   */
  public compile(node: Node): this {
    node.compile(this);
    return this;
  }

  public subcompile(node: Node): string {
    const current = this.source;
    this.source = '';
    node.compile(this);
    const result = this.source;
    this.source = current;
    return result;
  }

  /**
   * Adds a raw string to the compiled code.
   * @returns this
   * @memberof Compiler
   */
  public raw(string: string): this {
    this.source += string;
    return this;
  }

  /**
   * Adds a quoted string to the compiled code.
   * @returns this
   * @memberof Compiler
   */
  public string(value: string): this {
    this.source += `"${addcslashes(value ?? '', '\0\t"\\')}"`;
    return this;
  }

  /**
   * Returns a representation of a given value.
   * @returns this
   * @memberof Compiler
   */
  public repr(value: any, isIdentifier = false): this {
    // Check if the value is a number before performing arithmetic operations
    if (isIdentifier) {
      this.raw(value);
    } else if (Number.isInteger(value) || (+value === value && (!isFinite(value) || !!(value % 1)))) {
      this.raw('' + value);
    } else if (value === null) {
      this.raw('null');
    } else if (typeof value === 'boolean') {
      this.raw(value ? 'true' : 'false');
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      this.raw('{');
      let first = true;
      for (const oneKey of Object.keys(value)) {
        if (!first) {
          this.raw(', ');
        }
        first = false;
        this.repr(oneKey);
        this.raw(':');
        this.repr((value as Record<string, any>)[oneKey]);
      }
      this.raw('}');
    } else if (Array.isArray(value)) {
      this.raw('[');
      let first = true;
      for (const val of value) {
        if (!first) {
          this.raw(', ');
        }
        first = false;
        this.repr(val);
      }
      this.raw(']');
    } else {
      // If not number, boolean, object, or array, treat it as a string
      this.string(value);
    }
    return this;
  }
}
