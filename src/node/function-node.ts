/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';

/**
 * Represents a function node in an abstract syntax tree (AST) for an expression language.
 * @class FunctionNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class FunctionNode extends Node {
  constructor(name: string | number | null, argumentsNode: Node) {
    super({ arguments: argumentsNode }, { name });
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof FunctionNode
   */
  public compile(compiler: Compiler): void {
    const args: string[] = [];
    for (const node of Object.values(this.nodes.arguments.nodes)) {
      args.push(compiler.subcompile(node));
    }
    compiler.raw(compiler.getFunction(this.attributes.name)?.['compiler'](...args));
  }

  /**
   * Evaluates the node.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The evaluated value.
   * @memberof FunctionNode
   */
  public evaluate(functions: Record<string, any>, values: Record<string, any>): any {
    const args: any[] = [values];
    for (const node of Object.values(this.nodes.arguments.nodes)) {
      args.push(node.evaluate(functions, values));
    }
    return functions[this.attributes.name]['evaluator'](...args);
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof FunctionNode
   */
  public toArray(): (string | number | Node)[] {
    const array: (string | number | Node)[] = [];
    array.push(this.attributes.name);
    array.push('(');
    for (const node of Object.values(this.nodes.arguments.nodes)) {
      array.push(node, ', ');
    }
    array.pop();
    array.push(')');
    return array;
  }
}
