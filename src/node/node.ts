/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import addcslashes from 'locutus/php/strings/addcslashes';
import is_scalar from 'locutus/php/var/is_scalar';

/**
 * Represents a node in an abstract syntax tree (AST) for an expression language.
 * @class Node
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class Node {
  public nodes: Record<string, Node> = Object.create(Object.prototype);
  public attributes: Record<string, any> = Object.create(Object.prototype);

  constructor(
    nodes: Record<string, Node> = Object.create(Object.prototype),
    attributes: Record<string, any> = Object.create(Object.prototype)
  ) {
    this.nodes = nodes;
    this.attributes = attributes;
  }

  /**
   * Converts the Node instance to a string representation.
   * @returns The string representation of the Node.
   * @memberof Node
   */
  public toString(): string {
    const attributes = Object.keys(this.attributes).reduce((out: string[], name: string) => {
      out.push(`${name}: '${this.attributes[name] ? this.attributes[name].toString().replace(/\n/g, '') : 'null'}'`);
      return out;
    }, []);

    const repr = [this.constructor.name + '(' + attributes.join(', ')];

    if (Object.values(this.nodes).length > 0) {
      for (const node of Object.values(this.nodes)) {
        const lines = node.toString().split('\n');
        for (const line of lines) {
          repr.push('    ' + line);
        }
      }
      repr.push(')');
    } else {
      repr[0] += ')';
    }

    return repr.join('\n');
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof Node
   */
  public compile(compiler: Compiler): void {
    for (const node of Object.values(this.nodes)) {
      node.compile(compiler);
    }
  }

  /**
   * Evaluates the node.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The attribute value.
   * @memberof Node
   */
  public evaluate(functions: Record<string, any>, values: Record<string, any>): any {
    const results: any = [];
    for (const node of Object.values(this.nodes)) {
      results.push(node.evaluate(functions, values));
    }
    return results;
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof Node
   */
  public toArray(): any[] {
    throw new Error(`Dumping a "${this.constructor.name}" instance is not supported yet.`);
  }

  /**
   * Dumps the node as a string.
   * @returns The dumped string representation.
   * @memberof Node
   */
  public dump(): string {
    let dump = '';
    for (const node of this.toArray()) {
      dump += is_scalar(node) ? node : node.dump();
    }
    return dump;
  }

  /**
   * Escapes a string for use in dump output.
   * @param value - The string to escape.
   * @returns The escaped string.
   * @memberof Node
   */
  protected dumpString(value: string): string {
    return `"${addcslashes(value, '\0\t"\\')}"`;
  }

  /**
   * Determines whether an array is a hash (non-sequential keys).
   * @param value - The array to check.
   * @returns True if the array is a hash, false otherwise.
   * @memberof Node
   */
  protected isHash(value: Record<string | number, any>): boolean {
    let expectedKey = 0;
    for (const key of Object.keys(value)) {
      if (parseInt(key) !== expectedKey++) {
        return true;
      }
    }
    return false;
  }
}
