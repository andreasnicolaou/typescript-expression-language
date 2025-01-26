/**
 * Represents a token.
 * @class Token
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class Token {
  public static readonly EOF_TYPE = 'end of expression';
  public static readonly NAME_TYPE = 'name';
  public static readonly NUMBER_TYPE = 'number';
  public static readonly STRING_TYPE = 'string';
  public static readonly OPERATOR_TYPE = 'operator';
  public static readonly PUNCTUATION_TYPE = 'punctuation';

  constructor(
    public type: string,
    public value: string | number | null,
    public cursor?: number
  ) {}

  /**
   * A string representation of the token
   * @returns string
   * @memberof Token
   */
  public toString(): string {
    const cursor = this.cursor ? this.cursor.toString().padStart(3, ' ') : '   ';
    const type = this.type.toUpperCase().padEnd(11, ' ');
    return `${cursor} ${type} ${this.value}`;
  }

  /**
   * Tests token for type and value
   * @param type
   * @param [value]
   * @returns true if test
   * @memberof Token
   */
  public test(type: string, value: string | null = null): boolean {
    return this.type === type && (value === null || this.value == value);
  }
}
