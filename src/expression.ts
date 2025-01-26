/**
 * Represents an expression.
 * @class Expression
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class Expression {
  protected expression!: string;

  constructor(expression: string) {
    this.expression = expression;
  }

  /**
   * Gets the expression.
   * @returns The string representation of the expression
   * @memberof Expression
   */
  public toString(): string {
    return this.expression;
  }
}
