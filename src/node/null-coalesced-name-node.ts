/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';

/**
 * Represents a null-coalesced-name in an abstract syntax tree (AST) for an expression language.
 * @class NullCoalescedNameNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class NullCoalescedNameNode extends Node {
  constructor(name: string | number | null) {
    super(Object.create(null), { name });
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof NullCoalescedNameNode
   */
  public compile(compiler: Compiler): void {
    compiler.raw(`${this.attributes.name} ?? null`);
  }

  /**
   * Evaluates the node.
   * @param _functions - The available functions for evaluation.
   * @param _values - The current values for evaluation.
   * @returns null.
   * @memberof NullCoalescedNameNode
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public evaluate(_functions: Record<string, any>, _values: Record<string, any>): null {
    return null;
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof NullCoalescedNameNode
   */
  public toArray(): string[] {
    return [`${this.attributes.name} ?? null`];
  }
}
