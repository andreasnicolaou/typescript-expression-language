import { Expression } from './expression';
import { Node } from './node/node';

/**
 * Represents an already parsed expression.
 * @class ParsedExpression
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class ParsedExpression extends Expression {
  private readonly nodes: Node;

  constructor(expression: string, nodes: Node) {
    super(expression);
    this.nodes = nodes;
  }

  /**
   * Gets nodes
   * @returns nodes
   * @memberof ParsedExpression
   */
  public getNodes(): Node {
    return this.nodes;
  }
}
