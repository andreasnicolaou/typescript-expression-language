import { unserialize } from 'locutus/php/var/unserialize';
import { Node } from './node/node';

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
   * @returns The deserialized nodes, or false if deserialization fails.
   * @memberof SerializedParsedExpression
   */
  public getNodes(): Node | false {
    return unserialize(this.nodes) as Node | false;
  }
}
