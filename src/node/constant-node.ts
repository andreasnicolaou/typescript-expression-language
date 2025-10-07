/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';

/**
 * Represents a constant node in an abstract syntax tree (AST) for an expression language.
 * @class ConstantNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class ConstantNode extends Node {
  public isNullSafe!: boolean;
  public isIdentifier!: boolean;

  constructor(value: any, isIdentifier = false, isNullSafe = false) {
    super(Object.create(null), { value });
    this.isIdentifier = isIdentifier;
    this.isNullSafe = isNullSafe;
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof ConstantNode
   */
  public compile(compiler: Compiler): void {
    compiler.repr(this.attributes['value'], this.isIdentifier);
  }

  /**
   * Evaluates the node.
   * @param _functions - The available functions for evaluation.
   * @param _values - The current values for evaluation.
   * @returns The attribute value.
   * @memberof ConstantNode
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public evaluate(_functions?: Record<string, any>, _values?: Record<string, any>): any {
    return this.attributes['value'];
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof ConstantNode
   */
  public toArray(): (string | Node | number | bigint)[] {
    const array: (string | Node | number | bigint)[] = [];
    const value = this.attributes['value'];
    if (this.isIdentifier) {
      array.push(value);
    } else if (value === true) {
      array.push('true');
    } else if (value === false) {
      array.push('false');
    } else if (value === null) {
      array.push('null');
    } else if (typeof value === 'number' || typeof value === 'bigint') {
      array.push(value);
    } else if (typeof value === 'string') {
      array.push(this.dumpString(value));
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      array.push('{');
      for (const [k, v] of Object.entries(value)) {
        array.push(new ConstantNode(k), ': ', new ConstantNode(v), ', ');
      }
      array.pop();
      array.push('}');
    } else if (Array.isArray(value)) {
      array.push('[');
      for (const v of value) {
        array.push(new ConstantNode(v), ', ');
      }
      array.pop();
      array.push(']');
    }
    return array;
  }
}
