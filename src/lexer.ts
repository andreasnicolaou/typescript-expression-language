import { Token } from './token';
import { TokenStream } from './token-stream';
import { SyntaxError } from './syntax-error';

/**
 * Represents a lexer for an expression language.
 * @class Lexer
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class Lexer {
  private static readonly OPERATORS = [
    'starts with',
    'ends with',
    'contains',
    'matches',
    'not in',
    'not',
    'and',
    '===',
    '!==',
    'or',
    '||',
    '&&',
    '==',
    '!=',
    '>=',
    '<=',
    'in',
    '..',
    '**',
    '<<',
    '>>',
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

      // Match numbers
      const numberMatch = /^(?:\d[\d_]*(?:\.\d[\d_]*)?|\.\d[\d_]*)(?:[eE][+-]?\d[\d_]*)?/.exec(
        expression.slice(cursor)
      );
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
      const stringRegex = /^"([^"\\]*(?:\\.[^"\\]*)*)"|^'([^'\\]*(?:\\.[^'\\]*)*)'/s;
      const stringMatch = stringRegex.exec(expression.slice(cursor));
      if (stringMatch != null) {
        tokens.push(new Token(Token.STRING_TYPE, stringMatch[1] || stringMatch[2], cursor + 1));
        cursor += stringMatch[0].length;
        continue;
      }

      // Match comments
      const commentRegex = /^\/\*\*[\s\S]*?\*\/|^\/\*[\s\S]*?\*\//;
      const commentMatch = commentRegex.exec(expression.slice(cursor));
      if (commentMatch != null) {
        cursor += commentMatch[0].length;
        continue;
      }

      // Match operators
      const operator = this.extractOperator(expression.slice(cursor), expression, cursor);
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
      const nameMatch = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/.exec(expression.slice(cursor));
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
    for (const operator of Lexer.OPERATORS) {
      // Check if the string starts with the operator
      if (str.startsWith(operator)) {
        const operatorEnd = cursor + operator.length;
        // Check the character before the operator in the full expression (cursor - 1)
        const beforeChar = originalExpression[cursor - 1] || ' '; // Character before the operator
        // Check the character after the operator in the full expression
        const afterChar = originalExpression[operatorEnd] || ' ';
        // Handle word-based operators
        if (Lexer.OPERATORS.filter((op) => /^[a-z ]+$/i.test(op)).includes(operator)) {
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
