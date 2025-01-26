/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';

/**
 * Represents a name node in an abstract syntax tree (AST) for an expression language.
 * @class NameNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class NameNode extends Node {
  constructor(name: string | number | null) {
    super({}, { name });
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof NameNode
   */
  public compile(compile: Compiler): void {
    compile.raw(`${this.attributes.name}`);
  }

  /**
   * Evaluates the node.
   * @param _functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The attribute value.
   * @memberof NameNode
   */
  public evaluate(_functions: Record<string, any>, values: Record<string, any>): any {
    return values[this.attributes.name];
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof NameNode
   */
  public toArray(): string[] {
    return [this.attributes.name];
  }
}
