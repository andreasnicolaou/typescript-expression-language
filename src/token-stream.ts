import { Token } from './token';
import { SyntaxError } from './syntax-error';

/**
 * Represents a token stream.
 * @class TokenStream
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class TokenStream {
  public current!: Token;
  public position = 0;

  constructor(
    public readonly tokens: Token[],
    public readonly expression: string = ''
  ) {
    if (tokens.length === 0) {
      throw new Error('TokenStream requires at least one token.');
    }
    this.current = tokens[0];
  }

  /**
   * Returns a string representation of the token stream.
   * @returns string
   * @memberof TokenStream
   */
  public toString(): string {
    return this.tokens.join('\n');
  }

  /**
   * Sets the pointer to the next token and updates the current token.
   * @memberof TokenStream
   */
  public next(): void {
    ++this.position;
    if (!this.tokens[this.position]) {
      throw new SyntaxError('Unexpected end of expression', this.current.cursor ?? 0, this.expression);
    }
    this.current = this.tokens[this.position];
  }

  /**
   * Checks if the current token matches the expected type and value.
   * Throws an error if it doesn't.
   * @param type
   * @param [value]
   * @param [message]
   * @memberof TokenStream
   */
  public expect(type: string, value: string | null = null, message: string | null = null): void {
    const token = this.current;
    if (!token.test(type, value)) {
      const msg = message ? `${message}. ` : '';
      const v = value ? [value] : null;
      throw new SyntaxError(msg, token.cursor ?? 0, this.expression, token.value, v);
    }
    this.next();
  }

  /**
   * Checks if the end of the token stream is reached.
   * @returns true if eof
   * @memberof TokenStream
   */
  public isEOF(): boolean {
    return this.current.type === Token.EOF_TYPE;
  }

  /**
   * Returns the original expression for debugging or internal use.
   * @returns expression
   * @memberof TokenStream
   */
  public getExpression(): string {
    return this.expression;
  }
}
