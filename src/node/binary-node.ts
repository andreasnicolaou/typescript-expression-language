/* eslint-disable @typescript-eslint/no-explicit-any */
import { Compiler } from '../compiler';
import { Node } from '../node/node';
import { ConstantNode } from './constant-node';
import { SyntaxError } from '../syntax-error';

/**
 * Represents a binary node in an abstract syntax tree (AST) for an expression language.
 * @class BinaryNode
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class BinaryNode extends Node {
  private static readonly OPERATORS: Record<string, string> = {
    '~': '.',
    and: '&&',
    or: '||',
  };

  private static readonly FUNCTIONS: Record<string, any> = {
    '**': (x: number, y: number) => Math.pow(x, y),
    '..': (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i),
    in: (item: any, array: any[]) => array.indexOf(item) >= 0,
    'not in': (item: any, array: any[]) => array.indexOf(item) === -1,
    contains: (str: string, substr: string) => str?.includes(substr),
    'starts with': (str: string, prefix: string) => str.startsWith(prefix),
    'ends with': (str: string, suffix: string) => str.endsWith(suffix),
  };

  constructor(operator: string, left: Node, right: Node) {
    super({ left, right }, { operator });
  }

  /**
   * Compiles the node.
   * @param compiler - The Compiler instance.
   * @memberof BinaryNode
   */
  public compile(compiler: Compiler): void {
    const operator = this.attributes['operator'];
    if (operator === 'matches') {
      if (this.nodes.right instanceof ConstantNode) {
        this.evaluateMatches(this.nodes.right.evaluate({}, {}), '');
      } else if (this.nodes.right instanceof BinaryNode && this.nodes.right.attributes['operator'] !== '~') {
        throw new SyntaxError('The regex passed to "matches" must be a string.');
      }
      compiler
        .raw(
          '(function (regexp, str) { try { if (regexp.startsWith("/") && regexp.endsWith("/")) { regexp = regexp.slice(1, -1); } return new RegExp(regexp).test(str ?? ""); } catch () { throw new SyntaxError(\'Invalid regex passed to "matches".\'); } })('
        )
        .compile(this.nodes.right)
        .raw(', ')
        .compile(this.nodes.left)
        .raw(')');
      return;
    }
    if (BinaryNode.FUNCTIONS[operator]) {
      compiler
        .raw(`${BinaryNode.FUNCTIONS[operator]}(`)
        .compile(this.nodes.left)
        .raw(', ')
        .compile(this.nodes.right)
        .raw(')');
      return;
    }

    compiler
      .raw('(')
      .compile(this.nodes.left)
      .raw(` ${BinaryNode.OPERATORS[operator] || operator} `)
      .compile(this.nodes.right)
      .raw(')');
  }

  /**
   * Evaluates the node.
   * @param functions - The available functions for evaluation.
   * @param values - The current values for evaluation.
   * @returns The evaluated value.
   * @memberof ArrayNode
   */
  public evaluate(functions: Record<string, any>, values: Record<string, any>): any {
    const operator = this.attributes['operator'];
    const left = this.nodes.left?.evaluate(functions, values);
    let right = null;

    if (BinaryNode.FUNCTIONS[operator]) {
      const func = BinaryNode.FUNCTIONS[operator];
      if (typeof func === 'function') {
        return func(left, this.nodes.right.evaluate(functions, values));
      }
    }

    switch (operator) {
      case 'or':
      case '||':
        if (!left) {
          right = this.nodes.right.evaluate(functions, values);
        }
        return left || right;
      case 'and':
      case '&&':
        if (left) {
          right = this.nodes.right.evaluate(functions, values);
        }
        return left && right;
    }

    right = this.nodes.right.evaluate(functions, values);

    switch (operator) {
      case 'or':
      case '||':
        return left || right;
      case 'and':
      case '&&':
        return left && right;
      case '|':
        return left | right;
      case '^':
        return left ^ right;
      case '&':
        return left & right;
      case '<<':
        return left << right;
      case '>>':
        return left >> right;
      case '==':
        return left == right;
      case '===':
        return left === right;
      case '!=':
        return left != right;
      case '!==':
        return left !== right;
      case '<':
        return left < right;
      case '>':
        return left > right;
      case '<=':
        return left <= right;
      case '>=':
        return left >= right;
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        if (right === 0) {
          throw new Error('Division by zero.');
        }
        return left / right;
      case '%':
        if (right === 0) {
          throw new Error('Modulo by zero.');
        }
        return left % right;
      case 'matches':
        return this.evaluateMatches(right, left);
      case '~':
        return `${left}${right}`;
      default:
        throw new Error(`Operator "${operator}" not supported.`);
    }
  }

  /**
   * Converts the node to an array representation.
   * @returns The array representation of the node.
   * @memberof BinaryNode
   */
  public toArray(): (string | Node)[] {
    return ['(', this.nodes.left, ` ${this.attributes['operator']} `, this.nodes.right, ')'];
  }

  /**
   * Evaluates matches
   * @param regexp
   * @param str
   * @returns true if matches
   * @memberof BinaryNode
   */
  private evaluateMatches(regexp: string, str: string | null): boolean {
    try {
      if (regexp.startsWith('/') && regexp.endsWith('/')) {
        // Remove the slashes and use the part in between as the pattern
        regexp = regexp.slice(1, -1);
      }
      return new RegExp(regexp).test(str ?? '');
    } catch (error) {
      throw new SyntaxError(`Regexp "${regexp}" passed to "matches" is not valid.[${error}]`);
    }
  }
}
