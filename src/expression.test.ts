import serialize from 'locutus/php/var/serialize';
import unserialize from 'locutus/php/var/unserialize';
import { Expression } from './expression';

describe('Expression', () => {
  test('should serialize and un-serialize', () => {
    const expression = new Expression('kernel.boot()');
    const serializedExpression = serialize(expression);
    const unSerializedExpression = unserialize(serializedExpression);
    expect(unSerializedExpression).toEqual(expression);
  });
});
