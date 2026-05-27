import { unserialize } from 'locutus/php/var/unserialize';
import { Node } from './node/node';

/**
 * Represents an already serialized parsed expression.
 *
 * The serialized form passed to the constructor MUST come from a trusted source.
 * By contract, callers are expected to serialize their own ParsedExpression instances
 * and keep the resulting data under their control. Pass attacker-controlled data here at your peril.
 *
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
