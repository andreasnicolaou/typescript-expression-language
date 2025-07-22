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

  private static readonly FUNCTIONS: Record<string, string> = {
    '**': 'pow',
    '..': 'range',
    in: 'inArray',
    'not in': 'notInArray',
    contains: 'strContains',
    'starts with': 'strStartsWith',
    'ends with': 'strEndsWith',
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
    if (operator in BinaryNode.FUNCTIONS) {
      const funcName = BinaryNode.FUNCTIONS[operator];
      compiler.raw(`${funcName}(`).compile(this.nodes.left).raw(', ').compile(this.nodes.right).raw(')');
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

    if (operator in BinaryNode.FUNCTIONS) {
      const right = this.nodes.right.evaluate(functions, values);
      switch (operator) {
        case 'in':
          return this.inArray(left, right);
        case 'not in':
          return this.notInArray(left, right);
        case '**':
          return this.pow(left, right);
        case '..':
          return this.range(left, right);
        case 'contains':
          return this.strContains(left, right);
        case 'starts with':
          return this.strStartsWith(left, right);
        case 'ends with':
          return this.strEndsWith(left, right);
        default:
          // This should never happen unless FUNCTIONS is modified incorrectly
          throw new Error(`Unsupported function operator: ${operator}`);
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

  private pow(x: number, y: number): number {
    return Math.pow(x, y);
  }

  private range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  private inArray(item: any, array: any[]): boolean {
    return array.indexOf(item) >= 0;
  }

  private notInArray(item: any, array: any[]): boolean {
    return array.indexOf(item) === -1;
  }

  private strContains(str: string, substr: string): boolean {
    return str.includes(substr);
  }

  private strStartsWith(str: string, prefix: string): boolean {
    return str.startsWith(prefix);
  }

  private strEndsWith(str: string, suffix: string): boolean {
    return str.endsWith(suffix);
  }
}
