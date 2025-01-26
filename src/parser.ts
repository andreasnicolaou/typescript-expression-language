/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsNode } from './node/arguments-node';
import { ArrayNode } from './node/array-node';
import { Node } from './node/node';
import { BinaryNode } from './node/binary-node';
import { ConstantNode } from './node/constant-node';
import { TokenStream } from './token-stream';
import { SyntaxError } from './syntax-error';
import { ConditionalNode } from './node/conditional-node';
import { FunctionNode } from './node/function-node';
import { GetAttrNode } from './node/get-attr-node';
import { UnaryNode } from './node/unary-node';
import { NameNode } from './node/name-node';
import { NullCoalescedNameNode } from './node/null-coalesced-name-node';
import { NullCoalesceNode } from './node/null-coalesce-node';
import { Token } from './token';
export type Operators = Record<string, { precedence: number; associativity?: number }>;

/**
 * Represents a parser for an expression language.
 * @class Parser
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class Parser {
  public static readonly OPERATOR_LEFT = 1;
  public static readonly OPERATOR_RIGHT = 2;

  public static readonly IGNORE_UNKNOWN_VARIABLES = 1;
  public static readonly IGNORE_UNKNOWN_FUNCTIONS = 2;

  private static readonly unaryOperators: Operators = {
    not: { precedence: 50 },
    '!': { precedence: 50 },
    '-': { precedence: 500 },
    '+': { precedence: 500 },
    '~': { precedence: 500 },
  };

  private static readonly binaryOperators: Operators = {
    or: { precedence: 10, associativity: Parser.OPERATOR_LEFT },
    '||': { precedence: 10, associativity: Parser.OPERATOR_LEFT },
    and: { precedence: 15, associativity: Parser.OPERATOR_LEFT },
    '&&': { precedence: 15, associativity: Parser.OPERATOR_LEFT },
    '|': { precedence: 16, associativity: Parser.OPERATOR_LEFT },
    '^': { precedence: 17, associativity: Parser.OPERATOR_LEFT },
    '&': { precedence: 18, associativity: Parser.OPERATOR_LEFT },
    '==': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    '===': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    '!=': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    '!==': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    '<': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    '>': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    '>=': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    '<=': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    'not in': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    in: { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    contains: { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    'starts with': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    'ends with': { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    matches: { precedence: 20, associativity: Parser.OPERATOR_LEFT },
    '..': { precedence: 25, associativity: Parser.OPERATOR_LEFT },
    '<<': { precedence: 25, associativity: Parser.OPERATOR_LEFT },
    '>>': { precedence: 25, associativity: Parser.OPERATOR_LEFT },
    '+': { precedence: 30, associativity: Parser.OPERATOR_LEFT },
    '-': { precedence: 30, associativity: Parser.OPERATOR_LEFT },
    '~': { precedence: 40, associativity: Parser.OPERATOR_LEFT },
    '*': { precedence: 60, associativity: Parser.OPERATOR_LEFT },
    '/': { precedence: 60, associativity: Parser.OPERATOR_LEFT },
    '%': { precedence: 60, associativity: Parser.OPERATOR_LEFT },
    '**': { precedence: 200, associativity: Parser.OPERATOR_RIGHT },
  };

  private stream!: TokenStream;
  private names!: (string | number | Record<string, any>)[];
  private flags = 0;

  constructor(private readonly functions: Record<string, any>) {}

  /**
   * Converts a token stream to a node tree.
   * @param stream
   * @param [names]
   * @param [flags]
   * @returns parse
   * @throws SyntaxError
   * @memberof Parser
   */
  public parse(stream: TokenStream, names: (string | number | Record<string, any>)[] = [], flags = 0): Node {
    return this.doParse(stream, names, flags);
  }

  /**
   * Validates the syntax of an expression.
   * The syntax of the passed expression will be checked, but not parsed.
   * If you want to skip checking dynamic variable names, pass `Parser.IGNORE_UNKNOWN_VARIABLES` instead of the array.
   * @param stream
   * @param [names]
   * @param [flags]
   * @throws SyntaxError
   * @memberof Parser
   */
  public lint(stream: TokenStream, names: string[] | null = [], flags = 0): void {
    if (names === null) {
      console.warn(
        'Passing "null" as the second argument of "lint()" is deprecated. Use "Parser.IGNORE_UNKNOWN_VARIABLES" instead.'
      );
      flags |= Parser.IGNORE_UNKNOWN_VARIABLES;
      names = [];
    }
    this.doParse(stream, names, flags);
  }

  /**
   * Parses the expression
   * @param [precedence]
   * @returns node expression
   * @memberof Parser
   */
  public parseExpression(precedence = 0): Node {
    let expr = this.getPrimary();
    let token = this.stream.current;
    while (
      token.test(Token.OPERATOR_TYPE) &&
      token.value !== null &&
      Parser.binaryOperators[token.value] !== undefined &&
      Parser.binaryOperators[token.value] !== null &&
      Parser.binaryOperators[token.value].precedence >= precedence
    ) {
      const op = Parser.binaryOperators[token.value];
      this.stream.next();
      const expr1 = this.parseExpression(op.associativity === Parser.OPERATOR_LEFT ? op.precedence + 1 : op.precedence);
      expr = new BinaryNode(token.value.toString(), expr, expr1);
      token = this.stream.current;
    }

    return precedence === 0 ? this.parseConditionalExpression(expr) : expr;
  }

  /**
   * Parses primary expression
   * @returns primary expression
   * @memberof Parser
   */
  public parsePrimaryExpression(): Node {
    const token = this.stream.current;
    switch (token.type) {
      case Token.NAME_TYPE:
        this.stream.next();
        switch (token.value) {
          case 'true':
          case 'TRUE':
            return new ConstantNode(true);
          case 'false':
          case 'FALSE':
            return new ConstantNode(false);
          case 'null':
          case 'NULL':
            return new ConstantNode(null);
          default:
            if (this.stream.current.value === '(') {
              if (
                !(this.flags & Parser.IGNORE_UNKNOWN_FUNCTIONS) &&
                token.value !== null &&
                !this.functions[token.value]
              ) {
                throw new SyntaxError(
                  `The function "${token.value}" does not exist.`,
                  token.cursor,
                  this.stream.expression,
                  token.value,
                  Object.keys(this.functions)
                );
              }
              return this.parsePostfixExpression(new FunctionNode(token.value, this.parseArguments()));
            } else {
              if (!(this.flags & Parser.IGNORE_UNKNOWN_VARIABLES) && token.value !== null) {
                const names = (Array.isArray(this.names) ? this.names : [this.names]).reduce(
                  (out: { original: any; mapped: string | number }[], elem: string | number | Record<string, any>) => {
                    if (typeof elem === 'object' && elem !== null) {
                      for (const [key, value] of Object.entries(elem)) {
                        out.push({ original: value, mapped: key }); // Store the mapping as {original, mapped}
                      }
                    } else {
                      out.push({ original: elem, mapped: elem });
                    }
                    return out;
                  },
                  []
                );
                const validName = names.find((nameObj: any) => nameObj.original === token.value);
                if (!validName) {
                  if (this.stream.current.test(Token.PUNCTUATION_TYPE, '??')) {
                    return new NullCoalescedNameNode(token.value);
                  }
                  throw new SyntaxError(
                    `Variable "${token.value}" is not valid.`,
                    token.cursor,
                    this.stream.expression,
                    token.value,
                    names.map((nameObj: any) => nameObj.original)
                  );
                }

                // is the name used in the compiled code different
                // from the name used in the expression?
                const name = names.find((x: any) => x.original === token.value);
                if (name) {
                  token.value = name.mapped;
                }
              }
              return this.parsePostfixExpression(new NameNode(token.value));
            }
        }

      case Token.NUMBER_TYPE:
      case Token.STRING_TYPE:
        this.stream.next();
        return new ConstantNode(token.value);

      default:
        if (token.test(Token.PUNCTUATION_TYPE, '[')) {
          return this.parsePostfixExpression(this.parseArrayExpression());
        } else if (token.test(Token.PUNCTUATION_TYPE, '{')) {
          return this.parsePostfixExpression(this.parseHashExpression());
        } else {
          throw new SyntaxError(
            `Unexpected token "${this.stream.current.type}" of value "${this.stream.current.value}"`,
            token.cursor,
            this.stream.expression,
            token.value
          );
        }
    }
  }

  /**
   * Parses array expression
   * @returns array expression
   * @memberof Parser
   */
  public parseArrayExpression(): Node {
    this.stream.expect(Token.PUNCTUATION_TYPE, '[', 'An array element was expected');

    const node = new ArrayNode();
    let first = true;

    while (!this.stream.current.test(Token.PUNCTUATION_TYPE, ']')) {
      if (!first) {
        this.stream.expect(Token.PUNCTUATION_TYPE, ',', 'An array element must be followed by a comma');
        if (this.stream.current.test(Token.PUNCTUATION_TYPE, ']')) {
          break;
        }
      }
      first = false;
      node.addElement(this.parseExpression());
    }

    this.stream.expect(Token.PUNCTUATION_TYPE, ']', 'An opened array is not properly closed');
    return node;
  }

  /**
   * Parses hash expression
   * @returns hash expression
   * @memberof Parser
   */
  public parseHashExpression(): Node {
    this.stream.expect(Token.PUNCTUATION_TYPE, '{', 'A hash element was expected');

    const node = new ArrayNode();
    let first = true;

    while (!this.stream.current.test(Token.PUNCTUATION_TYPE, '}')) {
      if (!first) {
        this.stream.expect(Token.PUNCTUATION_TYPE, ',', 'A hash value must be followed by a comma');
        if (this.stream.current.test(Token.PUNCTUATION_TYPE, '}')) {
          break;
        }
      }
      first = false;

      let key: Node;
      if (
        this.stream.current.test(Token.STRING_TYPE) ||
        this.stream.current.test(Token.NAME_TYPE) ||
        this.stream.current.test(Token.NUMBER_TYPE)
      ) {
        key = new ConstantNode(this.stream.current.value);
        this.stream.next();
      } else if (this.stream.current.test(Token.PUNCTUATION_TYPE, '(')) {
        key = this.parseExpression();
      } else {
        throw new SyntaxError(
          `A hash key must be a quoted string, a number, a name, or an expression enclosed in parentheses (unexpected token "${this.stream.current.type}" with value "${this.stream.current.value}").`,
          this.stream.current.cursor,
          ''
        );
      }

      this.stream.expect(Token.PUNCTUATION_TYPE, ':', 'A hash key must be followed by a colon (:)');
      const value = this.parseExpression();
      node.addElement(value, key);
    }

    this.stream.expect(Token.PUNCTUATION_TYPE, '}', 'An opened hash is not properly closed');
    return node;
  }

  /**
   * Parses postfix expression
   * @param node
   * @returns postfix expression
   * @memberof Parser
   */
  public parsePostfixExpression(node: Node): Node {
    let token = this.stream.current;

    while (token.type === Token.PUNCTUATION_TYPE) {
      if (token.value === '.' || token.value === '?.') {
        // Handle property access or optional chaining
        const isNullSafe = token.value === '?.';
        this.stream.next();
        token = this.stream.current;
        this.stream.next();

        if (
          token.type !== Token.NAME_TYPE &&
          (token.type !== Token.OPERATOR_TYPE ||
            !/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/.test(token.value?.toString() ?? ''))
        ) {
          throw new SyntaxError('Expected name', token.cursor, this.stream.expression);
        }

        const arg = new ConstantNode(token.value, true, isNullSafe);
        const _arguments = new ArgumentsNode();
        let type = GetAttrNode.PROPERTY_CALL;

        if (this.stream.current.test(Token.PUNCTUATION_TYPE, '(')) {
          type = GetAttrNode.METHOD_CALL;
          Object.values(this.parseArguments().nodes).forEach((n) => _arguments.addElement(n));
        }

        node = new GetAttrNode(node, arg, _arguments, type);
      } else if (token.value === '[') {
        this.stream.next();
        const arg = this.parseExpression();
        this.stream.expect(Token.PUNCTUATION_TYPE, ']');
        node = new GetAttrNode(node, arg, new ArgumentsNode(), GetAttrNode.ARRAY_CALL);
      } else {
        break;
      }
      token = this.stream.current;
    }

    return node;
  }

  /**
   * Parses arguments
   * @returns arguments
   * @memberof Parser
   */
  public parseArguments(): Node {
    const args: Node[] = [];
    this.stream.expect(Token.PUNCTUATION_TYPE, '(', 'A list of arguments must begin with an opening parenthesis');

    while (!this.stream.current.test(Token.PUNCTUATION_TYPE, ')')) {
      if (args.length !== 0) {
        this.stream.expect(Token.PUNCTUATION_TYPE, ',', 'Arguments must be separated by a comma');
      }
      args.push(this.parseExpression());
    }
    this.stream.expect(Token.PUNCTUATION_TYPE, ')', 'A list of arguments must be closed by a parenthesis');
    const argsObject: Record<string, Node> = args.reduce(
      (acc, curr, index) => {
        acc[`${index}`] = curr;
        return acc;
      },
      {} as Record<string, Node>
    );
    return new Node(argsObject);
  }

  /**
   * Parse the given expression
   * @param stream
   * @param names
   * @param flags
   * @returns parse
   * @throws SyntaxError
   * @memberof Parse
   */
  private doParse(stream: TokenStream, names: (string | number | Record<string, any>)[], flags: number): Node {
    this.flags = flags;
    this.stream = stream;
    this.names = names;
    const node = this.parseExpression();
    if (!this.stream.isEOF()) {
      throw new SyntaxError(
        `Unexpected token "${this.stream.current.type}" of value "${this.stream.current.value}"`,
        this.stream.current.cursor,
        this.stream.expression,
        this.stream.current.value
      );
    }

    this.stream = undefined as unknown as TokenStream;
    this.names = [];
    return node;
  }

  /**
   * Gets the primary node
   * @returns primary node
   * @memberof Parse
   */
  private getPrimary(): Node {
    const token = this.stream.current;

    // Handle unary operators
    if (
      token.test(Token.OPERATOR_TYPE) &&
      token.value !== null &&
      Parser.unaryOperators[token.value] !== undefined &&
      Parser.unaryOperators[token.value] !== null
    ) {
      const operator = Parser.unaryOperators[token.value];
      this.stream.next();
      const expr = this.parseExpression(operator.precedence);
      return this.parsePostfixExpression(new UnaryNode(token.value, expr));
    }

    // Handle grouped expressions (parentheses)
    if (token.test(Token.PUNCTUATION_TYPE, '(')) {
      this.stream.next();
      const expr = this.parseExpression();
      this.stream.expect(Token.PUNCTUATION_TYPE, ')', 'An opened parenthesis is not properly closed');

      // After parsing the expression inside parentheses, handle any postfix expressions
      return this.parsePostfixExpression(expr);
    }

    // Handle primary expressions
    return this.parsePrimaryExpression();
  }

  /**
   * Parses conditional expression
   * @param expr
   * @returns conditional expression
   * @memberof Parser
   */
  private parseConditionalExpression(expr: Node): Node {
    while (this.stream.current.test(Token.PUNCTUATION_TYPE, '??')) {
      this.stream.next();
      const expr2 = this.parseExpression();
      expr = new NullCoalesceNode(expr, expr2);
    }

    while (this.stream.current.test(Token.PUNCTUATION_TYPE, '?')) {
      this.stream.next();
      const expr2 = this.stream.current.test(Token.PUNCTUATION_TYPE, ':') ? expr : this.parseExpression();

      if (this.stream.current.test(Token.PUNCTUATION_TYPE, ':')) {
        this.stream.next();
        const expr3 = this.parseExpression();
        expr = new ConditionalNode(expr, expr2, expr3);
      } else {
        expr = new ConditionalNode(expr, expr2, new ConstantNode(null));
      }
    }

    return expr;
  }
}
