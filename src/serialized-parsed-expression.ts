import { Node } from './node/node';
import unserialize from 'locutus/php/var/unserialize';

/**
 * Represents an already serialized parsed expression.
 * @class SerializedParsedExpression
 * @author Andreas Nicolaou <anicolaou66@gmail.com>
 */
export class SerializedParsedExpression {
  public readonly expression!: string;
  private readonly nodes!: string;

  constructor(expression: string, nodes: string) {
    this.expression = expression;
    this.nodes = nodes;
  }

  /**
   * Deserializes and returns the nodes.
   * @returns nodes
   * @memberof SerializedParsedExpression
   */
  public getNodes(): Node {
    return unserialize(this.nodes);
  }
}
