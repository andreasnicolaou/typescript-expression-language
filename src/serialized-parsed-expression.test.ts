import { serialize } from 'locutus/php/var/serialize';
import { SerializedParsedExpression } from './serialized-parsed-expression';

describe('SerializedParsedExpression', () => {
  test('should keep the expression', () => {
    expect(new SerializedParsedExpression('a + 1', serialize('nodes')).expression).toBe('a + 1');
  });

  test('should unserialize the nodes', () => {
    const nodes = { attributes: { value: 1 }, nodes: { left: 'a', right: [1, 2] } };
    expect(new SerializedParsedExpression('a', serialize(nodes)).getNodes()).toEqual(nodes);
  });

  test('should return false for nodes that are not serialized', () => {
    // Locutus reports the parse error on the console before returning false
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(new SerializedParsedExpression('a', 'garbage').getNodes()).toBe(false);
      expect(error).toHaveBeenCalled();
    } finally {
      error.mockRestore();
    }
  });
});
