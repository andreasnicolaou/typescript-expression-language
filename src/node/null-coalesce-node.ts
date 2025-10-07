/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';
import { GetAttrNode } from './get-attr-node';

/**
 * Represents a null-coalesce in an abstract syntax tree (AST) for an expression language.
 * @class NullCoalesceNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class NullCoalesceNode extends Node {
  constructor(expr1: Node, expr2: Node) {
    super({ expr1, expr2 }, Object.create(null));
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof NullCoalesceNode
   */
  public compile(compiler: Compiler): void {
    compiler.raw('((').compile(this.nodes.expr1).raw(') ?? (').compile(this.nodes.expr2).raw('))');
  }

  /**
   * Evaluates the node.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The attribute value.
   * @memberof NullCoalesceNode
   */
  public evaluate(functions: Record<string, any>, values: Record<string, any>): any {
    if (this.nodes.expr1 instanceof GetAttrNode) {
      this.addNullCoalesceAttributeToGetAttrNodes(this.nodes.expr1);
    }
    return this.nodes.expr1.evaluate(functions, values) ?? this.nodes.expr2.evaluate(functions, values);
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof NullCoalesceNode
   */
  public toArray(): (string | Node)[] {
    return ['(', this.nodes.expr1, ') ?? (', this.nodes.expr2, ')'];
  }

  /**
   * Adds null coalesce attribute to get attr nodes
   * @param node
   * @returns null coalesce attribute to get attr nodes
   * @memberof NullCoalesceNode
   */
  private addNullCoalesceAttributeToGetAttrNodes(node: Node): void {
    if (!(node instanceof GetAttrNode)) {
      return;
    }
    node.attributes['is_null_coalesce'] = true;
    for (const n of Object.values(node.nodes)) {
      this.addNullCoalesceAttributeToGetAttrNodes(n);
    }
  }
}
