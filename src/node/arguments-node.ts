import { Compiler } from '../compiler';
import { Node } from '../node/node';
import { ArrayNode } from './array-node';

/**
 * Represents a node for arguments of an abstract syntax tree (AST) in the expression language.
 * @class ArgumentsNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class ArgumentsNode extends ArrayNode {
  /**
   * Compiles the arguments
   * @param compiler - The Compiler instance to compile the node.
   * @memberof ArgumentsNode
   */
  public compile(compiler: Compiler): void {
    this.compileArguments(compiler, false);
  }

  /**
   * Converts the arguments node into an array representation.
   * @returns An array of the node's arguments.
   * @memberof ArgumentsNode
   */
  public toArray(): (string | Node)[] {
    const array: (string | Node)[] = [];
    this.getKeyValuePairs().forEach((pair, index, arr) => {
      array.push(pair.value);
      if (index < arr.length - 1) {
        array.push(', ');
      }
    });
    return array;
  }
}
