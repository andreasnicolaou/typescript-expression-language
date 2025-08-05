import serialize from 'locutus/php/var/serialize';
import unserialize from 'locutus/php/var/unserialize';
import { ConstantNode } from './node/constant-node';
import { ParsedExpression } from './parsed-expression';

describe('ParsedExpression', () => {
  test('should serialize correctly', () => {
    const expression = new ParsedExpression('25', new ConstantNode('25'));
    const serializedExpression = serialize(expression.toString());
    const unSerializedExpression = unserialize(serializedExpression);
    expect(expression.toString()).toStrictEqual(unSerializedExpression);
  });
});
