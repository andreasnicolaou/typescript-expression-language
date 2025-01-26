/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';

/**
 * Represents a unary node in an abstract syntax tree (AST) for an expression language.
 * @class UnaryNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class UnaryNode extends Node {
  public static readonly OPERATORS: Record<string, string> = {
    '!': '!',
    not: '!',
    '+': '+',
    '-': '-',
    '~': '~',
  };

  constructor(operator: string | number | null, node: Node) {
    super({ node }, { operator });
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof UnaryNode
   */
  public compile(compiler: Compiler): void {
    compiler.raw('(').raw(UnaryNode.OPERATORS[this.attributes.operator]).compile(this.nodes.node).raw(')');
  }

  /**
   * Evaluates the node.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The attribute value.
   * @memberof UnaryNode
   */
  public evaluate(functions: Record<string, any>, values: Record<string, any>): any {
    const value = this.nodes.node.evaluate(functions, values);
    switch (this.attributes.operator) {
      case 'not':
      case '!':
        return !value;
      case '-':
        return -value;
      case '~':
        return ~value;
      default:
        return value;
    }
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof UnaryNode
   */
  public toArray(): (string | Node)[] {
    return ['(', `${this.attributes.operator} `, this.nodes.node, ')'];
  }
}
