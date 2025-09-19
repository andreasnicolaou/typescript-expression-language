import { SyntaxError } from './syntax-error';
import { Token } from './token';
import { TokenStream } from './token-stream';

/**
 * Represents a lexer for an expression language.
 * @class Lexer
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class Lexer {
  private static readonly WORD_OPERATORS = new Set([
    'starts with',
    'ends with',
    'contains',
    'matches',
    'not in',
    'and',
    'not',
    'or',
    'in',
  ]);

  private static readonly SYMBOL_OPERATORS = [
    ...Lexer.WORD_OPERATORS,
    '===',
    '!==',
    '&&',
    '||',
    '==',
    '!=',
    '>=',
    '<=',
    '<<',
    '>>',
    '**',
    '..',
    '!',
    '|',
    '^',
    '&',
    '<',
    '>',
    '+',
    '-',
    '~',
    '*',
    '/',
    '%',
  ];

  private static readonly NUMBER_REGEX = /^(?:\d[\d_]*(?:\.\d[\d_]*)?|\.\d[\d_]*)(?:[eE][+-]?\d[\d_]*)?/;
  private static readonly STRING_REGEX = /^"([^"\\]*(?:\\.[^"\\]*)*)"|^'([^'\\]*(?:\\.[^'\\]*)*)'/s;
  private static readonly COMMENT_REGEX = /^\/\*\*[\s\S]*?\*\/|^\/\*[\s\S]*?\*\//;
  private static readonly NAME_REGEX = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/;

  /**
   * Tokenizes an expression.
   * @param expression
   * @returns tokenize
   * @throws SyntaxError
   * @memberof Lexer
   */
  public tokenize(expression: string): TokenStream {
    expression = expression.toString().replace(/[\r\n\t\v\f]/g, ' ');
    let cursor = 0;
    const tokens: Token[] = [];
    const brackets: [string, number][] = [];
    const end = expression.length;

    while (cursor < end) {
      if (expression[cursor] === ' ') {
        cursor++;
        continue;
      }

      const slicedExpression = expression.slice(cursor);

      // Match numbers
      const numberMatch = Lexer.NUMBER_REGEX.exec(slicedExpression);
      if (numberMatch) {
        const rawMatch = numberMatch[0];
        const cleanedNumber = rawMatch.replace(/_/g, '');
        tokens.push(new Token(Token.NUMBER_TYPE, +cleanedNumber, cursor + 1));
        cursor += rawMatch.length;
        continue;
      }

      // Match brackets (opening)
      if ('([{'.includes(expression[cursor])) {
        brackets.push([expression[cursor], cursor]);
        tokens.push(new Token(Token.PUNCTUATION_TYPE, expression[cursor], cursor + 1));
        cursor++;
        continue;
      }

      // Match brackets (closing)
      if (')]}'.includes(expression[cursor])) {
        if (brackets.length === 0) {
          throw new SyntaxError(`Unexpected "${expression[cursor]}"`, cursor, expression);
        }

        const lastBracket = brackets.pop();
        if (lastBracket) {
          const [expected, cur] = lastBracket;
          if (expression[cursor] !== { '(': ')', '[': ']', '{': '}' }[expected]) {
            throw new SyntaxError(`Unclosed "${expected}"`, cur, expression);
          }
        }

        tokens.push(new Token(Token.PUNCTUATION_TYPE, expression[cursor], cursor + 1));
        cursor++;
        continue;
      }

      // Match strings (double-quoted or single-quoted)
      const stringMatch = Lexer.STRING_REGEX.exec(slicedExpression);
      if (stringMatch != null) {
        tokens.push(new Token(Token.STRING_TYPE, stringMatch[1] || stringMatch[2], cursor + 1));
        cursor += stringMatch[0].length;
        continue;
      }

      // Match comments
      const commentMatch = Lexer.COMMENT_REGEX.exec(slicedExpression);
      if (commentMatch != null) {
        cursor += commentMatch[0].length;
        continue;
      }

      // Match operators
      const operator = this.extractOperator(slicedExpression, expression, cursor);
      if (operator) {
        tokens.push(new Token(Token.OPERATOR_TYPE, operator, cursor + 1));
        cursor += operator.length;
        continue;
      }

      // Match null-safe operator
      if (expression[cursor] === '?' && expression[cursor + 1] === '.') {
        tokens.push(new Token(Token.PUNCTUATION_TYPE, '?.', cursor + 1));
        cursor += 2;
        continue;
      }

      // Match null-coalescing operator
      if (expression[cursor] === '?' && expression[cursor + 1] === '?') {
        tokens.push(new Token(Token.PUNCTUATION_TYPE, '??', cursor + 1));
        cursor += 2;
        continue;
      }

      // Match punctuation
      if (',.:?'.includes(expression[cursor])) {
        tokens.push(new Token(Token.PUNCTUATION_TYPE, expression[cursor], cursor + 1));
        cursor++;
        continue;
      }

      // Match names
      const nameMatch = Lexer.NAME_REGEX.exec(slicedExpression);
      if (nameMatch != null) {
        tokens.push(new Token(Token.NAME_TYPE, nameMatch[0], cursor + 1));
        cursor += nameMatch[0].length;
        continue;
      }

      // Handle unexpected characters
      throw new SyntaxError(`Unexpected character "${expression[cursor]}"`, cursor, expression);
    }

    tokens.push(new Token(Token.EOF_TYPE, null, cursor + 1));

    // Check for unclosed brackets
    if (brackets.length > 0) {
      const lastBracket = brackets.pop();
      if (lastBracket) {
        const [expect, cur] = lastBracket;
        throw new SyntaxError(`Unclosed "${expect}"`, cur, expression);
      }
    }

    return new TokenStream(tokens, expression);
  }

  /**
   * Extracts the operator from the given string.
   * @private
   * @param {string} str
   * @param {string} originalExpression
   * @param {number} cursor
   * @return {*}  {(string | null)}
   * @memberof Lexer
   */
  private extractOperator(str: string, originalExpression: string, cursor: number): string | null {
    // Loop through all possible operators
    for (const operator of Lexer.SYMBOL_OPERATORS) {
      // Check if the string starts with the operator
      if (str.startsWith(operator)) {
        const operatorEnd = cursor + operator.length;
        // Check the character before the operator in the full expression (cursor - 1)
        const beforeChar = originalExpression[cursor - 1] || ' '; // Character before the operator
        // Check the character after the operator in the full expression
        const afterChar = originalExpression[operatorEnd] || ' ';
        // Handle word-based operators
        if (Lexer.WORD_OPERATORS.has(operator)) {
          // Ensure there are spaces or punctuation boundaries around the operator
          if (beforeChar.trim() === '' && afterChar.trim() === '') {
            return operator;
          }
        } else {
          // Non-word-based operators can match directly
          return operator;
        }
      }
    }
    return null;
  }
}
