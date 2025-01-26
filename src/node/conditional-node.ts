/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';

/**
 * Represents a conditional node in an abstract syntax tree (AST) for an expression language.
 * @class ConditionalNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class ConditionalNode extends Node {
  constructor(expr1: Node, expr2: Node, expr3: Node) {
    super({ expr1, expr2, expr3 });
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof ConditionalNode
   */
  public compile(compiler: Compiler): void {
    compiler
      .raw('((')
      .compile(this.nodes.expr1)
      .raw(') ? (')
      .compile(this.nodes.expr2)
      .raw(') : (')
      .compile(this.nodes.expr3)
      .raw('))');
  }

  /**
   * Evaluates the node.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The evaluated value.
   * @memberof ConditionalNode
   */
  public evaluate(functions: Record<string, any>, values: Record<string, any>): any {
    if (this.nodes.expr1.evaluate(functions, values)) {
      return this.nodes.expr2.evaluate(functions, values);
    }
    return this.nodes.expr3.evaluate(functions, values);
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof ConditionalNode
   */
  public toArray(): (string | Node)[] {
    return ['(', this.nodes.expr1, ' ? ', this.nodes.expr2, ' : ', this.nodes.expr3, ')'];
  }
}
